import { gunzipSync } from 'zlib';

import {
  Recording,
  RecordingEntry,
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupDuoRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    mutateEntry: mutateRecordingEntry,
  });
}

interface NestedReplaceOptions {
  testFunction: (key: string, value: any) => boolean;
  replacement: any;
}

const phoneNumberRegex = /^\+[0-9]{10,}$/;

function isString(input: any): boolean {
  return typeof input === 'string' || input instanceof String;
}

const nestedReplacements: NestedReplaceOptions[] = [
  {
    testFunction: (key: string, value: string) =>
      isString(value) && phoneNumberRegex.test(value),
    replacement: '+15555555555',
  },
  {
    testFunction: (key: string, value: any) => key === 'secret_key',
    replacement: '[REDACTED]',
  },
];

function isObject(input: any): boolean {
  return typeof input === 'object' && input !== null;
}

function nestedReplace(
  parsedJson: object,
  options: NestedReplaceOptions,
): object {
  for (const key of Object.keys(parsedJson)) {
    const originalValue = parsedJson[key];
    if (options.testFunction(key, originalValue)) {
      parsedJson[key] = options.replacement;
    } else if (isObject(originalValue)) {
      parsedJson[key] = nestedReplace(originalValue, options);
    }
  }
  return parsedJson;
}

function mutateRecordingEntry(entry: RecordingEntry): void {
  let responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  const contentEncoding = entry.response.headers.find(
    (e) => e.name === 'content-encoding',
  );
  const transferEncoding = entry.response.headers.find(
    (e) => e.name === 'transfer-encoding',
  );

  if (contentEncoding && contentEncoding.value === 'gzip') {
    const chunkBuffers: Buffer[] = [];
    const hexChunks = JSON.parse(responseText) as string[];
    hexChunks.forEach((chunk) => {
      const chunkBuffer = Buffer.from(chunk, 'hex');
      chunkBuffers.push(chunkBuffer);
    });

    responseText = gunzipSync(Buffer.concat(chunkBuffers)).toString('utf-8');

    // Remove encoding/chunking since content is now unzipped
    entry.response.headers = entry.response.headers.filter(
      (e) => e && e !== contentEncoding && e !== transferEncoding,
    );
    // Remove recording binary marker
    delete (entry.response.content as any)._isBinary;
    entry.response.content.text = responseText;
  }

  let responseJson = JSON.parse(responseText);

  nestedReplacements.forEach((nestedReplacement) => {
    const redactedJson = nestedReplace(responseJson, nestedReplacement);
    responseJson = redactedJson;
  });

  entry.response.content.text = JSON.stringify(responseJson);
}

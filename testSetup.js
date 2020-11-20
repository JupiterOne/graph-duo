'use strict';
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jest_fetch_mock_1 = __importStar(require('jest-fetch-mock'));
jest_fetch_mock_1.enableFetchMocks(); // turn on fetch mocking
jest_fetch_mock_1.default.dontMock(); // don't do it unless explicitly enabled in tests
require('dotenv').config();

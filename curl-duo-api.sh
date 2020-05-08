#!/usr/bin/env bash

set -o allexport; source .env; set +o allexport

method="GET"
path="/admin/v1/settings"
params=""
uri="https://$API_HOSTNAME$path"

date2822=`date -u -R`
authsig="$date2822
$method
$API_HOSTNAME
$path
$params"

digest=`echo -n "$authsig" | openssl dgst -sha1 -hmac "$SECRET_KEY"`

curl -u "$INTEGRATION_KEY:$digest" -H "Date: $date2822" $uri

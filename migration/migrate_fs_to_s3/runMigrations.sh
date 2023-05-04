#!/bin/bash

# Note: To run this script you will need an AWS CLI profile with write access to the audioanimated S3 bucket.

mkdir /tmp/audio_data
scp -r playr:/mnt/audio_data /tmp/

find /tmp/audio_data -type f | while read fname; do
  key=$(echo "$fname"  | sed 's/\/tmp\/audio_data\///g')
  echo "$key"
  aws s3 cp "$fname" s3://audioanimated/prod/"$key"
done

rm -rf /tmp/audio_data
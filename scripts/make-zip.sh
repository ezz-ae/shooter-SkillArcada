#!/bin/bash

# Create the release directory if it doesn't exist
mkdir -p release

# Create the ZIP archive using git archive and .gitattributes
git archive --format=zip --output release/shooter-v1.0.0.zip HEAD

echo "Clean ZIP archive created at release/shooter-v1.0.0.zip"
#!/bin/bash

set -e

echo "Checking if the latest commit is already tagged..."

# Find latest tag reachable from HEAD
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || true)

if [ -n "$LAST_TAG" ]; then
  # Get the commit that the tag points to
  TAG_COMMIT=$(git rev-list -n 1 "$LAST_TAG")
else
  TAG_COMMIT=""
fi

# Get commit hash of HEAD
HEAD_COMMIT=$(git rev-parse HEAD)

if [ "$TAG_COMMIT" = "$HEAD_COMMIT" ]; then
  echo "The latest commit is already tagged ($LAST_TAG). Skipping."
  exit 0
fi

echo "The latest commit is NOT tagged. Calculating next rc tag..."

# If no last tag, start from 0.0.0-rc0
if [ -z "$LAST_TAG" ]; then
  MAJOR=0; MINOR=0; PATCH=0; RC=0
else
  # Parse version numbers
  VERSION_PART=${LAST_TAG#v}
  VERSION_PART=${VERSION_PART%%-rc*}
  RC=${LAST_TAG##*-rc}
  MAJOR=$(echo "$VERSION_PART" | cut -d. -f1)
  MINOR=$(echo "$VERSION_PART" | cut -d. -f2)
  PATCH=$(echo "$VERSION_PART" | cut -d. -f3)
  # If somehow RC isn't a number, reset
  if ! [[ "$RC" =~ ^[0-9]+$ ]]; then RC=0; fi
fi

# Only bump RC (your custom logic could go here for real semver bumps)
RC=$((RC+1))

NEXT_TAG="v${MAJOR}.${MINOR}.${PATCH}-rc${RC}"
echo "Tagging HEAD as: $NEXT_TAG"

git tag "$NEXT_TAG"
git push origin "$NEXT_TAG"
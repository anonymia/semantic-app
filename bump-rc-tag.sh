#!/bin/bash

set -e

# Find last tag (could be rc or stable)
LAST_TAG=$(git tag --sort=-v:refname --list 'v*' | head -n 1)
if [ -z "$LAST_TAG" ]; then
  MAJOR=0; MINOR=0; PATCH=0; RC=0
else
  VERSION_PART="${LAST_TAG#v}"
  VERSION_PART="${VERSION_PART%%-rc*}"
  RC="${LAST_TAG##*-rc}"
  MAJOR=$(echo "$VERSION_PART" | cut -d. -f1)
  MINOR=$(echo "$VERSION_PART" | cut -d. -f2)
  PATCH=$(echo "$VERSION_PART" | cut -d. -f3)
  if ! [[ "$RC" =~ ^[0-9]+$ ]]; then RC=0; fi
fi

# Get latest commit hash on main
HEAD_COMMIT=$(git rev-parse HEAD)

# Is this commit already tagged?
if git tag --points-at "$HEAD_COMMIT" | grep -q '^v[0-9]\+\.[0-9]\+\.[0-9]\+-rc[0-9]\+$'; then
  echo "Current commit already tagged. Skipping."
  exit 0
fi

# Collect all commit messages since the last tag up to HEAD
if [ -z "$LAST_TAG" ]; then
  RANGE=""
else
  RANGE="${LAST_TAG}..HEAD"
fi
MSGS=$(git log $RANGE --pretty=format:%s)

# Determine if last tag is stable or RC
if [[ "$LAST_TAG" != *-rc* ]]; then
  LAST_TAG_IS_STABLE=1
else
  LAST_TAG_IS_STABLE=0
fi

BUMP_MAJOR=0
BUMP_MINOR=0
BUMP_PATCH=0
for msg in $MSGS; do
  echo "$msg" | grep -owq 'BREAKING CHANGE:' && BUMP_MAJOR=1 && break
done
if [ $BUMP_MAJOR -eq 0 ]; then
  for msg in $MSGS; do
    echo "$msg" | grep -Eowq 'feat:|\(feat\)' && BUMP_MINOR=1 && break
  done
fi
if [ $BUMP_MAJOR -eq 0 ] && [ $BUMP_MINOR -eq 0 ]; then
  for msg in $MSGS; do
    echo "$msg" | grep -Eowq 'fix:|\(fix\)' && BUMP_PATCH=1 && break
  done
fi

# If last tag was a stable release and no keyword matched, force PATCH bump
if [ $LAST_TAG_IS_STABLE -eq 1 ] && [ $BUMP_MAJOR -eq 0 ] && [ $BUMP_MINOR -eq 0 ] && [ $BUMP_PATCH -eq 0 ]; then
  BUMP_PATCH=1
fi

if [ $BUMP_MAJOR -eq 1 ]; then
  MAJOR=$((MAJOR+1)); MINOR=0; PATCH=0; RC=1
elif [ $BUMP_MINOR -eq 1 ]; then
  MINOR=$((MINOR+1)); PATCH=0; RC=1
elif [ $BUMP_PATCH -eq 1 ]; then
  PATCH=$((PATCH+1)); RC=1
else
  RC=$((RC+1))
fi

NEXT_TAG="v${MAJOR}.${MINOR}.${PATCH}-rc${RC}"
echo "Tagging commit with $NEXT_TAG"
git tag "$NEXT_TAG"
git push origin "$NEXT_TAG"
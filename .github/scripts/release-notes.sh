#!/usr/bin/env bash
# Wraps the release-please notes of a GitHub release with an install line, links and a compare footer.
# Usage: release-notes.sh <tag>   (DRY_RUN=1 prints the notes instead of editing the release)
set -euo pipefail

tag="${1:?usage: release-notes.sh <tag>}"
version="${tag#v}"
marker="<!-- pokenode-release-notes -->"

body="$(gh release view "$tag" --json body --jq .body)"
if [[ -z "$body" ]]; then
  echo "release $tag has an empty body" >&2
  exit 1
fi

# reruns of the workflow must not stack a second header
if [[ "$body" == *"$marker"* ]]; then
  echo "release $tag already styled, skipping"
  exit 0
fi

heading="$(head -n 1 <<<"$body")"
compare_url="$(grep -oE 'https://[^)]+/compare/[^)]+' <<<"$heading" || true)"
# the "## [x.y.z](...) (date)" heading repeats the release title
if [[ "$heading" == "## "* ]]; then
  body="$(tail -n +2 <<<"$body" | sed '/./,$!d')"
fi

notes="$(mktemp)"
trap 'rm -f "$notes"' EXIT

{
  echo "$marker"
  echo '```sh'
  echo "pnpm add pokenode-ts@$version"
  echo '```'
  echo
  echo "📦 [npm](https://www.npmjs.com/package/pokenode-ts/v/$version) · 📚 [Docs](https://pokenode-ts.vercel.app/)"
  echo
  echo "$body"
  if [[ -n "$compare_url" ]]; then
    echo
    echo "---"
    echo
    echo "🔍 **Full changelog:** [${compare_url##*/}]($compare_url)"
  fi
} >"$notes"

if [[ "${DRY_RUN:-}" == "1" ]]; then
  cat "$notes"
else
  gh release edit "$tag" --notes-file "$notes"
fi

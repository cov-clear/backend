#!/bin/bash

set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 environment[prod|staging] version" >&2
  echo "Ex: $0 prod latest" >&2
  exit 1
fi

for file in namespace pdb service deployment
do
  manifest=`sed "s/\[\[env\]\]/$1/g;s/\[\[docker_tag\]\]/$2/g" $file.yaml`
  echo  "$manifest"
done

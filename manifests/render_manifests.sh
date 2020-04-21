#!/bin/bash

set -e

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 environment[prod|staging] version domain" >&2
  echo "Ex: $0 prod latest app.cov-clear.com" >&2
  exit 1
fi

for file in namespace pdb service ingress deployment
do
  manifest=`sed "s/\[\[env\]\]/$1/g;s/\[\[docker_tag\]\]/$2/g;s/\[\[domain\]\]/$3/g" $file.yaml`
  echo  "$manifest"
done

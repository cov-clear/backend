#!/bin/bash

set -e

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 environment[uk|ee] version domain role-arn" >&2
  echo "Ex: $0 uk latest uk.cov-clear.com arn:aws:iam::12345566:role/cov-clear-uk-backend" >&2
  exit 1
fi

for file in namespace service_account pdb service ingress deployment
do
  manifest=`sed "s|\[\[env\]\]|$1|g;s|\[\[docker_tag\]\]|$2|g;s|\[\[domain\]\]|$3|g;s|\[\[role_arn\]\]|$4|g" $file.yaml`
  echo  "$manifest"
done

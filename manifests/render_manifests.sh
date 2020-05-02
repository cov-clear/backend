#!/bin/bash

set -e

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 environment[uk|ee] version domain role-arn" >&2
  echo "Ex: $0 uk latest uk.cov-clear.com arn:aws:iam::12345566:role/cov-clear-uk-backend" >&2
  exit 1
fi

ENVIRONMENT=$1
DOCKER_TAG=$2
APP_DOMAIN=$3
ROLE_ARN=$4

for file in namespace service_account pdb service ingress deployment
do
  manifest=`sed "s|\[\[env\]\]|$ENVIRONMENT|g;s|\[\[docker_tag\]\]|$DOCKER_TAG|g;s|\[\[domain\]\]|$APP_DOMAIN|g;s|\[\[role_arn\]\]|$ROLE_ARN|g" $file.yaml`
  echo  "$manifest"
done

echo "`sed "s|\[\[env\]\]|$1|g" configmap.$ENVIRONMENT.yaml`"

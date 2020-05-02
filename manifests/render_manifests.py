#!/usr/bin/env python

import sys


def render_all_manifests():
  replacements = {
    ':env:': sys.argv[1],
    ':docker_tag:': sys.argv[2],
    ':app_domain:': sys.argv[3],
    ':role_arn:': sys.argv[4],
  }

  manifests_filenames = [
    'namespace.yaml',
    'service_account.yaml',
    'pdb.yaml',
    'configmap.%s.yaml' % sys.argv[1],
    'service.yaml',
    'ingress.yaml',
    'deployment.yaml'
  ]

  manifests = ''

  # Render all manifests without errors first
  for filename in manifests_filenames:
    manifests += render_manifest(filename, replacements)

  return manifests


def render_manifest(filename, substitutions):
  with open(filename) as f:
    content = f.read()

  for key, replacement in substitutions.items():
    content = content.replace(key, replacement)

  return content


if __name__ == '__main__':
  if len(sys.argv) != 5:
    print('Usage: ./render_manifests.py env[uk|ee] version domain role-arn')
    print('Ex: ./render_manifests.py uk latest uk.cov-clear.com arn:aws:iam::12345566:role/cov-clear-uk-backend')
    sys.exit(0)

  print(render_all_manifests())


#!/bin/bash

echo "Upgrading Jenkins..."
helm upgrade --recreate-pods --wait -f jenkins-values.yaml ci stable/jenkins
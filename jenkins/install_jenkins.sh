#!/bin/bash

echo "Installing Jenkins..."
helm install --wait -n ci stable/jenkins -f jenkins-values.yaml
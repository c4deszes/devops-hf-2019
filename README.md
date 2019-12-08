# Infrastructure
#### The application heavily depends on the usage of Kubernetes, therefore it should be deployed into it.

## Kubernetes cluster
Any provider does it, as nor the application nor the deployment files are not using any provider-specific configuration (Except terraform, of course).
### Setting it up
If you are using Google Cloud Platform, just supply your credentials using `GOOGLE_CLOUD_KEYFILE_JSON` environment variable and hit `terraform apply` in the TERRAFORM foler. **Use Terraform 0.12!**
If your cluster is ready, then configure `kubectl`: `gcloud init && gcloud container clusters get-credentials <project-id>`.

Create namespaces: `jenkins`, `monitoring`, `chat`

### Ingress Controller
Install ingress controller: `kubectl apply -f ingress-controller/controller.yaml`. Don't forget to change your loadBalancerIP.

### Monitoring
Install helm, and then install prometheus and grafana using it:
```
kubectl apply -f gke-admin-rbac.yaml 
helm install --name prometheus --namespace monitoring stable/prometheus
kubectl apply -n monitoring -f monitoring/grafana.yaml
helm install --name grafana --namespace monitoring stable/grafana -f grafana-values.yaml
kubectl apply -n monitoring -f monitoring/ingress.yaml
```
Now you have Grafana on the *hostname* specified in `ingress.yaml`.

### Jenkins
Install Jenkins using helm, and the provided configuration files: `./jenkins/install_jenkins.sh`
Apply some files needed for proper access rights and ingress configuration:
```
kubectl apply -n jenkins -f jenkins/ingress.yaml
kubectl apply -n jenkins -f jenkins/gke-jenkins-rbac.yaml 
```

## Jenkins for CI/CD
You are in luck, this will be a short guide, as Helm, and the configuration file installed everything for you!

Get the admin password using: `printf $(kubectl get secret -n jenkins ci-jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo`
Login, and go to Manage Jenkins. Set the Locale to `en_US` (or whatever you want). Also go to Global Security and enable Jenkins own user database.
### Connect to GitHub
You have to obtain a Private Access Token from GitHub, with `admin:repo_hook, read:user, repo, user:email` rights. Note this token and head over to Manage Jenkins, add a GitHub server, insert the token as Secret Text and tick Manage Hooks.

Now open Blue Ocean and add a new Pipeline. This UI is quite intuitive, just follow the steps. Now you are ready!

## Jenkins should deploy everything for you. Done!
# Helm Chart — sample-ai-app

A shared Helm chart for deploying the backend, React frontend, and Streamlit frontend to Kubernetes / OpenShift.

## Tech Stack

| Category | Technologies |
|---|---|
| Package Manager | Helm |
| Platforms | Kubernetes, OpenShift |
| TLS | cert-manager / Venafi |
| GitOps | Argo CD (reference manifest) |

## Chart Info

| Field       | Value              |
|-------------|--------------------|
| Name        | `sample-ai-app`    |
| Type        | Application        |
| Version     | `0.1.0`            |
| App Version | `1.16.0`           |

## Values Files

The chart uses a base `values.yaml` with per-component overrides:

| File                            | Component            |
|---------------------------------|----------------------|
| `values.yaml`                   | Base / defaults      |
| `values-backend.yaml`           | Backend (port 8000)  |
| `values-react-frontend.yaml`    | React frontend (port 5173) |
| `values-streamlit-frontend.yaml`| Streamlit frontend (port 8501) |

## Key Configuration

| Value                  | Description                                       |
|------------------------|---------------------------------------------------|
| `app_name`             | Application name used in resource labels          |
| `env`                  | Environment label (e.g. `dev`)                    |
| `image.repository`     | Container image registry path                     |
| `image.tag`            | Image tag (default `latest`)                      |
| `image.pullSecretName` | Image pull secret name                            |
| `appEnv`               | Map of environment variables injected into the pod|
| `replicaCount`         | Number of replicas (when autoscaling is disabled)  |
| `autoscaling.*`        | HPA settings (enabled, min/max replicas, targets) |
| `resources.*`          | CPU and memory requests/limits                    |
| `service.ports`        | Service port definitions                          |
| `ingress.hostname`     | Ingress hostname                                  |
| `ingress.certManager`  | cert-manager / Venafi TLS configuration            |
| `livenessProbe.*`      | Liveness probe path and timing                    |
| `readinessProbe.*`     | Readiness probe path and timing                   |

## Templates

| Template              | Resource                        |
|-----------------------|---------------------------------|
| `deployment.yaml`     | Deployment with pod anti-affinity, probes, and env from Secret |
| `service.yaml`        | ClusterIP Service               |
| `ingress.yaml`        | Ingress with TLS via cert-manager |
| `hpa.yaml`            | HorizontalPodAutoscaler         |
| `appenv-secret.yaml`  | Secret containing `appEnv` values |

## Usage

```bash
# Backend
helm install backend ./helm -f helm/values-backend.yaml

# React Frontend
helm install react-frontend ./helm -f helm/values-react-frontend.yaml

# Streamlit Frontend
helm install streamlit-frontend ./helm -f helm/values-streamlit-frontend.yaml
```

## Project Structure

```
helm/
├── Chart.yaml
├── values.yaml
├── values-backend.yaml
├── values-react-frontend.yaml
├── values-streamlit-frontend.yaml
├── manifests_reference/
│   └── argocd_application-dev.yaml
└── templates/
    ├── appenv-secret.yaml
    ├── deployment.yaml
    ├── hpa.yaml
    ├── ingress.yaml
    └── service.yaml
```

## ArgoCD

A reference ArgoCD Application manifest is provided in [manifests_reference/argocd_application-dev.yaml](manifests_reference/argocd_application-dev.yaml). Update the placeholder values (`<NAMESPACE>`, `<PROJECT>`, `<GITREPO>`, `<SECRET_NAME>`) for your environment.

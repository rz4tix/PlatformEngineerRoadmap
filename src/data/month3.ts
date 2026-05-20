import { MonthlyMilestone } from "../types";

export const month3: MonthlyMilestone = {
  month: 3,
  title: "Month 3: Security, Identity & Observability",
  description: "Securing the perimeter, managing credentials dynamically, and illuminating cluster behavior with advanced observability stacks.",
  largeProject: "Deploy strict zero-trust security via Vault Injector, Network Policies, and OPA Gatekeeper. Aggregate all logs, metrics, and traces into a centralized Grafana/Loki/Tempo stack.",
  platformReview: "Review cluster egress/ingress paths. Verify the impossibility of lateral movement across tenant namespaces.",
  securityReview: "Conduct an internal audit of all running pods against Pod Security Standards (Restricted).",
  reliabilityReview: "Test the survivability of the observability stack itself during a major network partition.",
  finalAssessment: "Inject a 'rogue' container attempting to mine crypto/exfiltrate data. Prove that Kyverno blocks the pod, Network Policies block the egress, and Prometheus/Alertmanager alerts the team within 1 minute.",
  weeks: [
    {
      week: 5,
      title: "Secrets Management & Vault",
      miniProject: "Completely eradicate all K8s Secret objects containing static credentials. Inject secrets dynamically via Hashicorp Vault based on the Pod's Service Account identity.",
      incidentSimulation: "Secret leak inside Git. Rotate the Vault cryptographic backend keys and immediately expire all database credentials dynamically.",
      knowledgeReview: ["Vault unseal process", "OIDC/ServiceAccount authentication", "Dynamic secrets"],
      architectureReview: "Design a HA Vault architecture using Consul/Raft storage and auto-unseal mechanisms.",
      documentationAssignment: "Write a developer guide for fetching database credentials via Vault.",
      days: [
        {
          day: 29,
          title: "HashiCorp Vault Internals",
          topic: "Dynamic Authentication",
          objectives: ["Deploy Vault HA", "Understand Unseal process", "Connect Vault to K8s OIDC"],
          theory: "Kubernetes Secrets are just base64-encoded strings stored in etcd. They are insecure. Vault provides encryption as a service, dynamic secrets, and identity-based access locking credentials to a specific K8s Service Account.",
          practicalTasks: ["Deploy Vault in HA mode using Raft.", "Initialize and Unseal Vault using Shamir's Secret Sharing keys.", "Configure the K8s Auth Method to trust the cluster's API."],
          commands: ["vault operator init", "vault operator unseal", "vault auth enable kubernetes"],
          deliverables: ["An operational HA Vault instance trusted by Kubernetes."],
          expectedOutcome: "Mastery of enterprise credential management.",
          commonMistakes: ["Losing the unseal keys. If this happens, your Vault and all data inside are permanently dead.", "Storing the root token anywhere."],
          debuggingExercises: ["A pod cannot authenticate to Vault. Inspect the JWT token of the Service Account and trace why Vault rejects the audience/issuer."],
          productionMindset: "Static passwords belong in the 90s. If a database password doesn't auto-rotate every hour, it's insecure."
        },
        {
          day: 30,
          title: "Vault Agent & Sidecar Injection",
          topic: "Zero-Code Credential Delivery",
          objectives: ["Configure Vault Injector", "Deliver secrets as files", "Avoid K8s Secrets"],
          theory: "Developers shouldn't need to learn Vault API calls. The Vault Injector is a mutating webhook that intercepts Pod creation and inserts a sidecar that fetches secrets from Vault based on the pod's identity, rendering them into a shared memory volume.",
          practicalTasks: ["Annotate a sample pod to require Vault injection.", "Create Vault roles linking Service Accounts to KV paths.", "Observe the secrets written to `/vault/secrets/config` inside the pod."],
          commands: ["kubectl describe mutatatingwebhookconfigurations", "cat /vault/secrets/..."],
          deliverables: ["A backend application that reads its database password from an in-memory file populated by Vault."],
          expectedOutcome: "Can securely deliver credentials to legacy or modern apps without altering their code.",
          commonMistakes: ["Allowing wildcard `*` access in Vault policies, rendering the whole security paradigm useless.", "Letting secrets write to disk instead of tmfs (memory)."],
          debuggingExercises: ["The Vault-init container is crashing. Check Vault policies for missing 'read' permissions on the KV store."],
          productionMindset: "Security must be seamless for developers. If it requires massive code changes, they will bypass it."
        }
      ]
    },
    {
      week: 6,
      title: "Observability: Metrics, Logs & Traces",
      miniProject: "Deploy the full Prometheus/Loki/Tempo stack (PLG). Write PromQL queries to monitor API latency, and alert Slack when an error budget is threatened.",
      incidentSimulation: "Memory leak in an application. Use Grafana dashboards to identify the leaking pod, and trace the specific HTTP requests consuming the memory.",
      knowledgeReview: ["PromQL syntax", "Log aggregation limitations", "Distributed Tracing", "OpenTelemetry Collector"],
      architectureReview: "Design a long-term metric storage layer (Thanos/Cortex) to prevent Prometheus OOM kills over 3 years of data.",
      documentationAssignment: "Define the SLI/SLO standards for all Tier-1 platform services.",
      days: [
        {
          day: 36,
          title: "Prometheus & PromQL Mastery",
          topic: "Time-Series Data",
          objectives: ["Understand pull metrics", "Write complex PromQL", "Instrument services"],
          theory: "Prometheus scrapes /metrics endpoints continuously. It is the heart of K8s observability. PromQL is mathematically dense but incredibly powerful for calculating rates, quantiles, and anomalies over time.",
          practicalTasks: ["Deploy kube-prometheus-stack.", "Instrument a Python/Go app with prometheus-client.", "Write PromQL to find the 99th percentile latency of HTTP requests over 5 minutes."],
          commands: ["rate(http_requests_total[5m])", "histogram_quantile(0.99, ...)"],
          deliverables: ["A custom Grafana dashboard tracking RED (Rate, Errors, Duration) metrics for a service."],
          expectedOutcome: "Can definitively answer 'Is the system healthy?' using math, not feelings.",
          commonMistakes: ["Using high-cardinality labels (like user_id) in Prometheus, which immediately explodes memory and crashes the server.", "Graphing raw counters instead of rates."],
          debuggingExercises: ["Prometheus is dropping targets and failing to scrape. Fix the ServiceMonitor label selectors to match the target Pod."],
          productionMindset: "If a metric doesn't lead to an action, dashboard, or alert, delete it. Metrics are expensive."
        },
        {
          day: 37,
          title: "OpenTelemetry & Distributed Tracing",
          topic: "Finding the needle",
          objectives: ["Deploy OTel Collector", "Instrument apps for tracing", "Visualize in Tempo"],
          theory: "In microservices, a single user request might touch 15 different APIs. When it is slow, logs and metrics won't tell you *which* hop was slow. Distributed Tracing (OpenTelemetry) traces the specific path of individual requests.",
          practicalTasks: ["Deploy Tempo and OTel Collector.", "Instrument two microservices to pass Trace Context headers.", "Generate traffic and hunt down the slowest span in Grafana/Tempo."],
          commands: ["kubectl apply -f otel-collector.yaml"],
          deliverables: ["An OTel pipeline that scrubs PII from traces before shipping them to Tempo/Jaeger."],
          expectedOutcome: "Can debug latency and failure paths across deeply uncoupled architectures.",
          commonMistakes: ["Trying to trace 100% of traffic in production. Always use a head or tail sampling strategy to save storage.", "Dropping trace context headers at the load balancer."],
          debuggingExercises: ["Traces are 'broken' (showing as disconnected systems). Fix the application middleware so the W3C traceparent header is forwarded downstream."],
          productionMindset: "Without distributed tracing, debugging microservices is just guessing."
        }
      ]
    }
  ]
};

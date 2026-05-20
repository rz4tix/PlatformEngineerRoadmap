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
      knowledgeReview: ["Vault unseal process", "OIDC/ServiceAccount authentication", "Dynamic secrets", "Auto-unseal via KMS"],
      architectureReview: "Design a HA Vault architecture using Consul/Raft storage and auto-unseal mechanisms.",
      documentationAssignment: "Write a developer guide for fetching database credentials via Vault.",
      days: [
        {
          day: 29,
          title: "HashiCorp Vault Internals",
          topic: "Dynamic Authentication",
          objectives: ["Deploy Vault HA", "Understand Unseal process", "Connect Vault to K8s OIDC", "Implement Audit Devices"],
          theory: "Kubernetes Secrets are just base64-encoded strings stored in etcd. They are insecure. Vault provides encryption as a service, dynamic secrets, and identity-based access locking credentials to a specific K8s Service Account.",
          practicalTasks: [
            "Deploy Vault in hardened HA mode using Integrated Raft storage.", 
            "Initialize and Unseal Vault using complex Shamir's Secret Sharing keys.", 
            "Configure the sophisticated K8s Auth Method to implicitly trust the cluster's API JWT tokens.",
            "Configure highly resilient Vault Auto-Unseal using an external KMS or Transit secrets engine from a secondary cluster.",
            "Implement a strict audit device within Vault and systematically pipe logs securely to stdout for SIEM aggregation.",
            "Use the raw Vault API via cURL to programmatically generate periodic service tokens simulating an external pipeline.",
            "Establish intricate Vault Policies strictly delineating read and write boundaries between disparate namespaces."
          ],
          commands: ["vault operator init", "vault operator unseal", "vault auth enable kubernetes", "vault write auth/kubernetes/config", "vault audit enable file file_path=stdout", "vault policy write admin admin.hcl"],
          deliverables: ["An operational HA Vault instance trusted entirely by Kubernetes.", "A configured auto-unseal mechanism.", "A comprehensive audit log stream capturing every single credential retrieval attempt."],
          expectedOutcome: "Absolute mastery over enterprise-grade credential management paradigms.",
          commonMistakes: ["Losing the core unseal keys. If this happens, your Vault and absolutely all data inside are permanently dead.", "Storing the initial root token anywhere instead of promptly revoking it.", "Enabling audit logging without log rotation, completely filling the pod's disk and freezing Vault."],
          debuggingExercises: ["A test pod cannot authenticate to Vault. Inspect the raw JWT token of the Service Account and trace why Vault rejects the audience/issuer mapping.", "Vault enters a sealed state after rebooting. Debug the failing Transit auto-unseal configuration parameters connecting to the external KMS."],
          productionMindset: "Static passwords belong entirely in the 90s. If a database password doesn't continuously auto-rotate every hour, it's insecure."
        },
        {
          day: 30,
          title: "Vault Agent & Sidecar Injection",
          topic: "Zero-Code Credential Delivery",
          objectives: ["Configure Vault Injector", "Deliver secrets as files", "Avoid K8s Secrets", "Implement dynamic templating"],
          theory: "Developers shouldn't need to learn Vault API calls. The Vault Injector is a mutating webhook that intercepts Pod creation and inserts a sidecar that fetches secrets from Vault based on the pod's identity, rendering them into a shared memory volume.",
          practicalTasks: [
            "Annotate a sample backend pod rigidly to require Vault sidecar injection.", 
            "Create comprehensive Vault roles intrinsically linking specific Service Accounts to respective KV paths.", 
            "Observe the secrets actively written into `/vault/secrets/config` inside the pod securely.",
            "Configure advanced Vault Agent templates traversing JSON output to dynamically render config files specifically (e.g., `application.properties`).",
            "Implement Vault Agent secret caching to massively reduce API load on the primary Vault server.",
            "Set up a dedicated Kubernetes CronJob designed exclusively to aggressively rotate a specific set of legacy static secrets stored within Vault.",
            "Verify that the secrets volume is mounted strictly using tmpfs (RAM block) ensuring data never hits rust."
          ],
          commands: ["kubectl describe mutatatingwebhookconfigurations", "cat /vault/secrets/...", "vault read auth/kubernetes/role/my-role", "kubectl logs pod/my-app -c vault-agent-init"],
          deliverables: ["A modern backend application that reads its operational database password from an in-memory file populated directly by Vault.", "A comprehensive dynamic templating snippet defining connection strings.", "An automated rotation CronJob mechanism."],
          expectedOutcome: "Can securely and seamlessly deliver credentials to legacy monolithic or modern applications without altering their source code whatsoever.",
          commonMistakes: ["Allowing catastrophic wildcard `*` access in Vault policies, immediately rendering the whole security paradigm useless.", "Letting secrets write physically to disk instead of strictly utilizing tmpfs (memory).", "Configuring the injector but forgetting to bind the ServiceAccount, causing silent injection failures."],
          debuggingExercises: ["The critical Vault-init container is crashing consistently. Check Vault policies for missing explicit 'read' permissions on the KV store backend path.", "The Vault agent renders a blank file. Debug the incorrect Go templating syntax utilized within the annotation payload."],
          productionMindset: "Security must be inherently invisible and completely seamless for developers. If it mandates massive code modifications, they will bypass it entirely."
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
          objectives: ["Understand pull metrics", "Write complex PromQL", "Instrument services", "Tame high cardinality strings"],
          theory: "Prometheus scrapes /metrics endpoints continuously. It is the heart of K8s observability. PromQL is mathematically dense but incredibly powerful for calculating rates, quantiles, and anomalies over time.",
          practicalTasks: [
            "Deploy the vast kube-prometheus-stack comprehensively covering all nodes and controllers.", 
            "Instrument a custom Python or Go application heavily utilizing the core prometheus-client.", 
            "Write highly complex PromQL strictly to locate the precise 99th percentile latency of HTTP requests measured over 5 uninterrupted minutes.",
            "Configure sophisticated `prometheus` scrape configs to aggressively drop unneeded high-cardinality metrics explicitly utilizing `relabel_configs`.",
            "Set up Alertmanager to carefully deduplicate sprawling alerts and route directly to specific team Slack channels strictly based on severity labels.",
            "Implement a resource-saving recording rule to preemptively pre-calculate the 95th percentile CPU usage across the entire cluster efficiently.",
            "Build an intricate PromQL query monitoring exactly the TCP connection drop rates extracted from node-exporter."
          ],
          commands: ["rate(http_requests_total[5m])", "histogram_quantile(0.99, ...)", "promtool check rules", "kubectl get servicemonitors", "curl -s localhost:9090/api/v1/targets"],
          deliverables: ["A fully custom Grafana dashboard intricately tracking RED (Rate, Errors, Duration) metrics for a microservice.", "A highly optimized Alertmanager routing tree configuration file.", "Calculated recording rules substantially speeding up dashboard load times."],
          expectedOutcome: "Can definitively and statistically answer 'Is the system healthy?' using pure mathematics, not mere feelings or assumptions.",
          commonMistakes: ["Using devastating high-cardinality labels (like exact user_id) in Prometheus, which immediately explodes memory footprints and crashes the server.", "Graphing raw accumulating counters instead of calculating rates.", "Creating overly sensitive alerts that inevitably trigger extreme alert fatigue."],
          debuggingExercises: ["Prometheus is actively dropping vital targets and failing to scrape efficiently. Fix the precise ServiceMonitor label selectors to explicitly match the target Pod metadata.", "An alert fires constantly despite the metric being normal. Troubleshoot the mathematically flawed PromQL `rate` function window overlapping."],
          productionMindset: "If a tracked metric doesn't lead logically to an action, a dashboard, or a critical alert, immediately delete it. Metrics are extremely expensive to store."
        },
        {
          day: 37,
          title: "OpenTelemetry & Distributed Tracing",
          topic: "Finding the precise needle",
          objectives: ["Deploy OTel Collector", "Instrument apps for tracing", "Visualize in Tempo", "Link telemetry pillars"],
          theory: "In sprawling microservices architectures, a single user request might traverse 15 distinct APIs. When it operates slowly, aggregated logs and metrics won't definitively inform you *which* specific network hop was slow. Distributed Tracing effectively traces the specific serialized path of individual requests.",
          practicalTasks: [
            "Deploy Tempo and an expansive OTel Collector framework processing signals.", 
            "Instrument two discrete communicating microservices strictly to propagate core Trace Context headers globally.", 
            "Generate immense artificial traffic and hunt down the single slowest recorded span isolated within Grafana/Tempo.",
            "Configure the advanced OTel Collector directly to tail raw Kubernetes logs concurrently alongside processing tracing telemetry.",
            "Implement sophisticated trace sampling rules strictly dropping 90% of all successful `GET /health` requests avoiding massive storage bloat.",
            "Use Grafana's advanced trace-to-logs feature securely linking generated Tempo spans directly to localized Loki log lines seamlessly.",
            "Instrument auto-tracing exclusively for database transactions tracking exact SQL queries executed."
          ],
          commands: ["kubectl apply -f otel-collector.yaml", "export OTEL_EXPORTER_OTLP_ENDPOINT", "traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"],
          deliverables: ["A comprehensive OTel pipeline that strictly scrubs PII data natively from traces prior to shipping them to Tempo/Jaeger.", "A fully documented exemplar analyzing a slow intra-service request utilizing traces.", "A unified Grafana view perfectly correlating metrics, logs, and traces natively."],
          expectedOutcome: "Can securely debug deep latency and precise failure paths traversing across deeply uncoupled architectures with total conviction.",
          commonMistakes: ["Trying to trace 100% of organic traffic blindly in production environments. Always utilize a calculated head or specific tail sampling strategy drastically saving storage.", "Silently dropping critical trace context headers precisely at the load balancer or initial ingress boundary.", "Mixing up trace IDs and parent span IDs fundamentally breaking the trace waterfall visualization."],
          debuggingExercises: ["Aggregated traces are 'broken' (rendering uniquely isolated as completely disconnected systems). Fix the application middleware layer logically allowing the W3C traceparent header to naturally forward downstream.", "OTel collector is OOM crashing. Tune the batch processing limits and memory limiters parameters explicitly."],
          productionMindset: "Without highly implemented distributed tracing, debugging failing microservices architectures is functionally just pure guessing."
        }
      ]
    }
  ]
};

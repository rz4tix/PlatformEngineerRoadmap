import { MonthlyMilestone } from "../types";

export const month4: MonthlyMilestone = {
  month: 4,
  title: "Month 4: The Internal Developer Platform (IDP)",
  description: "Moving from cluster administrator to platform product engineer. Building Go operators, Crossplane control planes, and Backstage Developer Portals.",
  largeProject: "Build an Internal Developer Portal (Backstage) where developers can click a button to provision a new microservice repository, fully wired with CI/CD schemas, and dynamically provisioned Postgres databases via Crossplane.",
  platformReview: "Evaluate the 'golden paths' provided to developers. Is cognitive load reduced?",
  securityReview: "Review Crossplane provider credentials and Backstage identity integration.",
  reliabilityReview: "Test the robustness of the custom K8s Operator under heavy churn.",
  finalAssessment: "Demonstrate a complete self-service workflow from an empty git repo to a deployed application with an on-prem DB backing it.",
  weeks: [
    {
      week: 7,
      title: "Golang for Platform Engineers",
      miniProject: "Write a complete CLI utility in Go that authenticates to the K8s API, queries all pods across all namespaces consuming > 500Mi RAM, and exports a CSV report.",
      incidentSimulation: "Your Go operator introduces a memory leak in the K8s API server by improperly caching watch events. Debug and use pprof to fix it.",
      knowledgeReview: ["Go concurrency (goroutines/channels)", "client-go library", "K8s Informers & Listers"],
      architectureReview: "Design the architecture of a custom K8s controller vs a webhook.",
      documentationAssignment: "Write the README for your Go CLI.",
      days: [
        {
          day: 43,
          title: "Go Fundamentals & client-go",
          topic: "Speaking to the API",
          objectives: ["Write idiomatic Go", "Understand K8s ClientConfig", "Query the API"],
          theory: "Bash and Python break at scale. Go is the language of cloud-native. To build Kubernetes tools, you must interact with the API natively via `client-go`, utilizing Informers and Listers instead of expensive raw polling.",
          practicalTasks: ["Set up a Go workspace. Write a script that lists all Pods in a specific namespace using `client-go` locally (via kubeconfig) and in-cluster (via ServiceAccount)."],
          commands: ["go mod init", "go get k8s.io/client-go@latest"],
          deliverables: ["A binary that safely connects to K8s and streams logs from a selected deployment."],
          expectedOutcome: "Can extend K8s functionality with compiled, type-safe tooling.",
          commonMistakes: ["Polling the API server in a `for` loop (e.g., fetching all pods every 1 second) which crushes the API server. Always use SharedIndexInformers.", "Ignoring Go error handling."],
          debuggingExercises: ["The client-go script panics with 'out of cluster' error. Fix the configuration loading logic (fallback to kubeconfig)."],
          productionMindset: "Treat the API server nicely. Use caches (Informers) to observe state changes rather than active aggressive polling."
        },
        {
          day: 44,
          title: "Writing Kubernetes Operators",
          topic: "Extending the Control Plane",
          objectives: ["Use Kubebuilder", "Define Custom Resource Definitions (CRDs)", "Write a Reconciler"],
          theory: "Operators encode human operational knowledge into software. If an application requires 5 specific steps to backup, an Operator watches a custom `Backup` CRD and executes those steps automatically in Go.",
          practicalTasks: ["Scaffold a new project using Kubebuilder / Operator SDK.", "Define a CRD called `AppEnvironment` that spins up a Namespace, Deployment, and Service automatically.", "Write the reconcile logic to ensure these 3 objects exist and match the desired state."],
          commands: ["kubebuilder init", "kubebuilder create api", "make manifests", "make run"],
          deliverables: ["A functional Go custom controller running in the cluster."],
          expectedOutcome: "Transitioned from manipulating existing K8s objects to creating entirely new ones.",
          commonMistakes: ["Failing to handle 'requeue' logic properly, causing the controller to spam the API server endlessly or stall entirely.", "Not handling object Deletion and Finalizers, resulting in orphaned resources."],
          debuggingExercises: ["A deleted custom resource gets 'stuck' in terminating state forever. Fix the Finalizer logic in your Go code to remove external dependencies before deleting."],
          productionMindset: "Operators are the ultimate expression of Platform Engineering. You are building custom APIs for your developers to consume."
        }
      ]
    },
    {
      week: 8,
      title: "Crossplane & Infrastructure as Data",
      miniProject: "Use Crossplane to create a custom API called `CompanyDatabase`. When a Developer creates this K8s object, Crossplane provisions an actual PostgreSQL VM on Proxmox and injects the connection string back to the developer via Vault.",
      incidentSimulation: "Crossplane loses connection to the infrastructure provider (Proxmox/AWS). Re-establish the provider state without dropping existing databases.",
      knowledgeReview: ["Crossplane Providers", "Compositions", "Composite Resource Definitions (XRDs)", "Crossplane vs Terraform"],
      architectureReview: "Debate the complexities of migrating from Terraform-driven CI/CD to Crossplane-driven declarative APIs.",
      documentationAssignment: "Write a provider diagram explaining how Crossplane creates external VMs.",
      days: [
        {
          day: 50,
          title: "Crossplane Fundamentals",
          topic: "The Universal Control Plane",
          objectives: ["Understand K8s as a universal control plane", "Deploy Crossplane", "Configure Providers"],
          theory: "Terraform requires pipelines and CI/CD states. Crossplane lets you provision external infrastructure (VMs, S3 buckets, Databases) using native K8s YAML. K8s becomes the control plane for everything, not just containers.",
          practicalTasks: ["Install Crossplane.", "Configure the Provider-Helm or Provider-Proxmox.", "Create a raw database instance using a Crossplane Managed Resource object."],
          commands: ["kubectl crossplane install", "kubectl get managed"],
          deliverables: ["Infrastructure provisioned outside K8s by talking only to the K8s API."],
          expectedOutcome: "Understand the shift from Infrastructure-as-Code (Terraform) to Infrastructure-as-Data (Crossplane).",
          commonMistakes: ["Giving developers direct access to Managed Resources instead of Compositions (exposing too much complexity).", "Managing the same resource with Terraform AND Crossplane, causing a brutal fight-loop."],
          debuggingExercises: ["A managed resource is stuck in 'Syncing'. Identify the missing IAM/Secret permissions in the ProviderConfig."],
          productionMindset: "Unify the API surface. Developers should not need to learn K8s YAML for pods and HCL for databases. It should all just be the K8s API."
        }
      ]
    }
  ]
};

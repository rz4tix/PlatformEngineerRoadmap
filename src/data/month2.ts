import { MonthlyMilestone } from "../types";

export const month2: MonthlyMilestone = {
  month: 2,
  title: "Month 2: GitOps & Infrastructure as Code",
  description: "Transforming manual cluster operations into fully automated, version-controlled GitOps pipelines. Mastering declarative state with Terraform and ArgoCD.",
  largeProject: "Build an end-to-end GitOps cluster deployment. From Terraform spinning up VMs/networking, to Flux/ArgoCD bootstrapping workloads from an enterprise offline Harbor registry.",
  platformReview: "Evaluate the disaster recovery posture and security model of using a central Git repo for cluster state.",
  securityReview: "Audit Terraform state files for plaintext secrets. Review ArgoCD RBAC for developer tenants.",
  reliabilityReview: "Simulate ArgoCD drift and reconcile loops under heavy cluster load.",
  finalAssessment: "Demonstrate a git-push triggering an automated canary deployment and infrastructure change without manual intervention.",
  weeks: [
    {
      week: 3,
      title: "Advanced Terraform & IaC Patterns",
      miniProject: "Refactor a monolithic Terraform configuration into modular, DRY components using Terragrunt or strict Terraform workspaces with remote state.",
      incidentSimulation: "Terraform State lock and corruption. Someone forcefully removed an S3/Postgres backend state lock. Resolve the state drift with the actual cloud API without dropping the database.",
      knowledgeReview: ["State Management", "Modules & Registry", "Workspaces vs Directories", "Plan & Apply lifecycle", "Atlantis/TACOs ops"],
      architectureReview: "Design a state-file isolation strategy for multi-tenant, multi-environment enterprise deployments.",
      documentationAssignment: "Write the standard Terraform module contributing guidelines for internal platform teams.",
      days: [
        {
          day: 15,
          title: "Terraform State & Backends",
          topic: "Managing Truth",
          objectives: ["Understand remote backends", "Handle state locks", "Manipulate state locally"],
          theory: "In a team environment, local state files are catastrophic. State must be centralized, locked during operations, and encrypted. State is not just a cache; it maps your code to real-world IDs. If you corrupt it, Terraform cannot manage the infra.",
          practicalTasks: ["Configure a Postgres/Consul remote backend.", "Force a lock, then manually unlock it.", "Use `terraform state mv` and `rm` to refactor resources without destroying them."],
          commands: ["terraform state list", "terraform state rm", "terraform init -migrate-state", "terraform force-unlock"],
          deliverables: ["A robust, encrypted remote state configuration supporting team collaboration."],
          expectedOutcome: "Total mastery over Terraform's internal mechanics and state file manipulation.",
          commonMistakes: ["Leaving secrets in plaintext inside the state file.", "Destroying resources because of an ID mismatch instead of editing state.", "Committing state to git."],
          debuggingExercises: ["A developer renamed a module, and Terraform wants to destroy and recreate a production database. Use state manipulation to link the old ID to the new module address."],
          productionMindset: "NEVER run terraform apply if the plan shows a destroy on a stateful resource unless you explicitly intend it. Plan output is law."
        },
        {
          day: 16,
          title: "Modular Terraform & DRY Code",
          topic: "Enterprise Composability",
          objectives: ["Build reusable modules", "Understand variable precedence", "Implement dynamic blocks"],
          theory: "Monolithic Terraform (`main.tf` with 5000 lines) does not scale. Modules act like functions in programming, reducing duplication and standardizing configurations (e.g., standardizing K8s node configs across dev/stg/prod).",
          practicalTasks: ["Build a custom Terraform module for provisioning a standard Proxmox VM template.", "Publish it to a local/Git registry.", "Call the module across three different environments (directories) using varying parameters."],
          commands: ["terraform get", "terraform validate"],
          deliverables: ["A DRY Terraform structure using modules and a defined directory layout (e.g., prod/, staging/, modules/)."],
          expectedOutcome: "Can architect scalable Terraform codebases for enterprise teams.",
          commonMistakes: ["Over-parameterizing modules until they are just wrappers around the raw resources.", "Not pinning module versions, causing widespread breakages when a module updates."],
          debuggingExercises: ["Refactoring a flat file into a module causes Terraform to want to destroy all resources. Fix this using `moved` blocks."],
          productionMindset: "Modules should encapsulate organizational policy, not just abstract the technology."
        },
        {
          day: 17,
          title: "Infrastructure CI/CD (Atlantis/Pipelines)",
          topic: "TACOs (Terraform Automation)",
          objectives: ["Automate Terraform execution", "Implement plan-on-PR", "Secure pipeline credentials"],
          theory: "Humans should not run `terraform apply` from their laptops. Execution must happen centrally in CI/CD, driven by Pull Requests. Tools like Atlantis or GitLab CI coordinate this, providing audit logs and centralizing credential management.",
          practicalTasks: ["Set up an Atlantis server inside Kubernetes via Helm.", "Connect it to a Git repo to intercept Webhooks.", "Create a PR that triggers a `terraform plan` automatically commented on the PR."],
          commands: ["atlantis plan", "atlantis apply (via PR comment)"],
          deliverables: ["A fully functional GitOps workflow for Terraform changes."],
          expectedOutcome: "Removed the 'local laptop' from the infrastructure provisioning lifecycle.",
          commonMistakes: ["Granting the Terraform pipeline total God privileges indiscriminately without scoping.", "Failing to persist pipeline workspaces causing re-inits on every run."],
          debuggingExercises: ["The pipeline cannot connect to the internal vSphere/Proxmox API due to networking constraints. Fix the runner network placement."],
          productionMindset: "If a human runs `apply`, who audited it? If a machine runs `apply` via PR, you have logs, approval trails, and rollback capability."
        },
        {
          day: 18,
          title: "GitOps Foundations: ArgoCD",
          topic: "Continuous Delivery for K8s",
          objectives: ["Deploy ArgoCD", "Connect Git repos", "Understand reconcile loops"],
          theory: "GitOps extends IaC to Kubernetes workloads. Instead of `kubectl apply`, you push YAML to Git. An agent (ArgoCD/Flux) running inside the cluster watches Git, pulls changes, and reconciles cluster state to match Git state.",
          practicalTasks: ["Install ArgoCD via Helm.", "Deploy a sample application directly from a GitHub repository.", "Enable auto-sync and self-healing."],
          commands: ["argocd app create", "argocd app sync", "argocd admin initial-password"],
          deliverables: ["A cluster managing its own application workloads purely from Git commits."],
          expectedOutcome: "Solid understanding of pull-based CD vs push-based CI.",
          commonMistakes: ["Applying manifests manually after introducing GitOps, creating infinite fight loops between you and ArgoCD.", "Overloading a single ArgoCD instance with thousands of apps; tuning is required."],
          debuggingExercises: ["An app is completely out of sync. Hunt down the mutating webhook (like an auto-injecting mesh or scaler) that is changing the YAML at runtime and configure Argo to ignore those fields."],
          productionMindset: "Git is the singular source of truth. If a cluster dies, you apply ArgoCD, point it at Git, and the entire cluster rebuilds itself automatically."
        },
        {
          day: 19,
          title: "App of Apps & Kustomize/Helm",
          topic: "Scaling GitOps",
          objectives: ["Use Kustomize overlays", "Render Helm with ArgoCD", "Implement App of Apps pattern"],
          theory: "Managing 100 applications manually in the ArgoCD UI is painful. The 'App of Apps' pattern uses one ArgoCD Application to deploy other Applications. Kustomize and Helm allow varying configurations across environments (dev vs prod) without duplicating YAML.",
          practicalTasks: ["Convert a raw manifest directory into a base and dev/prod Kustomize overlays.", "Point ArgoCD to the overlays.", "Create an 'App of Apps' root manifest to bootstrap the entire cluster automatically."],
          commands: ["kustomize build .", "helm template", "argocd app create my-root-app"],
          deliverables: ["A multi-environment Git repository structure fully managed by the App of Apps pattern."],
          expectedOutcome: "Can organize and orchestrate complex microservice fleets declaratively.",
          commonMistakes: ["Using standard Helm install commands while ArgoCD is running, causing state conflict.", "Over-complicating Kustomize overlays until it's unreadable."],
          debuggingExercises: ["A Helm chart deployed via ArgoCD is failing due to CRDs being too large. Fix the Server-Side Apply flags in Argo."],
          productionMindset: "Bootstrapping a new cluster should take 2 commands: `talos bootstrap` and `kubectl apply -f root-app.yaml`."
        },
        {
          day: 20,
          title: "Enterprise Storage: Ceph & Rook",
          topic: "On-Prem Distributed Storage",
          objectives: ["Deploy Rook-Ceph", "Configure StorageClasses", "Understand RBD vs CephFS"],
          theory: "Stateful workloads in K8s (databases, queues) need Persistent Volumes. On-prem, you must provide this storage. Rook orchestrates Ceph, turning local NVMe/SSDs on worker nodes into a massive, distributed, highly-available storage fabric accessible natively via CSI.",
          practicalTasks: ["Deploy Rook operators in K8s.", "Format raw drives and allocate them to the Ceph cluster.", "Create a StorageClass for RWO (Block) and RWX (Shared filesystem) access.", "Deploy a StatefulSet Postgres DB utilizing the block storage."],
          commands: ["kubectl get no,pv,pvc", "ceph status (via toolbox)", "ceph osd tree"],
          deliverables: ["A fully functional Ceph cluster providing dynamic PV provisioning to Kubernetes workloads."],
          expectedOutcome: "Solved the 'persistent data' problem for on-premise clusters.",
          commonMistakes: ["Using slow HDD nodes for Ceph journals/WALs, absolutely destroying database performance.", "Deploying Ceph across low-bandwidth networking (1Gbe) instead of 10Gbe+."],
          debuggingExercises: ["Simulate an OSD (disk) failure. Evict the OSD from Ceph and watch it rebalance the data to healthy disks."],
          productionMindset: "If Ceph goes down, K8s goes down. Do not treat distributed storage as an afterthought."
        },
        {
          day: 21,
          title: "Offline Registries & Supply Chain",
          topic: "Air-Gapped Realities",
          objectives: ["Deploy Harbor", "Configure pull-through proxies", "Understand OCI"],
          theory: "Enterprise on-prem clusters often lack internet access. Image pulls from DockerHub will fail by design or rate-limiting. You must run an internal registry (Harbor) configured with vulnerabilities scanning and caching.",
          practicalTasks: ["Deploy Harbor on K8s.", "Configure K8s/Talos to use Harbor as a mirror for DockerHub/Quay.", "Test pushing and pulling an image locally."],
          commands: ["docker tag", "docker push", "skopeo copy"],
          deliverables: ["An offline, highly available container registry integrated with K8s image pull paths."],
          expectedOutcome: "Capable of operating clusters completely disconnected from the internet.",
          commonMistakes: ["Storing huge ML images without setting up registry garbage collection, filling the Ceph storage.", "Failing to properly configure Harbor TLS certificates, breaking containerd pulls."],
          debuggingExercises: ["A pod is trapped in ImagePullBackOff. Identify the lack of imagePullSecrets or TLS trust issues in the container runtime logs."],
          productionMindset: "You do not control the public internet. If DockerHub goes down, your platform should not even notice."
        }
      ]
    }
  ]
};

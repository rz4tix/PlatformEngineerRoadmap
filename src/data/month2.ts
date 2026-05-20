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
          objectives: ["Understand remote backends", "Handle state locks", "Manipulate state locally", "Import legacy systems"],
          theory: "In a team environment, local state files are catastrophic. State must be centralized, locked during operations, and encrypted. State is not just a cache; it maps your code to real-world IDs. If you corrupt it, Terraform cannot manage the infra.",
          practicalTasks: [
            "Configure a Postgres/Consul/S3 remote backend.", 
            "Force a concurrency lock, then manually force-unlock it recovering from a stalled pipeline.", 
            "Use `terraform state mv` and `rm` to surgically refactor resources across modules without destroying them.",
            "Import existing cloud/on-prem resources into your Terraform state file manually.",
            "Use `terraform console` to inspect complex variables, mappings, and state outputs live.",
            "Implement AWS DynamoDB (or Postgres table) state locking and simulate a concurrent run collision.",
            "Pull the remote state locally, inspect the generated JSON, and push it back safely."
          ],
          commands: ["terraform state list", "terraform state rm", "terraform init -migrate-state", "terraform force-unlock <ID>", "terraform import module.network.aws_vpc.main vpc-123456", "terraform console", "terraform state pull > state.json"],
          deliverables: ["A robust, encrypted remote state configuration supporting team collaboration.", "A documented procedure for refactoring state safely without dropping underlying infra.", "A successful import of an unmanaged virtual machine."],
          expectedOutcome: "Total mastery over Terraform's internal mechanics and state file manipulation.",
          commonMistakes: ["Leaving secrets in plaintext inside the state file.", "Destroying resources because of a logical nested ID mismatch instead of editing state.", "Committing state.tfstate files directly to git repositories."],
          debuggingExercises: ["A developer renamed a core module directory, and Terraform wants to destroy and recreate a production database. Use state manipulation to link the old ID to the new module address.", "The backend S3 bucket was accidentally hard-deleted. Rebuild the state from resource imports."],
          productionMindset: "NEVER run terraform apply if the plan shows a destroy on a critical stateful resource unless you explicitly intend it. Plan output is law."
        },
        {
          day: 16,
          title: "Modular Terraform & DRY Code",
          topic: "Enterprise Composability",
          objectives: ["Build reusable modules", "Understand variable precedence", "Implement dynamic blocks", "Automate compliance validations"],
          theory: "Monolithic Terraform (`main.tf` with 5000 lines) does not scale. Modules act like functions in programming, reducing duplication and standardizing configurations (e.g., standardizing K8s node configs across dev/stg/prod).",
          practicalTasks: [
            "Build a custom encapsulated Terraform module for provisioning a standard Proxmox VM template.", 
            "Publish the custom module to a local file system path or git registry.", 
            "Call the module across three different environments (directories) using complex varying parameters.",
            "Implement Terraform variable validation blocks to strictly enforce organizational resource naming conventions.",
            "Use `for_each` and `dynamic` blocks to provision a variable calculated number of subnets based on CIDR.",
            "Generate Terraform documentation dynamically using `terraform-docs`.",
            "Refactor a repeated set of security group rules into a DRY local map variable utilizing `for` loops."
          ],
          commands: ["terraform get", "terraform validate", "terraform-docs markdown table .", "terraform plan -var-file=prod.tfvars", "terraform fmt -recursive"],
          deliverables: ["A highly DRY Terraform structure utilizing modules and a clear directory layout (e.g., prod/, staging/, modules/).", "Automated variable validation rejecting non-compliant environments.", "Auto-generated Markdown documentation for all modules."],
          expectedOutcome: "Can architect scalable, composable Terraform codebases for massive enterprise teams.",
          commonMistakes: ["Over-parameterizing modules until they are just useless wrappers around the raw resources.", "Not pinning module versions in Git, causing widespread breakages when a shared module updates.", "Using element() or list lookups over map lookups for indexing."],
          debuggingExercises: ["Refactoring a flat file architecture directly into a module causes Terraform to want to destroy all resources. Fix this using native `moved` blocks.", "A variable validation is failing on a regex constraint. Debug the regex engine evaluation logic."],
          productionMindset: "Modules should encapsulate organizational policy and deep architectural choices, not strictly act as mere syntax abstraction interfaces."
        },
        {
          day: 17,
          title: "Infrastructure CI/CD (TACOs)",
          topic: "Atlantis & Automation",
          objectives: ["Automate Terraform execution", "Implement plan-on-PR", "Secure pipeline credentials", "Enforce security scanning"],
          theory: "Humans should not run `terraform apply` from their laptops. Execution must happen centrally in CI/CD, driven by Pull Requests. Tools like Atlantis or GitLab CI coordinate this, providing audit logs and centralizing credential management.",
          practicalTasks: [
            "Set up an Atlantis server instance running inside Kubernetes via Helm with secure ingresses.", 
            "Connect Atlantis to a Git repository to intercept webhook pushes and comment on PRs.", 
            "Create a PR that triggers an automated `terraform plan` commented directly onto the PR.",
            "Secure the Atlantis endpoints utilizing an ingress controller integrated with OIDC authentication.",
            "Configure custom Atlantis server-side workflows to forcefully run `tflint` and `tfsec` before planning.",
            "Implement organizational requirements where Atlantis strictly requires 2 code-owner approvals before allowing `atlantis apply`.",
            "Draft an emergency pipeline break-glass procedure for urgent hotfixes bypassing Atlantis."
          ],
          commands: ["atlantis plan -d src/prod", "atlantis apply (via PR comment)", "tflint --init", "tfsec .", "kubectl logs -l app=atlantis"],
          deliverables: ["A fully functional, secured GitOps workflow for Terraform changes.", "Automated security scanning integrated into the pipeline flow.", "A hardened Atlantis deployment inaccessible from the public internet."],
          expectedOutcome: "Removed the 'local laptop' entirely from the infrastructure provisioning lifecycle, replacing it with auditable systems.",
          commonMistakes: ["Granting the Terraform pipeline total organizational God privileges indiscriminately without scoping.", "Failing to persist pipeline workspaces causing excruciating re-inits on every run.", "Exposing Atlantis to the open web without authentication."],
          debuggingExercises: ["The pipeline cannot connect to the internal vSphere/Proxmox API due to strict networking constraints. Fix the runner network placement and routing.", "Atlantis is failing to lock the workspace. Identify the locked directory preventing parallel applies."],
          productionMindset: "If a human runs `apply`, who accurately audited it? If a machine runs `apply` via PR, you have logs, approval trails, and rollback capability natively."
        },
        {
          day: 18,
          title: "GitOps Foundations: ArgoCD",
          topic: "Continuous Delivery for K8s",
          objectives: ["Deploy ArgoCD", "Connect Git repos", "Understand reconcile loops", "Integrate SSO"],
          theory: "GitOps extends IaC to Kubernetes workloads. Instead of `kubectl apply`, you push YAML to Git. An agent (ArgoCD/Flux) running inside the cluster watches Git, pulls changes, and reconciles cluster state to match Git state.",
          practicalTasks: [
            "Install ArgoCD purely declaratively via Helm.", 
            "Deploy a sample multi-tier application directly from a GitHub repository.", 
            "Enable aggressive auto-sync and self-healing parameters on the application.",
            "Configure ArgoCD SSO integration binding to an external identity provider (GitHub/GitLab/Okta).",
            "Implement a complex ArgoCD pre-sync hook to run database migrations before cutting over to the new image.",
            "Use the `argocd` CLI to declaratively manage internal ArgoCD projects and lock down tenant RBAC.",
            "Set up notifications using ArgoCD Notifications connecting directly to a Slack/Discord webhook."
          ],
          commands: ["argocd app create", "argocd app sync", "argocd admin initial-password", "argocd proj create", "argocd app set --sync-policy automated", "kubectl describe application"],
          deliverables: ["A cluster actively managing its own application workloads purely from Git commits.", "Configured SSO access mapping groups to ArgoCD roles.", "Automated database migration pipelines running natively in-cluster."],
          expectedOutcome: "Solid understanding of pull-based CD mechanisms vs traditional push-based CI platforms.",
          commonMistakes: ["Applying manifests manually after introducing GitOps, creating infinite and brutal fight loops between you and ArgoCD.", "Overloading a single ArgoCD instance with thousands of apps without horizontal sharding; tuning is required.", "Committing sensitive Helm values.yaml unencrypted."],
          debuggingExercises: ["An app is completely stuck OutOfSync. Hunt down the mutating admission webhook (like an auto-injecting mesh or scaler) that is augmenting the YAML at runtime and configure Argo to ignore those specific fields.", "A Sync hook fails silently. Trace the job logs and define Hook deletion policies correctly."],
          productionMindset: "Git is the singular source of truth. If a cluster dies, you apply ArgoCD, point it at Git, and the entire cluster rebuilds itself automatically."
        },
        {
          day: 19,
          title: "App of Apps & Kustomize",
          topic: "Scaling GitOps",
          objectives: ["Use Kustomize overlays", "Render Helm with ArgoCD", "Implement App of Apps pattern", "Utilize ApplicationSets"],
          theory: "Managing 100 applications manually in the ArgoCD UI is painful. The 'App of Apps' pattern uses one ArgoCD Application to deploy other Applications. Kustomize and Helm allow varying configurations across environments (dev vs prod) without duplicating YAML.",
          practicalTasks: [
            "Convert a raw static manifest directory into a base directory paired with distinct dev/prod Kustomize overlays.", 
            "Point ArgoCD to the Kustomize overlays and observe the disparate deployments.", 
            "Create an 'App of Apps' root manifest to automatically bootstrap the entire cluster fabric.",
            "Write a Kustomize JSON patch to dynamically inject environment-specific Vault annotations into disparate Deployments.",
            "Configure ArgoCD to process standard Helm charts with a custom `post-renderer` to modify generated complex manifests.",
            "Establish an advanced `ApplicationSet` generator to dynamically spawn ArgoCD apps per cluster based on Git directory structures.",
            "Use Kustomize to seamlessly swap out container image tags for specific environment overlays."
          ],
          commands: ["kustomize build .", "helm template .", "argocd app create my-root-app", "kubectl apply -k .", "argocd app list"],
          deliverables: ["A multi-environment Git repository structure fully dynamically orchestrated by the App of Apps pattern.", "An ApplicationSet automatically deploying workloads across distinct clusters.", "Dry, parameterized manifests."],
          expectedOutcome: "Can organize and orchestrate complex microservice fleets declaratively without YAML spaghettification.",
          commonMistakes: ["Using standard Helm install commands while ArgoCD is running, causing catastrophic state conflict.", "Over-complicating Kustomize overlays infinitely nested until it becomes entirely unreadable.", "Failing to properly namespace root vs tenant applications in App of Apps."],
          debuggingExercises: ["A massive Helm chart deployed via ArgoCD is failing due to CRDs being too large for annotations. Fix the operation utilizing the Server-Side Apply flags in Argo.", "Kustomize refuses to build due to a missing base resource. Debug the Kustomization file paths."],
          productionMindset: "Bootstrapping a new cluster from scratch should literally take 2 commands: `talos bootstrap` and `kubectl apply -f root-app.yaml`."
        },
        {
          day: 20,
          title: "Enterprise Storage: Ceph & Rook",
          topic: "On-Prem Distributed Storage",
          objectives: ["Deploy Rook-Ceph", "Configure StorageClasses", "Understand RBD vs CephFS", "Manipulate PVCs dynamically"],
          theory: "Stateful workloads in K8s (databases, queues) need Persistent Volumes. On-prem, you must provide this storage. Rook orchestrates Ceph, turning local NVMe/SSDs on worker nodes into a massive, distributed, highly-available storage fabric accessible natively via CSI.",
          practicalTasks: [
            "Deploy the core Rook operators in a clean K8s environment.", 
            "Format raw physical drives attached to VMs and allocate them to the distributed Ceph cluster.", 
            "Create a dynamic StorageClass for RWO (Block) and RWX (Shared filesystem) access modes.", 
            "Configure a pristine VolumeSnapshot class and orchestrate a snapshot of a Ceph RBD volume containing dummy data.",
            "Dynamically expand the storage capacity of a running PVC backed by Ceph without dropping Pod connections.",
            "Deploy the heavily tooled Ceph toolbox pod and execute deep health diagnostic queries natively against the storage fabric.",
            "Deploy a StatefulSet PostgreSQL DB utilizing the hyper-fast block storage provisioned via the CSI."
          ],
          commands: ["kubectl get no,pv,pvc", "ceph status (via toolbox)", "ceph osd tree", "ceph -s", "kubectl patch pvc my-data -p '{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"10Gi\"}}}}'"],
          deliverables: ["A fully functional distributed Ceph cluster providing dynamic PV provisioning to Kubernetes workloads.", "A Volume Snapshot testing validation script.", "A comprehensive Ceph status monitoring dashboard output."],
          expectedOutcome: "Completely solved the 'persistent data gravity' problem for on-premise clusters.",
          commonMistakes: ["Using slow HDD rust nodes for Ceph journals/WALs, absolutely destroying database IOPS performance.", "Deploying Ceph across low-bandwidth networking (1Gbe instead of 10/40Gbe+), saturating the network.", "Deleting the Rook namespace before destroying Ceph resources, permanently hanging the API."],
          debuggingExercises: ["Simulate an OSD (physical disk) total failure. Evict the OSD strictly from Ceph via CLI and watch it aggressively rebalance the data to healthy disks.", "A pod is stuck in ContainerCreating due to a PVC attachment deadlock. Force detach the volume via the volumeattachment API."],
          productionMindset: "If Ceph goes down, K8s goes down completely. Treat distributed storage with the highest architectural priority; it is never an afterthought."
        },
        {
          day: 21,
          title: "Offline Registries & Supply Chain",
          topic: "Air-Gapped Realities",
          objectives: ["Deploy Harbor", "Configure pull-through proxies", "Understand OCI architecture", "Implement Image Signing"],
          theory: "Enterprise on-prem clusters often lack internet access. Image pulls from DockerHub will fail by design or rate-limiting. You must run an internal registry (Harbor) configured with vulnerabilities scanning and caching.",
          practicalTasks: [
            "Deploy the Harbor registry securely natively on K8s incorporating core Postgres and Redis dependencies.", 
            "Configure K8s/Talos daemon configurations to use Harbor strictly as a mirror proxy for DockerHub/Quay.", 
            "Configure a highly effective pull-through cache mechanism spanning multiple massive upstream registries (Quay, GCR).",
            "Set up deep image vulnerability scanning using Trivy embedded aggressively inside the Harbor pipeline.",
            "Sign core container images utilizing Cosign (Sigstore) and enforce verification before K8s deployment execution.",
            "Test pulling and pushing a complex multi-architecture generic OCI image locally.",
            "Implement stringent Harbor garbage collection policies to aggressively reap untagged images conserving Ceph storage."
          ],
          commands: ["docker tag", "docker push", "skopeo copy", "cosign sign --key cosign.key", "cosign verify --key cosign.pub", "helm install harbor harbor/harbor"],
          deliverables: ["An offline, highly available container registry integrated completely with K8s image pull paths.", "A supply chain security framework validating Cosign signatures.", "Automated Trivy vulnerability sweeping schedules."],
          expectedOutcome: "Capable of securely operating incredibly complex clusters completely disconnected from the broader public internet.",
          commonMistakes: ["Storing huge ML images repeatedly without setting up aggressive registry garbage collection, crashing the Ceph backend.", "Failing to properly configure Harbor TLS certificates, fundamentally breaking containerd pulls.", "Assuming tags are immutable without explicitly configuring immutability constraints in Harbor."],
          debuggingExercises: ["A production pod is suddenly trapped in ImagePullBackOff. Identify the lack of imagePullSecrets or specific TLS trust issues exclusively in the container runtime logs.", "Cosign verification is failing on a trusted image. Diagnose the mismatched public key pair parameters."],
          productionMindset: "You categorically do not control the public internet. If DockerHub permanently dies, your entire platform should not even notice a blip."
        }
      ]
    }
  ]
};

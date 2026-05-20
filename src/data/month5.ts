import { MonthlyMilestone } from "../types";

export const month5: MonthlyMilestone = {
  month: 5,
  title: "Month 5: SRE, FinOps, Chaos, & Multi-Cluster",
  description: "Operating at massive scale. Hardening the platform through chaos engineering, federating clusters across data centers, and implementing economic scaling (FinOps).",
  largeProject: "Deploy a distributed multi-cluster fleet using Cluster API (CAPI) and Karmada. Run Chaos Mesh on the infrastructure and maintain 99.9% availability during induced failures.",
  platformReview: "Present the total cost calculation (TCO) of the on-premise compute footprint vs public cloud.",
  securityReview: "Verify multi-cluster identity federation.",
  reliabilityReview: "Run a 4-hour Game Day simulating complete zone failures, storage disconnections, and rogue scaling events.",
  finalAssessment: "The Final Capstone: Present the architecture, code, and operational runbooks of your self-hosted, self-healing Enterprise Platform.",
  weeks: [
    {
      week: 9,
      title: "SRE Practices & FinOps",
      miniProject: "Implement KEDA (Kubernetes Event-driven Autoscaling) to scale workloads based on RabbitMQ/Kafka queue depth, whilst bounding it with cost-alerts.",
      incidentSimulation: "Thundering Herd. Your autoscaler spins up 5,000 pods instantly due to a metric spike, crushing the API server and exhausting IP addresses. Contain it.",
      knowledgeReview: ["SLIs vs SLOs vs SLAs", "Error Budgets", "KEDA vs HPA", "VPA limitations"],
      architectureReview: "Design the logic for scale-to-zero in an on-premise environment.",
      documentationAssignment: "Write an Incident Postmortem using the blameless SRE template.",
      days: [
        {
          day: 57,
          title: "Service Level Objectives (SLOs)",
          topic: "SRE Math",
          objectives: ["Define SLIs", "Calculate Error Budgets", "Implement Sloth/Prometheus Rules"],
          theory: "100% reliability is impossible. SLOs define acceptable failure. If a platform guarantees 99.9% uptime, you have ~43 minutes of allowed downtime per month. Platform engineering decisions (deployments, risk) are driven by this budget.",
          practicalTasks: [
            "Use Sloth to generate Prometheus recording rules that track a 99.9% SLO on API latency.",
            "Set up an alert that fires only when the Error Budget burn rate is highly accelerated.",
            "Implement a fast-burn Prometheus alert string that pages an on-call engineer when the budget burns 5% globally in 1 single hour strictly.",
            "Draft a profound SLI for a massive background asynchronous queue processor using precise success rates measured strictly over processing time instead of pure HTTP codes.",
            "Utilize precise Grafana SLO widgets to accurately visualize the rolling 30-day trailing compliance metrics interactively.",
            "Configure distinct alerts escalating specifically if the error budget completely zeroes out.",
            "Create an exhaustive spreadsheet model matching SLO burn formulas to exact real-world outage lengths mathematically."
          ],
          commands: ["sloth generate -i slo.yaml", "promtool check rules", "kubectl get prometheusrules"],
          deliverables: ["An operational Grafana dashboard showing the remaining Error Budget for the platform.", "A defined matrix of exact SLI parameters for primary databases.", "A formalized fast-burn paging protocol sheet."],
          expectedOutcome: "Can make engineering decisions based on math and reliability metrics.",
          commonMistakes: ["Setting alerts on single SLI metric spikes instead of algorithmic Burn Rates, predictably leading to massive alert fatigue permanently.", "Targeting exact 100% availability impossibly.", "Failing to exclude precisely known planned maintenance windows completely from the SLO calculation logic."],
          debuggingExercises: ["The calculated error budget sits artificially deeply negative concurrently, but actual end users importantly aren't complaining actively. Fix the specific SLI measuring logic natively (it's measuring internal strict retry loops iteratively, definitely not user impact).", "A fast-burn alert fired instantly without any apparent traffic load. Debug the anomaly strictly checking the denominator zero-division handling inherently."],
          productionMindset: "If the error budget is entirely depleted mathematically, immediate feature freezes definitively occur. Focus dynamically inevitably shifts entirely to pure reliability optimizations."
        },
        {
          day: 58,
          title: "Intelligent Autoscaling & FinOps",
          topic: "Cost and Scale",
          objectives: ["Deploy KEDA", "Configure VPA", "Understand Kube-Cost basics"],
          theory: "Static scaling wastes money, even on-prem (power, hardware utilization). HPA scales on CPU/RAM, but modern scaling often requires event-driven metrics (e.g., messages in a queue). Further, VPA helps right-size requesting applications.",
          practicalTasks: [
            "Deploy KEDA comprehensively. Configure an intensive workload to scale drastically from exactly 0 to 10 strictly based algorithmically on the exact real-time length natively of a Redis queue.",
            "Enable intelligent VPA strictly exclusively in passive recommendation mode constantly to systematically identify fundamentally over-provisioned wasteful pods structurally.",
            "Carefully configure an advanced HPA spec strategically to deliberately scale down extremely slowly utilizing Stabilization Windows natively to gracefully handle wildly fluctuating erratic traffic bursts softly.",
            "Implement the intricate Prometheus Adapter comprehensively to rigorously scale pods definitively based implicitly on deep business metrics parsed cleanly (e.g., 'active_payment_users_total').",
            "Deploy expansive KubeCost extensively and thoroughly analyze the exact specific cluster namespace with categorically the highest totally wasted raw memory allocation natively.",
            "Test massive scaling speeds locally and aggressively measure container cold-start delay anomalies specifically.",
            "Draft a comprehensive FinOps scaling architecture document securely detailing the balance of cost optimizations strictly versus pure application responsiveness metrics."
          ],
          commands: ["kubectl apply -f keda-auth.yaml", "kubectl describe scaledobject", "kubectl top pods", "helm install kubecost"],
          deliverables: ["A highly elastic workload layer optimized for hardware utilization.", "A VPA recommendation report scaling down resources by 20%.", "A FinOps dashboard visually mapping absolute memory requests strictly against actual RAM usage seamlessly."],
          expectedOutcome: "Absolute technical mastery of complex K8s compute economies.",
          commonMistakes: ["Deploying traditional HPA and autonomous VPA concurrently scaling drastically on identical CPU metrics universally, aggressively causing them to fight endlessly and crash the particular pod repeatedly permanently.", "Scaling evaluation metric intervals natively set inherently being absolutely too slow systematically, drastically causing necessary workloads safely to exclusively scale up specifically *after* the massive traffic spike natively is entirely over basically.", "Setting CPU limits aggressively too low preventing pods from initializing rapidly."],
          debuggingExercises: ["A specific pod explicitly scales up endlessly rapidly without terminating safely natively. Discover the profoundly missing `cooldownPeriod` structural configuration implicitly inside KEDA categorically.", "VPA recommends incredibly low CPU amounts which crashes Java applications natively during massive init phases gracefully. Implement strict lower bounds implicitly."],
          productionMindset: "Absolute resource optimization systematically without robust deep observation natively is categorically premature practically. You structurally cannot securely right-size what you fundamentally completely do not deeply measure continuously."
        }
      ]
    },
    {
      week: 10,
      title: "Chaos Engineering & Multi-Cluster",
      miniProject: "Install Chaos Mesh. Induce a network partition between the web nodes and database nodes. Ensure the application degrades gracefully and recovers autonomously.",
      incidentSimulation: "The Database Master node is hard-killed. Observe and fix the split-brain scenario during automatic failover.",
      knowledgeReview: ["Chaos Engineering physics", "Cluster API (CAPI)", "Karmada/Federation concepts", "Service Mesh multi-cluster routing"],
      architectureReview: "Design a topology spanning two physical data centers with stretched L2/L3 networking and active-active K8s replication.",
      documentationAssignment: "Write the 'Game Day' runbook outlining the rules of engagement for chaos testing in production.",
      days: [
        {
          day: 64,
          title: "Chaos Engineering",
          topic: "Breaking Things on Purpose",
          objectives: ["Deploy Chaos Mesh", "Write Chaos Experiments", "Grasp Game Day principles"],
          theory: "You cannot prove an architecture is highly available until you destroy parts of it. Chaos engineering systematically injects failure (CPU hogs, network latency, pod kills) to verify that recovery systems (auto-failovers, HPA) actually work.",
          practicalTasks: [
            "Deploy Chaos Mesh into a dedicated namespace.",
            "Induce 500ms of latency on connection packets between a microservice and Redis.",
            "Write a NetworkChaos YAML to drop 20% of packets randomly.",
            "Perform an aggressive IOChaos experiment natively simulating drastically failing SSDs specifically situated on the core database statefulset implicitly.",
            "Write an automated intricate script natively that continuously robustly asserts the running application properly responds purely with perfect 200 OK statuses reliably while brutal Chaos logic implicitly is actively matching a chaotic pod kill condition dynamically.",
            "Carefully configure a sophisticated TimeChaos experiment comprehensively simulating strict systemic clock skew gracefully verifying its cascading effect seamlessly on precise internal TLS handshakes securely.",
            "Run a controlled total pod-kill chaos run securely against the main API gateway specifically testing downstream retry resilience cleanly."
          ],
          commands: ["kubectl apply -f network-chaos.yaml", "helm install chaos-mesh", "kubectl get networkchaos"],
          deliverables: ["A documented Chaos Experiment proving the resilience of the platform's retry mechanisms.", "An aggressive IO chaos testing report natively demonstrating database recovery intervals securely.", "A precise TimeChaos validation strictly verifying rigorous clock drift tolerances correctly."],
          expectedOutcome: "Complete absolute confidence specifically in the robust fundamental platform's extensive automated survivability protective mechanics natively.",
          commonMistakes: ["Running aggressive chaos experiments casually in active Production implicitly without thoroughly testing deeply in distinct Staging environments natively entirely first securely.", "Initiating an autonomous experiment natively entirely without a strictly predefined robust 'abort/rollback' mechanism definitively integrated inherently.", "Focusing explicitly entirely completely on massive failures without gracefully simulating subtle persistent micro-degradations exclusively initially."],
          debuggingExercises: ["The destructive blast radius implicitly of a chaotic experiment gracefully deployed was profoundly too large inherently, forcefully bringing down cleanly the whole native cluster fundamentally. Extensively learn to ruthlessly aggressively strictly restrict NetworkChaos scopes seamlessly unequivocally using explicit distinct namespace/label selectors cleanly.", "Chaos Mesh consistently refuses securely to inject simulated latency gracefully exactly due absolutely to missing structural native kernel capabilities seamlessly. Diagnose the precise required container security configurations securely."],
          productionMindset: "If a system failure inherently occurs natively as a complete surprise systematically, your strict architectural testing is categorically weak safely. Carefully orchestrating complete systemic destruction specifically is categorically the highest absolute distinct form definitively of true reliability assurance continuously."
        }
      ]
    }
  ]
};

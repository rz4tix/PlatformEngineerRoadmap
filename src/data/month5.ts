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
          practicalTasks: ["Use Sloth to generate Prometheus recording rules that track a 99.9% SLO on API latency.", "Set up an alert that fires only when the Error Budget burn rate is highly accelerated."],
          commands: ["sloth generate", "promtool check rules"],
          deliverables: ["An operational Grafana dashboard showing the remaining Error Budget for the platform."],
          expectedOutcome: "Can make engineering decisions based on math and reliability metrics.",
          commonMistakes: ["Setting alerts on SLI single spikes instead of Burn Rates, leading to massive alert fatigue.", "Targeting 100% availability."],
          debuggingExercises: ["The error budget is negative, but users aren't complaining. Fix the SLI measuring logic (it's measuring internal retry loops, not user impact)."],
          productionMindset: "If the error budget is depleted, feature freezes occur. Focus shifts entirely to reliability."
        },
        {
          day: 58,
          title: "Intelligent Autoscaling & FinOps",
          topic: "Cost and Scale",
          objectives: ["Deploy KEDA", "Configure VPA", "Understand Kube-Cost basics"],
          theory: "Static scaling wastes money, even on-prem (power, hardware utilization). HPA scales on CPU/RAM, but modern scaling often requires event-driven metrics (e.g., messages in a queue). Further, VPA helps right-size requesting applications.",
          practicalTasks: ["Deploy KEDA. Configure a workload to scale from 0 to 10 based on the length of a Redis queue.", "Enable VPA in recommendation mode to identify over-provisioned pods."],
          commands: ["kubectl apply -f keda-auth.yaml", "kubectl describe scaledobject"],
          deliverables: ["A highly elastic workload layer optimized for hardware utilization."],
          expectedOutcome: "Mastery of K8s compute economics.",
          commonMistakes: ["Running HPA and VPA concurrently on CPU metrics, causing them to fight and crash the pod repeatedly.", "Scaling metric intervals being too slow, causing workloads to scale *after* the traffic spike is over."],
          debuggingExercises: ["A pod scales up endlessly without terminating. Discover the missing `cooldownPeriod` configuration in KEDA."],
          productionMindset: "Optimization without observation is premature. You cannot right-size what you do not measure."
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
          practicalTasks: ["Deploy Chaos Mesh.", "Induce 500ms of latency on connection packets between a microservice and Redis.", "Write a NetworkChaos YAML to drop 20% of packets randomly."],
          commands: ["kubectl apply -f network-chaos.yaml", "helm install chaos-mesh"],
          deliverables: ["A documented Chaos Experiment proving the resilience of the platform's retry mechanisms."],
          expectedOutcome: "Complete confidence in the platform's survivability mechanics.",
          commonMistakes: ["Running chaos experiments in Production without testing in Staging first.", "Running an experiment without a defined 'abort/rollback' mechanism."],
          debuggingExercises: ["The blast radius of an experiment was too large, bringing down the whole cluster. Learn to ruthlessly restrict NetworkChaos using namespace/label selectors."],
          productionMindset: "If a failure is a surprise, your testing is weak. Orchestrating destruction is the highest form of reliability assurance."
        }
      ]
    }
  ]
};

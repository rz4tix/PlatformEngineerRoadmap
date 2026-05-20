import { MonthlyMilestone } from "../types";

export const month1: MonthlyMilestone = {
  month: 1,
  title: "Month 1: Bare-Metal & Kubernetes Internals",
  description: "Diving deep into Linux internals, eBPF, On-Premise Virtualization, bare-metal networking, and dismantling the Kubernetes control plane.",
  largeProject: "Deploy an HA Talos Linux Kubernetes cluster on Proxmox/Bare-Metal with Cilium CNI (BGP routing), MetalLB, and localized storage via Ceph/Rook.",
  platformReview: "Review architectural decisions for decoupling compute from storage in on-prem environments. Assess redundancy and failover times for etcd.",
  securityReview: "Evaluate node-level security postures natively applied by Talos. Review Cilium network policies at L3/L4/L7.",
  reliabilityReview: "Simulate a complete node loss. Calculate time-to-recovery (TTR) for stateful vs stateless workloads on the cluster.",
  finalAssessment: "Whiteboard the complete request path from an external IP passing through BGP to the kube-apiserver, detailing components involved.",
  weeks: [
    {
      week: 1,
      title: "Linux Internals, Storage, & Networking",
      miniProject: "Rebuild a corrupted ext4 partition, set up a 3-disk RAID-5 array with LVM, and write a systemd service that bounds CPU/RAM via cgroups.",
      incidentSimulation: "Out-of-Memory (OOM) killer simulation. A stray process consumes memory; you must use cgroups and kernel tuning to fence it.",
      knowledgeReview: ["systemd architecture", "cgroups v2 vs v1", "LVM & RAID topologies for enterprise", "Namespaces (PID, Mount, Net)"],
      architectureReview: "Design a physical disk layout for a highly active database node (separation of WAL, Data, and OS).",
      documentationAssignment: "Write an RFC for adopting a specific RAID/LVM topology for on-premise Kubernetes worker nodes.",
      days: [
        {
          day: 1,
          title: "The Kernel & systemd",
          topic: "Linux Boot Process & systemd architecture",
          objectives: ["Understand systemd targets & units", "Master journalctl filtering", "Grasp the boot sequence (GRUB -> Kernel -> Init)", "Implement custom systemd timers", "Design complex unit dependencies"],
          theory: "In on-prem enterprise environments, when a node fails to boot or hangs, you are the final safety net. systemd is not just a service runner; it's a suite of system management tools. Understanding unit dependencies and slice management is critical for node stability.",
          practicalTasks: [
            "Create a custom systemd service that depends on networking and mounts.", 
            "Configure systemd slice configurations to limit CPU to 50% for a specific worker process.", 
            "Debug a failing boot component using systemd-analyze blame.",
            "Configure a systemd timer unit as an alternative to cron for log rotation.",
            "Examine the `journalctl` binary logs and set up persistent journal storage with size limits.",
            "Create a target unit to group multiple custom custom daemons together.",
            "Analyze and optimize the critical path of the boot sequence using systemd-analyze plot."
          ],
          commands: ["systemctl list-dependencies", "systemd-analyze blame", "journalctl -xeu <service>", "systemctl edit <service>", "systemctl list-timers", "systemd-analyze plot > boot.svg", "journalctl --vacuum-size=1G"],
          deliverables: ["A customized systemd service file running an application with strict resource bounds.", "Boot time analysis report.", "Configured systemd timer for automated maintenance.", "Persistent journald config limiting logs to 1GB maximum footprint."],
          expectedOutcome: "Can confidently trace and resolve system startup failures and manage persistent daemon lifecycles.",
          commonMistakes: ["Ignoring unit load ordering resulting in race conditions.", "Using default log configurations leading to /var/log saturation.", "Placing heavy synchronous scripts in ExecStartPre blocking the boot phase."],
          debuggingExercises: ["A service is failing to start with status 255. Use journalctl and strace to identify the missing dependency.", "A systemd timer triggers 2 hours late. Diagnose the RandomizedDelaySec parameters. Calculate exact fire times."],
          productionMindset: "Platform engineers don't reboot and pray. They trace the boot process, find the exact failing unit, and implement a deterministic fix."
        },
        {
          day: 2,
          title: "Cgroups & Namespaces Deep Dive",
          topic: "Container Primitives",
          objectives: ["Manually create containers using namespaces", "Understand cgroup tree hierarchies", "Grasp how Kubernetes limits resources at the OS level", "Manipulate network namespaces directly"],
          theory: "Docker and Kubernetes are just wrappers around Linux primitives: Namespaces (isolation) and cgroups (resource constraints). To debug 'OOMKilled' or 'CPU Throttling' in K8s, you must understand the underlying cgroup mechanics natively.",
          practicalTasks: [
            "Create a custom isolated environment using `unshare`.", 
            "Manually assign a PID to a cgroup memory controller and purposefully trigger an OOM kill.", 
            "Inspect the cgroupfs tree for a running Docker container.",
            "Use `nsenter` to execute a shell inside the namespace of a background process without Docker/kubectl.",
            "Create a `cpuset` cgroup and pin a CPU-intensive bash script to a single specific core.",
            "Use `systemd-cgtop` to monitor the real-time resource utilization of your custom cgroup slices.",
            "Isolate a process using Mount Namespaces and prove it cannot see the host's /etc/shadow."
          ],
          commands: ["unshare -p -f -m -n -u --mount-proc", "cgcreate -g memory:/test", "cat /sys/fs/cgroup/memory/.../memory.usage_in_bytes", "nsenter -t <pid> -m -u -i -n -p", "taskset -c 0-1 <cmd>", "systemd-cgtop"],
          deliverables: ["A bash script that creates a jailed process completely isolated from the host view using namespaces & cgroups.", "A lab report documenting cgroup CPU limits vs reality.", "A custom diagnostic tool utilizing nsenter."],
          expectedOutcome: "Deep intuition of what a 'container' actually is at the kernel level.",
          commonMistakes: ["Confusing cgroups v1 vs v2 mechanics.", "Assuming containers provide VM-level security by default.", "Triggering cgroup kill cascades that take down the host's sshd."],
          debuggingExercises: ["Identify why a container is being throttled when it hasn't reached its CPU limit (hint: CFS quota bugs/bursts).", "A process claims to have 64GB of RAM but is killed at 2GB. Track down the overarching parent cgroup slice limit."],
          productionMindset: "When a node becomes unresponsive, K8s metrics might be blind. You must drop to the host level and read cgroup stats manually."
        },
        {
          day: 3,
          title: "Storage Foundation: LVM & RAID",
          topic: "Enterprise Disk Provisioning",
          objectives: ["Configure RAID arrays", "Master Logical Volume Manager (LVM)", "Understand Filesystem tuning (ext4/xfs)", "Implement snapshotting"],
          theory: "On-prem platforms cannot rely on AWS EBS. You must design and carve out physical storage. Combining Hardware/Software RAID with LVM provides the redundancy and flexibility required for dynamically expanding K8s persistent volumes.",
          practicalTasks: [
            "Create a RAID-10 array using mdadm from loopback devices.", 
            "Initialize it as an LVM Physical Volume, create a Volume Group, and multiple Logical Volumes.", 
            "Format with XFS and extend the volume online without unmounting.",
            "Create an LVM thin pool and provision thin volumes to overcommit storage.",
            "Take an LVM snapshot of a live mock-database volume, modify the original wildly, and roll back to the snapshot state.",
            "Conduct an `fio` benchmark comparing direct raw block device I/O versus the LVM overhead.",
            "Simulate a catastrophic single-disk hardware failure in your RAID array and execute the zero-downtime rebuild procedure."
          ],
          commands: ["mdadm --create /dev/md0", "pvcreate, vgcreate, lvcreate", "lvextend -L+10G -r", "lvcreate -s -n snap1 /dev/vg0/lv0", "fio --name=randrw --ioengine=libaio --rw=randrw", "mdadm --manage /dev/md0 --fail"],
          deliverables: ["An automated script to provision disks into a standardized LVM thin-pool layout.", "Runbook for replacing a failed disk in a live RAID array.", "Detailed FIO benchmarking analysis spreadsheet.", "Disaster recovery documentation for snapshot rollbacks."],
          expectedOutcome: "Capable of designing and executing robust on-premise block storage architectures.",
          commonMistakes: ["Filling 100% of the VG immediately, leaving no room for LVM snapshots or metadata.", "Using incorrect chunk sizes for RAID affecting database performance.", "Forcing filesystem resizes without `-r` and breaking block limits."],
          debuggingExercises: ["A disk has 'failed', but is still physically attached. Degrade the array, remove the disk, and rebuild it.", "An LVM volume is throwing 'No space left on device' despite df -h showing 50% free. Deduce the inode exhaustion."],
          productionMindset: "Data gravity is real. Compute is ephemeral, but if you lose the underlying LVM array holding your etcd or database data, your platform is dead."
        },
        {
          day: 4,
          title: "Networking Internals: TCP/IP & eBPF Basics",
          topic: "Network Dataplane",
          objectives: ["Analyze network traffic deeply", "Understand modern networking via eBPF", "Master iproute2", "Grasp WireGuard tunnels"],
          theory: "The era of pure iptables is ending. eBPF (Extended Berkeley Packet Filter) is the new standard for tracing and networking (Cilium). Understanding how packets traverse the kernel stack, bridge interfaces, and veth pairs is critical.",
          practicalTasks: [
            "Manually create veth pairs, connect them via a bridge, and route traffic between multiple network namespaces.", 
            "Use tcpdump/wireshark to analyze a TLS handshake step-by-step focusing on Cypher suites.", 
            "Run basic bpftrace scripts to observe and log targeted network syscalls.",
            "Configure a secondary IP alias on a primary network interface using `ip addr`.",
            "Create a site-to-site WireGuard VPN tunnel manually between two isolated network namespaces.",
            "Trace a simulated packet drop at the firewall level using `dropwatch` or `perf`.",
            "Implement and verify TCP SYN cookie protection under a simulated SYN-flood DDoS attack."
          ],
          commands: ["ip link add type veth", "ip netns exec", "tcpdump -i any -w out.pcap coverage", "bpftrace -e 'tracepoint:syscalls:sys_enter_recvfrom { @[comm] = count(); }'", "wg genkey", "dropwatch -l kas"],
          deliverables: ["Architecture diagram of how packets move from a physical NIC into a container namespace.", "A bpftrace one-liner to track network drops.", "A configured Wireguard interface file.", "A TCP optimization sysctl hardening playbook."],
          expectedOutcome: "Can bypass high-level tooling and track packets directly attached to kernel hooks.",
          commonMistakes: ["Over-relying on ping. Ping uses ICMP, which might be blocked while TCP/UDP works.", "Not understanding the difference between POSTROUTING and PREROUTING in nat.", "Ignoring asymmetric routing pitfalls in dual-homed setups."],
          debuggingExercises: ["Traffic is being dropped between two namespaces. Use `ip route` and `iptables -L -v -n` to find the rogue DROP rule.", "A TCP connection is stalling. Hunt down the MTU mismatch causing Path MTU Discovery blackholes."],
          productionMindset: "If you cannot explain exactly how a packet reaches your pod from the physical switch, you cannot debug production outages."
        },
        {
          day: 5,
          title: "DNS Deep Dive",
          topic: "CoreDNS & Upstream Resolution",
          objectives: ["Understand DNS resolution chain", "Debug CoreDNS configurations", "Master dig and nslookup", "Implement DNS sinkholing"],
          theory: "DNS is always the problem. On-premise setups often have complex split-horizon DNS, corporate forwarders, and internal active directory structures. Understanding how K8s CoreDNS interfaces with the node's systemd-resolved is paramount.",
          practicalTasks: [
            "Deploy a custom bind9/dnsmasq server and configure complex conditional forwarding rules.", 
            "Use dig +trace to observe authoritative resolution paths and TTL expirations.", 
            "Configure custom local domains without modifying /etc/hosts recursively.",
            "Analyze a raw CoreDNS Corefile from a local Kubernetes setup and customize the plugins.",
            "Configure `dnsmasq` as a direct caching layer strictly to reduce upstream DNS latency.",
            "Implement a DNS sinkhole mechanism for network-level ad-blocking or malicious endpoint filtering.",
            "Force an intentional DNS spoofing attack in an isolated lab and detect it via logs."
          ],
          commands: ["dig +trace +short", "nslookup -debug", "resolvectl status", "systemctl restart dnsmasq", "rndc reload"],
          deliverables: ["A highly available CoreDNS configuration file handling local and corporate domain stub domains.", "A hardened DNS config preventing rebinding attacks.", "A comprehensive benchmark showing latency reductions via caching."],
          expectedOutcome: "Can isolate DNS latency, identify caching issues, and configure robust forwarding.",
          commonMistakes: ["Setting K8s dnsPolicy incorrectly resulting in infinite loops.", "Relying on ndots:5 without understanding the DNS amplification it causes.", "Assuming NXDOMAIN means the server is dead (it means the record doesn't exist)."],
          debuggingExercises: ["A pod is taking exactly 5.0 seconds to resolve an external domain. Debug the IPv6 AAAA timeout sequence and fix the resolver config.", "DNS queries inside the cluster intermittently fail once every 5 seconds. Find the UDP packet burst drop limit in the kernel."],
          productionMindset: "DNS is not just mapping names to IPs; it is the fundamental routing and service discovery mechanism of the entire enterprise."
        },
        {
          day: 6,
          title: "Revision & Deep Troubleshooting Lab",
          topic: "System Foundation Review",
          objectives: ["Consolidate week 1 knowledge", "Perform end-to-end OS debugging", "Practice forensic analysis"],
          theory: "Theoretical knowledge fades quickly. Today is about tying together systemd, cgroups, LVM, networks, and DNS into a holistic mental model of a Linux Node.",
          practicalTasks: [
            "Receive a completely 'broken' VM image. It has network misconfigurations, a degraded LVM layout, and failing vital systemd units. Fix it to a 'green' state within 4 hours.",
            "Simulate a corrupted `/etc/fstab` and use a live USB ISO/rescue mode to chroot and fix it.",
            "Perform live memory forensics on a historic OOM event strictly using `dmesg` and syslog archives.",
            "Write a formal incident post-mortem utilizing the Blameless SRE template for the recovery exercise.",
            "Execute a 'Drift Audit' identifying all undocumented manual changes made to the recovery VM vs the baseline configuration.",
            "Restore broken GRUB configurations and rebuild the initramfs safely."
          ],
          commands: ["strace", "dmesg -T", "journalctl -k", "ip -c a", "chroot /sysroot", "dracut -f", "grub-mkconfig -o /boot/grub/grub.cfg"],
          deliverables: ["RCA (Root Cause Analysis) document detailing what was broken and how it was resolved.", "An automated bash recovery tool.", "A detailed timeline of forensic events during the simulated outage."],
          expectedOutcome: "Absolute confidence in dismantling, analyzing, and fixing any broken Linux state.",
          commonMistakes: ["Applying brute-force configuration changes instead of diagnosing root causes.", "Overwriting critical logical volumes during the rescue phase.", "Forgetting to reinstall the bootloader after kernel updates in rescue mode."],
          debuggingExercises: ["Fixing the broken VM under an artificial 4-hour time constraint.", "Deconstruct a stack trace from a kernel panic message stored in the logs."],
          productionMindset: "In a P1 outage, panic is the enemy. Systematic deduction utilizing native low-level tools saves platforms."
        },
        {
          day: 7,
          title: "Architecture & Mindset: Immutable Infrastructure",
          topic: "Shifting to API-Driven Infrastructure",
          objectives: ["Understand the paradigm shift from pet servers to immutable nodes", "Read Talos & Flatcar architecture docs", "Plan zero-downtime upgrades"],
          theory: "Traditional Linux requires constant patching, configuration management (Ansible/Puppet), and drift resolution. The modern Platform Engineer builds systems using Immutable OS patterns (Talos/Flatcar) where nodes are replaced, never patched.",
          practicalTasks: [
            "Design on paper a migration plan from legacy RHEL VMs to immutable Talos bare-metal machines.", 
            "Compare the operational lifecycle of a traditional VM versus an immutable worker node.",
            "Map out the exact lifecycle of a Talos Linux node from bare metal PXE boot to cluster join.",
            "Draft an A/B Node upgrade strategy showing how workloads drain to new immutable OS versions seamlessly.",
            "Present your drafted immutable infrastructure design architecture to a peer/mentor for critique.",
            "Compare Flatcar Container Linux Ignition configs versus Talos MachineConfig formats."
          ],
          commands: ["N/A - Architectural Day", "diagrams.net / draw.io", "RFC Drafting"],
          deliverables: ["An architectural design document explaining the benefits and trade-offs of immutable infra.", "A cluster node upgrade runbook.", "A comparative analysis matrix of Talos vs Standard Linux for security posture."],
          expectedOutcome: "Mental shift from 'Systems Administrator' to 'Platform Architect'.",
          commonMistakes: ["Attempting to force legacy agents (like old proprietary antivirus) onto immutable platforms.", "Treating immutable nodes like pets with ad-hoc configuration scripts.", "Failing to anticipate stateful workload disruptions during node replacements."],
          debuggingExercises: ["Identify architectural bottlenecks in PXE booting 100 immutable nodes simultaneously over a 1Gbe network link.", "Debate the forensic challenges of ephemeral nodes when investigating an intrusion."],
          productionMindset: "If you have to SSH into a node to fix it, your automation architecture has already failed."
        }
      ]
    },
    {
      week: 2,
      title: "On-Premise Virtualization & K8s Internals",
      miniProject: "Automate a Proxmox cluster deployment using Terraform, PXE boot Talos nodes into a functional control plane, and rip apart etcd.",
      incidentSimulation: "Hypervisor Split-Brain: Proxmox quorum is lost due to a simulated network partition. Recover the VMs without data corruption.",
      knowledgeReview: ["KVM/QEMU concepts", "Proxmox clustering & Corosync", "Immutable OS workflows", "PXE/iPXE boot processes", "etcd raft consensus"],
      architectureReview: "Design a physical network topology for an on-prem cluster separating Management, Storage, and VM traffic.",
      documentationAssignment: "Write a disaster recovery runbook for restoring a failed Proxmox hypervisor node.",
      days: [
        {
          day: 8,
          title: "Proxmox & KVM Fundamentals",
          topic: "Virtualization Layers",
          objectives: ["Understand Type-1 Hypervisors", "Master KVM/QEMU tooling", "Deploy Proxmox", "Automate VM provisioning"],
          theory: "For self-hosted platforms, VMware is often too expensive, and bare-metal is too rigid. Proxmox provides enterprise-grade KVM orchestration. You must understand how VMs are allocated CPU, Memory, and Virtual Disks via QEMU.",
          practicalTasks: [
            "Install Proxmox on a bare-metal server (or nested virtualization).", 
            "Create VMs via CLI (qm), configure VirtIO drivers, and manage memory ballooning.",
            "Set up a Proxmox API token and interact with the hypervisor strictly using `curl`.",
            "Configure a Linux Bridge and an OpenVSwitch on Proxmox for complex VM networking isolation.",
            "Create an automated VM template with Cloud-Init baked in for rapid cloning.",
            "Leverage the Proxmox firewall to implement micro-segmentation between two test VMs.",
            "Setup PCIE passthrough mapping a physical NIC directly into a virtual machine for bare-metal performance."
          ],
          commands: ["qm create", "qm set", "pvesh get /cluster/resources", "kvm --help", "qm clone", "curl -k -H 'Authorization: PVEAPIToken=USER@pve!TOKEN=UUID'"],
          deliverables: ["A fully functional Proxmox node with an automated script to spin up templated VMs.", "Comparison matrix of VirtIO vs IDE vs SCSI performance.", "Cloud-init configuration suite for standard base images."],
          expectedOutcome: "Demystified virtual machine operations and hypervisor level networking management.",
          commonMistakes: ["Overprovisioning CPU cores blindly causing hypervisor thrashing.", "Using non-VirtIO network adapters, tanking throughput.", "Misunderstanding CPU flags and breaking live migration compatibility."],
          debuggingExercises: ["A VM is locked and unresponsive. Identify the runaway QEMU process on the host, kill it safely, and unlock the VM image.", "A cloned VM has the exact same IP address as its parent. Fix the Cloud-Init machine-id generation."],
          productionMindset: "Hypervisors are not black boxes. They are just Linux machines managing cgroups, QEMU processes, and network bridges."
        },
        {
            day: 9,
            title: "Advanced Proxmox Clustering & HA",
            topic: "High Availability Infrastructure",
            objectives: ["Configure Corosync clusters", "Set up ZFS/Ceph on Proxmox", "Understand HA migrations", "Implement Quorum Devices"],
            theory: "A single hypervisor is a massive single point of failure (SPOF). Creating a cluster allows for live migrations and HA. This requires robust distributed storage (like ZFS replication or Ceph) and a solid quorum network.",
            practicalTasks: [
              "Link 3 isolated Proxmox nodes into an operational Corosync cluster.", 
              "Configure ZFS and establish automated asynchronous replication between nodes at 15-minute intervals.", 
              "Perform a seamless live migration of a running VM spanning the cluster.",
              "Simulate a generic split-brain scenario by manually downing cluster network links.",
              "Configure a lightweight Quorum Device (QDevice) for a strict two-node cluster to prevent failover deadlocks.",
              "Monitor replication lag and detect latency anomalies for the ZFS replication streams.",
              "Set up High Availability Resource groupings and fence operations."
            ],
            commands: ["pvecm create", "pvecm add", "zpool create", "qm migrate", "pvecm qdevice setup", "ha-manager status", "pvesr status"],
            deliverables: ["An HA Proxmox cluster capable of surviving a single node total failure automatically.", "A comprehensive Quorum strategy document.", "A validated failover demonstration video/log."],
            expectedOutcome: "Capable of building powerful underlying private clouds to host Kubernetes.",
            commonMistakes: ["Running Corosync on the primary public network, causing quorum loss under heavy traffic payload.", "Using consumer SSDs for ZFS/Ceph leading to immediate write endurance failure.", "Failing to test fencing (nodes isolating themselves properly)."],
            debuggingExercises: ["Simulate network latency on the Corosync interface until nodes begin fencing. Analyze the syslog to understand quorum loss timelines.", "A live migration freezes at 99%. Investigate the RAM delta change rate exceeding the network transfer speed."],
            productionMindset: "Storage latency is the silent killer of enterprise platforms. Always separate storage, management, and VM networks logically or physical."
        },
        {
            day: 10,
            title: "Operating Talos Linux API",
            topic: "Immutable K8s Runtime",
            objectives: ["Understand Talos architecture", "Generate MachineConfigs", "Deploy Talos via CLI", "Execute API-driven lifecycle management"],
            theory: "Talos is Linux designed exclusively for Kubernetes. It has no SSH, no console, and consists entirely of an API, the kernel, and the container runtime. It provides extreme security and consistency.",
            practicalTasks: [
              "Generate customized Talos machine configurations for 1 control plane and 2 worker nodes.", 
              "Apply the configurations globally via talosctl and bootstrap an initial cluster.", 
              "Use `talosctl` interactively to view the node's process list, mount points, and container metrics.",
              "Create a Talos machine config patch to dynamically inject custom kernel arguments.",
              "Upgrade a running Talos node to a newer OS version entirely via the API.",
              "Implement Talos RBAC roles restricting specific developers from rebooting the node.",
              "Extract the encrypted etcd data volume and utilize Talos's disaster recovery tooling."
            ],
            commands: ["talosctl gen config", "talosctl apply-config", "talosctl bootstrap", "talosctl dmesg", "talosctl process", "talosctl upgrade --image", "talosctl patch machineconfig"],
            deliverables: ["A functional K8s cluster running on immutable Talos VMs, completely managed via API.", "A library of JSON-patch Configuration files for node state.", "Documented upgrade procedures."],
            expectedOutcome: "Proficient utilizing API-driven operating systems replacing legacy SSH models.",
            commonMistakes: ["Losing the `talosconfig` file, permanently locking yourself out of the node.", "Modifying configurations unsafely by over-writing instead of using patch mechanisms.", "Misconfiguring the endpoints array blocking API access."],
            debuggingExercises: ["A Talos node is failing to join the cluster. Retrieve its logs using the API and identify the underlying cert/token mismatch.", "The kubelet on a node is crashlooping. Use talosctl to trace the specific kubelet flags causing the crash."],
            productionMindset: "Embrace the discomfort of no SSH. It forces you to rely on proper observability, structured logging, and declarative configuration."
        },
        {
          day: 11,
          title: "PXE Booting & Automated Provisioning",
          topic: "Bare-Metal Automation",
          objectives: ["Set up a PXE/TFTP server", "Configure iPXE", "Boot Talos from network", "Automate hardware profiles"],
          theory: "Installing OS via ISOs manually does not scale. In an enterprise, rack servers boot from the network (PXE), grab their image, configuration, and join the cluster autonomously (Zero-Touch Provisioning).",
          practicalTasks: [
            "Deploy an iPXE server with Matchbox or a custom Nginx+TFTP stack.", 
            "Configure highly controlled DNS/DHCP (dnsmasq) to point network boots to the iPXE bootfiles.", 
            "Boot a blank VM or physical node, having it automatically load the Talos kernel and initramfs over HTTP.",
            "Inspect the TFTP/HTTP payload delivery using Wireshark during a PXE boot sequence.",
            "Create deeply specific MAC-address configurations in Matchbox for varying hardware profiles.",
            "Automate the provisioning of a static IP directly via kernel boot parameters.",
            "Implement a secure boot chain verifying signed images before execution."
          ],
          commands: ["dnsmasq -d", "ipxe.lkrn", "tcpdump port 67 or port 68 or port 69", "wget -O"],
          deliverables: ["A complete Zero-Touch Provisioning pipeline for scaling out new compute nodes.", "A packet-level analysis of the DHCP/TFTP conversational flow.", "A scalable Matchbox declarative configuration repository."],
          expectedOutcome: "Ability to instantly scale clusters by merely racking hardware and turning it on.",
          commonMistakes: ["Misconfiguring firewall rules blocking TFTP (UDP 69) or DHCP broadcast requests.", "Serving massive images entirely over TFTP instead of chaining to HTTP via iPXE.", "DHCP scope overlaps causing IP conflicts during the PXE phase."],
          debuggingExercises: ["Monitor network traffic during boot to diagnose why a node is dropping the payload midway.", "A node re-initializes on every boot instead of booting locally after installation. Fix the boot order logic via the iPXE script."],
          productionMindset: "Infrastructure scale is limited by manual toil. Automation must begin before the operating system is even installed."
        },
        {
          day: 12,
          title: "Kubernetes Internals: etcd",
          topic: "The Brain of the Cluster",
          objectives: ["Understand Raft consensus", "Perform etcd backups/restores", "Tune etcd for IOPS", "Execute defragmentation"],
          theory: "Kubernetes is stateless everywhere except etcd. etcd is a strongly consistent, distributed key-value store. If etcd dies, the cluster dies. It is highly sensitive to disk IO latency.",
          practicalTasks: [
            "Take a programmatic backup of an etcd cluster directly from the pods.", 
            "Simulate total etcd quorum failure, wipe the data directories, and restore the cluster entirely from snapshot.", 
            "Run a targeted FIO benchmarking test specifically for fsync latency on etcd storage disks.",
            "Configure etcd with strict TLS client certificate authentication and validation.",
            "Perform a manual defragmentation of an etcd cluster after deleting thousands of stale K8s keys.",
            "Set up Prometheus alerts specifically for etcd's `wal_fsync_duration_seconds` passing 10ms.",
            "Query raw K8s objects directly from the etcd data store using `etcdctl`."
          ],
          commands: ["etcdctl snapshot save", "etcdctl snapshot restore", "etcdctl member list", "fio --name=etcd_test", "etcdctl defrag", "etcdctl get /registry/pods --prefix"],
          deliverables: ["An automated etcd backup and disaster recovery runbook utilizing S3 offsite.", "A comprehensive benchmark validating the underlying hardware for etcd deployments.", "A defragmentation schedule and automation script."],
          expectedOutcome: "Total confidence in managing K8s state and preventing catastrophic platform data loss.",
          commonMistakes: ["Running etcd on slow magnetic rust (HDDs) causing leader elections to fail continuously due to slow fsync times.", "Having an even number of etcd nodes (eliminating the quorum advantage).", "Failing to test the snapshot restore process in a realistic environment."],
          debuggingExercises: ["etcd logs show 'apply entries took too long'. Use FIO, iostat, and prometheus to unequivocally prove disk bottlenecks.", "An etcd node refuses to join the cluster. Debug the peer-URL TLS cert SAN mismatch."],
          productionMindset: "Protect etcd like it's a bank vault. Dedicated underlying NVMe disks, distinct networks for peer traffic, and maniacal backup schedules are non-negotiable."
        },
        {
          day: 13,
          title: "Control Plane: API Server & Scheduler",
          topic: "The Nervous System",
          objectives: ["Understand API flows", "Configure Admission Controllers", "Debug API latency", "Tune the Scheduler"],
          theory: "When you run `kubectl apply`, what happens? The API server authenticates, authorizes, persists to etcd, and notifies watchers. Controllers react, update state, and the Scheduler assigns nodes. The kubelet finally executes.",
          practicalTasks: [
            "Interact with the K8s API server raw via `curl` utilizing service account certificates.", 
            "Create a custom Pod binding manually bypassing the scheduler entirely.", 
            "Watch API events live via the WebSocket streaming endpoints.",
            "Enable Advanced Audit Logging on the kube-apiserver with sophisticated filtering rules and parse the output.",
            "Deploy a custom MutatingAdmissionWebhook to enforce an 'enterprise-billing' label on all created pods.",
            "Measure the exact latency of the scheduler when placing a burst of 1,000 zero-resource pods.",
            "Tune the `kube-controller-manager` resync period to reduce ambient CPU load on large clusters."
          ],
          commands: ["curl --cacert ca.crt ... /api/v1/pods", "kubectl get events --watch", "kubectl proxy", "kube-apiserver --audit-log-path=/var/log/audit.log", "kube-scheduler -v=5"],
          deliverables: ["A deeply detailed diagram tracing the complete lifecycle of a Deployment object from CLI execution to container running.", "A functional admission webhook.", "An Audit Log aggregation strategy."],
          expectedOutcome: "Demystified the 'magic' of Kubernetes control planes at a component level.",
          commonMistakes: ["Assuming the API server actually 'starts' containers (it doesn't, the kubelet does).", "Overloading the API server with heavy Custom Resource listing queries without pagination.", "Deploying webhooks that timeout or fail closed, breaking the entire cluster."],
          debuggingExercises: ["The scheduler has crashed. Notice how existing pods keep running perfectly, but new pods stay in 'Pending' forever.", "A mutating webhook is blocking pod creation with a 500 error. Check the TLS validity of the webhook server endpoint."],
          productionMindset: "Kubernetes is merely a collection of decoupled control loops reading from and writing to etcd asynchronously. It is not an interconnected monolith."
        },
        {
          day: 14,
          title: "Architecture & Review: On-Premise Resilience",
          topic: "Building Fail-Safe Systems",
          objectives: ["Review weeks 1 and 2", "Architect a fully resilient on-prem stack", "Calculate formal SLAs"],
          theory: "You now possess critical knowledge spans spanning OS, Virtualization, Networking, Immutable Infrastructure, and K8s Internals. Today is about assembling them into a coherent enterprise architecture.",
          practicalTasks: [
            "Draw a multi-rack, power-redundant topology.", 
            "Map and document exact failure domains: Node failure, Rack failure, Core Switch failure, split-brain scenarios.",
            "Draft a detailed topology map explicitly detailing power circuits (A/B), top-of-rack switches, and hypervisors.",
            "Write a decisive incident runbook for a total datacenter localized power loss and phased recovery.",
            "Calculate the exact mathematical SLA achievable with your designed on-premise components with respective MTBF metrics.",
            "Present a 'Tear-down' session where a peer actively attacks the architecture looking for SPOFs."
          ],
          commands: ["N/A - Capstone Review"],
          deliverables: ["A comprehensive High Availability Architecture Document for a mission-critical banking application detailing compute, storage, and networking.", "A presentation slide deck defending the architectural choices against cloud-native alternatives."],
          expectedOutcome: "Solidified transition from building clusters to designing platforms.",
          commonMistakes: ["Placing all 3 etcd nodes in the exact same physical rack or on the same power phase.", "Ignoring core switch redundancy by using a single flat network.", "Designing complex HA mechanisms that have never been tested and fail during real incidents."],
          debuggingExercises: ["Tabletop exercise: An entire rack loses power instantly. Verbally walk through how Corosync, Talos, etcd, and K8s controllers respond minute by minute.", "A fiber cut isolates 40% of the datacenter. Re-calculate the quorum survival capabilities of all underlying systems."],
          productionMindset: "Hope is not a strategy. Assume servers will burn, cables will be cut, and networks will partition. Architect accordingly."
        }
      ]
    }
  ]
};

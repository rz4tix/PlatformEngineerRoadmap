import { Roadmap } from "../types";
import { month1 } from "./month1";
import { month2 } from "./month2";
import { month3 } from "./month3";
import { month4 } from "./month4";
import { month5 } from "./month5";

export const curriculum: Roadmap = {
  title: "Enterprise Platform Engineering Bootcamp",
  description: "An intensive 5-month, real-world roadmap transforming mid-level DevOps into Senior Platform Engineers. Focuses on on-premise, GitOps, Kubernetes internals, and SRE operations.",
  months: [
    month1,
    month2,
    month3,
    month4,
    month5
  ]
};

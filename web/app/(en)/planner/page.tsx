import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "Skill Tree Planner",
  description:
    "Plan a Cultivation build across all 117 skill-tree nodes, checked against the points your realm actually grants.",
  alternates: {
    canonical: "/planner/",
    languages: { en: "/planner/", "zh-Hans": "/zh/planner/", "x-default": "/planner/" },
  },
};

export default function Planner() {
  return <ToolPage tool="planner" lang="en" slug="planner" />;
}

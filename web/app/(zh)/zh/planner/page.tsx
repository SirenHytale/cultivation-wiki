import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "天赋加点模拟",
  description: "在全部 117 个天赋节点上规划加点，并按你所在境界实际获得的点数校验。",
  alternates: {
    canonical: "/zh/planner/",
    languages: { en: "/planner/", "zh-Hans": "/zh/planner/", "x-default": "/planner/" },
  },
};

export default function PlannerZh() {
  return <ToolPage tool="planner" lang="zh" slug="planner" />;
}

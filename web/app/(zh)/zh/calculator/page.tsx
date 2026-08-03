import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "灵气计算器",
  description: "每一阶所需灵气与攀升所需时间，取自模组自身的曲线 —— 任意数值均可按你的服务器调整。",
  alternates: {
    canonical: "/zh/calculator/",
    languages: { en: "/calculator/", "zh-Hans": "/zh/calculator/", "x-default": "/calculator/" },
  },
};

export default function CalculatorZh() {
  return <ToolPage tool="calculator" lang="zh" slug="calculator" />;
}

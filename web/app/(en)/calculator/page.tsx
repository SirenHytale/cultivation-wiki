import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "Qi & Breakthrough Calculator",
  description:
    "Every rung's Qi cost and how long the climb actually takes, from the mod's own curve — retune any value to match your server.",
  alternates: {
    canonical: "/calculator/",
    languages: { en: "/calculator/", "zh-Hans": "/zh/calculator/", "x-default": "/calculator/" },
  },
};

export default function Calculator() {
  return <ToolPage tool="calculator" lang="en" slug="calculator" />;
}

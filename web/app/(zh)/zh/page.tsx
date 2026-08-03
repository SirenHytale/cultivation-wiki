import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { docMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return docMetadata("zh", "");
}

export default function ChineseHome() {
  return <HomePage lang="zh" />;
}

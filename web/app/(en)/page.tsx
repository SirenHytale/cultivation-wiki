import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { docMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return docMetadata("en", "");
}

export default function Home() {
  return <HomePage lang="en" />;
}

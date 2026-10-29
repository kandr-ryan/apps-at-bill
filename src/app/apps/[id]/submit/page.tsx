import { mockApps } from "@/lib/mock-data";
import SubmitClient from "./client";

export function generateStaticParams() {
  return mockApps.map((app) => ({ id: app.id }));
}

export default async function SubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubmitClient id={id} />;
}

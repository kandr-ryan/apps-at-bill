import { mockApps } from "@/lib/mock-data";
import AppDetailClient from "./client";

export function generateStaticParams() {
  return mockApps.map((app) => ({ id: app.id }));
}

export default async function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppDetailClient id={id} />;
}

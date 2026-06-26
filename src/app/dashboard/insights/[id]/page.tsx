import { InsightDetailView } from "@/features/dashboard/components/InsightDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InsightDetailPage({ params }: Props) {
  const { id } = await params;
  return <InsightDetailView id={id} />;
}

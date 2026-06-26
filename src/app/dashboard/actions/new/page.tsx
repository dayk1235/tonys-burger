import { ActionCenterView } from "@/features/dashboard/components/ActionCenterView";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function ActionCenterPage({ searchParams }: Props) {
  const { id } = await searchParams;
  return <ActionCenterView insightId={id ?? null} />;
}

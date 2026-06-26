import { ExperimentLifecycleView } from "@/features/dashboard/components/ExperimentLifecycleView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExperimentLifecyclePage({ params }: Props) {
  const { id } = await params;
  return <ExperimentLifecycleView experimentId={id} />;
}

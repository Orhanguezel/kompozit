import { notFound } from "next/navigation";
import { SocialPlanner, type SocialPage } from "../../marketing-sections";
const platforms = new Set<SocialPage>(["facebook", "instagram", "linkedin", "x"]);
export default async function Page({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!platforms.has(platform as SocialPage)) notFound();
  return <SocialPlanner platform={platform as SocialPage} />;
}

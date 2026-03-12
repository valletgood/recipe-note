import Link from "next/link";
import { NAV } from "@/constants/ui";

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  return (
    <div className="relative z-10 min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-[var(--point)] hover:text-[var(--point-light)]"
        >
          ← {NAV.BACK_TO_LIST}
        </Link>
        <p className="mt-4 font-display text-lg text-[var(--foreground)]">
          레시피 상세 페이지 (id: {id}) — 추후 구현
        </p>
      </div>
    </div>
  );
}

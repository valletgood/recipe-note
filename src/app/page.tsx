import Link from "next/link";
import RecipeListView from "@/components/recipe/RecipeListView";
import { getAllRecipes } from "@/db/queries/recipe";
import { MAIN_PAGE } from "@/constants/ui";

export default async function MainPage() {
  const recipes = await getAllRecipes();

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--glass-border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              {MAIN_PAGE.TITLE}
            </h1>
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--point)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <PlusIcon className="h-4 w-4" />
              {MAIN_PAGE.ADD_RECIPE}
            </Link>
          </div>
        </div>
      </header>

      <RecipeListView recipes={recipes} />
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

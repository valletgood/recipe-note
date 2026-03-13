import { notFound } from "next/navigation";
import { getRecipeById } from "@/db/queries/recipe";
import RecipeEditForm from "@/components/recipe/RecipeEditForm";

interface RecipeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="relative z-10 min-h-screen">
      <RecipeEditForm recipe={recipe} />
    </div>
  );
}

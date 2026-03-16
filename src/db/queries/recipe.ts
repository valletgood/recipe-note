import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import type { Recipe } from "@/types/recipe";
import type { RecipeCategoryValue } from "@/constants/recipe-categories";
import type { RecipeSourceType } from "@/types/recipe";

function rowToRecipe(row: (typeof recipes.$inferSelect)): Recipe {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    imageUrl: row.imageUrl,
    category: row.category as RecipeCategoryValue,
    ingredients: row.ingredients,
    cookingSteps: row.cookingSteps,
    nutritionInfo: row.nutrition ?? undefined,
    sourceType: (row.sourceType as RecipeSourceType) ?? undefined,
    sourceUrl: row.sourceUrl ?? undefined,
    servingCount: row.servingCount,
    cookTimeMinutes: row.cookTimeMinutes,
    difficulty: row.difficulty as "easy" | "medium" | "hard",
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const rows = await db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.createdAt));

  return rows.map(rowToRecipe);
}

export async function getRecipesByUserUuid(userUuid: string): Promise<Recipe[]> {
  const rows = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userUuid, userUuid))
    .orderBy(desc(recipes.createdAt));

  return rows.map(rowToRecipe);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const [row] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id));

  if (!row) return null;
  return rowToRecipe(row);
}

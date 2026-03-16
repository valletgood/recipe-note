import { eq } from "drizzle-orm";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { successResponse, errorResponse, ErrorCode } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning({ id: recipes.id });

    if (!deleted) {
      return errorResponse(ErrorCode.NOT_FOUND, "레시피를 찾을 수 없습니다.");
    }

    return successResponse("레시피가 삭제되었습니다.", { id: deleted.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      description,
      category,
      difficulty,
      cookTimeMinutes,
      servingCount,
      ingredients,
      cookingSteps,
      nutrition,
      sourceType,
      sourceUrl,
    } = body;

    if (!title || typeof title !== "string") {
      return errorResponse(ErrorCode.BAD_REQUEST, "레시피 이름은 필수입니다.");
    }

    if (!category || typeof category !== "string") {
      return errorResponse(ErrorCode.BAD_REQUEST, "카테고리는 필수입니다.");
    }

    if (!difficulty || typeof difficulty !== "string") {
      return errorResponse(ErrorCode.BAD_REQUEST, "난이도는 필수입니다.");
    }

    if (typeof cookTimeMinutes !== "number") {
      return errorResponse(ErrorCode.BAD_REQUEST, "조리 시간은 필수입니다.");
    }

    if (typeof servingCount !== "number") {
      return errorResponse(ErrorCode.BAD_REQUEST, "인분 수는 필수입니다.");
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        "재료를 1개 이상 입력해주세요."
      );
    }

    if (!Array.isArray(cookingSteps) || cookingSteps.length === 0) {
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        "조리 단계를 1개 이상 입력해주세요."
      );
    }

    const [updated] = await db
      .update(recipes)
      .set({
        title: title.trim(),
        description: description?.trim() || null,
        category,
        difficulty,
        cookTimeMinutes,
        servingCount,
        ingredients,
        cookingSteps,
        nutrition: nutrition || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning();

    if (!updated) {
      return errorResponse(ErrorCode.NOT_FOUND, "레시피를 찾을 수 없습니다.");
    }

    return successResponse("레시피가 수정되었습니다.", { id: updated.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

import { db } from '@/db';
import { recipes } from '@/db/schema';
import { successResponse, errorResponse, ErrorCode } from '@/lib/api-response';
import { verifySessionToken } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    let userUuid: string | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const session = await verifySessionToken(token);
        userUuid = session.uuid;
      } catch {
        // 토큰이 유효하지 않아도 레시피 저장은 허용
      }
    }

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
      images,
    } = body;

    if (!title || typeof title !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '레시피 이름은 필수입니다.');
    }

    if (!category || typeof category !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '카테고리는 필수입니다.');
    }

    if (!difficulty || typeof difficulty !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '난이도는 필수입니다.');
    }

    if (!cookTimeMinutes || typeof cookTimeMinutes !== 'number') {
      return errorResponse(ErrorCode.BAD_REQUEST, '조리 시간은 필수입니다.');
    }

    if (!servingCount || typeof servingCount !== 'number') {
      return errorResponse(ErrorCode.BAD_REQUEST, '인분 수는 필수입니다.');
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        '재료를 1개 이상 입력해주세요.',
      );
    }

    if (!Array.isArray(cookingSteps) || cookingSteps.length === 0) {
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        '조리 단계를 1개 이상 입력해주세요.',
      );
    }

    const [inserted] = await db
      .insert(recipes)
      .values({
        userUuid,
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
        images: Array.isArray(images) ? images : null,
      })
      .returning();

    return successResponse('레시피가 저장되었습니다.', { id: inserted.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

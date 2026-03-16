import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { successResponse, errorResponse, ErrorCode } from '@/lib/api-response';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '이메일을 입력해주세요.');
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return errorResponse(ErrorCode.CONFLICT, '이미 사용 중인 이메일이에요.');
    }

    return successResponse('사용 가능한 이메일이에요.');
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

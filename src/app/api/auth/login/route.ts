import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { verifyPasswordToken } from '@/lib/jwt';
import { createSessionToken } from '@/lib/session';
import { successResponse, errorResponse, ErrorCode } from '@/lib/api-response';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, passwordToken } = body;

    if (!email || typeof email !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '이메일을 입력해주세요.');
    }

    if (!passwordToken || typeof passwordToken !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '비밀번호를 입력해주세요.');
    }

    // 토큰에서 비밀번호 추출
    let password: string;
    try {
      password = verifyPasswordToken(passwordToken);
    } catch {
      return errorResponse(ErrorCode.BAD_REQUEST, '유효하지 않은 요청입니다.');
    }

    // 사용자 조회
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      return errorResponse(ErrorCode.UNAUTHORIZED, '이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return errorResponse(ErrorCode.UNAUTHORIZED, '이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const loginAt = new Date().toISOString();
    const token = await createSessionToken({ uuid: user.uuid, email: user.email, name: user.name });

    return successResponse('로그인에 성공했습니다.', {
      email: user.email,
      name: user.name,
      loginAt,
      token,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

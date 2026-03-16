import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { verifyPasswordToken } from '@/lib/jwt';
import { successResponse, errorResponse, ErrorCode } from '@/lib/api-response';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, passwordToken } = body;

    if (!email || typeof email !== 'string') {
      return errorResponse(ErrorCode.BAD_REQUEST, '이메일을 입력해주세요.');
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return errorResponse(ErrorCode.BAD_REQUEST, '이름을 입력해주세요.');
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

    const normalizedEmail = email.toLowerCase().trim();

    // 이메일 중복 확인
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      return errorResponse(ErrorCode.CONFLICT, '이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 bcrypt 해싱 (salt rounds: 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    const [inserted] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        name: name.trim(),
        password: hashedPassword,
      })
      .returning({ uuid: users.uuid, email: users.email, name: users.name });

    return successResponse('회원가입이 완료되었습니다.', {
      uuid: inserted.uuid,
      email: inserted.email,
      name: inserted.name,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

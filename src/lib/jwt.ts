/** 비밀번호 전송용 토큰 생성 (클라이언트 → 서버)
 *  btoa/atob 기반으로 구현하여 secure context 제약 없이 동작합니다.
 */
export function signPasswordToken(password: string): string {
  const payload = {
    password,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120, // 2분 유효
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

/** 토큰에서 비밀번호 추출 및 만료 검증 (서버 전용) */
export function verifyPasswordToken(token: string): string {
  let payload: { password?: unknown; exp?: number };
  try {
    payload = JSON.parse(decodeURIComponent(escape(Buffer.from(token, 'base64').toString('utf8'))));
  } catch {
    throw new Error('유효하지 않은 토큰입니다.');
  }

  if (typeof payload.password !== 'string') {
    throw new Error('유효하지 않은 토큰입니다.');
  }

  if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('만료된 요청입니다. 다시 시도해주세요.');
  }

  return payload.password;
}

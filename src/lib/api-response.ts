import { NextResponse } from "next/server";

export const ErrorCode = {
  SUCCESS: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

interface ApiResponse<T = undefined> {
  error: number;
  message: string;
  data?: T;
}

export function successResponse<T>(message: string, data?: T) {
  const body: ApiResponse<T> = { error: ErrorCode.SUCCESS, message };
  if (data !== undefined) {
    body.data = data;
  }
  return NextResponse.json(body, { status: 200 });
}

export function errorResponse(code: ErrorCodeValue, message: string) {
  const status = code === ErrorCode.SUCCESS ? 200 : code;
  return NextResponse.json(
    { error: code, message } satisfies ApiResponse,
    { status }
  );
}

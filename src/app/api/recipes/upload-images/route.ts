import { supabaseServer } from '@/lib/supabase-server';
import { STORAGE_BUCKET_RECIPE_IMAGES } from '@/lib/supabase';
import { successResponse, errorResponse, ErrorCode } from '@/lib/api-response';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per file
const MAX_IMAGES = 10;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');

    if (!files.length) {
      return errorResponse(ErrorCode.BAD_REQUEST, '이미지 파일이 필요합니다.');
    }

    if (files.length > MAX_IMAGES) {
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        `이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`,
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return errorResponse(ErrorCode.BAD_REQUEST, '올바르지 않은 파일 형식입니다.');
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return errorResponse(ErrorCode.BAD_REQUEST, 'JPG, PNG, WebP, GIF 형식만 지원합니다.');
      }
      if (file.size > MAX_SIZE_BYTES) {
        return errorResponse(ErrorCode.BAD_REQUEST, '이미지 크기는 각 10MB 이하여야 합니다.');
      }

      const ext = file.type.split('/')[1] ?? 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error } = await supabaseServer.storage
        .from(STORAGE_BUCKET_RECIPE_IMAGES)
        .upload(path, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, `이미지 업로드 실패: ${error.message}`);
      }

      const { data } = supabaseServer.storage
        .from(STORAGE_BUCKET_RECIPE_IMAGES)
        .getPublicUrl(path);

      urls.push(data.publicUrl);
    }

    return successResponse('이미지가 업로드되었습니다.', { urls });
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

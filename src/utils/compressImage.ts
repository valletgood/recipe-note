/**
 * 브라우저에서 이미지 파일을 리사이즈·압축하여 서버리스 페이로드 한도 내로 유지합니다.
 * (예: Vercel 4.5MB 제한 대응)
 */

const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_QUALITY = 0.82;

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  /** 목표 최대 파일 크기(바이트). 초과 시 quality를 낮춤. */
  maxSizeBytes?: number;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      quality,
    );
  });
}

/**
 * 단일 이미지 파일을 압축한 새 File로 반환합니다.
 * 브라우저 전용 (createElement('canvas') 사용).
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const {
    maxWidth = DEFAULT_MAX_WIDTH,
    maxHeight = maxWidth,
    quality = DEFAULT_QUALITY,
    maxSizeBytes,
  } = options;

  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);
      const { width: w, height: h } = img;
      let width = w;
      let height = h;
      if (w > maxWidth || h > maxHeight) {
        const r = Math.min(maxWidth / w, maxHeight / h);
        width = Math.round(w * r);
        height = Math.round(h * r);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const tryExport = async (q: number): Promise<File | null> => {
        const blob = await canvasToBlob(canvas, q);
        const f = new File([blob], file.name.replace(/\.[a-z]+$/i, ".jpg"), {
          type: "image/jpeg",
        });
        if (maxSizeBytes && f.size > maxSizeBytes) return null;
        return f;
      };

      try {
        let result: File | null = await tryExport(quality);
        if (!result && maxSizeBytes) {
          // float drift 방지를 위해 정수 스텝 사용 (82 → 70 → 60 → ... → 30)
          for (let qi = Math.round(quality * 10) - 1; qi >= 3; qi--) {
            result = await tryExport(qi / 10);
            if (result) break;
          }
        }
        // 압축 후에도 한도 초과 시 maxWidth를 절반으로 줄여 재시도
        if (!result && maxSizeBytes) {
          const halfCanvas = document.createElement("canvas");
          halfCanvas.width = Math.round(width / 2);
          halfCanvas.height = Math.round(height / 2);
          const halfCtx = halfCanvas.getContext("2d");
          if (halfCtx) {
            halfCtx.drawImage(img, 0, 0, halfCanvas.width, halfCanvas.height);
            const blob = await new Promise<Blob>((res, rej) =>
              halfCanvas.toBlob((b) => (b ? res(b) : rej()), "image/jpeg", 0.7),
            );
            result = new File([blob], file.name.replace(/\.[a-z]+$/i, ".jpg"), {
              type: "image/jpeg",
            });
          }
        }
        resolve(result ?? file);
      } catch {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러올 수 없습니다."));
    };
    img.src = url;
  });
}

/**
 * 여러 이미지 파일을 압축합니다. 서버리스 페이로드 한도(예: 4MB)를 넘지 않도록
 * 개별 파일 크기를 제한합니다. 브라우저 외부에서는 압축 없이 원본을 반환합니다.
 */
export async function compressImageFiles(
  files: File[],
  options: CompressImageOptions & { maxTotalBytes?: number } = {},
): Promise<File[]> {
  if (typeof document === "undefined") return files;
  const { maxTotalBytes = 4 * 1024 * 1024, ...rest } = options;
  const perFile = Math.floor(maxTotalBytes / files.length);
  return Promise.all(
    files.map((file) =>
      compressImageFile(file, { ...rest, maxSizeBytes: perFile }),
    ),
  );
}

/** In-browser photo preparation: phone photos are often 4000px+ and 5–12 MB; the shop needs ≤1600px. */

export const MAX_EDGE = 1600
export const QUALITY = 0.85

export class ImageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImageError'
  }
}

const isHeic = (file: File) => /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

/**
 * Decode, downscale to MAX_EDGE on the long side (never upscale) and re-encode as WebP.
 * Browsers that can't encode WebP (older Safari returns PNG) fall back to JPEG at the same quality.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (file.type && !file.type.startsWith('image/')) {
    throw new ImageError('That file isn’t a photo. Choose a JPG, PNG, WebP or HEIC image.')
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new ImageError(
      isHeic(file)
        ? 'This browser can’t open HEIC photos. On iPhone, upload from Safari, or set Camera › Formats to “Most Compatible” and try again.'
        : 'This photo couldn’t be opened. Try a JPG, PNG or WebP image.',
    )
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new ImageError('This browser couldn’t process the photo. Try another browser.')
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  let blob = await toBlob(canvas, 'image/webp', QUALITY)
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', QUALITY)
  if (!blob) throw new ImageError('The photo couldn’t be saved. Try again, or use a smaller image.')
  return blob
}

export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`

import { useEffect } from 'react'
import { useImageSrc } from './useImageSrc'

// Keep the Image objects alive so their decoded bitmaps stay warm in the cache
const warmed = new Map<string, HTMLImageElement>()

/**
 * Download and decode an image ahead of time, e.g. a hover-reveal close-up.
 * Hidden images (opacity 0, clipped) are otherwise fetched lazily, so the
 * reveal would play over nothing for a beat on first hover.
 */
export function usePreloadImage(ref: string | undefined) {
  const url = useImageSrc(ref)
  useEffect(() => {
    if (!url || warmed.has(url)) return
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    img.decode().catch(() => {})
    warmed.set(url, img)
  }, [url])
}

import type { ImgHTMLAttributes } from 'react'
import { useImageSrc } from './useImageSrc'

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

/** <img> for catalog image refs (static paths or uploaded idb: photos). Keeps its box while loading. */
export function ProductImage({ src, alt = '', ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src: string | undefined }) {
  const url = useImageSrc(src)
  return <img {...props} alt={alt} src={url ?? BLANK} />
}

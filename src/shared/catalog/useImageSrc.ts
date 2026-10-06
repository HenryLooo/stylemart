import { useEffect, useState } from 'react'
import { isIdbRef } from './imageStore'
import { catalogRepo } from './store'

// One object URL per uploaded image for the life of the page
const urls = new Map<string, Promise<string | undefined>>()

function resolve(ref: string) {
  let url = urls.get(ref)
  if (!url) {
    url = catalogRepo.getImage(ref).then((blob) => (blob ? URL.createObjectURL(blob) : undefined))
    urls.set(ref, url)
  }
  return url
}

/**
 * Turn an image ref into something <img src> can use: static paths pass straight through,
 * uploaded photos (idb:…) load from IndexedDB. Returns undefined while loading.
 */
export function useImageSrc(ref: string | undefined): string | undefined {
  const [loaded, setLoaded] = useState<{ ref: string; url: string | undefined } | null>(null)

  useEffect(() => {
    if (!isIdbRef(ref)) return
    let live = true
    resolve(ref).then((url) => live && setLoaded({ ref, url }))
    return () => {
      live = false
    }
  }, [ref])

  if (!isIdbRef(ref)) return ref
  return loaded?.ref === ref ? loaded.url : undefined
}

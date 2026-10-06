/** Uploaded product photos. Refs look like `idb:<uuid>`; static site photos are plain paths. */
export interface ImageStore {
  put(blob: Blob): Promise<string>
  get(ref: string): Promise<Blob | undefined>
  delete(ref: string): Promise<void>
  /** Every stored ref, for sweeping abandoned uploads */
  keys(): Promise<string[]>
}

export const IDB_PREFIX = 'idb:'
export const isIdbRef = (ref: string | undefined): ref is string => !!ref && ref.startsWith(IDB_PREFIX)

const newRef = () => `${IDB_PREFIX}${crypto.randomUUID()}`

interface StoredImage {
  type: string
  data: ArrayBuffer
}

const DB_NAME = 'stylemart-catalog'
const STORE = 'images'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(db: IDBDatabase, mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = run(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error)
  })
}

/** Browser IndexedDB store: room for real photos, unlike localStorage's ~5 MB. */
export function createIdbImageStore(): ImageStore {
  let db: Promise<IDBDatabase> | null = null
  const conn = () => (db ??= openDb())
  return {
    // Stored as bytes + type rather than a Blob: Blob structured-cloning isn't reliable everywhere
    async put(blob) {
      const ref = newRef()
      const record: StoredImage = { type: blob.type, data: await blob.arrayBuffer() }
      await tx(await conn(), 'readwrite', (s) => s.put(record, ref))
      return ref
    },
    async get(ref) {
      const record = await tx<StoredImage | undefined>(await conn(), 'readonly', (s) => s.get(ref))
      return record ? new Blob([record.data], { type: record.type }) : undefined
    },
    async delete(ref) {
      await tx(await conn(), 'readwrite', (s) => s.delete(ref))
    },
    async keys() {
      return (await tx<IDBValidKey[]>(await conn(), 'readonly', (s) => s.getAllKeys())).map(String)
    },
  }
}

/** In-memory store for tests and environments without IndexedDB. */
export function createMemoryImageStore(): ImageStore {
  const blobs = new Map<string, Blob>()
  return {
    async put(blob) {
      const ref = newRef()
      blobs.set(ref, blob)
      return ref
    },
    async get(ref) {
      return blobs.get(ref)
    },
    async delete(ref) {
      blobs.delete(ref)
    },
    async keys() {
      return [...blobs.keys()]
    },
  }
}

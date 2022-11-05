const url = new URL('../worker/index.ts', import.meta.url)

export const worker = new Worker(url, { type: 'module' })

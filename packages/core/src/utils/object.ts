/**
 * Creates an object map with the same keys as `map` and values generated by
 * running each value of `record` thru `fn`.
 */
export function mapValue<T, V>(
  record: Record<string, T>,
  fn: (value: T, key: string) => V | typeof mapValue.SKIP
): Record<string, V> {
  const result = Object.create(null)

  for (const key of Object.keys(record)) {
    const value = fn(record[key], key)
    if (value === SKIP) continue
    result[key] = value
  }
  return result
}

const SKIP = Symbol.for("mapValue.skip")
mapValue.SKIP = SKIP

// https://github.com/graphql/graphql-js/blob/main/src/jsutils/toObjMap.ts
export function toObjMap<T>(
  obj: Maybe<ReadOnlyObjMapLike<T>>
): ReadOnlyObjMap<T> {
  if (obj == null) {
    return Object.create(null)
  }

  if (Object.getPrototypeOf(obj) === null) {
    return obj
  }

  const map = Object.create(null)
  for (const [key, value] of Object.entries(obj)) {
    map[key] = value
  }
  return map
}

export function notNullish<T>(x: T | undefined | null): x is T {
  return x != null
}

export function deepMerge<T extends Record<string, any>>(
  ...objects: (T | null | undefined)[]
): T {
  const result = {} as any

  for (const obj of objects) {
    if (obj == null) continue
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && typeof value === "object") {
        if (Array.isArray(value)) {
          if (!Array.isArray(result[key])) {
            result[key] = []
          }
          result[key] = [...result[key], ...value]
        } else {
          result[key] = deepMerge(result[key] as any, value)
        }
      } else {
        result[key] = value
      }
    }
  }

  return result
}

type Maybe<T> = null | undefined | T

type ReadOnlyObjMapLike<T> = ReadOnlyObjMap<T> | { readonly [key: string]: T }

interface ReadOnlyObjMap<T> {
  readonly [key: string]: T
}

import { CID, Version } from "multiformats/cid"
import { decode as decodeMultihash } from "multiformats/hashes/digest"

export { CID }


/**
 * CID representing an empty string. We use this to speed up DNS propagation
 * However, we treat that as a null value in the code
 */
export const EMPTY_CID = "Qmc5m94Gu7z62RC8waSKkZUrCCBJPyHbkpmGzEePxy2oXJ"

/**
 * Decode a possibly string-encoded CID.
 * Passing an already decoded CID instance works too.
 * @throws Throws an error if a CID cannot be decoded!
 */
export function decodeCID(val: CID | object | string): CID {
  const cid = CID.asCID(val)
  if (cid) return cid

  // String format
  if (typeof val === "string") return CID.parse(val)

  // CID.toJSON() returns an object in the form of { version, code, hash }
  // `hash` was `multihash` previously.
  if (typeof val === "object" && "version" in val && "code" in val && "multihash" in val) {
    return CID.create(val.version, val.code, val.multihash)
  }

  // Older version of the above
  if (
    typeof val === "object" &&
    hasProp(val, "version") &&
    hasProp(val, "code") && isNum(val.code) &&
    hasProp(val, "hash") && isObject(val.hash) && Object.values(val.hash).every(isNum)
  ) {
    const multihash = decodeMultihash(new Uint8Array(
      Object.values(val.hash) as number[]
    ))

    return CID.create(val.version as Version, val.code, multihash)
  }

  // Sometimes we can encounter a DAG-JSON encoded CID
  // https://github.com/oddsdk/ts-odd/issues/459
  // Related to the `ensureSkeletonStringCIDs` function in the `PrivateTree` class
  if (
    typeof val === "object" &&
    hasProp(val, "/") &&
    typeof val[ "/" ] === "string"
  ) {
    return CID.parse(val[ "/" ])
  }

  // Unrecognisable CID
  throw new Error(`Could not decode CID: ${JSON.stringify(val)}`)
}

/**
 * Encode a CID as a string.
 */
export function encodeCID(cid: CID | string): string {
  return typeof cid === "string" ? cid : cid.toString()
}

export function hasProp<K extends PropertyKey>(data: unknown, prop: K): data is Record<K, unknown> {
    return typeof data === "object" && data != null && prop in data
  }
  
  export const isDefined = <T>(val: T | undefined): val is T => {
    return val !== undefined
  }
  
  export const notNull = <T>(val: T | null): val is T => {
    return val !== null
  }
  
  export const isJust = notNull
  
  export const isValue = <T>(val: T | undefined | null): val is T => {
    return isDefined(val) && notNull(val)
  }
  
  export const isBool = (val: unknown): val is boolean => {
    return typeof val === "boolean"
  }
  
  export function isCryptoKey(val: unknown): val is CryptoKey {
    return hasProp(val, "algorithm") && hasProp(val, "extractable") && hasProp(val, "type")
  }
  
  export const isNum = (val: unknown): val is number => {
    return typeof val === "number"
  }
  
  export const isString = (val: unknown): val is string => {
    return typeof val === "string"
  }
  
  export const isObject = <T>(val: unknown): val is Record<string, T> => {
    return val !== null && typeof val === "object"
  }
  
  export const isBlob = (val: unknown): val is Blob => {
    if (typeof Blob === "undefined") return false
    return val instanceof Blob || (isObject(val) && val?.constructor?.name === "Blob")
  }
  
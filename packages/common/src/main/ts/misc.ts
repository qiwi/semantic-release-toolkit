import { Extends, ICallable } from '@qiwi/substrate'
import util from 'util'

export const isPromiseLike = (value: any): boolean =>
  typeof (value as any)?.then === 'function'

export const effect = <
  V extends any,
  C extends ICallable,
  R1 = Promise<ReturnType<C>>,
  R2 = ReturnType<C>
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> =>
  isPromiseLike(value) ? (value as any)?.then(cb) : cb(value)

export const extractValue = (value: any): any => {
  if (!isPromiseLike(value)) {
    return value
  }
  // Promise { 'foo' }"
  return util.inspect(value).slice(11, -3)
}

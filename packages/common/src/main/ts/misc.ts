import { Extends, ICallable } from '@qiwi/substrate'

export const effect = <
  V extends any,
  C extends ICallable,
  R1 = Promise<ReturnType<C>>,
  R2 = ReturnType<C>
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> => {
  if (typeof (value as any)?.then === 'function') {
    return (value as any)?.then(cb)
  }

  return cb(value)
}

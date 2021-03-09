import { Extends } from '@qiwi/substrate'

export interface ISyncSensitive {
  sync?: boolean
}

export type TSyncDirective = boolean | undefined | ISyncSensitive

export type ParseSync<T> = Extends<
  T,
  boolean | undefined,
  T,
  T extends ISyncSensitive ? T['sync'] : never
>

export type SyncGuard<V, S extends TSyncDirective> = Extends<
  S,
  { sync: true } | true,
  Extends<V, Promise<any>, never, V>,
  Extends<V, Promise<any>, V, Promise<V>>
>

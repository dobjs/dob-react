import { injectFactory, inject } from 'dependency-inject';

import { ArticleAction } from './article/action'
import { ArticleStore } from './article/store'

export const stores = injectFactory({
  ArticleAction,
  ArticleStore
})

type IPartial<T> = {
  [P in keyof T]?: T[P]
}

export type IStores = IPartial<typeof stores>
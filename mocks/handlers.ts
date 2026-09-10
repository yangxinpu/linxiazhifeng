import { quoteHandlers } from './handlers/quote.handler'
import { articleHandlers } from './handlers/article.handler'
import { profileHandlers } from './handlers/profile.handler'
import { searchHandlers } from './handlers/search.handler'
import { speakingHandlers } from './handlers/speaking.handler'

export const handlers = [
  ...quoteHandlers,
  ...articleHandlers,
  ...profileHandlers,
  ...searchHandlers,
  ...speakingHandlers,
]

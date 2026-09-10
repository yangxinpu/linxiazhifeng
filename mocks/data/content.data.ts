import { createMockArticleList } from '@mocks/fakers/article.faker'
import { createMockQuoteList } from '@mocks/fakers/quote.faker'

/** 在各内容 Handler 间共享数据，确保列表、搜索与详情结果一致。 */
export const mockArticles = createMockArticleList(12)
export const mockQuotes = createMockQuoteList(50)

import {
  ArrowRightOutlined,
  BookOutlined, 
  MessageOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { Article, Quote } from '@/api'
import { formatDate } from '@/utils'
import LeafSphere from './components/leaf-sphere'
import { useHomeContent } from './hooks/use-home-content'
import styles from './index.module.scss'

const ARTICLE_CATEGORY_LABELS: Record<Article['category'], string> = {
  technology: '科技',
  philosophy: '哲学',
  literature: '文学',
  science: '科学',
  life: '生活',
  wisdom: '智慧',
  art: '艺术',
  history: '历史',
}

const FALLBACK_QUOTE = {
  content: '未经审视的人生不值得过',
  author: '苏格拉底',
  source: '申辩篇',
}

const FALLBACK_QUOTES = [
  {
    content: '知人者智，自知者明',
    author: '老子',
    source: '道德经',
  },
  {
    content: '人生如逆旅，我亦是行人',
    author: '苏轼',
    source: '临江仙',
  },
  {
    content: '想象力比知识更重要',
    author: '爱因斯坦',
    source: '论科学',
  },
]

interface QuotePreview {
  id?: Quote['id']
  content: string
  author: string
  source: string
}

function getQuotePath(quote: QuotePreview): string {
  return quote.id ? `/quote/${quote.id}` : '/quotes'
}

export default function Home() {
  const { articles, quotes, isLoading, error } = useHomeContent()
  const featuredQuote: QuotePreview = quotes[0] ?? FALLBACK_QUOTE
  const quotePreviews: QuotePreview[] = quotes.length > 1
    ? quotes.slice(1, 4)
    : FALLBACK_QUOTES

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroInner}>
          <div className={styles.heroVisual}>
            <LeafSphere />
          </div>

          <div className={styles.heroContent}>
            <h1 id="home-title" className={styles.title}>
              <span className={styles.titlePrimary}>林下</span>
              <span>之风</span>
            </h1>

            <p className={styles.intro}>
              在经典文字与当代思考之间，留一处可以慢下来阅读、理解和沉淀的地方
            </p>

            <Link
              to={getQuotePath(featuredQuote)}
              className={styles.heroQuote}
              aria-label={`阅读${featuredQuote.author}的名言详情`}
            >
              <blockquote>
                <p>“{featuredQuote.content}”</p>
                <footer>
                  {featuredQuote.author}
                  <span>《{featuredQuote.source}》</span>
                </footer>
              </blockquote>
              <ArrowRightOutlined className={styles.heroQuoteArrow} aria-hidden="true" />
            </Link>

            <div className={styles.heroActions}>
              <Link to="/articles" className={styles.primaryAction}>
                开始阅读
                <ArrowRightOutlined aria-hidden="true" />
              </Link>
              <Link to="/quotes" className={styles.secondaryAction}>
                浏览名言
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pathsSection} aria-labelledby="paths-title">
        <div className={styles.sectionInner}>
          <header className={styles.sectionHeading}>
            <h2 id="paths-title">从此刻开始，读一点真正留下来的文字</h2>
          </header>

          <div className={styles.pathGrid}>
            <Link to="/articles" className={styles.pathItem}>
              <span className={styles.pathNumber}>01</span>
              <BookOutlined className={styles.pathIcon} aria-hidden="true" />
              <div className={styles.pathContent}>
                <h3>经典文章</h3>
                <p>从文学、哲学、历史与科学中，建立更完整的理解</p>
              </div>
              <ArrowRightOutlined className={styles.pathArrow} aria-hidden="true" />
            </Link>

            <Link to="/quotes" className={styles.pathItem}>
              <span className={styles.pathNumber}>02</span>
              <MessageOutlined className={styles.pathIcon} aria-hidden="true" />
              <div className={styles.pathContent}>
                <h3>思想短句</h3>
                <p>用一段凝练的文字，为忙碌的一天留下思考的间隙</p>
              </div>
              <ArrowRightOutlined className={styles.pathArrow} aria-hidden="true" />
            </Link>

            <Link to="/profile" className={styles.pathItem}>
              <span className={styles.pathNumber}>03</span>
              <ReadOutlined className={styles.pathIcon} aria-hidden="true" />
              <div className={styles.pathContent}>
                <h3>阅读足迹</h3>
                <p>回看阅读记录与年度绿墙，让持续阅读变得清晰可见</p>
              </div>
              <ArrowRightOutlined className={styles.pathArrow} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.latestSection} aria-labelledby="latest-title">
        <div className={styles.sectionInner}>
          <header className={styles.splitHeading}>
            <div>
              <h2 id="latest-title">今天值得读的文章</h2>
            </div>
            <Link to="/articles" className={styles.textLink}>
              查看全部
              <ArrowRightOutlined aria-hidden="true" />
            </Link>
          </header>

          {isLoading ? (
            <div className={styles.articleSkeletons} aria-label="正在加载最近文章">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className={styles.articleSkeleton}>
                  <span />
                  <div>
                    <span />
                    <span />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className={styles.articleList}>
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className={styles.articleItem}
                >
                  <span className={styles.articleNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.articleBody}>
                    <div className={styles.articleMeta}>
                      <span>{ARTICLE_CATEGORY_LABELS[article.category]}</span>
                      <span>{formatDate(article.createdAt)}</span>
                      <span>{article.author}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                  </div>
                  <ArrowRightOutlined className={styles.articleArrow} aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.contentStatus}>
              <p>{error ?? '最近文章暂时不可用'}</p>
              <Link to="/articles">前往文章列表</Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.quotesSection} aria-labelledby="quotes-title">
        <div className={styles.sectionInner}>
          <header className={styles.splitHeading}>
            <div>
              <h2 id="quotes-title">带走一句话</h2>
            </div>
          </header>

          <div className={styles.quoteGrid}>
            {quotePreviews.map((quote) => (
              <Link
                key={`${quote.author}-${quote.content}`}
                to={getQuotePath(quote)}
                className={styles.quoteItem}
              >
                <blockquote>
                  <p>“{quote.content}”</p>
                  <footer>
                    {quote.author}
                    <span>《{quote.source}》</span>
                  </footer>
                </blockquote>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closingSection}>
        <div className={styles.closingInner}>
          <h2>每天读一点，让理解自然生长</h2>
          <Link to="/articles" className={styles.closingAction}>
            继续阅读
            <ArrowRightOutlined aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}

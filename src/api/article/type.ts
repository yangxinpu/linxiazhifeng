import type { Category } from '../global-type'

/**
 * 文章分类的四个维度。
 * value 对应 constants/article-category.ts 层级分类中的叶子节点值，
 * 这样既支持分类筛选，也能与展示层 label 派生保持一致。
 */

/** 文章分类组合：4 个维度的层级分类树 */
export interface ArticleCategories {
  /** 内容主题分类（层级树） */
  contentTheme: Category[]
  /** 表达方式与文体分类（层级树） */
  expressionStyle: Category[]
  /** 来源与应用属性分类（层级树） */
  sourceAttribute: Category[]
  /** 时代与地域分类（层级树） */
  timeRegion: Category[]
}

/** 内容主题分类 value */
export type ArticleContentTheme =
  | 'biography'
  | 'growth'
  | 'event'
  | 'memoir'
  | 'travel'
  | 'custom'
  | 'artifact'
  | 'animalPlant'
  | 'sceneLyric'
  | 'objectAspiration'
  | 'directEmotion'
  | 'historyReflection'
  | 'lifeInsight'
  | 'viewpoint'
  | 'reasonAnalysis'
  | 'thoughtEssay'
  | 'currentComment'
  | 'cultureComment'
  | 'phenomenonAnalysis'
  | 'viewDebate'
  | 'thingIntro'
  | 'reasonExplain'
  | 'knowledgePopularize'
  | 'experimentReport'
  | 'dailyInsight'
  | 'readingNotes'
  | 'travelNotes'
  | 'experienceShare'
  | 'patriotism'
  | 'historyThought'
  | 'socialIdeal'
  | 'peopleConcern'

/** 表达方式与文体分类 value */
export type ArticleExpressionStyle =
  | 'personNarrative'
  | 'eventNarrative'
  | 'sceneNarrative'
  | 'objectNarrative'
  | 'thingExpository'
  | 'reasonExpository'
  | 'procedureExpository'
  | 'scienceExpository'
  | 'positiveEssay'
  | 'refutationEssay'
  | 'thoughtComment'
  | 'currentEssay'
  | 'notice'
  | 'report'
  | 'officialLetter'
  | 'decision'
  | 'letter'
  | 'diary'
  | 'leaveNote'
  | 'application'
  | 'resume'
  | 'summary'
  | 'plan'
  | 'workReport'
  | 'pressRelease'
  | 'speech'
  | 'manual'
  | 'proposal'

/** 来源与应用属性分类 value */
export type ArticleSourceAttribute =
  | 'prose'
  | 'novel'
  | 'poetry'
  | 'essay'
  | 'drama'
  | 'academicPaper'
  | 'researchReport'
  | 'literatureReview'
  | 'thesis'
  | 'investigationReport'
  | 'administrativeDocument'
  | 'businessLetter'
  | 'contract'
  | 'workPlan'
  | 'workSummary'
  | 'privateLetter'
  | 'personalDiary'
  | 'readingExcerpts'
  | 'initiativeNote'
  | 'note'
  | 'officialAccount'
  | 'column'
  | 'shortVideoCopy'
  | 'qaContent'
  | 'recommendationNote'

/** 时代与地域分类 value */
export type ArticleTimeRegion =
  | 'preQinProse'
  | 'historicalBiography'
  | 'tangSongProse'
  | 'mingQingEssay'
  | 'newCultureMovement'
  | 'foundingToReform'
  | 'traditionalMedia'
  | 'newMediaArticle'
  | 'foreignAncient'
  | 'foreignModern'
  | 'foreignContemporary'

/** 文章 */
export interface Article {
  id: number
  title: string
  summary: string
  content: string
  author: string
  /** 内容主题（contentThemeCategories 叶子 value） */
  contentTheme: ArticleContentTheme
  /** 表达方式与文体（expressionStyleCategories 叶子 value） */
  expressionStyle: ArticleExpressionStyle
  /** 来源与应用属性（sourceAttributeCategories 叶子 value） */
  sourceAttribute: ArticleSourceAttribute
  /** 时代与地域（timeRegionCategories 叶子 value） */
  timeRegion: ArticleTimeRegion
  cover?: string
  tags: string[]
  viewCount: number
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  createdAt: string
  updatedAt: string
}

/** 文章互动类型。 */
export type ArticleEngagementType = 'like' | 'favorite'

/** 更新文章互动状态的请求参数。 */
export interface UpdateArticleEngagementParams {
  type: ArticleEngagementType
  isActive: boolean
}

/** 文章最新互动状态。 */
export interface ArticleEngagement {
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
}

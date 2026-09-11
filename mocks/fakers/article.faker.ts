import { faker } from '@faker-js/faker/locale/zh_CN'
import type {
  ArticleContentTheme,
  ArticleExpressionStyle,
  ArticleSourceAttribute,
  ArticleTimeRegion,
} from '@/api/article/type'

export interface MockArticle {
  id: number
  title: string
  summary: string
  content: string
  author: string
  contentTheme: ArticleContentTheme
  expressionStyle: ArticleExpressionStyle
  sourceAttribute: ArticleSourceAttribute
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

const ARTICLE_POOL: Omit<
  MockArticle,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'viewCount'
  | 'likeCount'
  | 'favoriteCount'
  | 'isLiked'
  | 'isFavorited'
>[] = [
  {
    title: '人工智能时代的思考：技术如何重塑我们的生活',
    summary: '探讨人工智能技术对社会、经济和日常生活的深远影响，以及我们应该如何应对这场技术革命。',
    content: '人工智能正在以前所未有的速度改变着我们的世界。从智能手机的语音助手到自动驾驶汽车……',
    author: '张明远',
    contentTheme: 'thoughtEssay',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'column',
    timeRegion: 'foreignModern',
    tags: ['人工智能', '科技', '未来'],
    cover: 'https://picsum.photos/seed/ai/800/400',
  },
  {
    title: '庄子的逍遥游：追求精神的绝对自由',
    summary: '深入解读庄子《逍遥游》的哲学思想，探讨如何在现实世界中实现精神的自由与超脱。',
    content: '《逍遥游》是《庄子》的首篇，也是庄子哲学思想的集中体现……',
    author: '李思远',
    contentTheme: 'lifeInsight',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'essay',
    timeRegion: 'preQinProse',
    tags: ['庄子', '哲学', '自由'],
  },
  {
    title: '《红楼梦》中的人生智慧：从贾宝玉看人性',
    summary: '通过分析贾宝玉这一经典文学形象，探讨人性的复杂与美好，以及文学对人生的启示。',
    content: '贾宝玉是《红楼梦》中最具争议也最富魅力的人物之一……',
    author: '王文心',
    contentTheme: 'viewpoint',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'essay',
    timeRegion: 'mingQingEssay',
    tags: ['红楼梦', '文学', '人性'],
    cover: 'https://picsum.photos/seed/honglou/800/400',
  },
  {
    title: '量子力学与意识：科学边界的哲学思考',
    summary: '探讨量子力学中的观察者效应，以及它对意识本质研究的启示，揭示科学与哲学的交汇点。',
    content: '量子力学是20世纪最伟大的科学发现之一……',
    author: '陈物理',
    contentTheme: 'thoughtEssay',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'column',
    timeRegion: 'foreignModern',
    tags: ['量子力学', '意识', '科学'],
    cover: 'https://picsum.photos/seed/quantum/800/400',
  },
  {
    title: '慢生活的艺术：在快节奏时代寻找内心的平静',
    summary: '分享如何在繁忙的现代生活中实践慢生活理念，通过简单的方法找到内心的宁静与满足。',
    content: '在这个快节奏的时代，我们似乎总是在赶路……',
    author: '林静心',
    contentTheme: 'dailyInsight',
    expressionStyle: 'eventNarrative',
    sourceAttribute: 'prose',
    timeRegion: 'newMediaArticle',
    tags: ['慢生活', '生活', '平静'],
  },
  {
    title: '老子的智慧：道法自然的现代启示',
    summary: '解读《道德经》的核心思想，探讨"道法自然"如何指导现代人的生活和工作。',
    content: '老子在《道德经》中说："人法地，地法天，天法道，道法自然。"',
    author: '周道明',
    contentTheme: 'viewpoint',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'essay',
    timeRegion: 'preQinProse',
    tags: ['老子', '智慧', '自然'],
    cover: 'https://picsum.photos/seed/daodejing/800/400',
  },
  {
    title: '印象派的光与色：莫奈绘画中的时间哲学',
    summary: '通过分析莫奈的代表作，探讨印象派如何用光与色捕捉时间的流逝。',
    content: '克劳德·莫奈是印象派的代表人物……',
    author: '赵艺术',
    contentTheme: 'sceneLyric',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'essay',
    timeRegion: 'foreignModern',
    tags: ['莫奈', '印象派', '艺术'],
    cover: 'https://picsum.photos/seed/monet/800/400',
  },
  {
    title: '丝绸之路：古代世界的全球化',
    summary: '回顾丝绸之路的历史，探讨这条古老商路如何促进东西方文明的交流与融合。',
    content: '丝绸之路是古代世界最重要的贸易通道之一……',
    author: '孙历史',
    contentTheme: 'historyReflection',
    expressionStyle: 'thingExpository',
    sourceAttribute: 'prose',
    timeRegion: 'historicalBiography',
    tags: ['丝绸之路', '历史', '文明'],
  },
  {
    title: '深度学习入门：从神经网络到实践应用',
    summary: '为初学者介绍深度学习的基本概念、核心技术和实际应用，帮助读者快速入门。',
    content: '深度学习是人工智能领域最热门的技术之一……',
    author: '刘技术',
    contentTheme: 'knowledgePopularize',
    expressionStyle: 'scienceExpository',
    sourceAttribute: 'officialAccount',
    timeRegion: 'newMediaArticle',
    tags: ['深度学习', 'AI', '技术'],
    cover: 'https://picsum.photos/seed/deeplearning/800/400',
  },
  {
    title: '存在主义的自由：萨特与"他人即地狱"',
    summary: '深入解读萨特的存在主义哲学，探讨自由、责任与他人关系的深刻内涵。',
    content: '让-保罗·萨特是20世纪最具影响力的哲学家之一……',
    author: '杨哲学',
    contentTheme: 'thoughtEssay',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'essay',
    timeRegion: 'foreignModern',
    tags: ['萨特', '存在主义', '自由'],
    cover: 'https://picsum.photos/seed/sartre/800/400',
  },
  {
    title: '诗歌的力量：从杜甫看中国古典诗歌的现实关怀',
    summary: '通过分析杜甫的代表作，探讨中国古典诗歌如何反映社会现实，以及诗歌的社会价值。',
    content: '杜甫被誉为"诗圣"，他的诗歌深刻反映了唐代社会的现实……',
    author: '吴文学',
    contentTheme: 'historyReflection',
    expressionStyle: 'thoughtComment',
    sourceAttribute: 'essay',
    timeRegion: 'tangSongProse',
    tags: ['杜甫', '诗歌', '现实'],
  },
  {
    title: '相对论百年：爱因斯坦如何改变我们的时空观',
    summary: '回顾相对论的发展历程，探讨这一理论如何颠覆传统的时空观念。',
    content: '1905年，爱因斯坦发表了狭义相对论……',
    author: '钱科学',
    contentTheme: 'knowledgePopularize',
    expressionStyle: 'scienceExpository',
    sourceAttribute: 'column',
    timeRegion: 'foreignModern',
    tags: ['相对论', '爱因斯坦', '物理'],
    cover: 'https://picsum.photos/seed/einstein/800/400',
  },
  {
    title: '苏东坡在黄州：一位文豪的逆境成长',
    summary: '记述苏东坡被贬黄州期间的生活与创作，展现文学大家在困境中的生命韧性。',
    content: '元丰三年，苏东坡因"乌台诗案"被贬黄州……',
    author: '苏文学',
    contentTheme: 'biography',
    expressionStyle: 'personNarrative',
    sourceAttribute: 'prose',
    timeRegion: 'tangSongProse',
    tags: ['苏轼', '黄州', '成长'],
  },
  {
    title: '瓦尔登湖：一个人的自然实验',
    summary: '重读梭罗《瓦尔登湖》，看工业时代一位知识分子如何在森林中寻找生活的本真。',
    content: '1845年，梭罗独自来到康科德附近的瓦尔登湖畔……',
    author: '田自然',
    contentTheme: 'experienceShare',
    expressionStyle: 'thingExpository',
    sourceAttribute: 'novel',
    timeRegion: 'foreignAncient',
    tags: ['梭罗', '自然', '生活'],
  },
  {
    title: '从疫情到后疫情：我们如何重建日常生活',
    summary: '回顾三年疫情对个体生活方式的冲击与改变，探讨后疫情时代心理重建与社会关系。',
    content: '2020年初爆发的新冠疫情……',
    author: '方观察',
    contentTheme: 'viewpoint',
    expressionStyle: 'currentEssay',
    sourceAttribute: 'column',
    timeRegion: 'traditionalMedia',
    tags: ['疫情', '社会', '观察'],
  },
]

export function createMockArticleList(count: number): MockArticle[] {
  return ARTICLE_POOL.slice(0, count).map((article, index) => ({
    ...article,
    id: index + 1,
    viewCount: faker.number.int({ min: 100, max: 10000 }),
    likeCount: faker.number.int({ min: 10, max: 1000 }),
    favoriteCount: faker.number.int({ min: 5, max: 500 }),
    isLiked: faker.datatype.boolean({ probability: 0.25 }),
    isFavorited: faker.datatype.boolean({ probability: 0.2 }),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  }))
}

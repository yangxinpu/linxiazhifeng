// 1. 按内容主题划分
export const contentThemeCategories = [
  { value: 'all', label: '全部' },
  {
    value: 'narrative',
    label: '叙事记人',
    children: [
      { value: 'biography', label: '人物传记' },
      { value: 'growth', label: '成长纪事' },
      { value: 'event', label: '事件记录' },
      { value: 'memoir', label: '回忆散文' }
    ]
  },
  {
    value: 'scenery',
    label: '写景状物',
    children: [
      { value: 'travel', label: '山水游记' },
      { value: 'custom', label: '风物描写' },
      { value: 'artifact', label: '器物咏叹' },
      { value: 'animalPlant', label: '动植物随笔' }
    ]
  },
  {
    value: 'lyric',
    label: '抒情言志',
    children: [
      { value: 'sceneLyric', label: '借景抒情' },
      { value: 'objectAspiration', label: '托物言志' },
      { value: 'directEmotion', label: '直抒胸臆' },
      { value: 'historyReflection', label: '感怀咏史' }
    ]
  },
  {
    value: 'philosophy',
    label: '议论哲思',
    children: [
      { value: 'lifeInsight', label: '人生感悟' },
      { value: 'viewpoint', label: '观点阐释' },
      { value: 'reasonAnalysis', label: '道理评析' },
      { value: 'thoughtEssay', label: '思想杂谈' }
    ]
  },
  {
    value: 'socialComment',
    label: '社会评论',
    children: [
      { value: 'currentComment', label: '时事评论' },
      { value: 'cultureComment', label: '文化评论' },
      { value: 'phenomenonAnalysis', label: '现象评析' },
      { value: 'viewDebate', label: '观点争鸣' }
    ]
  },
  {
    value: 'popularScience',
    label: '科普说明',
    children: [
      { value: 'thingIntro', label: '事物介绍' },
      { value: 'reasonExplain', label: '事理讲解' },
      { value: 'knowledgePopularize', label: '知识普及' },
      { value: 'experimentReport', label: '实验报告' }
    ]
  },
  {
    value: 'lifeEssay',
    label: '生活随笔',
    children: [
      { value: 'dailyInsight', label: '日常感悟' },
      { value: 'readingNotes', label: '读书心得' },
      { value: 'travelNotes', label: '旅行手记' },
      { value: 'experienceShare', label: '经验分享' }
    ]
  },
  {
    value: 'homelandFeeling',
    label: '家国情怀',
    children: [
      { value: 'patriotism', label: '爱国抒怀' },
      { value: 'historyThought', label: '历史思考' },
      { value: 'socialIdeal', label: '社会理想' },
      { value: 'peopleConcern', label: '民生关切' }
    ]
  }
];

// 2. 按表达方式与文体划分
export const expressionStyleCategories = [
  { value: 'all', label: '全部' },
  {
    value: 'narrative',
    label: '记叙文',
    children: [
      { value: 'personNarrative', label: '写人记叙文' },
      { value: 'eventNarrative', label: '叙事记叙文' },
      { value: 'sceneNarrative', label: '写景记叙文' },
      { value: 'objectNarrative', label: '状物记叙文' }
    ]
  },
  {
    value: 'expository',
    label: '说明文',
    children: [
      { value: 'thingExpository', label: '事物说明文' },
      { value: 'reasonExpository', label: '事理说明文' },
      { value: 'procedureExpository', label: '程序说明文' },
      { value: 'scienceExpository', label: '科普说明文' }
    ]
  },
  {
    value: 'argumentative',
    label: '议论文',
    children: [
      { value: 'positiveEssay', label: '立论文' },
      { value: 'refutationEssay', label: '驳论文' },
      { value: 'thoughtComment', label: '思想评论' },
      { value: 'currentEssay', label: '时事杂文' }
    ]
  },
  {
    value: 'practical',
    label: '应用文',
    children: [
      {
        value: 'officialDocument',
        label: '公务文书',
        children: [
          { value: 'notice', label: '通知' },
          { value: 'report', label: '报告' },
          { value: 'officialLetter', label: '函' },
          { value: 'decision', label: '决定' }
        ]
      },
      {
        value: 'dailyDocument',
        label: '日常文书',
        children: [
          { value: 'letter', label: '书信' },
          { value: 'diary', label: '日记' },
          { value: 'leaveNote', label: '请假条' },
          { value: 'application', label: '申请书' }
        ]
      },
      {
        value: 'workplaceDocument',
        label: '职场文书',
        children: [
          { value: 'resume', label: '简历' },
          { value: 'summary', label: '总结' },
          { value: 'plan', label: '计划' },
          { value: 'workReport', label: '述职报告' }
        ]
      },
      {
        value: 'mediaDocument',
        label: '传媒文书',
        children: [
          { value: 'pressRelease', label: '新闻稿' },
          { value: 'speech', label: '演讲稿' },
          { value: 'manual', label: '说明书' },
          { value: 'proposal', label: '倡议书' }
        ]
      }
    ]
  }
];

// 3. 按来源与应用属性划分
export const sourceAttributeCategories = [
  { value: 'all', label: '全部' },
  {
    value: 'literature',
    label: '文学类文章',
    children: [
      { value: 'prose', label: '散文' },
      { value: 'novel', label: '小说' },
      { value: 'poetry', label: '诗歌' },
      { value: 'essay', label: '杂文' },
      { value: 'drama', label: '戏剧文学' }
    ]
  },
  {
    value: 'academic',
    label: '学术类文章',
    children: [
      { value: 'academicPaper', label: '学术论文' },
      { value: 'researchReport', label: '研究报告' },
      { value: 'literatureReview', label: '文献综述' },
      { value: 'thesis', label: '学位论文' },
      { value: 'investigationReport', label: '调查报告' }
    ]
  },
  {
    value: 'officialBusiness',
    label: '公务商务类文章',
    children: [
      { value: 'administrativeDocument', label: '行政公文' },
      { value: 'businessLetter', label: '商务函件' },
      { value: 'contract', label: '合同协议' },
      { value: 'workPlan', label: '工作计划' },
      { value: 'workSummary', label: '工作总结' }
    ]
  },
  {
    value: 'dailyPractical',
    label: '日常实用类文章',
    children: [
      { value: 'privateLetter', label: '私人书信' },
      { value: 'personalDiary', label: '个人日记' },
      { value: 'readingExcerpts', label: '读书摘录' },
      { value: 'initiativeNote', label: '倡议短文' },
      { value: 'note', label: '便条' }
    ]
  },
  {
    value: 'newMedia',
    label: '新媒体类文章',
    children: [
      { value: 'officialAccount', label: '公众号推文' },
      { value: 'column', label: '专栏文章' },
      { value: 'shortVideoCopy', label: '短视频文案' },
      { value: 'qaContent', label: '问答内容' },
      { value: 'recommendationNote', label: '种草笔记' }
    ]
  }
];

// 4. 按时代与地域划分
export const timeRegionCategories = [
  { value: 'all', label: '全部' },
  {
    value: 'chinese',
    label: '中国文章',
    children: [
      {
        value: 'ancientChinese',
        label: '古代文言文章',
        children: [
          { value: 'preQinProse', label: '诸子散文' },
          { value: 'historicalBiography', label: '史传文' },
          { value: 'tangSongProse', label: '唐宋古文' },
          { value: 'mingQingEssay', label: '明清小品文' }
        ]
      },
      {
        value: 'modernChinese',
        label: '近现代白话文章',
        children: [
          { value: 'newCultureMovement', label: '新文化运动时期' },
          { value: 'foundingToReform', label: '建国至改革开放时期' }
        ]
      },
      {
        value: 'contemporaryChinese',
        label: '当代文章',
        children: [
          { value: 'traditionalMedia', label: '传统纸媒文章' },
          { value: 'newMediaArticle', label: '新媒体文章' }
        ]
      }
    ]
  },
  {
    value: 'foreign',
    label: '外国文章',
    children: [
      { value: 'foreignAncient', label: '外国古典文章' },
      { value: 'foreignModern', label: '外国近现代文章' },
      { value: 'foreignContemporary', label: '外国当代文章' }
    ]
  }
];

/** 层级分类节点结构（与上面 4 组常量 shape 保持一致） */
export interface CategoryNode {
  value: string
  label: string
  children?: CategoryNode[]
}

/** 在一组层级分类中按 value 查找节点本身（不限层级），找不到返回 null */
export function findCategoryNode(
  tree: CategoryNode[] | readonly CategoryNode[],
  value: string,
): CategoryNode | null {
  for (const node of tree) {
    if (node.value === value) return node
    if (node.children?.length) {
      const hit = findCategoryNode(node.children, value)
      if (hit) return hit
    }
  }
  return null
}

/** 给定叶子 value，返回它在 tree 中的 label；若 value 属于中间节点也能直接返回 */
export function getCategoryLabel(
  tree: CategoryNode[] | readonly CategoryNode[],
  value: string,
): string {
  return findCategoryNode(tree, value)?.label ?? value
}

/** 给定叶子 value，返回它的**直接父级** label，用于 home 等场景展示"主分类"。找不到则返回叶子 label 自身 */
export function getParentCategoryLabel(
  tree: CategoryNode[] | readonly CategoryNode[],
  value: string,
): string {
  for (const node of tree) {
    if (!node.children?.length) continue
    for (const child of node.children) {
      if (child.value === value) return node.label
      if (child.children?.length) {
        for (const grandchild of child.children) {
          if (grandchild.value === value) return child.label
          if (grandchild.children?.length) {
            const hit = grandchild.children.find((g) => g.value === value)
            if (hit) return grandchild.label
          }
        }
      }
    }
  }
  return getCategoryLabel(tree, value)
}

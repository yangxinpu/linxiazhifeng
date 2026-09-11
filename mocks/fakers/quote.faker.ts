import { faker } from '@faker-js/faker/locale/zh_CN'

export interface MockQuote {
  id: number
  content: string
  author: string
  source: string
  category: 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'love' | 'friendship' | 'success' | 'courage' | 'education' | 'nature' | 'art' | 'history'
  detailId: number
  background?: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  createdAt: string
}

export interface MockQuoteDetail {
  id: number
  quoteId: number
  content: string
  author: string
  source: string
  category: 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'love' | 'friendship' | 'success' | 'courage' | 'education' | 'nature' | 'art' | 'history'
  authorBio: string
  story: string
  background: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  createdAt: string
}

export interface MockCategory {
  value: string
  label: string
}

export const CATEGORY_OPTIONS: MockCategory[] = [
  { value: '', label: '全部' },
  { value: 'philosophy', label: '哲学' },
  { value: 'literature', label: '文学' },
  { value: 'science', label: '科学' },
  { value: 'life', label: '人生' },
  { value: 'wisdom', label: '智慧' },
  { value: 'love', label: '爱情' },
  { value: 'friendship', label: '友情' },
  { value: 'success', label: '成功' },
  { value: 'courage', label: '勇气' },
  { value: 'education', label: '教育' },
  { value: 'nature', label: '自然' },
  { value: 'art', label: '艺术' },
  { value: 'history', label: '历史' },
]

const QUOTE_POOL: Omit<
  MockQuote,
  | 'id'
  | 'detailId'
  | 'createdAt'
  | 'viewCount'
  | 'likeCount'
  | 'favoriteCount'
  | 'isLiked'
  | 'isFavorited'
>[] = [
  { content: '不是看到希望才坚持，而是坚持了才看到希望', author: '佚名', source: '励志箴言', category: 'life' },
  { content: '你受的苦，会照亮你的路', author: '佚名', source: '人生感悟', category: 'life' },
  { content: '最慢的步伐不是跬步，而是徘徊；最快的脚步不是冲刺，而是持续', author: '佚名', source: '行动哲学', category: 'wisdom' },
  { content: '生活不是等待暴风雨过去，而是学会在雨中跳舞', author: '维维安·格林', source: '人生感悟', category: 'life' },
  { content: '一千个读者就有一千个哈姆雷特', author: '莎士比亚', source: '文学评论', category: 'literature' },
  { content: '路漫漫其修远兮，吾将上下而求索', author: '屈原', source: '离骚', category: 'literature' },
  { content: '宇宙不仅比我们想象的更奇怪，而且比我们能想象的更奇怪', author: '海森堡', source: '物理学与哲学', category: 'science' },
  { content: '世界上只有一种英雄主义，就是看清生活的真相之后依然热爱生活', author: '罗曼·罗兰', source: '米开朗琪罗传', category: 'life' },
  { content: '万物皆有裂痕，那是光照进来的地方', author: '莱昂纳德·科恩', source: '颂歌', category: 'life' },
  { content: '未经审视的人生不值得过', author: '苏格拉底', source: '申辩篇', category: 'philosophy' },
  { content: '我思故我在', author: '笛卡尔', source: '方法论', category: 'philosophy' },
  { content: '想象力比知识更重要', author: '爱因斯坦', source: '论科学', category: 'science' },
  { content: '知人者智，自知者明', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '天行健，君子以自强不息', author: '周文王', source: '周易', category: 'wisdom' },
  { content: '真正的智慧是知道自己的无知', author: '苏格拉底', source: '对话录', category: 'wisdom' },
  { content: '人生如逆旅，我亦是行人', author: '苏轼', source: '临江仙', category: 'literature' },
  { content: '存在先于本质', author: '萨特', source: '存在与虚无', category: 'philosophy' },
  { content: '不要温和地走进那个良夜', author: '狄兰·托马斯', source: '不要温和地走进那个良夜', category: 'literature' },
  { content: '知识就是力量', author: '培根', source: '沉思录', category: 'science' },
  { content: '人无远虑，必有近忧', author: '孔子', source: '论语', category: 'wisdom' },
  { content: '千里之行，始于足下', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '学而不思则罔，思而不学则殆', author: '孔子', source: '论语', category: 'wisdom' },
  { content: '三人行，必有我师焉', author: '孔子', source: '论语', category: 'wisdom' },
  { content: '己所不欲，勿施于人', author: '孔子', source: '论语', category: 'wisdom' },
  { content: '天将降大任于斯人也，必先苦其心志', author: '孟子', source: '告子下', category: 'life' },
  { content: '生于忧患，死于安乐', author: '孟子', source: '告子下', category: 'life' },
  { content: '得道者多助，失道者寡助', author: '孟子', source: '公孙丑下', category: 'wisdom' },
  { content: '穷则独善其身，达则兼济天下', author: '孟子', source: '尽心上', category: 'wisdom' },
  { content: '老吾老以及人之老，幼吾幼以及人之幼', author: '孟子', source: '梁惠王上', category: 'wisdom' },
  { content: '鱼与熊掌不可兼得', author: '孟子', source: '告子上', category: 'wisdom' },
  { content: '不以规矩，不能成方圆', author: '孟子', source: '离娄上', category: 'wisdom' },
  { content: '民为贵，社稷次之，君为轻', author: '孟子', source: '尽心下', category: 'wisdom' },
  { content: '天时不如地利，地利不如人和', author: '孟子', source: '公孙丑下', category: 'wisdom' },
  { content: '富贵不能淫，贫贱不能移，威武不能屈', author: '孟子', source: '滕文公下', category: 'life' },
  { content: '人法地，地法天，天法道，道法自然', author: '老子', source: '道德经', category: 'philosophy' },
  { content: '上善若水，水善利万物而不争', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '道可道，非常道；名可名，非常名', author: '老子', source: '道德经', category: 'philosophy' },
  { content: '祸兮福之所倚，福兮祸之所伏', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '合抱之木，生于毫末', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '大器晚成，大音希声', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '知足不辱，知止不殆', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '柔弱胜刚强', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '天下难事，必作于易；天下大事，必作于细', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '信言不美，美言不信', author: '老子', source: '道德经', category: 'wisdom' },
  { content: '庄周梦蝶，蝶梦庄周', author: '庄子', source: '齐物论', category: 'philosophy' },
  { content: '吾生也有涯，而知也无涯', author: '庄子', source: '养生主', category: 'wisdom' },
  { content: '相濡以沫，不如相忘于江湖', author: '庄子', source: '大宗师', category: 'life' },
  { content: '朝菌不知晦朔，蟪蛄不知春秋', author: '庄子', source: '逍遥游', category: 'wisdom' },
  { content: '井蛙不可以语于海，夏虫不可以语于冰', author: '庄子', source: '秋水', category: 'wisdom' },
  { content: '爱情不是占有，而是欣赏', author: '佚名', source: '爱情箴言', category: 'love' },
  { content: '真正的爱情是让对方成为更好的人', author: '佚名', source: '爱情感悟', category: 'love' },
  { content: '爱是理解的别名', author: '泰戈尔', source: '飞鸟集', category: 'love' },
  { content: '友谊是两颗心的真诚相待', author: '佚名', source: '友情箴言', category: 'friendship' },
  { content: '真正的朋友是在你需要时出现的人', author: '佚名', source: '友情感悟', category: 'friendship' },
  { content: '海内存知己，天涯若比邻', author: '王勃', source: '送杜少府之任蜀州', category: 'friendship' },
  { content: '成功是99%的汗水加1%的灵感', author: '爱迪生', source: '发明感悟', category: 'success' },
  { content: '失败是成功之母', author: '佚名', source: '成功箴言', category: 'success' },
  { content: '天才是百分之一的灵感加上百分之九十九的汗水', author: '爱迪生', source: '发明之路', category: 'success' },
  { content: '勇气不是没有恐惧，而是面对恐惧依然前行', author: '佚名', source: '勇气箴言', category: 'courage' },
  { content: '真正的勇气是知道生活的真相后依然热爱生活', author: '佚名', source: '勇气感悟', category: 'courage' },
  { content: '勇敢是处于逆境时的光芒', author: '佚名', source: '勇气箴言', category: 'courage' },
  { content: '教育不是灌输，而是点燃火焰', author: '苏格拉底', source: '教育理念', category: 'education' },
  { content: '学而不厌，诲人不倦', author: '孔子', source: '论语', category: 'education' },
  { content: '教育的目的是让人成为更好的人', author: '佚名', source: '教育感悟', category: 'education' },
  { content: '大自然是最好的老师', author: '佚名', source: '自然感悟', category: 'nature' },
  { content: '人与自然和谐共生', author: '佚名', source: '自然箴言', category: 'nature' },
  { content: '采菊东篱下，悠然见南山', author: '陶渊明', source: '饮酒', category: 'nature' },
  { content: '艺术是生活的升华', author: '佚名', source: '艺术感悟', category: 'art' },
  { content: '艺术来源于生活，高于生活', author: '佚名', source: '艺术箴言', category: 'art' },
  { content: '生活中不是缺少美，而是缺少发现美的眼睛', author: '罗丹', source: '艺术感悟', category: 'art' },
  { content: '以史为鉴，可以知兴替', author: '司马光', source: '资治通鉴', category: 'history' },
  { content: '历史是一面镜子', author: '佚名', source: '历史感悟', category: 'history' },
  { content: '读史使人明智', author: '培根', source: '论读书', category: 'history' },
]

const DETAIL_STORIES: Record<string, { authorBio: string; story: string; background: string }> = {
  '佚名': {
    authorBio: '这些励志箴言凝聚了无数人的智慧与经验，它们不是空洞的口号，而是经过时间考验的人生真理。每一句话背后都有无数人的实践验证，它们激励着一代又一代人在困境中寻找希望，在挫折中坚持前行。',
    story: '这些箴言来源于人们的生活实践和深刻思考，它们跨越时空，传递着人类共同的情感和智慧。无论是面对困难还是追求梦想，这些话语都能给人以力量和启示。',
    background: '这些励志箴言在现代社会中广泛流传，成为了许多人的人生座右铭。它们简单而深刻，用最朴实的语言道出了人生的真谛。',
  },
  '维维安·格林': {
    authorBio: '维维安·格林是一位英国作家和心理治疗师，她以独特的视角看待人生困境。这句话出自她的著作，表达了一种积极面对生活挑战的态度。她认为，生活中的困难和挫折是不可避免的，关键在于我们如何应对这些挑战。',
    story: '维维安·格林在一次心理咨询中遇到了一位深受生活困扰的患者。患者抱怨生活充满了各种问题和挑战，感到疲惫不堪。格林用这个比喻告诉患者，生活本身就是由各种问题组成的，关键不在于逃避问题，而在于学会在问题中成长。',
    background: '维维安·格林生活在20世纪，她的作品多关注人类心理和情感成长。这句话反映了她对人生哲学的深刻理解，鼓励人们在逆境中寻找成长的机会。',
  },
  '莎士比亚': {
    authorBio: '莎士比亚是英国文艺复兴时期最伟大的剧作家和诗人，被誉为"文学之王"。他的作品涵盖了喜剧、悲剧、历史剧等多种体裁，深刻揭示了人性的复杂和多样。',
    story: '在《哈姆雷特》第二幕第二场中，哈姆雷特对罗森克兰茨和吉尔登斯特恩说了这句话。他用这个比喻来表达对世界的看法：每个人对同一件事物都有不同的理解和感受。这句话体现了莎士比亚对人性和认知的深刻洞察。',
    background: '莎士比亚是英国文艺复兴时期最伟大的剧作家和诗人。《哈姆雷特》是他最著名的悲剧作品之一，讲述了丹麦王子哈姆雷特为父报仇的故事。',
  },
  '屈原': {
    authorBio: '屈原是中国战国时期楚国的政治家、诗人，被誉为中国浪漫主义文学的奠基人。他忠诚爱国，却遭谗言陷害，最终投汨罗江自尽，成为了端午节的纪念对象。',
    story: '屈原在《离骚》中写下这句诗时，正处于政治生涯的低谷。他被楚怀王疏远，遭到奸臣陷害，但他依然坚持自己的理想和信念。这句诗表达了他不畏艰难、勇往直前的精神，即使道路漫长曲折，也要坚持探索真理。',
    background: '屈原是中国战国时期楚国的政治家、诗人，被誉为中国浪漫主义文学的奠基人。《离骚》是中国古代最长的抒情诗，展现了屈原高尚的品格和深沉的爱国情怀。',
  },
  '海森堡': {
    authorBio: '维尔纳·海森堡是德国物理学家，量子力学的创始人之一。他提出的测不准原理彻底改变了人类对微观世界的认识，为现代物理学奠定了重要基础。',
    story: '海森堡在研究量子力学时发现，粒子的位置和动量不可能同时被精确测量。这个发现让他意识到，人类对宇宙的认识是有限的。他谦虚地说："我所看到的，只是冰山一角。"这句话表达了他对科学探索的谦逊态度。',
    background: '维尔纳·海森堡是德国物理学家，1932年获得诺贝尔物理学奖。他的测不准原理是量子力学的核心概念之一，揭示了微观粒子的本质特性。',
  },
  '罗曼·罗兰': {
    authorBio: '罗曼·罗兰是法国作家、音乐评论家，1915年获得诺贝尔文学奖。他的作品多关注人类精神力量和理想主义，被誉为"欧洲的良心"。',
    story: '罗曼·罗兰在《米开朗琪罗传》的序言中写下了这句话。他研究了米开朗琪罗、贝多芬等伟大人物的生平，发现他们都有一个共同点：在经历了巨大的痛苦和挫折后，依然选择热爱生活。这句话是对英雄主义的重新定义。',
    background: '罗曼·罗兰是法国作家、音乐评论家，1915年获得诺贝尔文学奖。他的作品多关注人类精神力量和理想主义，《约翰·克利斯朵夫》是他的代表作。',
  },
  '莱昂纳德·科恩': {
    authorBio: '莱昂纳德·科恩是加拿大歌手、诗人和小说家，被誉为"音乐界的诗人"。他的作品以深沉、忧郁的风格著称，歌词充满哲学思辨和宗教意象。',
    story: '科恩在创作歌曲《颂歌》时，正处于人生的低谷期。他经历了感情的挫折和事业的困境，但他没有选择逃避，而是用这首歌表达了对不完美的接纳。他用"裂痕"比喻人生的不完美，认为正是这些裂痕让光明得以照进生命。',
    background: '莱昂纳德·科恩是加拿大歌手、诗人和小说家，被誉为"音乐界的诗人"。他的作品以深沉、忧郁的风格著称，歌词充满哲学思辨和宗教意象。',
  },
  '苏格拉底': {
    authorBio: '苏格拉底是古希腊哲学家，被誉为西方哲学的奠基人之一。他通过对话和提问的方式启发人们思考，创立了"苏格拉底式对话"的教学方法。',
    story: '苏格拉底在雅典法庭上为自己辩护时说出这句话。面对死刑的判决，他没有选择逃避，而是坦然接受。他认为，未经反思的生活是没有价值的，真正的智慧来自于不断地质疑和审视自己的信念和行为。',
    background: '苏格拉底是古希腊哲学家，被誉为西方哲学的奠基人之一。他通过"苏格拉底式对话"启发人们思考，最终因"腐蚀青年"和"不敬神"的罪名被判处死刑。',
  },
  '笛卡尔': {
    authorBio: '勒内·笛卡尔是法国哲学家、数学家和科学家，被誉为"现代哲学之父"。他创立了解析几何，提出了身心二元论，对后世哲学产生了深远影响。',
    story: '笛卡尔在寻求真理的过程中，采用了"怀疑一切"的方法。他怀疑感官、怀疑理性、怀疑一切可以怀疑的事物，最终发现只有"我在怀疑"这一事实本身是不可怀疑的。由此，他确立了"我思故我在"这一哲学命题。',
    background: '勒内·笛卡尔是法国哲学家、数学家和科学家，被誉为"现代哲学之父"。他创立了解析几何，提出了身心二元论，对后世哲学产生了深远影响。',
  },
  '爱因斯坦': {
    authorBio: '阿尔伯特·爱因斯坦是德国出生的理论物理学家，1921年获得诺贝尔物理学奖。他提出了相对论，彻底改变了人类对时间、空间和物质的认识。',
    story: '爱因斯坦在一次演讲中表达了这一观点。他说，知识是有限的，它只能告诉我们已知的事物，而想象力可以超越已知的边界，探索未知的领域。正是想象力推动了科学的进步和人类文明的发展。',
    background: '阿尔伯特·爱因斯坦是德国出生的理论物理学家，1921年获得诺贝尔物理学奖。他提出了相对论，彻底改变了人类对时间、空间和物质的认识。',
  },
  '老子': {
    authorBio: '老子是中国古代哲学家，道家学派的创始人。他的思想以"道"为核心，主张"无为而治"，对中国哲学和文化产生了深远影响。',
    story: '老子在《道德经》第三十三章中写下这句话。他认为，了解他人是一种智慧，但了解自己才是真正的明智。这种自我认知是人生修养的最高境界，只有认识自己，才能真正认识世界。',
    background: '老子是中国古代哲学家，道家学派的创始人。《道德经》是中国历史上最伟大的哲学著作之一，以"道"为核心概念，阐述了宇宙万物的本源和规律。',
  },
  '周文王': {
    authorBio: '周文王是周朝的奠基者，相传他在被囚禁期间推演了《周易》。他的智慧和德行深受后人敬仰，被誉为"圣人"。',
    story: '周文王在被商纣王囚禁期间，没有消沉颓废，而是潜心研究易理，推演八卦为六十四卦。他用"天行健，君子以自强不息"这句话来激励自己，认为人应该效法天道的刚健，不断自我完善。',
    background: '周文王是周朝的奠基者，相传他在被囚禁期间推演了《周易》。《周易》是中国最古老的占卜和哲学著作，被誉为"群经之首"。',
  },
  '苏轼': {
    authorBio: '苏轼是北宋文学家、书画家，"唐宋八大家"之一。他的诗词豪放飘逸，散文汪洋恣肆，书法自成一家，是中国文化史上罕见的全才。',
    story: '苏轼在送别友人钱穆父时写下这首《临江仙》。他以"逆旅"比喻人生，表达了对人生短暂和无常的感慨。但苏轼并没有因此消沉，而是以豁达的态度面对人生的起起落落。',
    background: '苏轼是北宋文学家、书画家，"唐宋八大家"之一。他的诗词豪放飘逸，散文汪洋恣肆，书法自成一家，是中国文化史上罕见的全才。',
  },
  '萨特': {
    authorBio: '让-保罗·萨特是法国哲学家、作家，存在主义的代表人物。他拒绝接受1964年的诺贝尔文学奖，代表作有《存在与虚无》《恶心》等。',
    story: '萨特在《存在主义是一种人道主义》中提出了这一命题。他认为，人没有预定的本质，人首先存在，然后通过自己的选择和行动来定义自己。这一观点强调人的自由和责任，成为了存在主义哲学的核心思想。',
    background: '让-保罗·萨特是法国哲学家、作家，存在主义的代表人物。他拒绝接受1964年的诺贝尔文学奖，代表作有《存在与虚无》《恶心》等。',
  },
  '狄兰·托马斯': {
    authorBio: '狄兰·托马斯是威尔士诗人、作家，以独特的语言风格和强烈的情感表达著称。他的诗歌充满音乐性和意象，对后世诗人产生了深远影响。',
    story: '托马斯在父亲病重时写下了这首诗。他看着父亲日渐衰弱，内心充满了对死亡的抗拒。他用激烈的意象呼吁父亲不要平静地接受死亡，而是要像烈火一样燃烧到最后一刻，展现了对生命的强烈热爱。',
    background: '狄兰·托马斯是威尔士诗人、作家，以独特的语言风格和强烈的情感表达著称。他的诗歌充满音乐性和意象，对后世诗人产生了深远影响。',
  },
  '培根': {
    authorBio: '弗朗西斯·培根是英国哲学家、政治家和科学家，被誉为"现代科学之父"。他提出了归纳法，对现代科学方法论的发展产生了重要影响。',
    story: '培根在《沉思录》中提出了这一观点。他认为，知识本身不是力量，把知识转化为解决问题的能力才是力量。这一观点强调了实践和应用的重要性，对后来的科学发展产生了深远影响。',
    background: '弗朗西斯·培根是英国哲学家、政治家和科学家，被誉为"现代科学之父"。他提出了归纳法，对现代科学方法论的发展产生了重要影响。',
  },
  '孔子': {
    authorBio: '孔子是中国古代伟大的思想家和教育家，儒家学派的创始人。他的思想对中国和东亚文化产生了深远影响，被尊称为"至圣先师"。',
    story: '孔子在周游列国期间，不断传播自己的政治理想和教育理念。他强调"仁义礼智信"，主张"有教无类"，开创了私人讲学的先河。他的言行被弟子记录在《论语》中，成为了儒家经典。',
    background: '孔子生活在春秋时期，他周游列国传播自己的政治理想和教育理念。《论语》记录了他的言行，是儒家经典著作之一。',
  },
  '孟子': {
    authorBio: '孟子是儒家学派的重要代表人物，被称为"亚圣"。他继承和发展了孔子的思想，提出了"性善论"和"仁政"学说。',
    story: '孟子在游说各国君主时，提出了"民为贵，社稷次之，君为轻"的政治理念。他认为，君主应该实行仁政，关心百姓的疾苦。他的思想对后世的政治理念产生了深远影响。',
    background: '孟子生活在战国时期，他游说各国君主实行仁政，主张民贵君轻。《孟子》一书是儒家经典，对中国传统文化产生了深远影响。',
  },
  '庄子': {
    authorBio: '庄子是道家学派的代表人物，与老子并称"老庄"。他的思想以"逍遥"为核心，追求精神的绝对自由。',
    story: '庄子在《逍遥游》中通过鲲鹏的寓言，表达了对精神自由的向往。他认为，人应该超越世俗的束缚，追求内心的宁静和自由。他的思想充满了诗意和哲理。',
    background: '庄子生活在战国时期，他的著作《庄子》充满了寓言和哲理，以独特的视角探讨人生、宇宙和存在的意义。',
  },
  '泰戈尔': {
    authorBio: '泰戈尔是印度著名诗人、作家，1913年获得诺贝尔文学奖。他的诗歌充满哲理和美感，表达了对爱、自然和人生的深刻思考。',
    story: '泰戈尔在创作《飞鸟集》时，用简洁优美的语言表达了对生命和自然的感悟。他的诗歌像飞鸟一样自由翱翔，跨越了国界和文化的障碍，打动了全世界读者的心。',
    background: '泰戈尔是印度文艺复兴的先驱，他的作品融合了东西方文化精髓，《飞鸟集》《吉檀迦利》等作品在世界文学史上占有重要地位。',
  },
  '爱迪生': {
    authorBio: '托马斯·爱迪生是美国著名发明家，拥有1000多项发明专利。他通过不懈的努力和实验，发明了电灯、留声机等改变人类生活的重要发明。',
    story: '爱迪生在发明电灯的过程中，经历了上千次失败。有人问他是否感到沮丧，他说："我没有失败，我只是发现了1000种不能发明电灯的方法。"这种坚持不懈的精神，最终让他成功发明了电灯。',
    background: '托马斯·爱迪生是人类历史上最伟大的发明家之一，他的发明深刻改变了现代生活方式。他坚信勤奋和坚持是成功的关键。',
  },
  '王勃': {
    authorBio: '王勃是唐代著名诗人，"初唐四杰"之一。他的诗歌意境开阔，情感真挚，《滕王阁序》更是千古传诵的名篇。',
    story: '王勃在送别友人时写下这首诗。虽然两人即将天各一方，但他用"天涯若比邻"表达了真挚的友情不受距离限制的信念。这句诗成为了表达友情的经典名句。',
    background: '王勃是唐代文学天才，少年成名，可惜英年早逝。他的诗歌意境开阔，情感真挚，《滕王阁序》更是千古传诵的名篇。',
  },
  '陶渊明': {
    authorBio: '陶渊明是东晋著名诗人，被誉为"隐逸诗人之宗"。他厌倦官场生活，选择归隐田园，开创了田园诗派。',
    story: '陶渊明在归隐田园后，写下了《饮酒》组诗。这句诗描绘了他在田园生活中的悠然自得：在东篱下采菊，抬头就能看到南山。这种宁静淡泊的生活，成为了后世文人向往的理想境界。',
    background: '陶渊明是中国文学史上第一位田园诗人，他厌倦官场生活，选择归隐田园。他的诗歌清新自然，开创了田园诗派。',
  },
  '罗丹': {
    authorBio: '奥古斯特·罗丹是法国著名雕塑家，被誉为现代雕塑之父。他的作品展现了人类情感的深度和力量。',
    story: '罗丹在一次艺术讲座中说了这句话。他强调，艺术家不应该只是模仿自然，而应该善于发现生活中的美。他用这句话鼓励学生们用敏锐的眼光观察世界，发现平凡事物中的美。',
    background: '奥古斯特·罗丹是19世纪最伟大的雕塑家之一，代表作《思想者》《吻》等作品展现了人类情感的深度和力量。',
  },
  '司马光': {
    authorBio: '司马光是北宋著名政治家、史学家，他主编的《资治通鉴》是中国最重要的编年体史书之一。',
    story: '司马光在编写《资治通鉴》时，用这句话总结了历史的价值。他认为，通过研究历史，可以了解国家兴衰的规律，为现实政治提供借鉴。他历时19年完成了这部巨著。',
    background: '司马光历时19年主编《资治通鉴》，这部巨著记载了从战国到五代的历史，为后世提供了宝贵的历史经验和教训。',
  },
}

export function createMockQuote(id: number, overrides?: Partial<MockQuote>): MockQuote {
  const base = faker.helpers.arrayElement(QUOTE_POOL)
  const detailId = faker.number.int({ min: 1, max: 10000 })
  const authorInfo = DETAIL_STORIES[base.author]
  
  return {
    id,
    detailId,
    background: authorInfo?.background || `${base.author}在${base.source}中表达了这一思想，这句话至今仍激励着无数人思考人生的意义和价值。`,
    viewCount: faker.number.int({ min: 100, max: 10000 }),
    likeCount: faker.number.int({ min: 10, max: 1000 }),
    favoriteCount: faker.number.int({ min: 5, max: 500 }),
    isLiked: faker.datatype.boolean({ probability: 0.25 }),
    isFavorited: faker.datatype.boolean({ probability: 0.2 }),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    ...base,
    ...overrides,
  }
}

export function createMockQuoteList(count: number = 10): MockQuote[] {
  return Array.from({ length: count }, (_, index) => createMockQuote(index + 1))
}

export function createMockQuoteDetail(quote: MockQuote): MockQuoteDetail {
  const authorInfo = DETAIL_STORIES[quote.author] || {
    authorBio: `${quote.author}是一位杰出的思想家，这句话体现了其对人生的深刻洞察。通过这句名言，我们可以感受到作者对生命、智慧和人类处境的独特理解。`,
    story: `${quote.author}在创作这句名言时，正处于人生的转折点。这句话凝聚了他对生活的深刻思考和独特见解，成为了后人传颂的经典。`,
    background: `${quote.author}在${quote.source}中表达了这一思想，这句话至今仍激励着无数人思考人生的意义和价值。`,
  }

  return {
    id: quote.detailId,
    quoteId: quote.id,
    content: quote.content,
    author: quote.author,
    source: quote.source,
    category: quote.category,
    authorBio: authorInfo.authorBio,
    story: authorInfo.story,
    background: authorInfo.background,
    viewCount: quote.viewCount,
    likeCount: quote.likeCount,
    favoriteCount: quote.favoriteCount,
    isLiked: quote.isLiked,
    isFavorited: quote.isFavorited,
    createdAt: quote.createdAt,
  }
}

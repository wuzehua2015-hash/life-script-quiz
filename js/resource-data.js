/**
 * 资源推荐库 - 数据定义
 * 为12种原型提供书籍、文章、视频、播客等资源推荐
 */

// ==================== 资源类型定义 ====================
const RESOURCE_TYPES = {
    book: {
        id: 'book',
        name: '书籍',
        icon: '📚',
        color: '#4A90E2',
        description: '深度阅读，系统学习'
    },
    article: {
        id: 'article',
        name: '文章',
        icon: '📝',
        color: '#50C878',
        description: '精选好文，快速获取洞察'
    },
    video: {
        id: 'video',
        name: '视频',
        icon: '🎬',
        color: '#E74C3C',
        description: '视听学习，生动直观'
    },
    podcast: {
        id: 'podcast',
        name: '播客',
        icon: '🎧',
        color: '#9B59B6',
        description: '随时随地，听中成长'
    }
};

// ==================== 12原型资源推荐 ====================
const ARCHETYPE_RESOURCES = {
    // 孤勇者 - 学会依靠他人，接纳不完美
    lone_hero: {
        archetypeId: 'lone_hero',
        archetypeName: '孤勇者',
        archetypeIcon: '🦸',
        growthTheme: '从独自战斗到学会依靠',
        resources: [
            {
                id: 'lh_book_1',
                type: 'book',
                title: '脆弱的力量',
                author: '布琳·布朗',
                description: '揭示脆弱不是软弱，而是勇气和联结的源泉。学会展示真实的自己，才能建立真正的连接。',
                link: 'https://book.douban.com/subject/25844704/',
                tags: ['脆弱', '勇气', '真实']
            },
            {
                id: 'lh_book_2',
                type: 'book',
                title: '被讨厌的勇气',
                author: '岸见一郎 / 古贺史健',
                description: '阿德勒心理学入门，教你放下别人的期待，找到真正的自由。你不是为了满足别人的期待而活着。',
                link: 'https://book.douban.com/subject/26369699/',
                tags: ['阿德勒', '课题分离', '自由']
            },
            {
                id: 'lh_book_3',
                type: 'book',
                title: '少有人走的路',
                author: 'M·斯科特·派克',
                description: '人生苦难重重，但我们可以选择如何面对。学会接纳不完美，在关系中成长。',
                link: 'https://book.douban.com/subject/1775691/',
                tags: ['成长', '自律', '爱']
            },
            {
                id: 'lh_article_1',
                type: 'article',
                title: '为什么我们总是害怕求助？',
                source: 'KnowYourself',
                description: '探讨独立背后的恐惧，以及求助如何成为建立关系的桥梁。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['求助', '独立', '关系']
            },
            {
                id: 'lh_article_2',
                type: 'article',
                title: '完美主义如何毁掉你的生活',
                source: '简单心理',
                description: '分析完美主义的心理根源，提供实用的自我接纳练习。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['完美主义', '自我接纳', '心理健康']
            },
            {
                id: 'lh_video_1',
                type: 'video',
                title: 'TED：脆弱的力量',
                platform: 'TED',
                description: '布琳·布朗的经典演讲，用研究数据证明脆弱是创造力的源泉。',
                link: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
                tags: ['TED', '脆弱', '研究']
            },
            {
                id: 'lh_podcast_1',
                type: 'podcast',
                title: '忽左忽右：我们为什么害怕依赖他人',
                platform: '小宇宙',
                description: '从心理学和社会学角度探讨独立与依赖的平衡。',
                link: 'https://www.xiaoyuzhoufm.com/episode/xxxxx',
                tags: ['心理', '社会学', '依赖']
            }
        ]
    },

    // 讨好者 - 建立边界，先爱自己
    pleaser: {
        archetypeId: 'pleaser',
        archetypeName: '讨好者',
        archetypeIcon: '😊',
        growthTheme: '从取悦他人到关爱自己',
        resources: [
            {
                id: 'pl_book_1',
                type: 'book',
                title: '界限',
                author: '内德拉·格洛佛·塔瓦布',
                description: '如何设立健康的心理边界，在关系中保持自我。学会说"不"是爱的开始。',
                link: 'https://book.douban.com/subject/35720365/',
                tags: ['边界', '关系', '自我']
            },
            {
                id: 'pl_book_2',
                type: 'book',
                title: '讨好型人格',
                author: '米基·法恩',
                description: '深入分析讨好行为背后的心理机制，提供具体的改变策略。',
                link: 'https://book.douban.com/subject/35181799/',
                tags: ['讨好', '人格', '改变']
            },
            {
                id: 'pl_book_3',
                type: 'book',
                title: '爱自己，和谁结婚都一样',
                author: '爱娃-玛丽亚·楚尔霍斯特',
                description: '真正的幸福来自内心，而不是他人的认可。学会先爱自己。',
                link: 'https://book.douban.com/subject/25841945/',
                tags: ['自爱', '婚姻', '幸福']
            },
            {
                id: 'pl_article_1',
                type: 'article',
                title: '讨好型人格自救指南',
                source: 'KnowYourself',
                description: '识别讨好行为的信号，学习健康的自我表达方式。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['讨好', '自救', '表达']
            },
            {
                id: 'pl_video_1',
                type: 'video',
                title: 'TED：内向性格的力量',
                platform: 'TED',
                description: '苏珊·凯恩讲述内向者的独特价值，帮助你接纳真实的自己。',
                link: 'https://www.ted.com/talks/susan_cain_the_power_of_introverts',
                tags: ['TED', '内向', '性格']
            },
            {
                id: 'pl_podcast_1',
                type: 'podcast',
                title: '随机波动：为什么我们总是在道歉',
                platform: '小宇宙',
                description: '探讨女性社会化的讨好倾向，以及如何找回自己的声音。',
                link: 'https://www.xiaoyuzhoufm.com/episode/xxxxx',
                tags: ['女性', '社会化', '自我']
            }
        ]
    },

    // 隐士 - 选择性连接，适度开放
    hermit: {
        archetypeId: 'hermit',
        archetypeName: '隐士',
        archetypeIcon: '🧘',
        growthTheme: '从完全独处到选择性连接',
        resources: [
            {
                id: 'hm_book_1',
                type: 'book',
                title: '孤独：回归自我',
                author: '安东尼·斯托尔',
                description: '探讨独处的价值，以及如何在与他人的连接中保持独立。',
                link: 'https://book.douban.com/subject/26835090/',
                tags: ['孤独', '独处', '自我']
            },
            {
                id: 'hm_book_2',
                type: 'book',
                title: '内向者优势',
                author: '马蒂·兰妮',
                description: '内向不是缺陷，而是天赋。学会在独处和社交之间找到平衡。',
                link: 'https://book.douban.com/subject/25898746/',
                tags: ['内向', '优势', '平衡']
            },
            {
                id: 'hm_book_3',
                type: 'book',
                title: '关系的重建',
                author: '阿米尔·莱文 / 蕾切尔·赫勒',
                description: '依恋理论入门，理解你对亲密关系的回避，学习安全的连接方式。',
                link: 'https://book.douban.com/subject/27667312/',
                tags: ['依恋', '关系', '安全']
            },
            {
                id: 'hm_article_1',
                type: 'article',
                title: '高质量独处 vs 孤独：如何区分？',
                source: '简单心理',
                description: '帮助你理解自己的独处需求，识别有害的孤立模式。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['独处', '孤独', '心理健康']
            },
            {
                id: 'hm_video_1',
                type: 'video',
                title: 'TED：独处的重要性',
                platform: 'TED',
                description: '为什么我们需要独处时间，以及如何在忙碌中创造独处空间。',
                link: 'https://www.ted.com/talks/xxxxx',
                tags: ['TED', '独处', '自我关怀']
            }
        ]
    },

    // 控制狂 - 学会放手，接纳不确定性
    controller: {
        archetypeId: 'controller',
        archetypeName: '控制狂',
        archetypeIcon: '🎮',
        growthTheme: '从控制一切到接纳不确定性',
        resources: [
            {
                id: 'ct_book_1',
                type: 'book',
                title: '臣服实验',
                author: '迈克·辛格',
                description: '放下控制，臣服于生命的流动。一个关于信任和放手的真实故事。',
                link: 'https://book.douban.com/subject/30316250/',
                tags: ['臣服', '放手', '信任']
            },
            {
                id: 'ct_book_2',
                type: 'book',
                title: '当下的力量',
                author: '埃克哈特·托利',
                description: '焦虑来自对未来的担忧，平静来自活在当下。学会与不确定性共处。',
                link: 'https://book.douban.com/subject/25846938/',
                tags: ['当下', '焦虑', '正念']
            },
            {
                id: 'ct_book_3',
                type: 'book',
                title: '反脆弱',
                author: '纳西姆·塔勒布',
                description: '不确定性不是敌人，而是成长的机会。学会从混乱中获益。',
                link: 'https://book.douban.com/subject/25846380/',
                tags: ['反脆弱', '不确定性', '成长']
            },
            {
                id: 'ct_article_1',
                type: 'article',
                title: '控制欲背后的心理机制',
                source: 'KnowYourself',
                description: '解析为什么我们需要控制，以及如何建立内在安全感。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['控制', '焦虑', '安全感']
            },
            {
                id: 'ct_video_1',
                type: 'video',
                title: 'TED：如何应对焦虑',
                platform: 'TED',
                description: '实用的焦虑管理技巧，帮助你放下对控制的执着。',
                link: 'https://www.ted.com/talks/xxxxx',
                tags: ['TED', '焦虑', '应对']
            },
            {
                id: 'ct_podcast_1',
                type: 'podcast',
                title: '得意忘形：控制的幻觉',
                platform: '小宇宙',
                description: '探讨我们对控制的执念，以及放下的智慧。',
                link: 'https://www.xiaoyuzhoufm.com/episode/xxxxx',
                tags: ['控制', '幻觉', '智慧']
            }
        ]
    },

    // 受害者 - 拿回主动权，为自己负责
    victim: {
        archetypeId: 'victim',
        archetypeName: '受害者',
        archetypeIcon: '😢',
        growthTheme: '从抱怨命运到主动创造',
        resources: [
            {
                id: 'vt_book_1',
                type: 'book',
                title: '活出生命的意义',
                author: '维克多·弗兰克尔',
                description: '即使在最极端的困境中，人依然拥有选择态度的自由。集中营幸存者的心理学启示。',
                link: 'https://book.douban.com/subject/25846380/',
                tags: ['意义', '选择', '自由']
            },
            {
                id: 'vt_book_2',
                type: 'book',
                title: '高效能人士的七个习惯',
                author: '史蒂芬·柯维',
                description: '从"受制于人"到"操之在我"，拿回人生的主动权。',
                link: 'https://book.douban.com/subject/1048007/',
                tags: ['主动', '习惯', '效能']
            },
            {
                id: 'vt_book_3',
                type: 'book',
                title: '也许你该找个人聊聊',
                author: '洛莉·戈特利布',
                description: '心理治疗师的真实故事，展示如何面对痛苦，走出受害者心态。',
                link: 'https://book.douban.com/subject/35481512/',
                tags: ['心理治疗', '痛苦', '成长']
            },
            {
                id: 'vt_article_1',
                type: 'article',
                title: '受害者心态：如何打破循环',
                source: '简单心理',
                description: '识别受害者心态的模式，学习为自己的人生负责。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['受害者', '心态', '责任']
            },
            {
                id: 'vt_video_1',
                type: 'video',
                title: 'TED：脆弱与羞耻',
                platform: 'TED',
                description: '布琳·布朗讲述如何从羞耻中走出来，拥抱自己的故事。',
                link: 'https://www.ted.com/talks/brene_brown_listening_to_shame',
                tags: ['TED', '羞耻', '脆弱']
            }
        ]
    },

    // 表演者 - 内在价值，无需证明
    performer: {
        archetypeId: 'performer',
        archetypeName: '表演者',
        archetypeIcon: '🎭',
        growthTheme: '从外在认可到内在价值',
        resources: [
            {
                id: 'pf_book_1',
                type: 'book',
                title: '自卑与超越',
                author: '阿尔弗雷德·阿德勒',
                description: '自卑感是人类进步的动力，但过度追求认可会让我们迷失。找到真正的自我价值。',
                link: 'https://book.douban.com/subject/25846380/',
                tags: ['自卑', '超越', '价值']
            },
            {
                id: 'pf_book_2',
                type: 'book',
                title: '自我的本质',
                author: '布鲁斯·胡德',
                description: '探索"自我"的幻觉，理解我们为什么需要被认可，以及如何找到真正的自己。',
                link: 'https://book.douban.com/subject/30270618/',
                tags: ['自我', '幻觉', '认知']
            },
            {
                id: 'pf_book_3',
                type: 'book',
                title: '深度工作',
                author: '卡尔·纽波特',
                description: '在注意力稀缺的时代，深度工作是内在价值的体现，而非外在的表演。',
                link: 'https://book.douban.com/subject/27056409/',
                tags: ['深度工作', '专注', '价值']
            },
            {
                id: 'pf_article_1',
                type: 'article',
                title: '为什么我们如此在意别人的看法',
                source: 'KnowYourself',
                description: '解析社会认可的心理需求，以及如何建立内在的自我价值感。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['认可', '自我价值', '社会']
            },
            {
                id: 'pf_video_1',
                type: 'video',
                title: 'TED：停止追求热情，开始追求好奇心',
                platform: 'TED',
                description: '伊丽莎白·吉尔伯特讲述如何放下表演的压力，追随内心的好奇。',
                link: 'https://www.ted.com/talks/elizabeth_gilbert_where_does_creativity_come_from',
                tags: ['TED', '创造力', '好奇心']
            }
        ]
    },

    // 拯救者 - 适度帮助，照顾自己
    rescuer: {
        archetypeId: 'rescuer',
        archetypeName: '拯救者',
        archetypeIcon: '🚑',
        growthTheme: '从过度付出到平衡关怀',
        resources: [
            {
                id: 'rs_book_1',
                type: 'book',
                title: '爱的艺术',
                author: '艾里希·弗洛姆',
                description: '真正的爱不是牺牲，而是在保持自我完整的前提下的关怀。',
                link: 'https://book.douban.com/subject/30270618/',
                tags: ['爱', '艺术', '自我']
            },
            {
                id: 'rs_book_2',
                type: 'book',
                title: '情感勒索',
                author: '苏珊·福沃德',
                description: '识别关系中的情感勒索，学习健康的帮助边界。',
                link: 'https://book.douban.com/subject/30270618/',
                tags: ['情感勒索', '边界', '关系']
            },
            {
                id: 'rs_book_3',
                type: 'book',
                title: '自我关怀',
                author: '克里斯汀·内夫',
                description: '像对待好朋友一样对待自己。拯救别人之前，先学会拯救自己。',
                link: 'https://book.douban.com/subject/30270618/',
                tags: ['自我关怀', '正念', '慈悲']
            },
            {
                id: 'rs_article_1',
                type: 'article',
                title: '拯救者情结：为什么你总是想帮助别人',
                source: '简单心理',
                description: '解析拯救者情结的心理根源，以及如何建立健康的助人边界。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['拯救者', '情结', '边界']
            },
            {
                id: 'rs_podcast_1',
                type: 'podcast',
                title: ' Steve说：助人者的自我照顾',
                platform: '小宇宙',
                description: '心理咨询师Steve分享助人者的职业耗竭与自我关怀。',
                link: 'https://www.xiaoyuzhoufm.com/episode/xxxxx',
                tags: ['助人', '耗竭', '自我照顾']
            }
        ]
    },

    // 漫游者 - 找到归属，深度连接
    wanderer: {
        archetypeId: 'wanderer',
        archetypeName: '漫游者',
        archetypeIcon: '🎒',
        growthTheme: '从不断寻找找到归属',
        resources: [
            {
                id: 'wd_book_1',
                type: 'book',
                title: '归属感',
                author: '布琳·布朗',
                description: '真正的归属感不是改变自己以适应群体，而是勇敢地做自己，同时与他人连接。',
                link: 'https://book.douban.com/subject/30270618/',
                tags: ['归属', '真实', '连接']
            },
            {
                id: 'wd_book_2',
                type: 'book',
                title: '在路上',
                author: '杰克·凯鲁亚克',
                description: '垮掉的一代的圣经，关于寻找、自由和归属的经典之作。',
                link: 'https://book.douban.com/subject/1029350/',
                tags: ['旅行', '自由', '寻找']
            },
            {
                id: 'wd_book_3',
                type: 'book',
                title: '小王子',
                author: '圣埃克苏佩里',
                description: '关于爱与责任的寓言，帮助你理解真正的归属是什么。',
                link: 'https://book.douban.com/subject/1084336/',
                tags: ['爱', '责任', '归属']
            },
            {
                id: 'wd_article_1',
                type: 'article',
                title: '为什么我们总是想要逃离',
                source: 'KnowYourself',
                description: '解析漫游背后的心理需求，以及如何找到内心的归属感。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['逃离', '归属', '内心']
            },
            {
                id: 'wd_video_1',
                type: 'video',
                title: 'TED：归属感的力量',
                platform: 'TED',
                description: '布琳·布朗讲述归属感的科学，以及如何在差异中找到连接。',
                link: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
                tags: ['TED', '归属', '连接']
            }
        ]
    },

    // 战士 - 选择战斗，学会柔软
    warrior: {
        archetypeId: 'warrior',
        archetypeName: '战士',
        archetypeIcon: '⚔️',
        growthTheme: '从对抗一切到选择战斗',
        resources: [
            {
                id: 'wr_book_1',
                type: 'book',
                title: '非暴力沟通',
                author: '马歇尔·卢森堡',
                description: '战斗不是唯一的选择。学习用同理心连接，而不是用攻击防御。',
                link: 'https://book.douban.com/subject/3533221/',
                tags: ['非暴力', '沟通', '同理心']
            },
            {
                id: 'wr_book_2',
                type: 'book',
                title: '情绪急救',
                author: '盖伊·温奇',
                description: '学习处理情绪创伤的方法，理解愤怒背后的脆弱。',
                link: 'https://book.douban.com/subject/26831789/',
                tags: ['情绪', '创伤', '疗愈']
            },
            {
                id: 'wr_book_3',
                type: 'book',
                title: '道德经',
                author: '老子',
                description: '"柔弱胜刚强"，古老的智慧教你如何以柔克刚。',
                link: 'https://book.douban.com/subject/1029350/',
                tags: ['道家', '柔弱', '智慧']
            },
            {
                id: 'wr_article_1',
                type: 'article',
                title: '愤怒背后的心理需求',
                source: '简单心理',
                description: '理解愤怒是次级情绪，探索背后的恐惧和脆弱。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['愤怒', '情绪', '脆弱']
            },
            {
                id: 'wr_video_1',
                type: 'video',
                title: 'TED：为什么我们会生气',
                platform: 'TED',
                description: '瑞恩·马丁讲述愤怒的心理学，以及如何健康地表达愤怒。',
                link: 'https://www.ted.com/talks/ryan_martin_why_we_get_mad',
                tags: ['TED', '愤怒', '情绪']
            }
        ]
    },

    // 治愈者 - 自我关怀，平衡付出
    healer: {
        archetypeId: 'healer',
        archetypeName: '治愈者',
        archetypeIcon: '💚',
        growthTheme: '从治愈他人到治愈自己',
        resources: [
            {
                id: 'hl_book_1',
                type: 'book',
                title: '身体从未忘记',
                author: '巴塞尔·范德考克',
                description: '创伤治疗的经典之作，理解身心连接，学习自我疗愈的方法。',
                link: 'https://book.douban.com/subject/26831789/',
                tags: ['创伤', '疗愈', '身心']
            },
            {
                id: 'hl_book_2',
                type: 'book',
                title: '正念的奇迹',
                author: '一行禅师',
                description: '正念是治愈的基础。学习在呼吸间找到平静和力量。',
                link: 'https://book.douban.com/subject/25846938/',
                tags: ['正念', '冥想', '平静']
            },
            {
                id: 'hl_book_3',
                type: 'book',
                title: '创伤与复原',
                author: '朱迪思·赫尔曼',
                description: '创伤治疗的权威著作，理解治愈的过程，学会照顾自己。',
                link: 'https://book.douban.com/subject/26831789/',
                tags: ['创伤', '复原', '治疗']
            },
            {
                id: 'hl_article_1',
                type: 'article',
                title: '助人者的自我照顾指南',
                source: 'KnowYourself',
                description: '为心理咨询师、社工等助人者提供的自我关怀建议。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['助人者', '自我照顾', '职业耗竭']
            },
            {
                id: 'hl_podcast_1',
                type: 'podcast',
                title: '冥想：每日正念练习',
                platform: '小宇宙',
                description: '引导式冥想，帮助你在忙碌中找到内心的平静。',
                link: 'https://www.xiaoyuzhoufm.com/episode/xxxxx',
                tags: ['冥想', '正念', '平静']
            }
        ]
    },

    // 观察者 - 投入生活，感受当下
    observer: {
        archetypeId: 'observer',
        archetypeName: '观察者',
        archetypeIcon: '👁️',
        growthTheme: '从旁观生活到投入生活',
        resources: [
            {
                id: 'ob_book_1',
                type: 'book',
                title: '心流',
                author: '米哈里·契克森米哈赖',
                description: '最优体验心理学，学习如何全身心投入，在专注中找到满足。',
                link: 'https://book.douban.com/subject/25782902/',
                tags: ['心流', '专注', '投入']
            },
            {
                id: 'ob_book_2',
                type: 'book',
                title: '当下的力量',
                author: '埃克哈特·托利',
                description: '停止过度思考，投入当下的生活。此刻就是你所拥有的一切。',
                link: 'https://book.douban.com/subject/25846938/',
                tags: ['当下', '正念', '存在']
            },
            {
                id: 'ob_book_3',
                type: 'book',
                title: '体验派表演',
                author: '李·斯特拉斯伯格',
                description: '表演艺术的精髓是真实体验，生活也是如此。投入其中，而非旁观。',
                link: 'https://book.douban.com/subject/30270618/',
                tags: ['表演', '体验', '投入']
            },
            {
                id: 'ob_article_1',
                type: 'article',
                title: '为什么我们总是旁观者',
                source: 'KnowYourself',
                description: '解析旁观者心态的心理根源，以及如何勇敢地投入生活。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['旁观者', '投入', '勇气']
            },
            {
                id: 'ob_video_1',
                type: 'video',
                title: 'TED：如何活在当下',
                platform: 'TED',
                description: '学习正念技巧，停止过度思考，真正体验生活。',
                link: 'https://www.ted.com/talks/andy_puddicombe_all_it_takes_is_10_mindful_minutes',
                tags: ['TED', '正念', '当下']
            }
        ]
    },

    // 觉醒者 - 持续成长，帮助他人
    awakened: {
        archetypeId: 'awakened',
        archetypeName: '觉醒者',
        archetypeIcon: '🌟',
        growthTheme: '从个人成长到影响他人',
        resources: [
            {
                id: 'aw_book_1',
                type: 'book',
                title: '人类简史',
                author: '尤瓦尔·赫拉利',
                description: '从宏观视角理解人类，帮助你在个人成长中找到更大的意义。',
                link: 'https://book.douban.com/subject/25904508/',
                tags: ['人类', '历史', '意义']
            },
            {
                id: 'aw_book_2',
                type: 'book',
                title: '心',
                author: '夏目漱石',
                description: '关于人性、道德和自我觉醒的经典日本文学。',
                link: 'https://book.douban.com/subject/1029350/',
                tags: ['人性', '道德', '觉醒']
            },
            {
                id: 'aw_book_3',
                type: 'book',
                title: '给予者',
                author: '亚当·格兰特',
                description: '如何在帮助他人的同时实现自我成功，建立双赢的关系模式。',
                link: 'https://book.douban.com/subject/26831789/',
                tags: ['给予', '成功', '关系']
            },
            {
                id: 'aw_article_1',
                type: 'article',
                title: '如何在帮助他人的同时不迷失自己',
                source: 'KnowYourself',
                description: '为觉醒者提供的平衡建议，在影响他人的同时保持自我。',
                link: 'https://mp.weixin.qq.com/s/xxxxx',
                tags: ['助人', '自我', '平衡']
            },
            {
                id: 'aw_video_1',
                type: 'video',
                title: 'TED：如何成为一个更好的助人者',
                platform: 'TED',
                description: '学习有效的助人方法，让你的善意产生真正的影响。',
                link: 'https://www.ted.com/talks/xxxxx',
                tags: ['TED', '助人', '影响']
            }
        ]
    }
};

// ==================== 通用资源推荐 ====================
const GENERAL_RESOURCES = {
    name: '通用成长资源',
    description: '适合所有原型的成长资源',
    resources: [
        {
            id: 'gen_book_1',
            type: 'book',
            title: '了不起的我',
            author: '陈海贤',
            description: '自我发展心理学，帮助你理解改变的过程，走出心理舒适区。',
            link: 'https://book.douban.com/subject/34836531/',
            tags: ['自我发展', '改变', '心理学']
        },
        {
            id: 'gen_book_2',
            type: 'book',
            title: '蛤蟆先生去看心理医生',
            author: '罗伯特·戴博德',
            description: '用童话的方式讲述心理咨询的过程，帮助你理解自己的情绪和行为模式。',
            link: 'https://book.douban.com/subject/35143787/',
            tags: ['心理咨询', '情绪', '成长']
        },
        {
            id: 'gen_book_3',
            type: 'book',
            title: '思考，快与慢',
            author: '丹尼尔·卡尼曼',
            description: '诺贝尔经济学奖得主的心理学巨著，理解人类思维的两种模式。',
            link: 'https://book.douban.com/subject/10785583/',
            tags: ['思维', '心理学', '决策']
        },
        {
            id: 'gen_podcast_1',
            type: 'podcast',
            title: '忽左忽右',
            platform: '小宇宙',
            description: '高质量的泛文化播客，拓宽视野，理解多元观点。',
            link: 'https://www.xiaoyuzhoufm.com/podcast/xxxxx',
            tags: ['文化', '社会', '思考']
        },
        {
            id: 'gen_podcast_2',
            type: 'podcast',
            title: '随机波动',
            platform: '小宇宙',
            description: '三位女性媒体人主持的文化类播客，探讨社会、性别、心理等话题。',
            link: 'https://www.xiaoyuzhoufm.com/podcast/xxxxx',
            tags: ['女性', '社会', '文化']
        }
    ]
};

// ==================== 服务类 ====================
const ResourceService = {
    // 获取所有资源类型
    getResourceTypes() {
        return RESOURCE_TYPES;
    },

    // 获取特定原型的资源
    getResourcesByArchetype(archetypeId) {
        return ARCHETYPE_RESOURCES[archetypeId] || null;
    },

    // 获取所有原型资源
    getAllArchetypeResources() {
        return Object.values(ARCHETYPE_RESOURCES);
    },

    // 获取通用资源
    getGeneralResources() {
        return GENERAL_RESOURCES;
    },

    // 按类型筛选资源
    filterByType(resources, type) {
        if (!type || type === 'all') return resources;
        return resources.filter(r => r.type === type);
    },

    // 按标签筛选资源
    filterByTag(resources, tag) {
        if (!tag) return resources;
        return resources.filter(r => r.tags && r.tags.includes(tag));
    },

    // 搜索资源
    searchResources(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        // 搜索原型资源
        Object.values(ARCHETYPE_RESOURCES).forEach(archetypeData => {
            const matched = archetypeData.resources.filter(r => 
                r.title.toLowerCase().includes(lowerQuery) ||
                r.author?.toLowerCase().includes(lowerQuery) ||
                r.description.toLowerCase().includes(lowerQuery) ||
                r.tags?.some(t => t.toLowerCase().includes(lowerQuery))
            );
            if (matched.length > 0) {
                results.push({
                    archetype: archetypeData,
                    resources: matched
                });
            }
        });

        // 搜索通用资源
        const generalMatched = GENERAL_RESOURCES.resources.filter(r =>
            r.title.toLowerCase().includes(lowerQuery) ||
            r.author?.toLowerCase().includes(lowerQuery) ||
            r.description.toLowerCase().includes(lowerQuery) ||
            r.tags?.some(t => t.toLowerCase().includes(lowerQuery))
        );
        if (generalMatched.length > 0) {
            results.push({
                archetype: { archetypeName: '通用资源', archetypeIcon: '📚' },
                resources: generalMatched
            });
        }

        return results;
    },

    // 获取所有标签
    getAllTags() {
        const tags = new Set();
        Object.values(ARCHETYPE_RESOURCES).forEach(archetypeData => {
            archetypeData.resources.forEach(r => {
                r.tags?.forEach(t => tags.add(t));
            });
        });
        GENERAL_RESOURCES.resources.forEach(r => {
            r.tags?.forEach(t => tags.add(t));
        });
        return Array.from(tags).sort();
    },

    // 获取推荐资源（基于用户的原型）
    getRecommendedResources(userArchetypeId, limit = 5) {
        const resources = [];
        
        // 优先获取用户原型的资源
        const userArchetype = ARCHETYPE_RESOURCES[userArchetypeId];
        if (userArchetype) {
            resources.push(...userArchetype.resources.slice(0, 3));
        }

        // 补充通用资源
        const general = GENERAL_RESOURCES.resources.slice(0, limit - resources.length);
        resources.push(...general);

        return resources;
    }
};

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RESOURCE_TYPES,
        ARCHETYPE_RESOURCES,
        GENERAL_RESOURCES,
        ResourceService
    };
}

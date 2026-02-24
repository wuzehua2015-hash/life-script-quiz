/**
 * 人生剧本测试 - 优化版数据文件
 * 包含详细4维解读、具体配角分析、日常场景代入
 */

// 四个维度的类型定义
const DIMENSIONS = {
    drive: {
        name: "核心驱动力",
        description: "你做事的底层动力是什么？",
        types: {
            achievement: { name: "成就型", desc: "追求卓越、证明自我价值" },
            relationship: { name: "关系型", desc: "渴望连接、害怕被抛弃" },
            security: { name: "安全型", desc: "规避风险、追求稳定" },
            unique: { name: "独特型", desc: "追求与众不同、害怕平庸" },
            service: { name: "服务型", desc: "通过帮助他人获得价值感" }
        }
    },
    world: {
        name: "与世界的关系",
        description: "你如何看待外部世界？",
        types: {
            battle: { name: "战斗型", desc: "世界是战场，必须不断战斗" },
            victim: { name: "受害者型", desc: "世界不公平，我总是被伤害" },
            cooperation: { name: "合作型", desc: "世界可以共赢，需要连接" },
            detachment: { name: "疏离型", desc: "世界与我无关，保持距离" },
            control: { name: "控制型", desc: "世界需要规划，掌控才有安全感" }
        }
    },
    self: {
        name: "与自我的关系",
        description: "你如何看待自己？",
        types: {
            perfection: { name: "完美型", desc: "对自己苛刻，永不满足" },
            inferiority: { name: "自卑型", desc: "觉得自己不够好，需要被认可" },
            narcissism: { name: "自恋型", desc: "需要被关注，害怕被忽视" },
            authenticity: { name: "真实型", desc: "接纳真实的自己" },
            lost: { name: "迷失型", desc: "不清楚自己是谁，想要什么" }
        }
    },
    time: {
        name: "与时间的关系",
        description: "你如何看待人生进程？",
        types: {
            chasing: { name: "追赶型", desc: "时间不够用，必须不断追赶" },
            stagnation: { name: "停滞型", desc: "人生就这样了，很难改变" },
            exploration: { name: "探索型", desc: "人生是旅程，享受过程" },
            fate: { name: "宿命型", desc: "听天由命，顺其自然" },
            creation: { name: "创造型", desc: "未来由我决定，主动创造" }
        }
    }
};

// 维度类型中文名映射
const DIMENSION_TYPE_NAMES = {
    drive: { achievement: "成就", relationship: "关系", security: "安全", unique: "独特", service: "服务" },
    world: { battle: "战斗", victim: "受害者", cooperation: "合作", detachment: "疏离", control: "控制" },
    self: { perfection: "完美", inferiority: "自卑", narcissism: "自恋", authenticity: "真实", lost: "迷失" },
    time: { chasing: "追赶", stagnation: "停滞", exploration: "探索", fate: "宿命", creation: "创造" }
};

// 12题剧本杀风格问答
const QUESTIONS = [
    // 维度一：核心驱动力 (3题)
    {
        id: 1,
        dimension: "drive",
        location: "INT. 深夜办公室 - 23:00",
        dialogue: [
            { character: "你", line: "终于改完第18版方案了..." },
            { character: "同事", line: "走吧，一起去吃宵夜？" },
            { character: "你", line: "（看着手机里的未读消息）" }
        ],
        narration: "你连续加班两周，身体已经很疲惫。此刻，什么念头最强烈？",
        choices: [
            { text: "这个项目必须完美，否则之前的努力都白费了", type: "achievement", score: 2 },
            { text: "同事邀请我，不去的话会不会显得不合群？", type: "relationship", score: 2 },
            { text: "还是回家吧，熬夜太伤身体了", type: "security", score: 2 },
            { text: "这种重复性工作真无聊，我想做点不一样的", type: "unique", score: 2 },
            { text: "团队还在奋斗，我怎么能先走", type: "service", score: 2 }
        ]
    },
    {
        id: 2,
        dimension: "drive",
        location: "INT. 春节家庭聚会 - 客厅",
        dialogue: [
            { character: "亲戚A", line: "小明现在月薪多少啊？" },
            { character: "亲戚B", line: "我家孩子刚买了第三套房" },
            { character: "你", line: "（感受到所有人的目光）" }
        ],
        narration: "面对亲戚们的「关心」，你内心真实的反应是？",
        choices: [
            { text: "我要更努力，下次让他们刮目相看", type: "achievement", score: 2 },
            { text: "好尴尬，希望有人能帮我解围", type: "relationship", score: 2 },
            { text: "随便应付一下，反正我不在乎他们的评价", type: "security", score: 2 },
            { text: "这种攀比真低级，我有自己的追求", type: "unique", score: 2 },
            { text: "换个话题吧，问问长辈身体怎么样", type: "service", score: 2 }
        ]
    },
    {
        id: 3,
        dimension: "drive",
        location: "INT. 心理咨询室 - 午后",
        dialogue: [
            { character: "咨询师", line: "如果可以放下一切，你最想成为什么样的人？" },
            { character: "你", line: "（沉默良久）" }
        ],
        narration: "这个问题触动了你内心最深处的渴望...",
        choices: [
            { text: "成为一个被认可、有成就的人", type: "achievement", score: 2 },
            { text: "被很多人爱着，有温暖的关系", type: "relationship", score: 2 },
            { text: "过着安稳、没有波澜的生活", type: "security", score: 2 },
            { text: "做一个与众不同、活出自我的人", type: "unique", score: 2 },
            { text: "能够帮助他人、让世界更好的人", type: "service", score: 2 }
        ]
    },

    // 维度二：与世界的关系 (3题)
    {
        id: 4,
        dimension: "world",
        location: "INT. 公司会议室 - 上午",
        dialogue: [
            { character: "上司", line: "这个项目竞争很激烈，你们组能拿下吗？" },
            { character: "同事", line: "听说对手公司也在争取..." },
            { character: "你", line: "（看着项目资料）" }
        ],
        narration: "面对职场竞争，你的第一反应是？",
        choices: [
            { text: "来啊，谁怕谁，我一定要赢", type: "battle", score: 2 },
            { text: "为什么总是这么难，感觉要被压垮了", type: "victim", score: 2 },
            { text: "看看能不能找到双赢的方案", type: "cooperation", score: 2 },
            { text: "职场竞争而已，跟我关系不大", type: "detachment", score: 2 },
            { text: "先制定详细计划，把每个环节控制住", type: "control", score: 2 }
        ]
    },
    {
        id: 5,
        dimension: "world",
        location: "EXT. 咖啡馆 - 傍晚",
        dialogue: [
            { character: "朋友", line: "我最近好倒霉，工作丢了，对象也分手了..." },
            { character: "你", line: "（看着朋友憔悴的脸）" }
        ],
        narration: "朋友向你倾诉不幸，你内心的反应是？",
        choices: [
            { text: "生活就是一场战斗，必须坚强面对", type: "battle", score: 2 },
            { text: "世界真的太不公平了，好人没好报", type: "victim", score: 2 },
            { text: "也许这是转机，我陪你一起想办法", type: "cooperation", score: 2 },
            { text: "每个人有每个人的命，我帮不了太多", type: "detachment", score: 2 },
            { text: "我们来分析一下问题出在哪里", type: "control", score: 2 }
        ]
    },
    {
        id: 6,
        dimension: "world",
        location: "INT. 卧室 - 深夜",
        dialogue: [
            { character: "你", line: "（辗转反侧，难以入眠）" },
            { character: "内心声音", line: "明天要发生的事，你能应对吗？" }
        ],
        narration: "面对未知的明天，你最真实的感受是？",
        choices: [
            { text: "不管发生什么，我都能战斗到底", type: "battle", score: 2 },
            { text: "总觉得会有不好的事情发生...", type: "victim", score: 2 },
            { text: "相信一切都会往好的方向发展", type: "cooperation", score: 2 },
            { text: "想那么多干嘛，明天再说", type: "detachment", score: 2 },
            { text: "我已经规划好了，应该没问题", type: "control", score: 2 }
        ]
    },

    // 维度三：与自我的关系 (3题)
    {
        id: 7,
        dimension: "self",
        location: "INT. 试衣间 - 商场",
        dialogue: [
            { character: "你", line: "（看着镜中的自己）" },
            { character: "内心声音", line: "这就是真实的我吗？" }
        ],
        narration: "面对镜子里的自己，你的第一反应是？",
        choices: [
            { text: "这里不够好，那里还需要改进", type: "perfection", score: 2 },
            { text: "为什么我总是不如别人", type: "inferiority", score: 2 },
            { text: "虽然不完美，但我还是挺优秀的", type: "narcissism", score: 2 },
            { text: "这就是我，有优点也有缺点", type: "authenticity", score: 2 },
            { text: "说实话，我不太确定我是谁", type: "lost", score: 2 }
        ]
    },
    {
        id: 8,
        dimension: "self",
        location: "INT. 生日派对 - 餐厅",
        dialogue: [
            { character: "朋友", line: "来，寿星许愿！" },
            { character: "你", line: "（闭上眼睛）" }
        ],
        narration: "生日许愿的时刻，你内心真正渴望的是？",
        choices: [
            { text: "成为一个完美无缺的人", type: "perfection", score: 2 },
            { text: "变得更优秀，让别人看得起我", type: "inferiority", score: 2 },
            { text: "被更多人认可和崇拜", type: "narcissism", score: 2 },
            { text: "接纳真实的自己，活出想要的人生", type: "authenticity", score: 2 },
            { text: "找到真正的自己，知道想要什么", type: "lost", score: 2 }
        ]
    },
    {
        id: 9,
        dimension: "self",
        location: "INT. 独处空间 - 周末",
        dialogue: [
            { character: "你", line: "（一个人待着，没有手机，没有打扰）" },
            { character: "内心声音", line: "此刻，你和自己相处得如何？" }
        ],
        narration: "完全独处的时刻，你的感受是？",
        choices: [
            { text: "还有很多事情没做，不能放松", type: "perfection", score: 2 },
            { text: "空虚，需要找点事情填满", type: "inferiority", score: 2 },
            { text: "享受这种独处的优越感", type: "narcissism", score: 2 },
            { text: "平静，和自己在一起很舒服", type: "authenticity", score: 2 },
            { text: "迷茫，不知道该做什么", type: "lost", score: 2 }
        ]
    },

    // 维度四：与时间的关系 (3题)
    {
        id: 10,
        dimension: "time",
        location: "INT. 同学聚会 - 包厢",
        dialogue: [
            { character: "老同学", line: "还记得我们当年的梦想吗？" },
            { character: "你", line: "（看着大家的变化）" }
        ],
        narration: "对比过去和现在，你的感受是？",
        choices: [
            { text: "时间不够用，我要追赶那些被浪费的年头", type: "chasing", score: 2 },
            { text: "人生就这样了，很难再有什么改变", type: "stagnation", score: 2 },
            { text: "每个阶段都有不同风景，挺有意思的", type: "exploration", score: 2 },
            { text: "命运自有安排，顺其自然就好", type: "fate", score: 2 },
            { text: "未来由我决定，我可以创造想要的人生", type: "creation", score: 2 }
        ]
    },
    {
        id: 11,
        dimension: "time",
        location: "INT. 医院走廊 - 下午",
        dialogue: [
            { character: "医生", line: "检查结果显示需要住院观察" },
            { character: "你", line: "（看着窗外）" }
        ],
        narration: "身体发出警报，被迫停下来，你的想法是？",
        choices: [
            { text: "完了，这会耽误我多少计划...", type: "chasing", score: 2 },
            { text: "果然，我这个人就是容易出问题", type: "stagnation", score: 2 },
            { text: "也许这是身体让我停下来休息的信号", type: "exploration", score: 2 },
            { text: "听天由命吧，该来的总会来", type: "fate", score: 2 },
            { text: "积极配合治疗，争取早日康复", type: "creation", score: 2 }
        ]
    },
    {
        id: 12,
        dimension: "time",
        location: "EXT. 跨年夜 - 天台",
        dialogue: [
            { character: "人群", line: "10、9、8..." },
            { character: "你", line: "（看着烟花绽放）" }
        ],
        narration: "新年钟声即将敲响，你对未来一年的期待是？",
        choices: [
            { text: "新的一年，必须比去年更成功", type: "chasing", score: 2 },
            { text: "年复一年，好像也没什么不同", type: "stagnation", score: 2 },
            { text: "不知道会发生什么，期待新的体验", type: "exploration", score: 2 },
            { text: "该来的会来，该走的会走", type: "fate", score: 2 },
            { text: "新的一年，我要创造不一样的故事", type: "creation", score: 2 }
        ]
    }
];

// 12种人设原型 - 优化版（详细4维解读、具体配角、日常场景）
const ARCHETYPES = {
    // 1. 孤勇者
    lone_hero: {
        name: "孤勇者",
        englishName: "Lone Hero",
        movieTitle: "《永不言败》",
        tagline: "「只有赢才能证明我活着」",
        dimensions: {
            drive: "achievement",
            world: "battle", 
            self: "perfection",
            time: "chasing"
        },
        dimensionAnalysis: {
            drive: "你的核心驱动力是「成就」。你做事的动力来自对卓越的追求，害怕失败，认为只有成功才能证明自己的价值。",
            world: "你与世界的关系是「战斗」。你把世界看作竞技场，人生就是一场接一场的战役，必须不断胜利才能生存。",
            self: "你与自我的关系是「完美」。你对自己极其苛刻，永远觉得自己还不够好，内心有一个永不满足的完美主义者。",
            time: "你与时间的关系是「追赶」。你总觉得时间不够用，必须不断奔跑，停下来就意味着落后和失败。"
        },
        dailyScenes: [
            "你是不是经常加班到很晚，即使工作已经完成了，也觉得自己还可以做得更好？",
            "你是不是很难接受失败，哪怕是很小的失误也会让你自责很久？",
            "你是不是觉得休息是浪费时间，看到别人在努力就会感到焦虑？",
            "你是不是很难向别人求助，觉得那意味着软弱和无能？"
        ],
        badMovie: {
            title: "《一个人的战场》",
            synopsis: "主角永远在战斗，从不停歇。每一次胜利都带来短暂的满足，然后立刻投入下一场战役。直到有一天，主角发现身边空无一人——所有的战友都已离开，所有的奖杯都已蒙尘。",
            symptoms: [
                "工作狂，难以放松",
                "把生活当成必须打赢的战役",
                "很难真正享受和休息",
                "关系因为「不够重要」而被忽视"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "高期待的施压者", desc: "他们的认可永远差一点点，让你觉得自己永远不够好" },
                    { name: "不理解但无奈的支持者", desc: "心疼你但不知道怎么帮你，只能默默担心" }
                ]
            },
            acquired: {
                role: "👥 后天配角（你吸引的人）",
                parts: [
                    { name: "朋友：被忽视的同行者", desc: "想靠近却总被你的忙碌推开，最后渐行渐远" },
                    { name: "亲密关系：仰望但无法亲近的伴侣", desc: "他们看到你发光，却触不到你的疲惫" },
                    { name: "同事：竞争对手或追随者", desc: "要么和你较劲，要么仰望你但无法平等交流" },
                    { name: "上司：欣赏但担忧的领导", desc: "认可你的能力，但担心你 burnout" }
                ]
            }
        },
        newScript: {
            title: "《胜利之外》",
            synopsis: "主角发现：人生不只有输赢。他开始学习享受过程，允许自己休息，发现原来战友的陪伴比奖杯更珍贵。",
            keyChanges: [
                "从「必须赢」到「可以享受过程」",
                "从「独自承担」到「允许被支持」",
                "从「永不满足」到「庆祝小胜利」"
            ]
        },
        actionPlan: [
            { icon: "🛑", text: "今天刻意做一件「无意义」的事，不评判自己" },
            { icon: "📞", text: "给一个很久没联系的朋友打电话，不谈工作" },
            { icon: "📝", text: "写下三件已经做得够好的事，贴在显眼处" },
            { icon: "🏃", text: "运动时不计时、不计距离，纯粹享受身体的感觉" }
        ]
    }
};

// 原型匹配规则（简化版，其余11个原型类似结构）
const ARCHETYPE_MATCHING_RULES = {
    lone_hero: { drive: "achievement", world: "battle", self: "perfection", time: "chasing" },
    pleaser: { drive: "relationship", world: "victim", self: "inferiority", time: "stagnation" },
    hermit: { drive: "security", world: "detachment", self: "authenticity", time: "exploration" },
    controller: { drive: "achievement", world: "control", self: "perfection", time: "chasing" },
    victim: { drive: "relationship", world: "victim", self: "inferiority", time: "stagnation" },
    performer: { drive: "unique", world: "narcissism", self: "perfection", time: "exploration" },
    savior: { drive: "service", world: "cooperation", self: "inferiority", time: "creation" },
    wanderer: { drive: "unique", world: "detachment", self: "lost", time: "exploration" },
    warrior: { drive: "achievement", world: "battle", self: "authenticity", time: "creation" },
    healer: { drive: "service", world: "cooperation", self: "authenticity", time: "creation" },
    observer: { drive: "security", world: "detachment", self: "authenticity", time: "exploration" },
    awakened: { drive: "unique", world: "cooperation", self: "authenticity", time: "creation" }
};

// 混合原型描述
const MIXED_ARCHETYPE_DESCRIPTIONS = {
    "lone_hero-warrior": "你拥有孤勇者的拼搏精神和战士的自我接纳。你在追求卓越的同时，也在学习如何享受过程。",
    "pleaser-healer": "你有讨好者的敏感和治愈者的温暖。你天生善于关怀他人，正在学习如何也关怀自己。",
    "hermit-observer": "你有隐士的谨慎和观察者的洞察。你喜欢深度而非广度，正在学习如何适度参与。",
    "controller-warrior": "你有控制狂的规划和战士的行动力。你善于掌控局面，正在学习何时该放手。",
    "performer-wanderer": "你有表演者的光芒和漫游者的自由。你追求独特体验，正在寻找真正的归属。",
    "savior-healer": "你有拯救者的付出和治愈者的智慧。你善于帮助他人，正在学习平衡给予和接受。",
    "victim-pleaser": "你有受害者的敏感和讨好者的付出。你经历过伤害，正在学习如何保护自己。"
};

// 导出数据
if (typeof window !== 'undefined') {
    window.QUIZ_DATA = {
        DIMENSIONS,
        QUESTIONS,
        ARCHETYPES,
        DIMENSION_TYPE_NAMES,
        ARCHETYPE_MATCHING_RULES,
        MIXED_ARCHETYPE_DESCRIPTIONS
    };
}
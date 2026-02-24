/**
 * 人生剧本测试 v2.0 - 数据文件
 * 包含80个影视/文学角色库、12种原型、匹配算法
 */

// ==================== 基础信息配置 ====================
const APP_CONFIG = {
    version: '2.0',
    versionName: '角色觉醒',
    totalCharacters: 80,
    totalArchetypes: 12
};

// ==================== 前置问题配置 ====================
const BASIC_QUESTIONS = [
    {
        id: 'gender',
        title: '选择你的性别',
        description: '这将帮助我们匹配更适合你的角色',
        options: [
            { value: 'male', label: '男', icon: '👨' },
            { value: 'female', label: '女', icon: '👩' },
            { value: 'other', label: '多元', icon: '🌈' }
        ]
    },
    {
        id: 'age',
        title: '选择你的年龄段',
        description: '不同年龄段有不同的角色共鸣',
        options: [
            { value: '18-25', label: '18-25岁', icon: '🌱' },
            { value: '26-35', label: '26-35岁', icon: '🌿' },
            { value: '36-45', label: '36-45岁', icon: '🌳' },
            { value: '46+', label: '46岁以上', icon: '🏔️' }
        ]
    },
    {
        id: 'career',
        title: '选择你的职业类型',
        description: '职业背景影响角色代入感',
        options: [
            { value: 'student', label: '学生', icon: '📚' },
            { value: 'newbie', label: '职场新人', icon: '💼' },
            { value: 'middle', label: '中层管理', icon: '📊' },
            { value: 'executive', label: '高管', icon: '👔' },
            { value: 'entrepreneur', label: '创业者', icon: '🚀' },
            { value: 'freelance', label: '自由职业', icon: '🎨' }
        ]
    },
    {
        id: 'life_stage',
        title: '当前人生阶段',
        description: '你在人生的哪个阶段？',
        options: [
            { value: 'studying', label: '求学阶段', icon: '🎓' },
            { value: 'working', label: '职场打拼', icon: '⚔️' },
            { value: 'stable', label: '事业稳定', icon: '⚖️' },
            { value: 'transition', label: '转型期', icon: '🔄' },
            { value: 'retired', label: '退休/休息', icon: '🍵' }
        ]
    }
];

// ==================== 四个维度的类型定义 ====================
const DIMENSIONS = {
    drive: {
        name: "核心驱动力",
        description: "你做事的底层动力是什么？",
        types: {
            achievement: { 
                name: "成就型", 
                shortDesc: "追求卓越、证明自我价值",
                fullDesc: "你的内心深处住着一个「永远不够好」的声音。只有达成目标、获得认可时，你才感到自己有价值。休息让你焦虑，放松让你内疚。你常常为了赢而忘记为什么出发。",
                dailyScene: "你是不是经常加班到很晚，即使工作完成了，也觉得自己还可以做得更好？失败对你来说像是一种身份否定，而不是简单的结果。"
            },
            relationship: { 
                name: "关系型", 
                shortDesc: "渴望连接、害怕被抛弃",
                fullDesc: "你做事的动力来自与他人的连接。被喜欢、被接纳是你最大的安全感来源。你常常为了维持关系而委屈自己，害怕冲突，害怕被孤立。",
                dailyScene: "你是不是经常优先考虑别人的感受，即使自己心里不愿意？别人的冷淡回复会让你胡思乱想很久。"
            },
            security: { 
                name: "安全型", 
                shortDesc: "规避风险、追求稳定",
                fullDesc: "你渴望稳定、可预期的生活。变化让你焦虑，未知让你恐惧。你倾向于选择熟悉但可能不够好的选项，因为「至少不会更糟」。",
                dailyScene: "你是不是宁愿待在熟悉但不满意的环境里，也不敢尝试新的可能？稳定对你来说比精彩更重要。"
            },
            unique: { 
                name: "独特型", 
                shortDesc: "追求与众不同、害怕平庸",
                fullDesc: "你害怕被淹没在人群中，渴望被看见、被记住。平凡对你来说像是一种死亡。你不断寻找自己的独特标签，有时候为了不同而不同。",
                dailyScene: "你是不是经常觉得「我和他们不一样」，即使在人群中也会感到孤独？你渴望被理解，但又害怕被完全看透。"
            },
            service: { 
                name: "服务型", 
                shortDesc: "通过帮助他人获得价值感",
                fullDesc: "你的价值感来自对他人的帮助。被需要让你感到存在有意义。你常常把别人的需求放在自己之前，直到精疲力竭。",
                dailyScene: "你是不是很难拒绝别人的求助，即使自己已经忙不过来了？帮助别人之后的感谢，是你最好的能量来源。"
            }
        }
    },
    world: {
        name: "与世界的关系",
        description: "你如何看待外部世界？",
        types: {
            battle: { 
                name: "战斗型", 
                shortDesc: "世界是战场，必须不断战斗",
                fullDesc: "你把世界看作竞技场，人生就是一场接一场的战役。放松警惕意味着被击败。你很难信任他人，总是处于戒备状态。",
                dailyScene: "你是不是经常感到紧张，觉得必须时刻准备应对挑战？即使没有人与你竞争，你也会给自己设定对手。"
            },
            victim: { 
                name: "受害者型", 
                shortDesc: "世界不公平，我总是被伤害",
                fullDesc: "你觉得世界对你不公平，好事轮不到你，坏事总是找上门。你感到无力改变现状，常常陷入「为什么是我」的抱怨。",
                dailyScene: "你是不是经常觉得「我运气不好」「好事从来轮不到我」？即使有机会，你也会怀疑「这不会是真的吧」。"
            },
            cooperation: { 
                name: "合作型", 
                shortDesc: "世界可以共赢，需要连接",
                fullDesc: "你相信世界足够大，可以容纳所有人的成功。你重视关系，相信通过合作可以创造更好的结果。冲突让你不安，你倾向于寻求共识。",
                dailyScene: "你是不是更喜欢团队合作，一个人单打独斗让你感到孤单？你常常是朋友间的和事佬。"
            },
            detachment: { 
                name: "疏离型", 
                shortDesc: "世界与我无关，保持距离",
                fullDesc: "你选择与世界保持一定距离。不参与、不卷入，这样就不会受伤。你习惯做一个旁观者，观察但不投入。",
                dailyScene: "你是不是经常觉得「这和我有什么关系」？群体活动让你感到消耗，独处才是你的充电方式。"
            },
            control: { 
                name: "控制型", 
                shortDesc: "世界需要规划，掌控才有安全感",
                fullDesc: "你相信凡事预则立，不预则废。未知和失控让你极度焦虑。你需要知道每一步的走向，讨厌 surprises。",
                dailyScene: "你是不是经常做计划，即使计划赶不上变化？临时变动会让你烦躁，你需要提前知道会发生什么。"
            }
        }
    },
    self: {
        name: "与自我的关系",
        description: "你如何看待自己？",
        types: {
            perfection: { 
                name: "完美型", 
                shortDesc: "对自己苛刻，永不满足",
                fullDesc: "你对自己有极高的标准，永远觉得自己还不够好。你不断鞭策自己，休息是奢侈，放松是堕落。你的内心住着一个严厉的批评者。",
                dailyScene: "你是不是经常对自己很苛刻，犯一点小错就会自责很久？你很难对自己满意，总觉得还可以更好。"
            },
            inferiority: { 
                name: "自卑型", 
                shortDesc: "觉得自己不够好，需要被认可",
                fullDesc: "你内心深处觉得自己不够好，需要外界的认可来证明自己的价值。你常常拿自己和别人比较，总是看到别人比自己强的地方。",
                dailyScene: "你是不是经常觉得自己不如别人？别人的赞美你会怀疑，但批评你会立刻相信。"
            },
            narcissism: { 
                name: "自恋型", 
                shortDesc: "需要被关注，害怕被忽视",
                fullDesc: "你需要被看见、被关注。被忽视对你来说像是一种惩罚。你习惯成为焦点，当注意力转移到别人身上时，你会感到失落。",
                dailyScene: "你是不是很在意别人的评价和关注？发朋友圈后是不是会反复看点赞数？"
            },
            authenticity: { 
                name: "真实型", 
                shortDesc: "接纳真实的自己",
                fullDesc: "你对自己有比较客观的认知，接纳自己的优点和缺点。你不会为了迎合别人而伪装自己，也不会对自己过于苛刻。",
                dailyScene: "你是不是比较接纳自己，不会为了别人的期待而勉强自己？你允许自己有缺点，也允许自己休息。"
            },
            lost: { 
                name: "迷失型", 
                shortDesc: "不清楚自己是谁，想要什么",
                fullDesc: "你不太确定自己是谁，想要什么。你可能一直在按照别人的期待生活，或者不断尝试不同的角色，但始终没有找到真正的自己。",
                dailyScene: "你是不是经常感到迷茫，不知道自己真正想要什么？你可能有很多选择，但没有一个让你感到「这就是我要的」。"
            }
        }
    },
    time: {
        name: "与时间的关系",
        description: "你如何看待人生进程？",
        types: {
            chasing: { 
                name: "追赶型", 
                shortDesc: "时间不够用，必须不断追赶",
                fullDesc: "你总觉得时间不够用，必须不断奔跑。停下来意味着落后，休息意味着被超越。你活在未来，很少享受当下。",
                dailyScene: "你是不是经常感到时间紧迫，即使完成了任务也觉得「还可以做更多」？你很难完全放松，总觉得还有事情没做。"
            },
            stagnation: { 
                name: "停滞型", 
                shortDesc: "人生就这样了，很难改变",
                fullDesc: "你觉得人生已经定型，很难再有大的改变。你可能有过梦想，但现在觉得「就这样吧」。你感到一种深深的无力感。",
                dailyScene: "你是不是经常觉得「人生就这样了」「改变太难了」？你可能有过很多想法，但都没有付诸行动。"
            },
            exploration: { 
                name: "探索型", 
                shortDesc: "人生是旅程，享受过程",
                fullDesc: "你把人生看作一场探索的旅程，重要的不是目的地，而是沿途的风景。你对新事物充满好奇，喜欢尝试不同的可能性。",
                dailyScene: "你是不是喜欢尝试新事物，不喜欢一成不变的生活？你对未知充满好奇，愿意为了体验而冒险。"
            },
            fate: { 
                name: "宿命型", 
                shortDesc: "听天由命，顺其自然",
                fullDesc: "你相信「命里有时终须有，命里无时莫强求」。你倾向于接受现状，而不是强行改变。你相信一切都有安排。",
                dailyScene: "你是不是比较顺其自然，相信「该来的会来，该走的会走」？你不会强求，也不会过度焦虑未来。"
            },
            creation: { 
                name: "创造型", 
                shortDesc: "未来由我决定，主动创造",
                fullDesc: "你相信未来是由自己创造的。你有明确的目标，并愿意为之付出努力。你相信只要努力，就可以改变现状。",
                dailyScene: "你是不是相信「命运掌握在自己手中」？你有明确的目标，并愿意为之付出持续的努力。"
            }
        }
    }
};

// ==================== 12题剧本杀风格问答 ====================
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
        location: "INT. 家庭聚会 - 周末",
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
        location: "INT. 心理咨询室 - 黄昏",
        dialogue: [
            { character: "咨询师", line: "如果可以放下一切，你最想成为什么样的人？" },
            { character: "你", line: "（沉默良久）" }
        ],
        narration: "抛开所有外界期待，你内心真正的渴望是？",
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
        narration: "面对激烈的竞争，你的第一反应是？",
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
        location: "EXT. 街角咖啡店 - 雨天",
        dialogue: [
            { character: "朋友", line: "我最近好倒霉，工作丢了，对象也分手了..." },
            { character: "你", line: "（看着朋友憔悴的脸）" }
        ],
        narration: "朋友向你倾诉不幸，这让你想到什么？",
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
        location: "INT. 深夜卧室 - 凌晨2点",
        dialogue: [
            { character: "你", line: "（辗转反侧，难以入眠）" },
            { character: "内心声音", line: "明天要发生的事，你能应对吗？" }
        ],
        narration: "面对未知的明天，你内心深处的感受是？",
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
        location: "INT. 浴室镜子前 - 早晨",
        dialogue: [
            { character: "你", line: "（看着镜中的自己）" },
            { character: "内心声音", line: "这就是真实的我吗？" }
        ],
        narration: "当你凝视镜中的自己，最常出现的念头是？",
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
        location: "INT. 生日派对 - 晚上",
        dialogue: [
            { character: "朋友", line: "来，寿星许愿！" },
            { character: "你", line: "（闭上眼睛）" }
        ],
        narration: "如果只能许一个关于自己的愿望，你会希望？",
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
        location: "INT. 独处时刻 - 深夜",
        dialogue: [
            { character: "你", line: "（一个人待着，没有手机，没有打扰）" },
            { character: "内心声音", line: "此刻，你和自己相处得如何？" }
        ],
        narration: "独处时，你最能感受到的是？",
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
        location: "INT. 老同学聚会 - 周末",
        dialogue: [
            { character: "老同学", line: "还记得我们当年的梦想吗？" },
            { character: "你", line: "（看着大家的变化）" }
        ],
        narration: "对比过去，你现在对人生的感受是？",
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
        narration: "面对突如其来的健康危机，你想到的是？",
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
        location: "INT. 跨年倒数现场 - 23:59",
        dialogue: [
            { character: "人群", line: "10、9、8..." },
            { character: "你", line: "（看着烟花绽放）" }
        ],
        narration: "新年钟声敲响时，你对自己说的是？",
        choices: [
            { text: "新的一年，必须比去年更成功", type: "chasing", score: 2 },
            { text: "年复一年，好像也没什么不同", type: "stagnation", score: 2 },
            { text: "不知道会发生什么，期待新的体验", type: "exploration", score: 2 },
            { text: "该来的会来，该走的会走", type: "fate", score: 2 },
            { text: "新的一年，我要创造不一样的故事", type: "creation", score: 2 }
        ]
    }
];

// ==================== 80个影视/文学角色库 ====================
const CHARACTER_LIBRARY = {
    // 孤勇者 (Lone Hero) - 8个角色
    lone_hero: [
        // 国产剧
        { name: "安欣", work: "《狂飙》", gender: ["male"], age: ["26-35", "36-45"], career: ["newbie", "middle"], stage: ["working"], 
          quote: "我无亲无故，敢跟他耗一辈子。", 
          similarity: ["坚持正义", "孤独前行", "不向黑暗妥协", "内心坚定"],
          story: "从意气风发的年轻刑警到满头白发的边缘警察，安欣用20年时间坚守正义，即使被孤立、被边缘化，也从未放弃对真相的追寻。",
          advice: "像安欣一样坚持信念很可贵，但也要学会保护自己，找到并肩作战的伙伴。",
          imageKeyword: "安欣 狂飙 张译" },
        { name: "梅长苏", work: "《琅琊榜》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle", "executive"], stage: ["working", "transition"],
          quote: "既然我活了下来，就不会白白活着。",
          similarity: ["背负使命", "隐忍不发", "智计无双", "孤注一掷"],
          story: "身中火寒之毒，改头换面，以病弱之躯搅动朝堂风云，只为平反赤焰冤案。他是谋士，也是复仇者。",
          advice: "梅长苏的智慧值得学习，但不要像他一样燃烧自己，记得留一些温暖给自己。",
          imageKeyword: "梅长苏 琅琊榜 胡歌" },
        { name: "甄嬛", work: "《甄嬛传》", gender: ["female"], age: ["18-25", "26-35", "36-45"], career: ["newbie", "middle", "executive"], stage: ["working", "stable"],
          quote: "刚入宫的甄嬛已经死了，皇上你忘了，是您亲手杀了她。",
          similarity: ["浴火重生", "步步为营", "从纯真到成熟", "独自战斗"],
          story: "从天真烂漫的莞嫔到权倾后宫的太后，甄嬛在宫廷斗争中失去了爱情、友情，最终赢得了权力，却失去了最初的自己。",
          advice: "甄嬛的蜕变让人心疼，成长不一定要以失去纯真为代价，记得保留内心柔软的部分。",
          imageKeyword: "甄嬛 孙俪" },
        // 美剧
        { name: "Tony Stark", work: "《钢铁侠》", gender: ["male"], age: ["26-35", "36-45"], career: ["executive", "entrepreneur"], stage: ["working", "stable"],
          quote: "I am Iron Man.",
          similarity: ["天才自负", "独自承担", "用成就证明自己", "内心孤独"],
          story: "天才发明家、亿万富翁、花花公子、慈善家，Tony Stark用盔甲保护自己脆弱的心，最终为保护世界牺牲自己。",
          advice: "像Tony一样承担责任很伟大，但也要学会依靠他人，你不是一个人在战斗。",
          imageKeyword: "Iron Man Tony Stark" },
        { name: "Walter White", work: "《绝命毒师》", gender: ["male"], age: ["46+"], career: ["middle"], stage: ["transition"],
          quote: "I am the one who knocks!",
          similarity: ["被低估的才华", "渴望认可", "一步步走向黑暗", "证明自己"],
          story: "高中化学老师，身患绝症后制毒养家，从一个老实人变成毒枭Heisenberg，最终被自己的野心吞噬。",
          advice: "Walter的悲剧在于被自尊蒙蔽，才华不需要通过伤害他人来证明，找到健康的出口。",
          imageKeyword: "Walter White Breaking Bad" },
        // 电影
        { name: "安迪", work: "《肖申克的救赎》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle", "executive"], stage: ["working", "transition"],
          quote: "希望是美好的，也许是人间至善，而美好的事物永不消逝。",
          similarity: ["不屈不挠", "坚持希望", "智慧求生", "孤独但坚定"],
          story: "被冤枉入狱的银行家，用19年时间挖地道越狱，在绝望的环境中始终保持希望和尊严。",
          advice: "安迪的希望让人动容，但自由需要行动，不要只是等待，要为自己创造机会。",
          imageKeyword: "Andy Shawshank Redemption" },
        { name: "程蝶衣", work: "《霸王别姬》", gender: ["male"], age: ["26-35", "36-45", "46+"], career: ["freelance"], stage: ["working", "stable", "transition"],
          quote: "不疯魔，不成活。",
          similarity: ["极致追求", "不疯魔不成活", "为艺术献身", "孤独执着"],
          story: "京剧名角，人戏不分，对艺术的极致追求让他分不清戏里戏外，最终为霸王别姬的虞姬画上句号。",
          advice: "蝶衣的专注令人敬佩，但艺术和生活需要平衡，不要让自己完全消失在角色中。",
          imageKeyword: "程蝶衣 张国荣 霸王别姬" },
        // 文学
        { name: "孙少安", work: "《平凡的世界》", gender: ["male"], age: ["18-25", "26-35", "36-45"], career: ["entrepreneur", "middle"], stage: ["working", "stable"],
          quote: "人的一生总应有一次为了理想而奋不顾身的时候。",
          similarity: ["艰苦奋斗", "不屈不挠", "为家人拼搏", "独自承担"],
          story: "农村青年，在贫困和挫折中奋斗，从生产队长到砖厂老板，用汗水改变命运，却永远失去了最爱的人。",
          advice: "少安的奋斗精神值得学习，但也要允许自己休息，成功不是人生的全部。",
          imageKeyword: "平凡的世界 孙少安" }
    ],

    // 讨好者 (Pleaser) - 7个角色
    pleaser: [
        // 国产剧
        { name: "樊胜美", work: "《欢乐颂》", gender: ["female"], age: ["26-35", "36-45"], career: ["middle"], stage: ["working"],
          quote: "我樊胜美，一个人在上海打拼，容易吗我？",
          similarity: ["被家庭索取", "渴望被爱", "委屈求全", "自我价值感低"],
          story: "外企HR，外表光鲜，却被原生家庭不断索取，为了得到父母的认可不断付出，却始终得不到真正的爱。",
          advice: "樊胜美的困境在于把付出当筹码，真正的爱不需要交换，学会先爱自己。",
          imageKeyword: "樊胜美 欢乐颂" },
        { name: "苏明玉", work: "《都挺好》", gender: ["female"], age: ["26-35", "36-45"], career: ["executive"], stage: ["working", "stable"],
          quote: "我努力了这么多年，就是为了不再像小时候那样看人脸色。",
          similarity: ["原生家庭创伤", "渴望认可", "用成功证明价值", "内心脆弱"],
          story: "从小被母亲嫌弃的女儿，靠自己的努力成为金领，却始终无法摆脱原生家庭的阴影，直到学会与过去和解。",
          advice: "明玉的坚强是盔甲，真正的强大是允许自己脆弱，不需要一直证明什么。",
          imageKeyword: "苏明玉 都挺好 姚晨" },
        // 美剧
        { name: "Monica Geller", work: "《老友记》", gender: ["female"], age: ["18-25", "26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "I know!",
          similarity: ["追求完美", "需要被认可", "控制欲强", "渴望被爱"],
          story: "曾经的胖女孩，长大后变成完美主义者，用 hostess 的热情和厨艺来维系友谊，渴望被需要和认可。",
          advice: "Monica的热情很珍贵，但不需要通过付出来换取爱，你的存在本身就值得被爱。",
          imageKeyword: "Monica Friends" },
        // 电影
        { name: "松子", work: "《被嫌弃的松子的一生》", gender: ["female"], age: ["18-25", "26-35", "36-45"], career: ["newbie", "middle"], stage: ["working", "transition"],
          quote: "生而为人，我很抱歉。",
          similarity: ["极度渴望爱", "不断讨好", "被伤害仍不放弃", "自我价值感极低"],
          story: "一生都在寻找爱的女人，不断讨好男人，不断被伤害，最终在孤独中死去，一生都在说对不起。",
          advice: "松子的悲剧在于把爱的希望寄托在他人身上，请先学会爱自己，你值得被好好对待。",
          imageKeyword: "被嫌弃的松子的一生" },
        // 文学
        { name: "林黛玉", work: "《红楼梦》", gender: ["female"], age: ["18-25"], career: ["student"], stage: ["studying"],
          quote: "一年三百六十日，风刀霜剑严相逼。",
          similarity: ["敏感多疑", "渴望被理解", "用眼泪表达", "害怕被抛弃"],
          story: "寄人篱下的孤女，才华横溢却体弱多病，深爱着贾宝玉却不敢表达，最终在宝玉大婚之夜泪尽而逝。",
          advice: "黛玉的敏感是天赋，但不要让敏感变成自我折磨，学会表达需求，而不是等待被猜中。",
          imageKeyword: "林黛玉 红楼梦" },
        { name: "祥子", work: "《骆驼祥子》", gender: ["male"], age: ["18-25", "26-35"], career: ["freelance"], stage: ["working"],
          quote: "他没有什么模样，但他可爱的是脸上的精神。",
          similarity: ["老实本分", "努力生活", "被命运打击", "逐渐失去希望"],
          story: "北平人力车夫，梦想拥有一辆自己的车，三次买车三次失去，最终被生活压垮，从勤劳善良变成行尸走肉。",
          advice: "祥子的悲剧是时代的悲剧，但在任何时代，都请保留内心的光，不要让环境完全定义你。",
          imageKeyword: "骆驼祥子" },
        { name: "许三观", work: "《许三观卖血记》", gender: ["male"], age: ["26-35", "36-45", "46+"], career: ["middle", "freelance"], stage: ["working", "stable"],
          quote: "力气这东西，和钱不一样，钱是越用越少，力气是越用越多。",
          similarity: ["为家庭牺牲", "默默付出", "用身体换生存", "责任感强"],
          story: "丝厂工人，用卖血度过人生难关，为家庭、为孩子一次次卖血，体现了底层人的坚韧与无奈。",
          advice: "许三观的责任感令人敬佩，但付出要有底线，你的身体和健康同样重要。",
          imageKeyword: "许三观卖血记" }
    ],

    // 隐士 (Hermit) - 7个角色
    hermit: [
        // 国产剧
        { name: "叶文洁", work: "《三体》", gender: ["female"], age: ["18-25", "26-35", "36-45", "46+"], career: ["middle", "executive"], stage: ["working", "stable", "transition"],
          quote: "到这里来吧，我将帮助你们获得这个世界。",
          similarity: ["对人类失望", "选择孤独", "理性冷静", "与世界疏离"],
          story: "天体物理学家，因文革创伤对人类文明失望，向三体文明发送信号，成为地球三体组织的统帅，在孤独中等待救赎。",
          advice: "叶文洁的选择源于创伤，但封闭自己无法获得真正的平静，尝试打开心扉，世界没那么糟糕。",
          imageKeyword: "叶文洁 三体" },
        { name: "范闲", work: "《庆余年》", gender: ["male"], age: ["18-25", "26-35"], career: ["middle", "executive"], stage: ["working"],
          quote: "我想做个好人，但这个世界不让我做好人。",
          similarity: ["表面洒脱", "内心孤独", "与世俗保持距离", "渴望简单"],
          story: "穿越者范闲，拥有现代思想，在封建王朝中格格不入，表面玩世不恭，内心渴望公平正义，却始终无法真正融入。",
          advice: "范闲的孤独源于与众不同，但差异不是隔离的理由，找到同类，建立连接。",
          imageKeyword: "范闲 庆余年 张若昀" },
        // 美剧
        { name: "Sherlock Holmes", work: "《神探夏洛克》", gender: ["male"], age: ["26-35", "36-45"], career: ["freelance"], stage: ["working"],
          quote: "I'm a high-functioning sociopath.",
          similarity: ["天才孤独", "社交障碍", "沉浸在自己的世界", "拒绝情感"],
          story: "咨询侦探，智商超群但情商欠费，用推理逃避情感，在221B的公寓里与华生建立了一段特殊的友谊。",
          advice: "Sherlock的智慧令人钦佩，但情感不是弱点，允许自己需要他人，这是人性的一部分。",
          imageKeyword: "Sherlock Holmes Benedict Cumberbatch" },
        // 电影
        { name: "阿甘", work: "《阿甘正传》", gender: ["male"], age: ["18-25", "26-35", "36-45"], career: ["newbie", "middle"], stage: ["working", "stable"],
          quote: "生活就像一盒巧克力，你永远不知道下一颗是什么味道。",
          similarity: ["简单纯粹", "不与人争", "专注当下", "内心平静"],
          story: "智商只有75的男人，却经历了美国历史上最重要的时刻，用简单和真诚影响了身边的人，始终爱着珍妮。",
          advice: "阿甘的简单是智慧，保持内心的纯粹，但也不要害怕复杂，你有能力应对。",
          imageKeyword: "Forrest Gump Tom Hanks" },
        // 文学
        { name: "贾宝玉", work: "《红楼梦》", gender: ["male"], age: ["18-25"], career: ["student"], stage: ["studying"],
          quote: "女儿是水做的骨肉，男人是泥做的骨肉。",
          similarity: ["逃避世俗", "追求精神", "与主流价值观冲突", "敏感多情"],
          story: "荣国府的贵公子，厌恶仕途经济，在大观园中寻找精神家园，最终看破红尘，出家为僧。",
          advice: "宝玉的逃避无法解决问题，理想主义需要现实基础，学会在世俗中守护精神家园。",
          imageKeyword: "贾宝玉 红楼梦" },
        { name: "悉达多", work: "《悉达多》", gender: ["male"], age: ["18-25", "26-35", "36-45"], career: ["student", "freelance"], stage: ["studying", "working", "transition"],
          quote: "知识可以传授，但智慧不能。",
          similarity: ["寻求真理", "独自修行", "经历世间百态", "内心探索"],
          story: "古印度贵族青年，放弃一切寻求真理，经历了苦行、财富、欲望，最终在河边悟道，成为智者。",
          advice: "悉达多的旅程是每个人的旅程，但悟道不必远离尘世，在日常生活中也能找到智慧。",
          imageKeyword: "Siddhartha Hermann Hesse" },
        { name: "渡边", work: "《挪威的森林》", gender: ["male"], age: ["18-25"], career: ["student"], stage: ["studying"],
          quote: "死并非生的对立面，而是作为生的一部分永存。",
          similarity: ["内向敏感", "沉浸回忆", "与死亡相伴", "情感疏离"],
          story: "大学生渡边，在直子和绿子之间徘徊，沉浸在对死去好友木月的回忆中，在孤独中寻找活着的意义。",
          advice: "渡边的忧郁是青春的一部分，但不要沉溺于悲伤，活着的人要继续活下去，这是对死者最好的纪念。",
          imageKeyword: "挪威的森林 村上春树" }
    ],

    // 控制狂 (Controller) - 7个角色
    controller: [
        // 国产剧
        { name: "高启强", work: "《狂飙》", gender: ["male"], age: ["26-35", "36-45", "46+"], career: ["entrepreneur", "executive"], stage: ["working", "stable"],
          quote: "告诉老默，我想吃鱼了。",
          similarity: ["掌控全局", "步步为营", "从底层爬起", "控制欲强"],
          story: "从卖鱼小贩到京海黑老大，高启强用20年时间建立了自己的帝国，控制一切可以控制的人和事，最终被正义审判。",
          advice: "高启强的控制源于不安全感，但控制无法带来真正的安全，学会信任和放手。",
          imageKeyword: "高启强 狂飙 张颂文" },
        { name: "甄嬛（后期）", work: "《甄嬛传》", gender: ["female"], age: ["26-35", "36-45"], career: ["executive"], stage: ["working", "stable"],
          quote: "既然进宫，又岂能不争宠？既然争宠，又岂能不专宠？",
          similarity: ["精于算计", "掌控后宫", "步步为营", "控制局面"],
          story: "回宫后的甄嬛，不再是单纯的莞嫔，而是精于算计的熹贵妃，用智慧和手段控制后宫，最终成为太后。",
          advice: "甄嬛的蜕变是生存所需，但控制他人终将孤立自己，权力的巅峰往往是孤独的。",
          imageKeyword: "甄嬛 太后 孙俪" },
        // 美剧
        { name: "Cersei Lannister", work: "《权力的游戏》", gender: ["female"], age: ["26-35", "36-45", "46+"], career: ["executive"], stage: ["working", "stable"],
          quote: "When you play the game of thrones, you win or you die.",
          similarity: ["权力欲望", "控制一切", "不择手段", "偏执疯狂"],
          story: "兰尼斯特家族的长女，为了权力和保护孩子不择手段，最终登上铁王座，却在疯狂中走向毁灭。",
          advice: "Cersei的悲剧在于被权力蒙蔽，控制欲源于恐惧，真正的力量来自内心，而非权力。",
          imageKeyword: "Cersei Lannister Game of Thrones" },
        { name: "Gus Fring", work: "《绝命毒师》", gender: ["male"], age: ["36-45", "46+"], career: ["entrepreneur", "executive"], stage: ["stable"],
          quote: "I hide in plain sight, same as you.",
          similarity: ["表面完美", "精密控制", "复仇驱动", "冷酷无情"],
          story: "炸鸡店老板，实为毒枭，用20年时间精密策划复仇，控制新墨西哥州的毒品交易，最终被炸死。",
          advice: "Gus的控制令人恐惧，但复仇无法带来平静，放下执念才能获得真正的自由。",
          imageKeyword: "Gus Fring Breaking Bad" },
        // 电影
        { name: "汉尼拔", work: "《沉默的羔羊》", gender: ["male"], age: ["36-45", "46+"], career: ["executive"], stage: ["stable"],
          quote: "I do wish we could chat longer, but I'm having an old friend for dinner.",
          similarity: ["智商超群", "操控他人", "优雅冷酷", "掌控一切"],
          story: "精神病学家、食人魔，用心理学知识操控他人，即使在监狱中也能控制局面，是史上最迷人的反派之一。",
          advice: "汉尼拔的智慧被扭曲，控制他人是病态的，真正的强大是自我控制，而非控制他人。",
          imageKeyword: "Hannibal Lecter Anthony Hopkins" },
        // 文学
        { name: "王熙凤", work: "《红楼梦》", gender: ["female"], age: ["26-35", "36-45"], career: ["executive", "middle"], stage: ["working", "stable"],
          quote: "我是从来不信什么阴司地狱报应的，凭是什么事，我说要行就行。",
          similarity: ["精明强干", "控制欲强", "手段狠辣", "机关算尽"],
          story: "荣国府的管家奶奶，精明强干，控制贾府大小事务，用手段维护自己的地位，最终机关算尽太聪明，反算了卿卿性命。",
          advice: "凤姐的能力令人佩服，但控制欲过强会反噬自己，学会信任和授权，给自己留退路。",
          imageKeyword: "王熙凤 红楼梦" },
        { name: "麦克白夫人", work: "《麦克白》", gender: ["female"], age: ["26-35", "36-45"], career: ["executive"], stage: ["working", "stable"],
          quote: "Unsex me here, and fill me from the crown to the toe top-full of direst cruelty.",
          similarity: ["野心勃勃", "操控丈夫", "不择手段", "最终被罪恶吞噬"],
          story: "麦克白的妻子，野心勃勃，鼓动丈夫弑君篡位，最终被罪恶感逼疯，梦游中洗不净手上的血迹。",
          advice: "麦克白夫人的野心毁灭了一切，控制欲和野心需要道德底线，否则将自我毁灭。",
          imageKeyword: "Lady Macbeth Shakespeare" }
    ],

    // 受害者 (Victim) - 6个角色
    victim: [
        // 国产剧
        { name: "房似锦", work: "《安家》", gender: ["female"], age: ["26-35", "36-45"], career: ["middle", "executive"], stage: ["working"],
          quote: "我拼命工作，就是为了不再过那种日子。",
          similarity: ["原生家庭伤害", "努力摆脱", "被索取", "自我价值感低"],
          story: "房产中介店长，能力出众却被原生家庭不断索取，母亲像吸血鬼一样压榨她，让她始终无法摆脱过去的阴影。",
          advice: "房似锦的困境需要设立边界，你有权利说不，不需要为原生家庭的无底洞买单。",
          imageKeyword: "房似锦 安家 孙俪" },
        // 美剧
        { name: "Jesse Pinkman", work: "《绝命毒师》", gender: ["male"], age: ["18-25", "26-35"], career: ["freelance"], stage: ["working", "transition"],
          quote: "I'm the bad guy.",
          similarity: ["被命运捉弄", "渴望被爱", "不断被伤害", "内心善良"],
          story: "小毒贩，被Walter White拖入制毒深渊，一次次想退出却被命运捉弄，失去所有爱的人，最终逃离。",
          advice: "Jesse的遭遇让人心疼，但不要把自己定义为受害者，你有选择的力量，可以重新开始。",
          imageKeyword: "Jesse Pinkman Breaking Bad" },
        // 电影
        { name: "小丑", work: "《Joker》", gender: ["male"], age: ["26-35", "36-45"], career: ["freelance"], stage: ["working", "transition"],
          quote: "I used to think that my life was a tragedy. But now I realize, it's a comedy.",
          similarity: ["被社会抛弃", "渴望关注", "精神崩溃", "从受害者到加害者"],
          story: "喜剧演员Arthur Fleck，被社会抛弃、被嘲笑、被殴打，最终在绝望中变成小丑，引发哥谭市暴动。",
          advice: "小丑的悲剧是社会的问题，但暴力不是答案，寻求帮助，不要独自承受。",
          imageKeyword: "Joker Joaquin Phoenix" },
        // 文学
        { name: "苔丝", work: "《德伯家的苔丝》", gender: ["female"], age: ["18-25", "26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "凡是有甜美的鸟歌唱的地方，也都有毒蛇嘶嘶地叫。",
          similarity: ["纯洁善良", "被命运摧残", "社会不公", "无力反抗"],
          story: "纯洁的乡村少女，被贵族少爷诱奸，失去孩子，婚后被丈夫抛弃，最终杀死少爷，被绞死。",
          advice: "苔丝的悲剧是时代的悲剧，但在今天，你有权利为自己发声，寻求帮助，不要独自承受。",
          imageKeyword: "Tess of the d'Urbervilles" },
        { name: "孔乙己", work: "《孔乙己》", gender: ["male"], age: ["26-35", "36-45", "46+"], career: ["freelance"], stage: ["working", "transition"],
          quote: "窃书不能算偷...窃书！读书人的事，能算偷么？",
          similarity: ["固守旧观念", "被时代抛弃", "自欺欺人", "悲剧性"],
          story: "科举制度下的落魄书生，固守读书人的尊严，却连饭都吃不饱，最终被时代抛弃，不知所踪。",
          advice: "孔乙己的悲剧在于无法适应变化，世界在变，你也要变，放下执念，拥抱新的可能。",
          imageKeyword: "孔乙己 鲁迅" },
        { name: "骆驼祥子（后期）", work: "《骆驼祥子》", gender: ["male"], age: ["26-35", "36-45"], career: ["freelance"], stage: ["working"],
          quote: "他没了心，他的心被人家摘了去。",
          similarity: ["被命运打击", "失去希望", "自暴自弃", "受害者心态"],
          story: "后期的祥子，被生活彻底击垮，从勤劳善良变成行尸走肉，吃喝嫖赌，出卖朋友，彻底堕落。",
          advice: "祥子的堕落是环境的悲剧，但即使在最黑暗的时刻，也不要放弃内心的光，寻求帮助，重新站起来。",
          imageKeyword: "骆驼祥子 后期" }
    ],

    // 表演者 (Performer) - 7个角色
    performer: [
        // 国产剧
        { name: "魏璎珞", work: "《延禧攻略》", gender: ["female"], age: ["18-25", "26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "我魏璎珞，天生脾气爆，不好惹。",
          similarity: ["敢于表现", "与众不同", "追求关注", "机智过人"],
          story: "宫女出身，凭借机智和勇气在后宫崛起，从不掩饰自己的锋芒，用独特的方式获得皇帝的宠爱。",
          advice: "魏璎珞的锋芒是武器，但不需要一直战斗，学会柔软，你会发现另一种力量。",
          imageKeyword: "魏璎珞 延禧攻略 吴谨言" },
        { name: "韩商言", work: "《亲爱的，热爱的》", gender: ["male"], age: ["26-35"], career: ["entrepreneur"], stage: ["working"],
          quote: "我是你的，迟早都是。",
          similarity: ["高冷外表", "内心柔软", "追求认可", "渴望被爱"],
          story: "电竞俱乐部老板，外表高冷内心柔软，用冷酷的外表保护自己，在佟年的温暖下逐渐打开心扉。",
          advice: "韩商言的冷酷是面具，摘下面具，真实的你更值得被爱。",
          imageKeyword: "韩商言 李现" },
        // 美剧
        { name: "Tyrion Lannister", work: "《权力的游戏》", gender: ["male"], age: ["26-35", "36-45"], career: ["executive"], stage: ["working", "stable"],
          quote: "Never forget what you are. The rest of the world will not. Wear it like armor, and it can never be used to hurt you.",
          similarity: ["用智慧弥补缺陷", "善于表演", "渴望认可", "内心敏感"],
          story: "兰尼斯特家族的侏儒，用智慧和幽默在权力游戏中生存，渴望被父亲认可，最终成为国王之手。",
          advice: "Tyrion的智慧令人钦佩，但不需要用表演来掩饰脆弱，真实的你同样值得被爱。",
          imageKeyword: "Tyrion Lannister Game of Thrones" },
        { name: "Rachel Green", work: "《老友记》", gender: ["female"], age: ["18-25", "26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "It's a metaphor, Daddy!",
          similarity: ["追求时尚", "渴望关注", "从依赖到独立", "在意形象"],
          story: "富家女，逃婚后独立生活，从服务员到时尚行业高管，在意自己的形象，渴望被认可。",
          advice: "Rachel的成长令人欣慰，但真正的自信来自内心，而非外表和他人认可。",
          imageKeyword: "Rachel Friends Jennifer Aniston" },
        // 电影
        { name: "楚门", work: "《楚门的世界》", gender: ["male"], age: ["26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "In case I don't see you... good afternoon, good evening, and good night.",
          similarity: ["活在表演中", "渴望真实", "被注视", "追求自由"],
          story: "楚门，从出生就生活在真人秀中，所有人都是演员，只有他不知道。最终发现真相，勇敢走出虚假的世界。",
          advice: "楚门的勇气值得学习，你的生活不是表演，不需要观众的掌声，做真实的自己。",
          imageKeyword: "Truman Show Jim Carrey" },
        // 文学
        { name: "包法利夫人", work: "《包法利夫人》", gender: ["female"], age: ["26-35"], career: ["middle"], stage: ["stable", "transition"],
          quote: "她想去巴黎，她也很想死。",
          similarity: ["追求浪漫", "不满现实", "渴望关注", "虚荣浮华"],
          story: "艾玛，不满平淡的婚姻生活，追求浪漫和奢华，不断出轨，债台高筑，最终服毒自杀。",
          advice: "艾玛的悲剧在于把幸福寄托在外在，真正的满足来自内心，学会欣赏当下的美好。",
          imageKeyword: "Madame Bovary" },
        { name: "盖茨比", work: "《了不起的盖茨比》", gender: ["male"], age: ["26-35", "36-45"], career: ["entrepreneur"], stage: ["working", "stable"],
          quote: "So we beat on, boats against the current, borne back ceaselessly into the past.",
          similarity: ["追求梦想", "表演人生", "渴望认可", "执念过去"],
          story: "神秘富豪，举办奢华派对只为吸引旧爱黛西，用财富和表演构建梦想，最终梦想破灭，死于非命。",
          advice: "盖茨比的梦想令人动容，但不要为了他人的认可而活着，真正的价值不需要证明。",
          imageKeyword: "Great Gatsby Leonardo DiCaprio" }
    ],

    // 拯救者 (Savior) - 7个角色
    savior: [
        // 国产剧
        { name: "明兰", work: "《知否知否应是绿肥红瘦》", gender: ["female"], age: ["18-25", "26-35"], career: ["middle"], stage: ["working", "stable"],
          quote: "这天下没有谁是谁的靠山，凡事最好不要太指望人。",
          similarity: ["智慧隐忍", "照顾家人", "解决问题", "责任感强"],
          story: "庶女明兰，在复杂的家庭中生存，用智慧保护自己和家人，成为盛家的主心骨，照顾身边的每一个人。",
          advice: "明兰的智慧值得学习，但不要把所有责任都扛在自己身上，学会求助和分享。",
          imageKeyword: "明兰 知否 赵丽颖" },
        { name: "罗子君", work: "《我的前半生》", gender: ["female"], age: ["26-35", "36-45"], career: ["newbie", "middle"], stage: ["working", "transition"],
          quote: "人活一辈子，没有下一次的。",
          similarity: ["从依赖到独立", "重新站起", "帮助他人", "成长蜕变"],
          story: "全职太太被离婚后，在闺蜜和贺涵的帮助下重新站起来，从依附他人到独立自主，最终成为职场女性。",
          advice: "罗子君的成长令人欣慰，但成长不是为了拯救他人，先照顾好自己，才能更好地帮助他人。",
          imageKeyword: "罗子君 我的前半生 马伊琍" },
        // 美剧
        { name: "Daenerys Targaryen", work: "《权力的游戏》", gender: ["female"], age: ["18-25", "26-35"], career: ["executive"], stage: ["working"],
          quote: "I am not going to stop the wheel. I am going to break the wheel.",
          similarity: ["解放者", "拯救他人", "使命感强", "从弱到强"],
          story: "龙母，从被卖的公主到解放奴隶的女王，用龙和军队解放奴隶城邦，渴望打破旧秩序，建立新世界。",
          advice: "Daenerys的使命感令人敬佩，但拯救他人不能失去自我，权力需要制衡，理想需要现实支撑。",
          imageKeyword: "Daenerys Game of Thrones Emilia Clarke" },
        { name: "Ted Mosby", work: "《老爸老妈的浪漫史》", gender: ["male"], age: ["26-35"], career: ["middle"], stage: ["working"],
          quote: "I think for the most part, if you're really honest with yourself about what you want out of life, life gives it to you.",
          similarity: ["浪漫理想", "照顾朋友", "寻找真爱", "相信美好"],
          story: "建筑师，用9年时间向孩子讲述如何遇见他们的母亲，相信真爱，照顾朋友，最终找到幸福。",
          advice: "Ted的浪漫很美好，但不要为了寻找爱情而忽略当下，珍惜眼前人。",
          imageKeyword: "Ted Mosby How I Met Your Mother" },
        // 电影
        { name: "辛德勒", work: "《辛德勒的名单》", gender: ["male"], age: ["36-45", "46+"], career: ["entrepreneur", "executive"], stage: ["working", "stable"],
          quote: "凡救一命，即救全世界。",
          similarity: ["拯救他人", "责任感", "从商人到义人", "人性光辉"],
          story: "德国商人，起初为了利润雇佣犹太人，最终散尽家财拯救1100名犹太人，从投机者变成义人。",
          advice: "辛德勒的选择令人敬佩，但拯救他人需要量力而行，不要为了他人牺牲自己的一切。",
          imageKeyword: "Schindler's List Liam Neeson" },
        // 文学
        { name: "简·爱", work: "《简·爱》", gender: ["female"], age: ["18-25", "26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "你以为我贫穷、相貌平平就没有感情吗？我向你发誓，如果上帝赋予我财富和美貌，我会让你难以离开我。",
          similarity: ["独立自主", "精神平等", "帮助他人", "坚守原则"],
          story: "孤女简·爱，在寄宿学校长大，成为家庭教师，与罗切斯特相爱，发现他有妻子后离开，最终继承遗产后回来照顾失明的罗切斯特。",
          advice: "简·爱的独立令人敬佩，但独立不等于孤立，学会接受他人的爱和帮助。",
          imageKeyword: "Jane Eyre" },
        { name: "白求恩", work: "《纪念白求恩》", gender: ["male"], age: ["36-45", "46+"], career: ["middle", "executive"], stage: ["working"],
          quote: "一个外国人，毫无利己的动机，把中国人民的解放事业当作他自己的事业。",
          similarity: ["无私奉献", "拯救他人", "国际主义", "牺牲精神"],
          story: "加拿大医生，不远万里来到中国，在抗日战争前线救治伤员，最终因感染牺牲，成为中国人民的英雄。",
          advice: "白求恩的精神令人敬佩，但奉献需要量力而行，照顾好自己才能更好地帮助他人。",
          imageKeyword: "Norman Bethune" }
    ],

    // 漫游者 (Wanderer) - 7个角色
    wanderer: [
        // 国产剧
        { name: "王漫妮", work: "《三十而已》", gender: ["female"], age: ["26-35"], career: ["newbie", "middle"], stage: ["working", "transition"],
          quote: "我没有靠山，我就是我自己最稳的靠山。",
          similarity: ["追求更好", "不断尝试", "不愿安定", "寻找自我"],
          story: "奢侈品柜姐，在上海打拼，渴望更好的生活，经历感情挫折后出国深造，寻找新的人生可能。",
          advice: "漫妮的勇气值得学习，但漂泊不是目的，找到内心的归属才是真正的自由。",
          imageKeyword: "王漫妮 三十而已 江疏影" },
        { name: "余则成", work: "《潜伏》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle", "executive"], stage: ["working"],
          quote: "有一种胜利叫撤退，有一种失败叫占领。",
          similarity: ["隐藏身份", "不断适应", "内心孤独", "寻找归属"],
          story: "地下党员，潜伏在军统内部，不断变换身份，在危险中生存，最终离开大陆，与爱人分离。",
          advice: "余则成的隐忍是使命所需，但生活中不需要一直伪装，找到可以真实做自己的地方。",
          imageKeyword: "余则成 潜伏 孙红雷" },
        // 美剧
        { name: "Arya Stark", work: "《权力的游戏》", gender: ["female"], age: ["18-25"], career: ["freelance"], stage: ["working", "transition"],
          quote: "A girl is Arya Stark of Winterfell. And I'm going home.",
          similarity: ["拒绝束缚", "独自旅行", "寻找自我", "不愿被定义"],
          story: "史塔克家族的小女儿，拒绝成为淑女，独自流浪，学习暗杀，复仇后选择出海探索未知的世界。",
          advice: "Arya的勇气令人钦佩，但探索之后也要记得回家，归属感同样重要。",
          imageKeyword: "Arya Stark Game of Thrones Maisie Williams" },
        { name: "Phoebe Buffay", work: "《老友记》", gender: ["female"], age: ["26-35"], career: ["freelance"], stage: ["working"],
          quote: "I don't even have a 'pla'.",
          similarity: ["自由随性", "与众不同", "拒绝规则", "活在当下"],
          story: "按摩师、歌手，童年流浪街头，长大后依然保持自由随性的生活方式，用独特的视角看待世界。",
          advice: "Phoebe的随性很迷人，但适度的规划能让自由更持久，找到平衡。",
          imageKeyword: "Phoebe Friends Lisa Kudrow" },
        // 电影
        { name: "杰克", work: "《泰坦尼克号》", gender: ["male"], age: ["18-25"], career: ["freelance"], stage: ["working"],
          quote: "I'm the king of the world!",
          similarity: ["自由不羁", "活在当下", "追求体验", "不愿被束缚"],
          story: "穷画家，赢得船票登上泰坦尼克号，与Rose相爱，最终为救她牺牲自己，用生命诠释了自由和爱。",
          advice: "杰克的自由令人向往，但自由需要责任，真正的自由是在爱中找到归属。",
          imageKeyword: "Jack Titanic Leonardo DiCaprio" },
        // 文学
        { name: "堂吉诃德", work: "《堂吉诃德》", gender: ["male"], age: ["36-45", "46+"], career: ["freelance"], stage: ["transition"],
          quote: "太胆小是懦弱，太胆大是鲁莽，勇敢是恰好适中。",
          similarity: ["追求理想", "漫游四方", "与众不同", "不被理解"],
          story: "疯癫的骑士，带着侍从桑丘漫游西班牙，与风车作战，追求不可能的理想，最终清醒后死去。",
          advice: "堂吉诃德的理想主义很珍贵，但理想需要现实基础，找到可以实现的梦想。",
          imageKeyword: "Don Quixote" },
        { name: "霍尔顿", work: "《麦田里的守望者》", gender: ["male"], age: ["18-25"], career: ["student"], stage: ["studying"],
          quote: "一个不成熟男子的标志是他愿意为某种事业英勇地死去，一个成熟男子的标志是他愿意为某种事业卑贱地活着。",
          similarity: ["叛逆少年", "逃离学校", "寻找真实", "拒绝虚伪"],
          story: "16岁少年，被学校开除后游荡纽约，厌恶成人世界的虚伪，渴望保护孩子们的纯真，最终精神崩溃。",
          advice: "霍尔顿的叛逆是成长的一部分，但不要拒绝成长，保持纯真和承担责任可以并存。",
          imageKeyword: "Catcher in the Rye Holden" }
    ],

    // 战士 (Warrior) - 7个角色
    warrior: [
        // 国产剧
        { name: "李云龙", work: "《亮剑》", gender: ["male"], age: ["26-35", "36-45", "46+"], career: ["middle", "executive"], stage: ["working", "stable"],
          quote: "面对强大的对手，明知不敌，也要毅然亮剑。",
          similarity: ["勇敢无畏", "战斗精神", "重情重义", "永不退缩"],
          story: "八路军独立团团长，性格粗犷，作战勇猛，带领部队打胜仗，从士兵成长为将军，最终因性格刚烈而悲剧收场。",
          advice: "李云龙的亮剑精神令人敬佩，但战斗不是唯一选择，学会智慧地战斗，保护自己和爱的人。",
          imageKeyword: "李云龙 亮剑 李幼斌" },
        { name: "许三多", work: "《士兵突击》", gender: ["male"], age: ["18-25", "26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "不抛弃，不放弃。",
          similarity: ["执着坚持", "不断突破", "真诚善良", "永不放弃"],
          story: "农村士兵，从孬兵到兵王，用执着和坚持证明自己，影响了身边的每一个人，成为真正的战士。",
          advice: "许三多的坚持令人动容，但坚持需要方向，不要为了坚持而坚持，找到值得的目标。",
          imageKeyword: "许三多 士兵突击 王宝强" },
        // 美剧
        { name: "Jon Snow", work: "《权力的游戏》", gender: ["male"], age: ["18-25", "26-35"], career: ["middle", "executive"], stage: ["working"],
          quote: "The man who passes the sentence should swing the sword.",
          similarity: ["荣誉至上", "责任感强", "勇敢正直", "愿意牺牲"],
          story: "史塔克家的私生子，加入守夜人，成为总司令，联合野人对抗异鬼，发现真实身份后杀死龙母，被流放。",
          advice: "Jon的荣誉令人敬佩，但世界不是非黑即白，学会灵活应对，保护自己。",
          imageKeyword: "Jon Snow Game of Thrones Kit Harington" },
        { name: "Rick Grimes", work: "《行尸走肉》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle"], stage: ["working", "transition"],
          quote: "We are the walking dead.",
          similarity: [ "领导能力", "保护家人", "在绝境中战斗", "不断进化"],
          story: "小镇警长，在丧尸末日中带领幸存者生存，从正义的警察变成冷酷的领袖，最终为保护家人牺牲。",
          advice: "Rick的领导力令人钦佩，但不要为了战斗失去人性，保持内心的善良。",
          imageKeyword: "Rick Grimes Walking Dead Andrew Lincoln" },
        // 电影
        { name: "Maximus", work: "《角斗士》", gender: ["male"], age: ["36-45", "46+"], career: ["executive"], stage: ["working", "transition"],
          quote: "My name is Maximus Decimus Meridius, commander of the Armies of the North...",
          similarity: ["复仇驱动", "战斗技巧", "荣誉信念", "为正义而战"],
          story: "罗马将军，被背叛后沦为奴隶，成为角斗士，最终复仇成功，在竞技场中死去，成为传奇。",
          advice: "Maximus的复仇令人痛快，但复仇不能带来真正的平静，放下仇恨，选择宽恕。",
          imageKeyword: "Maximus Gladiator Russell Crowe" },
        // 文学
        { name: "鲁滨逊", work: "《鲁滨逊漂流记》", gender: ["male"], age: ["26-35", "36-45"], career: ["entrepreneur", "freelance"], stage: ["working", "transition"],
          quote: "一个人只是呆呆地坐着，空想自己所得不到的东西，是没有用的。",
          similarity: ["生存能力", "永不放弃", "独自战斗", "适应环境"],
          story: "英国水手，海难后漂流到荒岛，独自生存28年，最终获救回国，成为冒险文学的经典形象。",
          advice: "鲁滨逊的生存能力令人惊叹，但人不是孤岛，学会与他人合作，共同面对困难。",
          imageKeyword: "Robinson Crusoe" },
        { name: "保尔·柯察金", work: "《钢铁是怎样炼成的》", gender: ["male"], age: ["18-25", "26-35"], career: ["middle"], stage: ["working"],
          quote: "人最宝贵的是生命，生命每个人只有一次。",
          similarity: ["革命理想", "坚强意志", "为信仰战斗", "不畏艰难"],
          story: "乌克兰工人，参加红军，在战斗中受伤，最终瘫痪失明，但坚持写作，用笔继续战斗。",
          advice: "保尔的意志令人敬佩，但身体是革命的本钱，照顾好自己才能更好地战斗。",
          imageKeyword: "Pavel Korchagin" }
    ],

    // 治愈者 (Healer) - 7个角色
    healer: [
        // 国产剧
        { name: "贺涵", work: "《我的前半生》", gender: ["male"], age: ["26-35", "36-45"], career: ["executive"], stage: ["working", "stable"],
          quote: "你已经不年轻了，不能再靠刷脸去做人生的摆渡船了。",
          similarity: ["智慧成熟", "帮助他人", "理性冷静", "引导成长"],
          story: "咨询业精英，帮助罗子君重新站起来，从理性的职场导师变成感性的爱人，最终选择离开。",
          advice: "贺涵的智慧值得学习，但帮助他人不能代替自己的成长，找到属于自己的幸福。",
          imageKeyword: "贺涵 我的前半生 靳东" },
        { name: "童文洁", work: "《小欢喜》", gender: ["female"], age: ["36-45"], career: ["middle", "executive"], stage: ["working", "stable"],
          quote: "孩子，妈妈永远是你的后盾。",
          similarity: ["关爱家人", "理解支持", "温暖包容", "化解矛盾"],
          story: "职场妈妈，面对高考压力和家庭矛盾，用理解和包容化解危机，成为家庭的粘合剂。",
          advice: "童文洁的温暖很珍贵，但不要把所有精力都给家人，留一些给自己。",
          imageKeyword: "童文洁 小欢喜 海清" },
        // 美剧
        { name: "Meredith Grey", work: "《实习医生格蕾》", gender: ["female"], age: ["26-35", "36-45"], career: ["middle", "executive"], stage: ["working"],
          quote: "It's good to be scared. It means you still have something to lose.",
          similarity: ["医者仁心", "治愈他人", "面对创伤", "不断成长"],
          story: "外科医生，在手术室里拯救生命，同时面对自己的创伤，从实习生成长为医院主任。",
          advice: "Meredith的坚韧令人敬佩，但治愈他人前先治愈自己，不要忽视自己的伤口。",
          imageKeyword: "Meredith Grey Grey's Anatomy Ellen Pompeo" },
        { name: "Chandler Bing", work: "《老友记》", gender: ["male"], age: ["26-35"], career: ["middle"], stage: ["working"],
          quote: "I'm not great at the advice. Can I interest you in a sarcastic comment?",
          similarity: ["幽默化解", "支持朋友", "内心温暖", "害怕承诺"],
          story: "数据分析师，用幽默掩饰不安，是朋友们的开心果，最终与Monica建立家庭，学会承担责任。",
          advice: "Chandler的幽默很珍贵，但不要用幽默逃避真实，允许自己脆弱。",
          imageKeyword: "Chandler Friends Matthew Perry" },
        // 电影
        { name: "马修", work: "《心灵捕手》", gender: ["male"], age: ["36-45", "46+"], career: ["middle"], stage: ["working"],
          quote: "It's not your fault.",
          similarity: ["治愈创伤", "智慧引导", "理解包容", "帮助他人"],
          story: "心理学教授，治愈天才少年Will的心灵创伤，帮助他面对过去，找到人生方向。",
          advice: "马修的智慧令人敬佩，但治愈他人需要边界，不要过度卷入。",
          imageKeyword: "Good Will Hunting Robin Williams" },
        // 文学
        { name: "史铁生", work: "《我与地坛》", gender: ["male"], age: ["26-35", "36-45", "46+"], career: ["freelance"], stage: ["working", "transition"],
          quote: "死是一件不必急于求成的事，死是一个必然会降临的节日。",
          similarity: ["面对苦难", "思考生命", "治愈他人", "文字力量"],
          story: "作家，21岁双腿瘫痪，在地坛公园思考生命，用文字治愈自己和读者，成为当代文学的重要声音。",
          advice: "史铁生的智慧令人敬佩，但不要把苦难浪漫化，寻求帮助，不要独自承受。",
          imageKeyword: "史铁生" },
        { name: "夏洛", work: "《夏洛的网》", gender: ["female"], age: ["18-25", "26-35", "36-45", "46+"], career: ["freelance"], stage: ["working", "stable"],
          quote: "你一直是我的朋友，这件事本身就是一件了不起的事。",
          similarity: ["无私奉献", "拯救他人", "智慧善良", "默默付出"],
          story: "蜘蛛夏洛，用蛛网编织文字拯救小猪威尔伯，最终耗尽生命，用生命诠释了友谊和牺牲。",
          advice: "夏洛的友谊令人感动，但付出要有边界，不要为了他人耗尽自己。",
          imageKeyword: "Charlotte's Web" }
    ],

    // 观察者 (Observer) - 7个角色
    observer: [
        // 国产剧
        { name: "陈独秀", work: "《觉醒年代》", gender: ["male"], age: ["36-45", "46+"], career: ["executive", "freelance"], stage: ["working", "transition"],
          quote: "青年如初春，如朝日，如百卉之萌动。",
          similarity: ["思想深刻", "观察时代", "理性分析", "保持距离"],
          story: "新文化运动领袖，创办《新青年》，观察中国命运，用思想唤醒民众，是时代的观察者和引领者。",
          advice: "陈独秀的思想令人敬佩，但观察之后要行动，不要只做旁观者。",
          imageKeyword: "陈独秀 觉醒年代" },
        { name: "林奚", work: "《琅琊榜之风起长林》", gender: ["female"], age: ["18-25", "26-35"], career: ["freelance"], stage: ["working"],
          quote: "我的心可以热，但我的脑袋要冷。",
          similarity: ["冷静理性", "观察分析", "保持距离", "独立思考"],
          story: "医女，冷静理性，用医术救人，观察朝堂风云，与萧平旌相爱却不依附，保持独立人格。",
          advice: "林奚的独立令人敬佩，但冷静不等于冷漠，允许自己投入情感。",
          imageKeyword: "林奚 琅琊榜之风起长林" },
        // 美剧
        { name: "Spock", work: "《星际迷航》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle", "executive"], stage: ["working"],
          quote: "Live long and prosper.",
          similarity: ["逻辑至上", "观察分析", "抑制情感", "理性决策"],
          story: "半人类半瓦肯人，企业号大副，用逻辑分析一切，观察人类行为，在理性与情感之间寻找平衡。",
          advice: "Spock的逻辑很有价值，但情感也是人性的一部分，不要完全压抑。",
          imageKeyword: "Spock Star Trek" },
        { name: "Ross Geller", work: "《老友记》", gender: ["male"], age: ["26-35"], career: ["middle", "executive"], stage: ["working"],
          quote: "We were on a break!",
          similarity: ["学术思维", "观察分析", "理性解释", "情感笨拙"],
          story: "古生物学家，用学术思维分析感情，观察朋友关系，理性但情感笨拙，经历三次婚姻最终找到幸福。",
          advice: "Ross的理性很珍贵，但感情不能用理性分析，学会用心感受。",
          imageKeyword: "Ross Friends David Schwimmer" },
        // 电影
        { name: "楚门（发现真相前）", work: "《楚门的世界》", gender: ["male"], age: ["26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "Good morning! And in case I don't see you, good afternoon, good evening, and good night.",
          similarity: ["观察生活", "发现异常", "保持好奇", "寻找真相"],
          story: "保险推销员，逐渐发现生活的异常，观察周围的细节，最终发现真相，勇敢走出虚假世界。",
          advice: "楚门的好奇心救了他，保持观察，但不要过度怀疑，信任也是必要的。",
          imageKeyword: "Truman Show Jim Carrey" },
        // 文学
        { name: "福尔摩斯", work: "《福尔摩斯探案集》", gender: ["male"], age: ["26-35", "36-45"], career: ["freelance"], stage: ["working"],
          quote: "当你排除了所有不可能的因素，剩下的，无论你多么不愿意相信，那就是真相。",
          similarity: ["观察入微", "逻辑推理", "保持距离", "理性分析"],
          story: "咨询侦探，用观察和推理解决案件，保持情感距离，理性分析一切，是观察者的极致代表。",
          advice: "福尔摩斯的观察力令人惊叹，但生活不是案件，允许自己投入情感。",
          imageKeyword: "Sherlock Holmes" },
        { name: "默尔索", work: "《局外人》", gender: ["male"], age: ["26-35"], career: ["newbie", "middle"], stage: ["working"],
          quote: "今天，妈妈死了。也许是昨天，我不知道。",
          similarity: ["情感疏离", "观察世界", "拒绝表演", "真实面对"],
          story: "公司职员，对母亲的死毫无反应，杀人后拒绝表演悲伤，被社会审判，是存在主义文学的经典形象。",
          advice: "默尔索的真实令人震撼，但完全疏离会失去人性，找到平衡。",
          imageKeyword: "L'Étranger Camus" }
    ],

    // 觉醒者 (Awakened) - 7个角色
    awakened: [
        // 国产剧
        { name: "张东升", work: "《隐秘的角落》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle"], stage: ["working", "stable"],
          quote: "你看，我还有机会吗？",
          similarity: ["看透人性", "冷静计算", "觉醒黑暗", "掌控局面"],
          story: "数学老师，表面温和，实则冷静计算，觉醒后掌控局面，用智慧实施完美犯罪，最终被少年击败。",
          advice: "张东升的觉醒走向了黑暗，觉醒应该是为了更好，而不是更坏。",
          imageKeyword: "张东升 隐秘的角落 秦昊" },
        { name: "李必", work: "《长安十二时辰》", gender: ["male"], age: ["18-25", "26-35"], career: ["middle", "executive"], stage: ["working"],
          quote: "我要做宰相，我要让这长安，万世长安。",
          similarity: ["理想主义", "看透时局", "坚守信念", "智慧行动"],
          story: "靖安司司丞，少年天才，看透朝堂黑暗，仍坚守理想，用智慧拯救长安，是觉醒者的正面代表。",
          advice: "李必的理想令人敬佩，但理想需要现实支撑，学会灵活应对。",
          imageKeyword: "李必 长安十二时辰 易烊千玺" },
        // 美剧
        { name: "Walter White（觉醒后）", work: "《绝命毒师》", gender: ["male"], age: ["46+"], career: ["middle"], stage: ["transition"],
          quote: "I did it for me. I liked it. I was good at it. And I was really... I was alive.",
          similarity: ["自我觉醒", "掌控人生", "打破束缚", "真实面对"],
          story: "化学老师，身患绝症后觉醒，承认自己制毒是为了自己，不是为了家庭，最终真实面对自己。",
          advice: "Walter的觉醒走向了极端，觉醒应该是解放，不是毁灭。",
          imageKeyword: "Walter White Breaking Bad Heisenberg" },
        { name: "Elliot Alderson", work: "《黑客军团》", gender: ["male"], age: ["26-35"], career: ["freelance"], stage: ["working", "transition"],
          quote: "Hello, friend.",
          similarity: ["看透系统", "反抗控制", "寻找真实", "内心挣扎"],
          story: "黑客，看透社会系统的控制，用技术反抗，同时面对自己的精神疾病，在觉醒中挣扎。",
          advice: "Elliot的反抗令人共鸣，但破坏不是出路，建设才是。",
          imageKeyword: "Elliot Mr Robot Rami Malek" },
        // 电影
        { name: "尼奥", work: "《黑客帝国》", gender: ["male"], age: ["26-35", "36-45"], career: ["middle", "freelance"], stage: ["working", "transition"],
          quote: "There is no spoon.",
          similarity: ["觉醒真相", "打破幻象", "选择自由", "承担责任"],
          story: "程序员Neo，觉醒后发现世界是矩阵，选择红色药丸，成为救世主，用觉醒改变世界。",
          advice: "尼奥的选择令人震撼，但觉醒后要行动，不要停留在知道。",
          imageKeyword: "Neo Matrix Keanu Reeves" },
        // 文学
        { name: "悉达多（悟道后）", work: "《悉达多》", gender: ["male"], age: ["36-45", "46+"], career: ["freelance"], stage: ["transition"],
          quote: "智慧无法言传，智者试图传授智慧，总像痴人说梦。",
          similarity: [ "悟道觉醒", "看透本质", "接纳一切", "内心平静"],
          story: "悟道后的悉达多，看透世间本质，成为智者，用沉默和微笑影响他人，是觉醒者的最高境界。",
          advice: "悉达多的智慧令人向往，但悟道不是终点，而是新的开始。",
          imageKeyword: "Siddhartha enlightened" },
        { name: "贾宝玉（悟道后）", work: "《红楼梦》", gender: ["male"], age: ["26-35"], career: ["freelance"], stage: ["transition"],
          quote: "好了歌注：陋室空堂，当年笏满床...",
          similarity: ["看破红尘", "放下执念", "选择出家", "超脱世俗"],
          story: "悟道后的宝玉，看破红尘繁华，放下对黛玉的执念，选择出家，是觉醒者的悲剧结局。",
          advice: "宝玉的觉醒走向了逃避，觉醒应该是融入，不是逃离。",
          imageKeyword: "贾宝玉 出家 红楼梦" }
    ]
};

// ==================== 12种原型定义 ====================
const ARCHETYPES = {
    lone_hero: {
        name: "孤勇者",
        englishName: "Lone Hero",
        movieTitle: "《永不言败》",
        tagline: "「只有赢才能证明我活着」",
        dimensions: { drive: "achievement", world: "battle", self: "perfection", time: "chasing" },
        badMovie: {
            title: "《一个人的马拉松》",
            synopsis: "主角从第一分钟跑到最后一分钟，没有休息，没有陪伴，甚至没有风景。观众看得筋疲力尽，主角却说：停下来就是失败。",
            symptoms: ["休息时有强烈的罪恶感", "把生活当成必须打赢的战役", "很难真正放松和享受", "关系因为「不够重要」而被忽视"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "高期待的施压者", desc: "他们的认可永远差一点点" },
                { name: "不理解但无奈的支持者", desc: "心疼你但不知道怎么帮你" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "被忽视的同行者", desc: "想靠近却总被推开" },
                { name: "仰望但无法亲近的追随者", desc: "他们看到你发光，却触不到你的疲惫" },
                { name: "必须击败的敌人", desc: "你给自己制造的假想敌" }
            ]}
        },
        newScript: {
            title: "《光荣与陪伴》",
            synopsis: "主角依然追求卓越，但学会了：赢不是唯一价值，休息不是软弱，求助不是失败。他开始欣赏沿途风景，发现有人并肩作战时，胜利更甜。",
            keyChanges: ["从「必须赢」到「可以享受过程」", "从「独自承担」到「允许被支持」", "从「永不满足」到「庆祝小胜利」"]
        },
        actionPlan: [
            { icon: "🛑", text: "今天刻意做一件「无意义」的事，不评判自己" },
            { icon: "📞", text: "给一个很久没联系的朋友打电话，不谈工作" },
            { icon: "📝", text: "写下三件已经做得够好的事，贴在显眼处" },
            { icon: "🏃", text: "运动时不计时、不计距离，纯粹享受身体的感觉" }
        ]
    },
    pleaser: {
        name: "讨好者",
        englishName: "Pleaser",
        movieTitle: "《无私奉献》",
        tagline: "「只有付出才配被爱」",
        dimensions: { drive: "relationship", world: "victim", self: "inferiority", time: "fate" },
        badMovie: {
            title: "《永远不够好》",
            synopsis: "主角不断付出、妥协、牺牲，期待换来爱和认可。但镜头拉远才发现：那些接受的人早已习惯，主角的真心成了理所当然。",
            symptoms: ["很难说「不」，即使内心不愿意", "害怕冲突，总是先道歉", "付出后感到委屈和怨恨", "自我价值感建立在他人认可上"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "情感忽视者", desc: "你的感受很少被看见" },
                { name: "条件式关爱者", desc: "只有乖、听话才配得到爱" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "伤害者/索取者", desc: "被你吸引来的人，往往最会索取" },
                { name: "利用者", desc: "享受你的好，但从不回报" },
                { name: "拯救者-疲惫离开者", desc: "想帮你，但你拒绝被帮" }
            ]}
        },
        newScript: {
            title: "《被爱的勇气》",
            synopsis: "主角发现：爱不是交易，不需要用付出来兑换。她开始表达真实需求，设立边界。神奇的是，真正爱她的人留下了，只想要好处的离开了。",
            keyChanges: ["从「付出换爱」到「我本身就值得被爱」", "从「害怕被拒绝」到「筛选值得的人」", "从「委屈求全」到「温和而坚定」"]
        },
        actionPlan: [
            { icon: "🚫", text: "今天拒绝一个请求，哪怕只是小事" },
            { icon: "💬", text: "对一个人表达真实的想法，即使可能不被认同" },
            { icon: "🎁", text: "给自己买一件想要的东西，不找理由" },
            { icon: "📝", text: "写下：「如果不需要讨好任何人，我想做什么？」" }
        ]
    },
    hermit: {
        name: "隐士",
        englishName: "Hermit",
        movieTitle: "《安全区》",
        tagline: "「改变是危险的，独处最安全」",
        dimensions: { drive: "security", world: "detachment", self: "inferiority", time: "stagnation" },
        badMovie: {
            title: "《永远明天再说》",
            synopsis: "主角住在舒适的洞穴里，外面有阳光、冒险、可能性，但主角说「再等等」。等到片尾字幕升起，洞穴成了坟墓，主角从未真正活过。",
            symptoms: ["对新机会的第一反应是风险评估", "社交消耗能量，独处才能恢复", "错过很多「本来可以」的机会", "内心深处渴望连接却害怕受伤"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "过度保护者", desc: "世界很危险，待在安全的地方" },
                { name: "情感疏离者", desc: "亲近意味着受伤，保持距离" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "难以靠近的室友", desc: "物理上很近，心理上很远" },
                { name: "偶尔联系的网友", desc: "安全距离的关系" },
                { name: "互不干扰的平行线", desc: "同事、邻居，但从未真正认识" }
            ]}
        },
        newScript: {
            title: "《有根的旅人》",
            synopsis: "主角依然珍视独处，但不再用安全作为逃避的借口。他尝试小步走出舒适区，发现外面的世界没那么可怕，而真正的安全感来自内心的力量。",
            keyChanges: ["从「回避风险」到「评估后行动」", "从「孤立」到「选择性连接」", "从「我不行」到「我可以试试」"]
        },
        actionPlan: [
            { icon: "🚶", text: "去一个从未去过的地方，哪怕只是附近的咖啡馆" },
            { icon: "👋", text: "主动和一个陌生人打招呼或简短交谈" },
            { icon: "📅", text: "答应一个邀请，不找借口推掉" },
            { icon: "✍️", text: "写下：「如果不会失败，我最想尝试什么？」" }
        ]
    },
    controller: {
        name: "控制狂",
        englishName: "Controller",
        movieTitle: "《完美计划》",
        tagline: "「失控=失败，必须掌控一切」",
        dimensions: { drive: "achievement", world: "control", self: "perfection", time: "chasing" },
        badMovie: {
            title: "《崩溃的精密仪器》",
            synopsis: "主角试图控制每个变量，但生活不断抛出意外。每次计划被打乱，主角就更接近崩溃。最后发现，控制的幻觉比失控本身更可怕。",
            symptoms: ["事情不按计划进行会焦虑", "很难信任他人，喜欢亲力亲为", "经常 micromanagement", "放松时也在想着「还有什么没做」"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "高控制者", desc: "你学会了控制是生存方式" },
                { name: "无力者", desc: "你发誓不要像他们那样无助" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "被控制的傀儡", desc: "后来变成「反抗的叛逆者」" },
                { name: "阳奉阴违的执行者", desc: "表面顺从，内心抵触" },
                { name: "压抑的继承者", desc: "你的孩子可能正在承受" }
            ]}
        },
        newScript: {
            title: "《优雅的冲浪者》",
            synopsis: "主角学会了：控制能控制的，接纳不能控制的。他发现放下控制后，团队更有活力，关系更真实，而他自己，终于能睡个好觉。",
            keyChanges: ["从「控制一切」到「影响关键」", "从「计划完美」到「灵活应变」", "从「不信任」到「授权与信任」"]
        },
        actionPlan: [
            { icon: "🎲", text: "今天故意不做计划，看看会发生什么" },
            { icon: "🤝", text: "把一件任务完全交给别人，不干涉过程" },
            { icon: "🧘", text: "当焦虑出现时，深呼吸，告诉自己「我可以不确定」" },
            { icon: "📝", text: "写下：「如果我不控制，最坏会发生什么？我能承受吗？」" }
        ]
    },
    victim: {
        name: "受害者",
        englishName: "Victim",
        movieTitle: "《无辜者》",
        tagline: "「世界伤害我，这不是我的错」",
        dimensions: { drive: "relationship", world: "victim", self: "inferiority", time: "fate" },
        badMovie: {
            title: "《重复播放的悲剧》",
            synopsis: "主角的人生是一部重复的悲剧，不同的场景，同样的剧本：被伤害、被辜负、被忽视。主角说「这不公平」，但镜头显示，主角从未尝试换台。",
            symptoms: ["经常感到委屈和无助", "遇到问题时先找外部原因", "重复遇到类似的负面情境", "渴望被拯救，但拒绝自救"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "加害者", desc: "你的剧本从受伤开始" },
                { name: "拯救者-加害者循环", desc: "帮你又伤你的循环" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "施虐者", desc: "被你的受害者气场吸引" },
                { name: "拯救者-疲惫离开者", desc: "想帮你，但你拒绝改变" },
                { name: "冷漠的旁观者", desc: "你的抱怨让他们远离" }
            ]}
        },
        newScript: {
            title: "《重生的选择权》",
            synopsis: "主角意识到：过去确实发生了，但现在的反应是自己的选择。她开始为自己的生活负责，发现原来一直都有力量，只是之前没用过。",
            keyChanges: ["从「为什么是我」到「现在我该怎么办」", "从「等待拯救」到「自我赋能」", "从「重复创伤」到「打破循环」"]
        },
        actionPlan: [
            { icon: "✋", text: "当想抱怨时，停下来，问自己「我能做什么改变？」" },
            { icon: "🎯", text: "设定一个小目标并完成它，体验掌控感" },
            { icon: "🙏", text: "写下三件感恩的事，训练看到资源而非问题" },
            { icon: "💪", text: "做一件过去觉得自己做不到的事，证明给自己看" }
        ]
    },
    performer: {
        name: "表演者",
        englishName: "Performer",
        movieTitle: "《聚光灯下》",
        tagline: "「被看见=存在，平凡=死亡」",
        dimensions: { drive: "unique", world: "narcissism", self: "perfection", time: "exploration" },
        badMovie: {
            title: "《永不落幕的假面舞会》",
            synopsis: "主角戴着各种面具，在不同的舞台扮演完美的角色。观众鼓掌，但没有人知道面具后面是谁——包括主角自己。曲终人散，只剩空虚。",
            symptoms: ["很在意他人评价和关注", "难以建立深度关系", "经常感到内心空虚", "形象管理消耗大量精力"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "conditional love 给予者", desc: "只有表现好才配被爱" },
                { name: "忽视真实需求的赞美者", desc: "赞美你的成就，不看你的感受" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "观众/粉丝", desc: "后来变成「厌倦的离开者」" },
                { name: "仰望者", desc: "他们爱的可能是你的面具" },
                { name: "竞争者", desc: "和你争夺关注的人" }
            ]}
        },
        newScript: {
            title: "《真实的魅力》",
            synopsis: "主角发现：真实的自己不完美，但比完美的面具更有力量。他开始展示脆弱，发现真正的连接发生在面具摘下的时刻。",
            keyChanges: ["从「被看见才有价值」到「我存在，无需证明」", "从「superficial 关系」到「深度连接」", "从「形象管理」到「真实表达」"]
        },
        actionPlan: [
            { icon: "😊", text: "今天不化妆/不精心打扮，素颜面对世界" },
            { icon: "💬", text: "对一个人表达真实的脆弱，说「我其实不太确定」" },
            { icon: "📵", text: "不发朋友圈/社交媒体，体验不被关注的一天" },
            { icon: "🎭", text: "写下：「如果没人看，我想成为什么样的人？」" }
        ]
    },
    savior: {
        name: "拯救者",
        englishName: "Savior",
        movieTitle: "《救世主》",
        tagline: "「被需要=有价值」",
        dimensions: { drive: "service", world: "cooperation", self: "inferiority", time: "creation" },
        badMovie: {
            title: "《燃尽的蜡烛》",
            synopsis: "主角不断燃烧自己照亮别人，直到油尽灯枯。那些被帮助的人要么依赖成性，要么成长后离开。主角躺在灰烬中问：我自己呢？",
            symptoms: ["很难拒绝别人的求助", "忽视自己的需求", "关系中常常不平等", "付出后感到怨恨但无法停止"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "需要被照顾的弱者", desc: "你从小学会了照顾别人" },
                { name: "牺牲型的榜样", desc: "妈妈/爸爸就是这样付出的" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "被拯救的依赖者", desc: "后来变成「怨恨的独立者」" },
                { name: "不断求助者", desc: "你的善良吸引了他们" },
                { name: "甩锅者", desc: "知道你会接手，所以不承担责任" }
            ]}
        },
        newScript: {
            title: "《有边界的光》",
            synopsis: "主角学会了：真正的帮助不是牺牲自己，而是赋能他人。她开始设立边界，发现健康的关系是互相滋养，而不是单向拯救。",
            keyChanges: ["从「被需要才有价值」到「我有价值，无需证明」", "从「过度付出」到「适度帮助」", "从「忽视自己」到「自我关怀」"]
        },
        actionPlan: [
            { icon: "🙅", text: "当有人求助时，先问自己「我真的愿意吗？」" },
            { icon: "💆", text: "做一件纯粹为自己做的事，不带任何「有用」的目的" },
            { icon: "🗣️", text: "向一个人表达你的需求，而不是先问对方需要什么" },
            { icon: "📝", text: "写下：「如果我不再帮助任何人，我还值得存在吗？」" }
        ]
    },
    wanderer: {
        name: "漫游者",
        englishName: "Wanderer",
        movieTitle: "《在路上》",
        tagline: "「答案在路上，停留=窒息」",
        dimensions: { drive: "unique", world: "detachment", self: "lost", time: "exploration" },
        badMovie: {
            title: "《没有终点的列车》",
            synopsis: "主角永远在移动，换工作、换城市、换关系。每个地方都是暂时的，每段关系都是浅尝辄止。片尾，主角看着窗外飞逝的风景，不知自己在哪里。",
            symptoms: ["很难在一个地方/关系停留太久", "深入时会感到不安", "有很多经历但缺乏积累", "内心深处有存在主义空虚"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "缺席者", desc: "你学会了不依赖任何人" },
                { name: "无法理解的旁观者", desc: "他们希望你稳定下来" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "短暂的同行者", desc: "来了又走，像你自己一样" },
                { name: "散落各地的旧识", desc: "很多关系没有深入就结束" },
                { name: "无法归类的边缘人", desc: "社会角色模糊" }
            ]}
        },
        newScript: {
            title: "《有根的流浪》",
            synopsis: "主角发现：探索不意味着不能停留，自由不意味着没有归属。他开始尝试深入，发现真正的冒险是建立深度连接，而不是不断逃离。",
            keyChanges: ["从「答案在路上」到「答案也在当下」", "从「逃离」到「选择」", "从「superficial 体验」到「深度投入」"]
        },
        actionPlan: [
            { icon: "🌱", text: "承诺做一件事至少三个月，不中途放弃" },
            { icon: "🤝", text: "主动联系一个旧友，深化这段关系" },
            { icon: "🏠", text: "为自己创造一个「基地」，哪怕只是一个角落" },
            { icon: "📝", text: "写下：「我在逃避什么？如果停下来，会发生什么？」" }
        ]
    },
    warrior: {
        name: "战士",
        englishName: "Warrior",
        movieTitle: "《荣耀之战》",
        tagline: "「战斗是本能，但我不被战斗定义」",
        dimensions: { drive: "achievement", world: "battle", self: "authenticity", time: "creation" },
        badMovie: {
            title: "《孤独的胜利》",
            synopsis: "主角赢得了一场又一场战斗，但发现胜利带来的满足感越来越短。奖杯堆满房间，但房间里没有人。",
            symptoms: ["享受竞争和挑战", "有时会忽视关系的重要性", "休息时会感到不安", "把生活看作一系列需要打赢的战役"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "坚强的后盾", desc: "支持你去战斗" },
                { name: "共同战斗的战友", desc: "教会你战斗的方式" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "并肩作战的搭档", desc: "可以托付后背的人" },
                { name: "可靠的盟友", desc: "互相支持的朋友" },
                { name: "尊重的敌人", desc: "让你变得更强的人" }
            ]}
        },
        newScript: {
            title: "《智者的战斗》",
            synopsis: "主角依然热爱挑战，但学会了选择值得的战斗。他发现真正的强大不是战胜所有人，而是知道为什么而战，以及何时该放下剑。",
            keyChanges: ["从「赢得一切」到「选择值得的战斗」", "从「独自战斗」到「建立同盟」", "从「战斗定义我」到「我选择何时战斗」"]
        },
        actionPlan: [
            { icon: "🎯", text: "审视当前的「战斗」，哪些值得继续，哪些可以放下？" },
            { icon: "🤗", text: "向一个战友表达感谢，不是关于胜利，而是关于陪伴" },
            { icon: "🧘", text: "尝试一天不竞争，纯粹享受过程" },
            { icon: "📝", text: "写下：「如果不需要证明什么，我还想做什么？」" }
        ]
    },
    healer: {
        name: "治愈者",
        englishName: "Healer",
        movieTitle: "《爱的流动》",
        tagline: "「爱是流动的，给予和接受同样重要」",
        dimensions: { drive: "relationship", world: "cooperation", self: "authenticity", time: "creation" },
        badMovie: {
            title: "《过度付出的温柔》",
            synopsis: "主角给予太多，接受太少，最后精疲力竭。那些接受爱的人习惯了索取，忘记了爱需要双向流动。",
            symptoms: ["善于倾听和支持他人", "有时会忽视自己的需求", "难以接受别人的帮助", "在关系中倾向于照顾者的角色"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "真实的关爱者", desc: "给你无条件的爱" },
                { name: "情感支持的榜样", desc: "教会你如何爱人" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "平等的同行者", desc: "互相滋养的关系" },
                { name: "互相滋养的知己", desc: "深度的友谊" },
                { name: "受益于你帮助的人", desc: "你温暖了他们的生命" }
            ]}
        },
        newScript: {
            title: "《完整的圆》",
            synopsis: "主角学会了：真正的治愈包括治愈自己。他开始接受帮助，允许自己被爱，发现关系变得更加平衡和深厚。",
            keyChanges: ["从「只给予」到「也接受」", "从「照顾他人」到「互相照顾」", "从「忽视自己」到「自我关怀」"]
        },
        actionPlan: [
            { icon: "🎁", text: "接受别人的帮助或礼物，不说「不用了」" },
            { icon: "💬", text: "向一个人表达你的需要，而不是先问对方" },
            { icon: "🛁", text: "给自己安排一个「被照顾」的时间，像对待朋友那样对待自己" },
            { icon: "📝", text: "写下：「当我接受爱时，我给了别人什么礼物？」" }
        ]
    },
    observer: {
        name: "观察者",
        englishName: "Observer",
        movieTitle: "《静水流深》",
        tagline: "「观察即参与，深度优于广度」",
        dimensions: { drive: "security", world: "detachment", self: "authenticity", time: "exploration" },
        badMovie: {
            title: "《永远旁观的人生》",
            synopsis: "主角坐在观众席，看着别人生活。安全，但从未真正参与。片尾发现，人生不是电影，不能只看不动。",
            symptoms: ["喜欢观察和分析", "参与时会感到消耗", "有很多知识但缺乏体验", "内心深处渴望连接"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "尊重边界的支持者", desc: "给你独处的空间" },
                { name: "智慧的引导者", desc: "教会你观察和思考" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "独立但亲密的伴侣", desc: "尊重你的空间" },
                { name: "深度对话的知己", desc: "少数但深入的关系" },
                { name: "受益于你智慧的人", desc: "你的洞察帮助了他们" }
            ]}
        },
        newScript: {
            title: "《参与的观察者》",
            synopsis: "主角发现：观察和参与不是对立的。他开始选择性地投入，发现深度参与带来的体验是观察无法替代的。",
            keyChanges: ["从「只观察」到「选择性参与」", "从「保持距离」到「适度靠近」", "从「知识」到「体验」"]
        },
        actionPlan: [
            { icon: "🎭", text: "选择一件感兴趣的事，全身心投入体验，不分析" },
            { icon: "👥", text: "参加一个群体活动，不只是旁观" },
            { icon: "💬", text: "和一个人分享你的感受，而不只是想法" },
            { icon: "📝", text: "写下：「如果我知道一切，但从没体验过，那算什么？」" }
        ]
    },
    awakened: {
        name: "觉醒者",
        englishName: "Awakened",
        movieTitle: "《编剧的自我修养》",
        tagline: "「我是编剧，不是剧本」",
        dimensions: { drive: "authenticity", world: "cooperation", self: "authenticity", time: "creation" },
        badMovie: {
            title: "《清醒的孤独》",
            synopsis: "主角看透了剧本的运作，但发现周围的人还在演戏。清醒带来自由，也带来孤独。主角在舞台边缘，不知该上台还是离开。",
            symptoms: ["对自己有深入的觉察", "能看到行为背后的模式", "有时会感到与周围人格格不入", "在「觉醒」和「融入」之间摇摆"]
        },
        cast: {
            innate: { role: "👨‍👩‍👧 先天配角（父母）", parts: [
                { name: "被重新理解的真实的人", desc: "你看到了他们的局限和尽力" },
                { name: "觉醒的触发者", desc: "他们的痛苦或智慧启发了你" }
            ]},
            acquired: { role: "👥 后天配角", parts: [
                { name: "共同成长的伙伴", desc: "一起探索的同行者" },
                { name: "互相启发的觉醒者", desc: "深度的精神连接" },
                { name: "世界", desc: "你共同创作的舞台" }
            ]}
        },
        newScript: {
            title: "《清醒的游戏》",
            synopsis: "主角学会了：觉醒不是逃离生活，而是更深入地参与。他开始用编剧的视角创造人生，既清醒又投入，既自由又连接。",
            keyChanges: ["从「看透一切」到「选择参与」", "从「清醒的孤独」到「有意识的连接」", "从「分析」到「创造」"]
        },
        actionPlan: [
            { icon: "🎬", text: "设计一个「场景」，创造你想要的体验" },
            { icon: "🤝", text: "和一个还在「剧本」中的人真诚连接，不评判" },
            { icon: "🎨", text: "用艺术/创作表达你的觉醒体验" },
            { icon: "📝", text: "写下你的「新剧本」：如果完全由你决定，你想怎么活？" }
        ]
    }
};

// ==================== 原型匹配规则 ====================
const ARCHETYPE_MATCHING_RULES = [
    { archetype: "lone_hero", conditions: { drive: ["achievement"], world: ["battle"], self: ["perfection"], time: ["chasing"] } },
    { archetype: "pleaser", conditions: { drive: ["relationship"], world: ["victim"], self: ["inferiority"], time: ["fate"] } },
    { archetype: "hermit", conditions: { drive: ["security"], world: ["detachment"], self: ["inferiority", "lost"], time: ["stagnation"] } },
    { archetype: "controller", conditions: { drive: ["achievement"], world: ["control"], self: ["perfection"], time: ["chasing"] } },
    { archetype: "victim", conditions: { drive: ["relationship"], world: ["victim"], self: ["inferiority"], time: ["fate"] } },
    { archetype: "performer", conditions: { drive: ["unique"], world: ["narcissism"], self: ["perfection"], time: ["exploration"] } },
    { archetype: "savior", conditions: { drive: ["service"], world: ["cooperation"], self: ["inferiority"], time: ["creation"] } },
    { archetype: "wanderer", conditions: { drive: ["unique"], world: ["detachment"], self: ["lost"], time: ["exploration"] } },
    { archetype: "warrior", conditions: { drive: ["achievement"], world: ["battle"], self: ["authenticity"], time: ["creation"] } },
    { archetype: "healer", conditions: { drive: ["relationship"], world: ["cooperation"], self: ["authenticity"], time: ["creation"] } },
    { archetype: "observer", conditions: { drive: ["security"], world: ["detachment"], self: ["authenticity"], time: ["exploration"] } },
    { archetype: "awakened", conditions: { self: ["authenticity"] } }
];

// ==================== 维度类型中文映射 ====================
const DIMENSION_TYPE_NAMES = {
    drive: { achievement: "成就型", relationship: "关系型", security: "安全型", unique: "独特型", service: "服务型" },
    world: { battle: "战斗型", victim: "受害者型", cooperation: "合作型", detachment: "疏离型", control: "掌控型" },
    self: { perfection: "完美型", inferiority: "自卑型", narcissism: "自恋型", authenticity: "真实型", lost: "迷失型" },
    time: { chasing: "追赶型", stagnation: "停滞型", exploration: "探索型", fate: "宿命型", creation: "创造型" }
};

// ==================== 动态描述 ====================
const DYNAMIC_DESCRIPTIONS = {
    drive: {
        achievement: ["追求卓越", "渴望证明价值", "目标导向", "竞争意识强"],
        relationship: ["重视连接", "渴望被接纳", "关系优先", "害怕被孤立"],
        security: ["追求稳定", "规避风险", "谨慎保守", "重视可预期性"],
        unique: ["追求与众不同", "害怕平庸", "创意十足", "反传统"],
        service: ["乐于助人", "通过付出获得价值", "关怀他人", "富有同情心"]
    },
    world: {
        battle: ["把世界当作战场", "随时准备战斗", "不信任他人", "戒备心强"],
        victim: ["觉得世界不公平", "好事轮不到我", "无力感", "被动接受"],
        cooperation: ["相信共赢", "重视合作", "寻求共识", "避免冲突"],
        detachment: ["保持距离", "旁观者心态", "不参与", "自我保护"],
        control: ["需要掌控", "厌恶失控", "计划性强", "追求确定性"]
    },
    self: {
        perfection: ["对自己苛刻", "永不满足", "内心批评者", "高标准"],
        inferiority: ["觉得自己不够好", "需要认可", "常比较", "自我怀疑"],
        narcissism: ["需要关注", "害怕被忽视", "享受焦点", "形象管理"],
        authenticity: ["接纳真实自己", "不伪装", "自我认知清晰", "内心平和"],
        lost: ["不清楚自己是谁", "迷茫", "寻找方向", "尝试不同角色"]
    },
    time: {
        chasing: ["总觉得时间不够", "必须不断奔跑", "活在未来", "难以放松"],
        stagnation: ["觉得人生定型", "改变很难", "无力感", "接受现状"],
        exploration: ["享受过程", "好奇新事物", "喜欢尝试", "活在当下"],
        fate: ["顺其自然", "听天由命", "接受安排", "不焦虑未来"],
        creation: ["主动创造", "相信努力", "目标明确", "掌控未来"]
    }
};

const COMBINATION_TRANSITIONS = ["同时，", "另一方面，", "与此同时，", "而且，", "此外，"];

// ==================== 混合原型描述 ====================
const MIXED_ARCHETYPE_DESCRIPTIONS = {
    "lone_hero-warrior": "你拥有孤勇者的拼搏精神和战士的自我接纳。你在追求卓越的同时，也在学习如何享受过程。",
    "pleaser-healer": "你有讨好者的敏感和治愈者的温暖。你天生善于关怀他人，正在学习如何也关怀自己。",
    "hermit-observer": "你有隐士的谨慎和观察者的洞察。你喜欢深度而非广度，正在学习如何适度参与。",
    "controller-warrior": "你有控制狂的规划和战士的行动力。你善于掌控局面，正在学习何时该放手。",
    "performer-wanderer": "你有表演者的光芒和漫游者的自由。你追求独特体验，正在寻找真正的归属。",
    "savior-healer": "你有拯救者的付出和治愈者的智慧。你善于帮助他人，正在学习平衡给予和接受。",
    "victim-pleaser": "你有受害者的敏感和讨好者的付出。你经历过伤害，正在学习如何保护自己。"
};

// ==================== 导出数据 ====================
if (typeof window !== 'undefined') {
    window.QUIZ_DATA = {
        APP_CONFIG,
        BASIC_QUESTIONS,
        DIMENSIONS,
        QUESTIONS,
        CHARACTER_LIBRARY,
        ARCHETYPES,
        DIMENSION_TYPE_NAMES,
        ARCHETYPE_MATCHING_RULES,
        MIXED_ARCHETYPE_DESCRIPTIONS,
        DYNAMIC_DESCRIPTIONS,
        COMBINATION_TRANSITIONS
    };
}

// rebuild v2.0 - 80 characters library

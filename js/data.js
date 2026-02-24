/**
 * 人生剧本测试 - 数据文件
 * 包含12题问答和12种原型结果
 */

// 四个维度的类型定义
const DIMENSIONS = {
    drive: {
        name: "核心驱动力",
        types: ["achievement", "relationship", "security", "unique", "service"]
    },
    world: {
        name: "与世界的关系",
        types: ["battle", "victim", "cooperation", "detachment", "control"]
    },
    self: {
        name: "与自我的关系",
        types: ["perfection", "inferiority", "narcissism", "authenticity", "lost"]
    },
    time: {
        name: "与时间的关系",
        types: ["chasing", "stagnation", "exploration", "fate", "creation"]
    }
};

// 12题剧本杀风格问答
// 每题对应一个维度，5个选项对应5种类型
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

// 12种原型结果定义
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
        badMovie: {
            title: "《一个人的马拉松》",
            synopsis: "主角从第一分钟跑到最后一分钟，没有休息，没有陪伴，甚至没有风景。观众看得筋疲力尽，主角却说：停下来就是失败。",
            symptoms: [
                "休息时有强烈的罪恶感",
                "把生活当成必须打赢的战役",
                "很难真正放松和享受",
                "关系因为「不够重要」而被忽视"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "高期待的施压者", desc: "他们的认可永远差一点点" },
                    { name: "不理解但无奈的支持者", desc: "心疼你但不知道怎么帮你" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "被忽视的同行者", desc: "想靠近却总被推开" },
                    { name: "仰望但无法亲近的追随者", desc: "他们看到你发光，却触不到你的疲惫" },
                    { name: "必须击败的敌人", desc: "你给自己制造的假想敌" }
                ]
            }
        },
        newScript: {
            title: "《光荣与陪伴》",
            synopsis: "主角依然追求卓越，但学会了：赢不是唯一价值，休息不是软弱，求助不是失败。他开始欣赏沿途风景，发现有人并肩作战时，胜利更甜。",
            keyChanges: [
                "从「必须赢」到「可以享受过程」",
                "从「独自承担」到「允许被支持」",
                "从「永不满足」到「庆祝小胜利」",
            ]
        },
        actionPlan: [
            { icon: "🛑", text: "今天刻意做一件「无意义」的事，不评判自己" },
            { icon: "📞", text: "给一个很久没联系的朋友打电话，不谈工作" },
            { icon: "📝", text: "写下三件已经做得够好的事，贴在显眼处" },
            { icon: "🏃", text: "运动时不计时、不计距离，纯粹享受身体的感觉" }
        ]
    },

    // 2. 讨好者
    pleaser: {
        name: "讨好者",
        englishName: "Pleaser",
        movieTitle: "《无私奉献》",
        tagline: "「只有付出才配被爱」",
        dimensions: {
            drive: "relationship",
            world: "victim",
            self: "inferiority",
            time: "fate"
        },
        badMovie: {
            title: "《永远不够好》",
            synopsis: "主角不断付出、妥协、牺牲，期待换来爱和认可。但镜头拉远才发现：那些接受的人早已习惯，主角的真心成了理所当然。",
            symptoms: [
                "很难说「不」，即使内心不愿意",
                "害怕冲突，总是先道歉",
                "付出后感到委屈和怨恨",
                "自我价值感建立在他人认可上"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "情感忽视者", desc: "你的感受很少被看见" },
                    { name: "条件式关爱者", desc: "只有乖、听话才配得到爱" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "伤害者/索取者", desc: "被你吸引来的人，往往最会索取" },
                    { name: "利用者", desc: "享受你的好，但从不回报" },
                    { name: "拯救者-疲惫离开者", desc: "想帮你，但你拒绝被帮" }
                ]
            }
        },
        newScript: {
            title: "《被爱的勇气》",
            synopsis: "主角发现：爱不是交易，不需要用付出来兑换。她开始表达真实需求，设立边界。神奇的是，真正爱她的人留下了，只想要好处的离开了。",
            keyChanges: [
                "从「付出换爱」到「我本身就值得被爱」",
                "从「害怕被拒绝」到「筛选值得的人」",
                "从「委屈求全」到「温和而坚定」",
            ]
        },
        actionPlan: [
            { icon: "🚫", text: "今天拒绝一个请求，哪怕只是小事" },
            { icon: "💬", text: "对一个人表达真实的想法，即使可能不被认同" },
            { icon: "🎁", text: "给自己买一件想要的东西，不找理由" },
            { icon: "📝", text: "写下：「如果不需要讨好任何人，我想做什么？」" }
        ]
    },

    // 3. 隐士
    hermit: {
        name: "隐士",
        englishName: "Hermit",
        movieTitle: "《安全区》",
        tagline: "「改变是危险的，独处最安全」",
        dimensions: {
            drive: "security",
            world: "detachment",
            self: "inferiority",
            time: "stagnation"
        },
        badMovie: {
            title: "《永远明天再说》",
            synopsis: "主角住在舒适的洞穴里，外面有阳光、冒险、可能性，但主角说「再等等」。等到片尾字幕升起，洞穴成了坟墓，主角从未真正活过。",
            symptoms: [
                "对新机会的第一反应是风险评估",
                "社交消耗能量，独处才能恢复",
                "错过很多「本来可以」的机会",
                "内心深处渴望连接却害怕受伤"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "过度保护者", desc: "世界很危险，待在安全的地方" },
                    { name: "情感疏离者", desc: "亲近意味着受伤，保持距离" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "难以靠近的室友", desc: "物理上很近，心理上很远" },
                    { name: "偶尔联系的网友", desc: "安全距离的关系" },
                    { name: "互不干扰的平行线", desc: "同事、邻居，但从未真正认识" }
                ]
            }
        },
        newScript: {
            title: "《有根的旅人》",
            synopsis: "主角依然珍视独处，但不再用安全作为逃避的借口。他尝试小步走出舒适区，发现外面的世界没那么可怕，而真正的安全感来自内心的力量。",
            keyChanges: [
                "从「回避风险」到「评估后行动」",
                "从「孤立」到「选择性连接」",
                "从「我不行」到「我可以试试」",
            ]
        },
        actionPlan: [
            { icon: "🚶", text: "去一个从未去过的地方，哪怕只是附近的咖啡馆" },
            { icon: "👋", text: "主动和一个陌生人打招呼或简短交谈" },
            { icon: "📅", text: "答应一个邀请，不找借口推掉" },
            { icon: "✍️", text: "写下：「如果不会失败，我最想尝试什么？」" }
        ]
    },

    // 4. 控制狂
    controller: {
        name: "控制狂",
        englishName: "Controller",
        movieTitle: "《完美计划》",
        tagline: "「失控=失败，必须掌控一切」",
        dimensions: {
            drive: "achievement",
            world: "control",
            self: "perfection",
            time: "chasing"
        },
        badMovie: {
            title: "《崩溃的精密仪器》",
            synopsis: "主角试图控制每个变量，但生活不断抛出意外。每次计划被打乱，主角就更接近崩溃。最后发现，控制的幻觉比失控本身更可怕。",
            symptoms: [
                "事情不按计划进行会焦虑",
                "很难信任他人，喜欢亲力亲为",
                "经常 micromanagement",
                "放松时也在想着「还有什么没做」"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "高控制者", desc: "你学会了控制是生存方式" },
                    { name: "无力者", desc: "你发誓不要像他们那样无助" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "被控制的傀儡", desc: "后来变成「反抗的叛逆者」" },
                    { name: "阳奉阴违的执行者", desc: "表面顺从，内心抵触" },
                    { name: "压抑的继承者", desc: "你的孩子可能正在承受" }
                ]
            }
        },
        newScript: {
            title: "《优雅的冲浪者》",
            synopsis: "主角学会了：控制能控制的，接纳不能控制的。他发现放下控制后，团队更有活力，关系更真实，而他自己，终于能睡个好觉。",
            keyChanges: [
                "从「控制一切」到「影响关键」",
                "从「计划完美」到「灵活应变」",
                "从「不信任」到「授权与信任」",
            ]
        },
        actionPlan: [
            { icon: "🎲", text: "今天故意不做计划，看看会发生什么" },
            { icon: "🤝", text: "把一件任务完全交给别人，不干涉过程" },
            { icon: "🧘", text: "当焦虑出现时，深呼吸，告诉自己「我可以不确定」" },
            { icon: "📝", text: "写下：「如果我不控制，最坏会发生什么？我能承受吗？」" }
        ]
    },

    // 5. 受害者
    victim: {
        name: "受害者",
        englishName: "Victim",
        movieTitle: "《无辜者》",
        tagline: "「世界伤害我，这不是我的错」",
        dimensions: {
            drive: "relationship",
            world: "victim",
            self: "inferiority",
            time: "fate"
        },
        badMovie: {
            title: "《重复播放的悲剧》",
            synopsis: "主角的人生是一部重复的悲剧，不同的场景，同样的剧本：被伤害、被辜负、被忽视。主角说「这不公平」，但镜头显示，主角从未尝试换台。",
            symptoms: [
                "经常感到委屈和无助",
                "遇到问题时先找外部原因",
                "重复遇到类似的负面情境",
                "渴望被拯救，但拒绝自救"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "加害者", desc: "你的剧本从受伤开始" },
                    { name: "拯救者-加害者循环", desc: "帮你又伤你的循环" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "施虐者", desc: "被你的受害者气场吸引" },
                    { name: "拯救者-疲惫离开者", desc: "想帮你，但你拒绝改变" },
                    { name: "冷漠的旁观者", desc: "你的抱怨让他们远离" }
                ]
            }
        },
        newScript: {
            title: "《重生的选择权》",
            synopsis: "主角意识到：过去确实发生了，但现在的反应是自己的选择。她开始为自己的生活负责，发现原来一直都有力量，只是之前没用过。",
            keyChanges: [
                "从「为什么是我」到「现在我该怎么办」",
                "从「等待拯救」到「自我赋能」",
                "从「重复创伤」到「打破循环」",
            ]
        },
        actionPlan: [
            { icon: "✋", text: "当想抱怨时，停下来，问自己「我能做什么改变？」" },
            { icon: "🎯", text: "设定一个小目标并完成它，体验掌控感" },
            { icon: "🙏", text: "写下三件感恩的事，训练看到资源而非问题" },
            { icon: "💪", text: "做一件过去觉得自己做不到的事，证明给自己看" }
        ]
    },

    // 6. 表演者
    performer: {
        name: "表演者",
        englishName: "Performer",
        movieTitle: "《聚光灯下》",
        tagline: "「被看见=存在，平凡=死亡」",
        dimensions: {
            drive: "unique",
            world: "narcissism",
            self: "perfection",
            time: "exploration"
        },
        badMovie: {
            title: "《永不落幕的假面舞会》",
            synopsis: "主角戴着各种面具，在不同的舞台扮演完美的角色。观众鼓掌，但没有人知道面具后面是谁——包括主角自己。曲终人散，只剩空虚。",
            symptoms: [
                "很在意他人评价和关注",
                "难以建立深度关系",
                "经常感到内心空虚",
                "形象管理消耗大量精力"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "conditional love 给予者", desc: "只有表现好才配被爱" },
                    { name: "忽视真实需求的赞美者", desc: "赞美你的成就，不看你的感受" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "观众/粉丝", desc: "后来变成「厌倦的离开者」" },
                    { name: "仰望者", desc: "他们爱的可能是你的面具" },
                    { name: "竞争者", desc: "和你争夺关注的人" }
                ]
            }
        },
        newScript: {
            title: "《真实的魅力》",
            synopsis: "主角发现：真实的自己不完美，但比完美的面具更有力量。他开始展示脆弱，发现真正的连接发生在面具摘下的时刻。",
            keyChanges: [
                "从「被看见才有价值」到「我存在，无需证明」",
                "从「superficial 关系」到「深度连接」",
                "从「形象管理」到「真实表达」",
            ]
        },
        actionPlan: [
            { icon: "😊", text: "今天不化妆/不精心打扮，素颜面对世界" },
            { icon: "💬", text: "对一个人表达真实的脆弱，说「我其实不太确定」" },
            { icon: "📵", text: "不发朋友圈/社交媒体，体验不被关注的一天" },
            { icon: "🎭", text: "写下：「如果没人看，我想成为什么样的人？」" }
        ]
    },

    // 7. 拯救者
    savior: {
        name: "拯救者",
        englishName: "Savior",
        movieTitle: "《救世主》",
        tagline: "「被需要=有价值」",
        dimensions: {
            drive: "service",
            world: "cooperation",
            self: "inferiority",
            time: "creation"
        },
        badMovie: {
            title: "《燃尽的蜡烛》",
            synopsis: "主角不断燃烧自己照亮别人，直到油尽灯枯。那些被帮助的人要么依赖成性，要么成长后离开。主角躺在灰烬中问：我自己呢？",
            symptoms: [
                "很难拒绝别人的求助",
                "忽视自己的需求",
                "关系中常常不平等",
                "付出后感到怨恨但无法停止"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "需要被照顾的弱者", desc: "你从小学会了照顾别人" },
                    { name: "牺牲型的榜样", desc: "妈妈/爸爸就是这样付出的" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "被拯救的依赖者", desc: "后来变成「怨恨的独立者」" },
                    { name: "不断求助者", desc: "你的善良吸引了他们" },
                    { name: "甩锅者", desc: "知道你会接手，所以不承担责任" }
                ]
            }
        },
        newScript: {
            title: "《有边界的光》",
            synopsis: "主角学会了：真正的帮助不是牺牲自己，而是赋能他人。她开始设立边界，发现健康的关系是互相滋养，而不是单向拯救。",
            keyChanges: [
                "从「被需要才有价值」到「我有价值，无需证明」",
                "从「过度付出」到「适度帮助」",
                "从「忽视自己」到「自我关怀」",
            ]
        },
        actionPlan: [
            { icon: "🙅", text: "当有人求助时，先问自己「我真的愿意吗？」" },
            { icon: "💆", text: "做一件纯粹为自己做的事，不带任何「有用」的目的" },
            { icon: "🗣️", text: "向一个人表达你的需求，而不是先问对方需要什么" },
            { icon: "📝", text: "写下：「如果我不再帮助任何人，我还值得存在吗？」" }
        ]
    },

    // 8. 漫游者
    wanderer: {
        name: "漫游者",
        englishName: "Wanderer",
        movieTitle: "《在路上》",
        tagline: "「答案在路上，停留=窒息」",
        dimensions: {
            drive: "unique",
            world: "detachment",
            self: "lost",
            time: "exploration"
        },
        badMovie: {
            title: "《没有终点的列车》",
            synopsis: "主角永远在移动，换工作、换城市、换关系。每个地方都是暂时的，每段关系都是浅尝辄止。片尾，主角看着窗外飞逝的风景，不知自己在哪里。",
            symptoms: [
                "很难在一个地方/关系停留太久",
                "深入时会感到不安",
                "有很多经历但缺乏积累",
                "内心深处有存在主义空虚"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "缺席者", desc: "你学会了不依赖任何人" },
                    { name: "无法理解的旁观者", desc: "他们希望你稳定下来" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "短暂的同行者", desc: "来了又走，像你自己一样" },
                    { name: "散落各地的旧识", desc: "很多关系没有深入就结束" },
                    { name: "无法归类的边缘人", desc: "社会角色模糊" }
                ]
            }
        },
        newScript: {
            title: "《有根的流浪》",
            synopsis: "主角发现：探索不意味着不能停留，自由不意味着没有归属。他开始尝试深入，发现真正的冒险是建立深度连接，而不是不断逃离。",
            keyChanges: [
                "从「答案在路上」到「答案也在当下」",
                "从「逃离」到「选择」",
                "从「superficial 体验」到「深度投入」",
            ]
        },
        actionPlan: [
            { icon: "🌱", text: "承诺做一件事至少三个月，不中途放弃" },
            { icon: "🤝", text: "主动联系一个旧友，深化这段关系" },
            { icon: "🏠", text: "为自己创造一个「基地」，哪怕只是一个角落" },
            { icon: "📝", text: "写下：「我在逃避什么？如果停下来，会发生什么？」" }
        ]
    },

    // 9. 战士
    warrior: {
        name: "战士",
        englishName: "Warrior",
        movieTitle: "《荣耀之战》",
        tagline: "「战斗是本能，但我不被战斗定义」",
        dimensions: {
            drive: "achievement",
            world: "battle",
            self: "authenticity",
            time: "creation"
        },
        badMovie: {
            title: "《孤独的胜利》",
            synopsis: "主角赢得了一场又一场战斗，但发现胜利带来的满足感越来越短。奖杯堆满房间，但房间里没有人。",
            symptoms: [
                "享受竞争和挑战",
                "有时会忽视关系的重要性",
                "休息时会感到不安",
                "把生活看作一系列需要打赢的战役"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "坚强的后盾", desc: "支持你去战斗" },
                    { name: "共同战斗的战友", desc: "教会你战斗的方式" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "并肩作战的搭档", desc: "可以托付后背的人" },
                    { name: "可靠的盟友", desc: "互相支持的朋友" },
                    { name: "尊重的敌人", desc: "让你变得更强的人" }
                ]
            }
        },
        newScript: {
            title: "《智者的战斗》",
            synopsis: "主角依然热爱挑战，但学会了选择值得的战斗。他发现真正的强大不是战胜所有人，而是知道为什么而战，以及何时该放下剑。",
            keyChanges: [
                "从「赢得一切」到「选择值得的战斗」",
                "从「独自战斗」到「建立同盟」",
                "从「战斗定义我」到「我选择何时战斗」",
            ]
        },
        actionPlan: [
            { icon: "🎯", text: "审视当前的「战斗」，哪些值得继续，哪些可以放下？" },
            { icon: "🤗", text: "向一个战友表达感谢，不是关于胜利，而是关于陪伴" },
            { icon: "🧘", text: "尝试一天不竞争，纯粹享受过程" },
            { icon: "📝", text: "写下：「如果不需要证明什么，我还想做什么？」" }
        ]
    },

    // 10. 治愈者
    healer: {
        name: "治愈者",
        englishName: "Healer",
        movieTitle: "《爱的流动》",
        tagline: "「爱是流动的，给予和接受同样重要」",
        dimensions: {
            drive: "relationship",
            world: "cooperation",
            self: "authenticity",
            time: "creation"
        },
        badMovie: {
            title: "《过度付出的温柔》",
            synopsis: "主角给予太多，接受太少，最后精疲力竭。那些接受爱的人习惯了索取，忘记了爱需要双向流动。",
            symptoms: [
                "善于倾听和支持他人",
                "有时会忽视自己的需求",
                "难以接受别人的帮助",
                "在关系中倾向于照顾者的角色"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "真实的关爱者", desc: "给你无条件的爱" },
                    { name: "情感支持的榜样", desc: "教会你如何爱人" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "平等的同行者", desc: "互相滋养的关系" },
                    { name: "互相滋养的知己", desc: "深度的友谊" },
                    { name: "受益于你帮助的人", desc: "你温暖了他们的生命" }
                ]
            }
        },
        newScript: {
            title: "《完整的圆》",
            synopsis: "主角学会了：真正的治愈包括治愈自己。他开始接受帮助，允许自己被爱，发现关系变得更加平衡和深厚。",
            keyChanges: [
                "从「只给予」到「也接受」",
                "从「照顾他人」到「互相照顾」",
                "从「忽视自己」到「自我关怀」",
            ]
        },
        actionPlan: [
            { icon: "🎁", text: "接受别人的帮助或礼物，不说「不用了」" },
            { icon: "💬", text: "向一个人表达你的需要，而不是先问对方" },
            { icon: "🛁", text: "给自己安排一个「被照顾」的时间，像对待朋友那样对待自己" },
            { icon: "📝", text: "写下：「当我接受爱时，我给了别人什么礼物？」" }
        ]
    },

    // 11. 观察者
    observer: {
        name: "观察者",
        englishName: "Observer",
        movieTitle: "《静水流深》",
        tagline: "「观察即参与，深度优于广度」",
        dimensions: {
            drive: "security",
            world: "detachment",
            self: "authenticity",
            time: "exploration"
        },
        badMovie: {
            title: "《永远旁观的人生》",
            synopsis: "主角坐在观众席，看着别人生活。安全，但从未真正参与。片尾发现，人生不是电影，不能只看不动。",
            symptoms: [
                "喜欢观察和分析",
                "参与时会感到消耗",
                "有很多知识但缺乏体验",
                "内心深处渴望连接"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "尊重边界的支持者", desc: "给你独处的空间" },
                    { name: "智慧的引导者", desc: "教会你观察和思考" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "独立但亲密的伴侣", desc: "尊重你的空间" },
                    { name: "深度对话的知己", desc: "少数但深入的关系" },
                    { name: "受益于你智慧的人", desc: "你的洞察帮助了他们" }
                ]
            }
        },
        newScript: {
            title: "《参与的观察者》",
            synopsis: "主角发现：观察和参与不是对立的。他开始选择性地投入，发现深度参与带来的体验是观察无法替代的。",
            keyChanges: [
                "从「只观察」到「选择性参与」",
                "从「保持距离」到「适度靠近」",
                "从「知识」到「体验」",
            ]
        },
        actionPlan: [
            { icon: "🎭", text: "选择一件感兴趣的事，全身心投入体验，不分析" },
            { icon: "👥", text: "参加一个群体活动，不只是旁观" },
            { icon: "💬", text: "和一个人分享你的感受，而不只是想法" },
            { icon: "📝", text: "写下：「如果我知道一切，但从没体验过，那算什么？」" }
        ]
    },

    // 12. 觉醒者
    awakened: {
        name: "觉醒者",
        englishName: "Awakened",
        movieTitle: "《编剧的自我修养》",
        tagline: "「我是编剧，不是剧本」",
        dimensions: {
            drive: "authenticity",
            world: "cooperation",
            self: "authenticity",
            time: "creation"
        },
        badMovie: {
            title: "《清醒的孤独》",
            synopsis: "主角看透了剧本的运作，但发现周围的人还在演戏。清醒带来自由，也带来孤独。主角在舞台边缘，不知该上台还是离开。",
            symptoms: [
                "对自己有深入的觉察",
                "能看到行为背后的模式",
                "有时会感到与周围人格格不入",
                "在「觉醒」和「融入」之间摇摆"
            ]
        },
        cast: {
            innate: {
                role: "👨‍👩‍👧 先天配角（父母）",
                parts: [
                    { name: "被重新理解的真实的人", desc: "你看到了他们的局限和尽力" },
                    { name: "觉醒的触发者", desc: "他们的痛苦或智慧启发了你" }
                ]
            },
            acquired: {
                role: "👥 后天配角",
                parts: [
                    { name: "共同成长的伙伴", desc: "一起探索的同行者" },
                    { name: "互相启发的觉醒者", desc: "深度的精神连接" },
                    { name: "世界", desc: "你共同创作的舞台" }
                ]
            }
        },
        newScript: {
            title: "《清醒的游戏》",
            synopsis: "主角学会了：觉醒不是逃离生活，而是更深入地参与。他开始用编剧的视角创造人生，既清醒又投入，既自由又连接。",
            keyChanges: [
                "从「看透一切」到「选择参与」",
                "从「清醒的孤独」到「有意识的连接」",
                "从「分析」到「创造」",
            ]
        },
        actionPlan: [
            { icon: "🎬", text: "设计一个「场景」，创造你想要的体验" },
            { icon: "🤝", text: "和一个还在「剧本」中的人真诚连接，不评判" },
            { icon: "🎨", text: "用艺术/创作表达你的觉醒体验" },
            { icon: "📝", text: "写下你的「新剧本」：如果完全由你决定，你想怎么活？" }
        ]
    }
};

// 维度类型中文映射
const DIMENSION_TYPE_NAMES = {
    drive: {
        achievement: "成就型",
        relationship: "关系型",
        security: "安全型",
        unique: "独特型",
        service: "服务型"
    },
    world: {
        battle: "战斗型",
        victim: "受害者型",
        cooperation: "合作型",
        detachment: "疏离型",
        control: "掌控型"
    },
    self: {
        perfection: "完美型",
        inferiority: "自卑型",
        narcissism: "自恋型",
        authenticity: "真实型",
        lost: "迷失型"
    },
    time: {
        chasing: "追赶型",
        stagnation: "停滞型",
        exploration: "探索型",
        fate: "宿命型",
        creation: "创造型"
    }
};

// 原型匹配规则
// 根据四个维度的最高得分类型匹配原型
const ARCHETYPE_MATCHING_RULES = [
    // 孤勇者
    {
        archetype: "lone_hero",
        conditions: {
            drive: ["achievement"],
            world: ["battle"],
            self: ["perfection"],
            time: ["chasing"]
        }
    },
    // 讨好者
    {
        archetype: "pleaser",
        conditions: {
            drive: ["relationship"],
            world: ["victim"],
            self: ["inferiority"],
            time: ["fate"]
        }
    },
    // 隐士
    {
        archetype: "hermit",
        conditions: {
            drive: ["security"],
            world: ["detachment"],
            self: ["inferiority", "lost"],
            time: ["stagnation"]
        }
    },
    // 控制狂
    {
        archetype: "controller",
        conditions: {
            drive: ["achievement"],
            world: ["control"],
            self: ["perfection"],
            time: ["chasing"]
        }
    },
    // 受害者
    {
        archetype: "victim",
        conditions: {
            drive: ["relationship"],
            world: ["victim"],
            self: ["inferiority"],
            time: ["fate"]
        }
    },
    // 表演者
    {
        archetype: "performer",
        conditions: {
            drive: ["unique"],
            world: ["narcissism"],
            self: ["perfection"],
            time: ["exploration"]
        }
    },
    // 拯救者
    {
        archetype: "savior",
        conditions: {
            drive: ["service"],
            world: ["cooperation"],
            self: ["inferiority"],
            time: ["creation"]
        }
    },
    // 漫游者
    {
        archetype: "wanderer",
        conditions: {
            drive: ["unique"],
            world: ["detachment"],
            self: ["lost"],
            time: ["exploration"]
        }
    },
    // 战士
    {
        archetype: "warrior",
        conditions: {
            drive: ["achievement"],
            world: ["battle"],
            self: ["authenticity"],
            time: ["creation"]
        }
    },
    // 治愈者
    {
        archetype: "healer",
        conditions: {
            drive: ["relationship"],
            world: ["cooperation"],
            self: ["authenticity"],
            time: ["creation"]
        }
    },
    // 观察者
    {
        archetype: "observer",
        conditions: {
            drive: ["security"],
            world: ["detachment"],
            self: ["authenticity"],
            time: ["exploration"]
        }
    },
    // 觉醒者 - 默认匹配，当self为authenticity时
    {
        archetype: "awakened",
        conditions: {
            self: ["authenticity"]
        }
    }
];

// 混合原型描述（当得分接近时）
const MIXED_ARCHETYPE_DESCRIPTIONS = {
    "lone_hero-warrior": "你拥有孤勇者的拼搏精神和战士的自我接纳。你在追求卓越的同时，也在学习如何享受过程。",
    "pleaser-healer": "你有讨好者的敏感和治愈者的温暖。你天生善于关怀他人，正在学习如何也关怀自己。",
    "hermit-observer": "你有隐士的谨慎和观察者的洞察。你喜欢深度而非广度，正在学习如何适度参与。",
    "controller-warrior": "你有控制狂的规划和战士的行动力。你善于掌控局面，正在学习何时该放手。",
    "performer-wanderer": "你有表演者的光芒和漫游者的自由。你追求独特体验，正在寻找真正的归属。",
    "savior-healer": "你有拯救者的付出和治愈者的智慧。你善于帮助他人，正在学习平衡给予和接受。",
    "victim-pleaser": "你有受害者的敏感和讨好者的付出。你经历过伤害，正在学习如何保护自己。"
};

// 导出数据（用于模块化，但这里直接挂载到window）
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
// rebuild Tue Feb 24 03:34:16 PM CST 2026

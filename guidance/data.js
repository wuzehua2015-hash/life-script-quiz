// 行动指导系统数据

const GuidanceData = {
    // 12原型行动指导
    archetypes: {
        lone_hero: {
            name: '孤勇者',
            icon: '🦅',
            shortDesc: '习惯独自承担，难以信任他人',
            challenge: '过度独立导致孤立，无法获得支持',
            strategy: [
                '从小事开始寻求他人帮助',
                '练习表达脆弱和需求',
                '建立至少一个深度关系'
            ],
            dailyPractice: [
                'Day 1: 觉察自己何时在独自硬撑',
                'Day 2: 向一个人表达"我需要帮助"',
                'Day 3: 接受别人的好意而不回报',
                'Day 4: 分享自己的困难给一个信任的人',
                'Day 5: 允许自己休息而不内疚'
            ],
            resources: [
                '《被讨厌的勇气》- 学会课题分离',
                '《关系：适度依赖让我们走得更近》'
            ]
        },
        
        pleaser: {
            name: '讨好者',
            icon: '😊',
            shortDesc: '过度关注他人，忽视自己需求',
            challenge: '边界模糊，容易疲惫和 resentment',
            strategy: [
                '练习说"不"，从小事开始',
                '每天问自己"我想要什么"',
                '建立自我关怀的日常仪式'
            ],
            dailyPractice: [
                'Day 1: 记录今天说了几次"好的"',
                'Day 2: 拒绝一个不合理的小请求',
                'Day 3: 表达自己的真实想法',
                'Day 4: 做一件只为自己做的事',
                'Day 5: 不主动帮助别人，等待求助'
            ],
            resources: [
                '《界限》- 学会设立健康边界',
                '《讨好是一种病》'
            ]
        },
        
        hermit: {
            name: '隐士',
            icon: '🐚',
            shortDesc: '回避社交，害怕被看见',
            challenge: '过度保护导致错失机会和连接',
            strategy: [
                '小步尝试社交，不强迫自己',
                '找到舒适的社交方式',
                '在安全环境中练习表达'
            ],
            dailyPractice: [
                'Day 1: 觉察自己想要逃避的时刻',
                'Day 2: 和一个熟人多聊5分钟',
                'Day 3: 在群体中发表一次意见',
                'Day 4: 参加一个小型社交活动',
                'Day 5: 分享自己的一个想法给他人'
            ],
            resources: [
                '《内向者优势》',
                '《社交焦虑》'
            ]
        },
        
        controller: {
            name: '控制狂',
            icon: '🎮',
            shortDesc: '需要掌控一切，难以放手',
            challenge: '控制导致压力和关系紧张',
            strategy: [
                '识别可控与不可控的界限',
                '练习放手和信任',
                '接纳不确定性和混乱'
            ],
            dailyPractice: [
                'Day 1: 记录今天想要控制的时刻',
                'Day 2: 允许一件事按别人的方式做',
                'Day 3: 不给出建议，只倾听',
                'Day 4: 故意做一件"不完美"的事',
                'Day 5: 信任他人的决定'
            ],
            resources: [
                '《控制狂的自愈指南》',
                '《臣服实验》'
            ]
        },
        
        victim: {
            name: '受害者',
            icon: '⚡',
            shortDesc: '感觉被生活针对，无力改变',
            challenge: '被动等待，放弃自己的选择权',
            strategy: [
                '识别自己的选择权',
                '从"不得不"到"我选择"',
                '为自己的反应负责'
            ],
            dailyPractice: [
                'Day 1: 记录今天"被迫"做的事',
                'Day 2: 把一个"必须"改成"我选择"',
                'Day 3: 为自己的情绪负责',
                'Day 4: 做一个小而主动的决定',
                'Day 5: 感谢生活中的一件小事'
            ],
            resources: [
                '《活出生命的意义》',
                '《选择理论》'
            ]
        },
        
        performer: {
            name: '表演者',
            icon: '🎭',
            shortDesc: '追求认可，害怕真实的自己',
            challenge: '外在成功与内在空虚的冲突',
            strategy: [
                '区分"我是谁"和"我做了什么"',
                '练习不被看见时的自我价值',
                '建立内在的认可系统'
            ],
            dailyPractice: [
                'Day 1: 觉察自己何时在"表演"',
                'Day 2: 做一件不会告诉任何人的好事',
                'Day 3: 承认自己的一个缺点',
                'Day 4: 不寻求反馈地完成一件事',
                'Day 5: 写下自己的3个内在品质'
            ],
            resources: [
                '《完美主义》',
                '《真实的幸福》'
            ]
        },
        
        savior: {
            name: '拯救者',
            icon: '🦸',
            shortDesc: '习惯帮助他人，忽视自己',
            challenge: '拯救成瘾，边界不清，耗竭自己',
            strategy: [
                '区分帮助与拯救',
                '允许他人承担后果',
                '把精力放回自己身上'
            ],
            dailyPractice: [
                'Day 1: 记录今天想要"拯救"的冲动',
                'Day 2: 不主动提供建议',
                'Day 3: 拒绝一个求助，推荐其他资源',
                'Day 4: 做一件只为自己服务的事',
                'Day 5: 观察别人如何自己解决问题'
            ],
            resources: [
                '《不再拯救》',
                '《共情疲劳》'
            ]
        },
        
        wanderer: {
            name: '漫游者',
            icon: '🦋',
            shortDesc: '不断寻找，难以扎根',
            challenge: '逃避承诺，无法建立深度',
            strategy: [
                '探索背后的逃避模式',
                '练习承诺小事物',
                '发现当下的丰富性'
            ],
            dailyPractice: [
                'Day 1: 觉察自己想要"离开"的冲动',
                'Day 2: 完成一件拖延的小事',
                'Day 3: 和一个旧朋友重新联系',
                'Day 4: 承诺并坚持一个小习惯',
                'Day 5: 写下当下生活中的3件美好'
            ],
            resources: [
                '《当下的力量》',
                '《逃避自由》'
            ]
        },
        
        warrior: {
            name: '战士',
            icon: '⚔️',
            shortDesc: '不断战斗，难以放松',
            challenge: '过度警觉，无法享受和平',
            strategy: [
                '识别真正的威胁与想象的威胁',
                '练习放松和信任',
                '发现战斗之外的价值'
            ],
            dailyPractice: [
                'Day 1: 记录今天"战斗"的时刻',
                'Day 2: 不反驳，只听别人的观点',
                'Day 3: 做一件"无用"的享受活动',
                'Day 4: 感谢一个"对手"',
                'Day 5: 练习10分钟什么都不做'
            ],
            resources: [
                '《和平战士》',
                '《身体从未忘记》'
            ]
        },
        
        healer: {
            name: '治愈者',
            icon: '💚',
            shortDesc: '关注他人痛苦，容易耗竭',
            challenge: '过度吸收他人情绪，忽视自己',
            strategy: [
                '建立情感边界',
                '区分同情与共情',
                '优先照顾自己'
            ],
            dailyPractice: [
                'Day 1: 觉察自己何时"吸收"了他人情绪',
                'Day 2: 不试图解决别人的情绪',
                'Day 3: 拒绝一个情感劳动的请求',
                'Day 4: 做一件纯粹让自己开心的事',
                'Day 5: 写下自己的需求清单'
            ],
            resources: [
                '《共情疲劳》',
                '《高敏感人群》'
            ]
        },
        
        observer: {
            name: '观察者',
            icon: '🔭',
            shortDesc: '保持距离，难以参与',
            challenge: '过度思考，行动不足',
            strategy: [
                '从观察转向小行动',
                '接纳不完美的尝试',
                '体验而非分析'
            ],
            dailyPractice: [
                'Day 1: 觉察自己何时在"旁观"',
                'Day 2: 做一个即兴的小决定',
                'Day 3: 参与而非观察一个活动',
                'Day 4: 做一件没有准备的事',
                'Day 5: 分享一个真实的感受'
            ],
            resources: [
                '《第五项修炼》',
                '《当下的力量》'
            ]
        },
        
        awakened: {
            name: '觉醒者',
            icon: '☀️',
            shortDesc: '正在转变，需要整合',
            challenge: '新旧模式的冲突，需要耐心',
            strategy: [
                '接纳转变的过程',
                '整合新旧模式',
                '寻找支持系统'
            ],
            dailyPractice: [
                'Day 1: 记录今天的新觉察',
                'Day 2: 练习新的反应方式一次',
                'Day 3: 原谅自己回到旧模式',
                'Day 4: 庆祝一个小进步',
                'Day 5: 写下自己想要的未来'
            ],
            resources: [
                '《臣服实验》',
                '《新世界》'
            ]
        }
    },
    
    // 21天计划模板
    planTemplate: {
        title: '21天改变计划',
        description: '每天5-10分钟，逐步重塑你的人生剧本',
        weeks: [
            {
                week: 1,
                theme: '觉察',
                days: [
                    { day: 1, task: '觉察自己的模式何时出现', time: '5分钟' },
                    { day: 2, task: '记录触发你模式的情境', time: '5分钟' },
                    { day: 3, task: '观察自己的身体反应', time: '5分钟' },
                    { day: 4, task: '识别模式背后的信念', time: '10分钟' },
                    { day: 5, task: '写下这个模式如何保护过你', time: '10分钟' },
                    { day: 6, task: '觉察今天的情绪变化', time: '5分钟' },
                    { day: 7, task: '回顾本周的觉察收获', time: '10分钟' }
                ]
            },
            {
                week: 2,
                theme: '尝试',
                days: [
                    { day: 8, task: '选择一个新模式小尝试', time: '10分钟' },
                    { day: 9, task: '实践原型专属练习', time: '10分钟' },
                    { day: 10, task: '记录尝试时的感受', time: '5分钟' },
                    { day: 11, task: '再次实践，调整方法', time: '10分钟' },
                    { day: 12, task: '寻求反馈或支持', time: '10分钟' },
                    { day: 13, task: '庆祝一个小突破', time: '5分钟' },
                    { day: 14, task: '回顾本周的尝试成果', time: '10分钟' }
                ]
            },
            {
                week: 3,
                theme: '巩固',
                days: [
                    { day: 15, task: '连续实践新模式', time: '10分钟' },
                    { day: 16, task: '应对 setback，不责备自己', time: '5分钟' },
                    { day: 17, task: '寻找更多实践机会', time: '10分钟' },
                    { day: 18, task: '分享你的改变给他人', time: '10分钟' },
                    { day: 19, task: '整合新旧模式的优势', time: '10分钟' },
                    { day: 20, task: '制定后续行动计划', time: '10分钟' },
                    { day: 21, task: '庆祝完成，颁发证书', time: '15分钟' }
                ]
            }
        ]
    }
};

// 导出
if (typeof window !== 'undefined') {
    window.GuidanceData = GuidanceData;
}

/**
 * 紧急干预工具箱 - Emergency Intervention Toolkit
 * 
 * 这是一个安全网功能，为情绪低谷的用户提供快速应对工具
 * 包括：呼吸练习、grounding技巧、自我对话引导、心理援助热线
 */

// ==================== 呼吸练习配置 ====================
const BREATHING_EXERCISES = [
    {
        id: 'box_breathing',
        name: '盒式呼吸',
        desc: '帮助快速平复焦虑',
        icon: '📦',
        steps: [
            { phase: 'inhale', text: '吸气', duration: 4000, desc: '用鼻子缓慢吸气' },
            { phase: 'hold1', text: '屏息', duration: 4000, desc: '保持呼吸' },
            { phase: 'exhale', text: '呼气', duration: 4000, desc: '用嘴缓慢呼气' },
            { phase: 'hold2', text: '屏息', duration: 4000, desc: '保持' }
        ],
        cycles: 3,
        color: '#4A90E2'
    },
    {
        id: '478_breathing',
        name: '4-7-8 呼吸',
        desc: '帮助入睡和深度放松',
        icon: '🌙',
        steps: [
            { phase: 'inhale', text: '吸气', duration: 4000, desc: '用鼻子吸气' },
            { phase: 'hold', text: '屏息', duration: 7000, desc: '保持呼吸' },
            { phase: 'exhale', text: '呼气', duration: 8000, desc: '用嘴呼气，发出呼呼声' }
        ],
        cycles: 4,
        color: '#7B68EE'
    },
    {
        id: 'coherent_breathing',
        name: '共振呼吸',
        desc: '平衡神经系统',
        icon: '🌊',
        steps: [
            { phase: 'inhale', text: '吸气', duration: 5500, desc: '缓慢吸气' },
            { phase: 'exhale', text: '呼气', duration: 5500, desc: '缓慢呼气' }
        ],
        cycles: 5,
        color: '#20B2AA'
    }
];

// ==================== Grounding 技巧配置 ====================
const GROUNDING_TECHNIQUES = [
    {
        id: '54321',
        name: '5-4-3-2-1 感官 grounding',
        desc: '用五感回到当下',
        icon: '👁️',
        color: '#FF6B6B',
        steps: [
            { 
                number: 5, 
                sense: '看', 
                icon: '👁️',
                desc: '说出你看到的5样东西',
                examples: ['墙上的画', '窗外的树', '桌上的杯子', '我的手', '地板的颜色'],
                prompt: '环顾四周，说出5样你能看到的东西'
            },
            { 
                number: 4, 
                sense: '触', 
                icon: '✋',
                desc: '感受4样你能触摸的东西',
                examples: ['衣服的质地', '椅子的硬度', '皮肤的温度', '地面的触感'],
                prompt: '感受你的身体与周围环境的接触'
            },
            { 
                number: 3, 
                sense: '听', 
                icon: '👂',
                desc: '识别3样你能听到的声音',
                examples: ['空调声', '远处的车声', '自己的呼吸声'],
                prompt: '仔细听，识别3种声音'
            },
            { 
                number: 2, 
                sense: '闻', 
                icon: '👃',
                desc: '注意2样你能闻到的气味',
                examples: ['咖啡香', '清新的空气', '护手霜的味道'],
                prompt: '深呼吸，注意你能闻到的气味'
            },
            { 
                number: 1, 
                sense: '尝', 
                icon: '👅',
                desc: '注意1样你能尝到的味道',
                examples: ['口中的余味', '淡淡的甜味', '薄荷的清凉'],
                prompt: '注意你口中的味道'
            }
        ]
    },
    {
        id: 'cold_water',
        name: '冷水 grounding',
        desc: '用冷水激活身体',
        icon: '💧',
        color: '#4ECDC4',
        steps: [
            { 
                number: 1, 
                sense: '准备', 
                icon: '💧',
                desc: '准备冷水',
                prompt: '去洗手间，打开水龙头'
            },
            { 
                number: 2, 
                sense: '感受', 
                icon: '✋',
                desc: '将手放在冷水下',
                prompt: '感受水流过手指的感觉'
            },
            { 
                number: 3, 
                sense: '专注', 
                icon: '🧘',
                desc: '专注于温度变化',
                prompt: '注意水温从暖到凉的变化'
            }
        ]
    },
    {
        id: 'body_scan',
        name: '身体扫描 grounding',
        desc: '通过身体感受回到当下',
        icon: '🧘',
        color: '#9B59B6',
        steps: [
            { 
                number: 1, 
                sense: '脚', 
                icon: '🦶',
                desc: '感受双脚与地面的接触',
                prompt: '把注意力放在双脚上，感受它们与地面的接触'
            },
            { 
                number: 2, 
                sense: '腿', 
                icon: '🦵',
                desc: '感受腿部的感觉',
                prompt: '感受腿部的重量、温度、任何感觉'
            },
            { 
                number: 3, 
                sense: '躯干', 
                icon: '🫁',
                desc: '感受腹部和胸部的起伏',
                prompt: '随着呼吸，感受腹部的起伏'
            },
            { 
                number: 4, 
                sense: '手', 
                icon: '✋',
                desc: '感受双手的感觉',
                prompt: '感受双手的温度和重量'
            },
            { 
                number: 5, 
                sense: '头', 
                icon: '🧠',
                desc: '感受头部和面部',
                prompt: '放松面部肌肉，感受头部的感觉'
            }
        ]
    }
];

// ==================== 自我对话引导 ====================
const SELF_TALK_GUIDES = [
    {
        id: 'panic',
        title: '当恐慌来袭时',
        icon: '😰',
        color: '#E74C3C',
        messages: [
            { type: 'acknowledge', text: '我注意到我现在感到恐慌' },
            { type: 'validate', text: '这种感觉很不舒服，但它会过去的' },
            { type: 'reality', text: '我现在是安全的，这种感觉只是暂时的' },
            { type: 'action', text: '我可以尝试深呼吸，或者触碰身边的物体' },
            { type: 'encourage', text: '我已经度过了很多次这种感觉，这次也会过去' }
        ]
    },
    {
        id: 'overwhelmed',
        title: '当感到不堪重负时',
        icon: '😵',
        color: '#F39C12',
        messages: [
            { type: 'acknowledge', text: '我注意到我现在感到压力很大' },
            { type: 'validate', text: '有这么多事情要处理，感到压力是正常的' },
            { type: 'reality', text: '我不需要现在解决所有问题' },
            { type: 'action', text: '我可以先做一件小事，一步一步来' },
            { type: 'encourage', text: '我有能力处理这些，只是需要时间' }
        ]
    },
    {
        id: 'lonely',
        title: '当感到孤独时',
        icon: '🥺',
        color: '#3498DB',
        messages: [
            { type: 'acknowledge', text: '我注意到我现在感到孤独' },
            { type: 'validate', text: '渴望连接是人类最基本的需求' },
            { type: 'reality', text: '这种感觉是暂时的，不代表我不可爱' },
            { type: 'action', text: '我可以给关心我的人发消息，或者做一些让自己舒服的事' },
            { type: 'encourage', text: '我值得被爱和关心' }
        ]
    },
    {
        id: 'self_critical',
        title: '当自我批评时',
        icon: '💔',
        color: '#9B59B6',
        messages: [
            { type: 'acknowledge', text: '我注意到我在批评自己' },
            { type: 'validate', text: '每个人都会犯错，这是成长的一部分' },
            { type: 'reality', text: '我的价值不取决于我的表现' },
            { type: 'action', text: '我会像对待好朋友一样对待自己' },
            { type: 'encourage', text: '我在尽力而为，这就足够了' }
        ]
    }
];

// ==================== 心理援助热线 ====================
const CRISIS_RESOURCES = [
    {
        category: '24小时危机干预热线',
        icon: '🆘',
        color: '#E74C3C',
        resources: [
            {
                name: '北京心理危机研究与干预中心',
                phone: '010-82951332',
                hours: '24小时',
                desc: '专业心理危机干预'
            },
            {
                name: '全国希望24小时热线',
                phone: '400-161-9995',
                hours: '24小时',
                desc: '生命教育与危机干预'
            },
            {
                name: '北京回龙观医院心理危机干预',
                phone: '010-82951332',
                hours: '24小时',
                desc: '专业医疗机构'
            }
        ]
    },
    {
        category: '青少年心理援助',
        icon: '👶',
        color: '#3498DB',
        resources: [
            {
                name: '青少年法律与心理咨询热线',
                phone: '12355',
                hours: '工作日 9:00-21:00',
                desc: '共青团中央服务台'
            },
            {
                name: '北京青少年心理咨询热线',
                phone: '010-12355',
                hours: '工作日 9:00-17:00',
                desc: '青少年专项服务'
            }
        ]
    },
    {
        category: '妇女儿童保护',
        icon: '👩',
        color: '#E91E63',
        resources: [
            {
                name: '全国妇联妇女维权热线',
                phone: '12338',
                hours: '工作日',
                desc: '妇女儿童权益保护'
            }
        ]
    },
    {
        category: '在线心理支持',
        icon: '💬',
        color: '#9C27B0',
        resources: [
            {
                name: '简单心理',
                website: 'www.jiandanxinli.com',
                desc: '专业心理咨询平台'
            },
            {
                name: '壹心理',
                website: 'www.xinli001.com',
                desc: '心理服务与测评'
            },
            {
                name: 'KnowYourself',
                website: 'www.knowyourself.cc',
                desc: '心理健康科普与咨询'
            }
        ]
    }
];

// ==================== 安全确认消息 ====================
const SAFETY_MESSAGES = [
    '我现在是安全的',
    '这种感觉会过去的',
    '我已经度过了困难的时刻',
    '我值得被爱和关心',
    '我可以寻求帮助',
    '我在尽力而为',
    '这不是我的错',
    '我有能力度过这个时刻',
    '我可以一步一步来',
    '我的感受是真实的，也是可以接受的'
];

// ==================== EmergencyService ====================
const EmergencyService = {
    // 获取所有呼吸练习
    getBreathingExercises() {
        return BREATHING_EXERCISES;
    },

    // 获取特定呼吸练习
    getBreathingExercise(id) {
        return BREATHING_EXERCISES.find(e => e.id === id);
    },

    // 获取所有 grounding 技巧
    getGroundingTechniques() {
        return GROUNDING_TECHNIQUES;
    },

    // 获取特定 grounding 技巧
    getGroundingTechnique(id) {
        return GROUNDING_TECHNIQUES.find(t => t.id === id);
    },

    // 获取所有自我对话引导
    getSelfTalkGuides() {
        return SELF_TALK_GUIDES;
    },

    // 获取特定自我对话引导
    getSelfTalkGuide(id) {
        return SELF_TALK_GUIDES.find(g => g.id === id);
    },

    // 获取所有危机资源
    getCrisisResources() {
        return CRISIS_RESOURCES;
    },

    // 获取随机安全确认消息
    getRandomSafetyMessage() {
        return SAFETY_MESSAGES[Math.floor(Math.random() * SAFETY_MESSAGES.length)];
    },

    // 记录安全确认
    recordSafetyCheck() {
        const checks = JSON.parse(localStorage.getItem('lsq_safetyChecks') || '[]');
        checks.push({
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        localStorage.setItem('lsq_safetyChecks', JSON.stringify(checks.slice(-30))); // 保留最近30条
        return checks.length;
    },

    // 获取安全确认历史
    getSafetyCheckHistory() {
        return JSON.parse(localStorage.getItem('lsq_safetyChecks') || '[]');
    },

    // 记录紧急工具使用
    recordToolUse(toolType, toolId) {
        const uses = JSON.parse(localStorage.getItem('lsq_emergencyToolUses') || '[]');
        uses.push({
            toolType,
            toolId,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        localStorage.setItem('lsq_emergencyToolUses', JSON.stringify(uses.slice(-50))); // 保留最近50条
    },

    // 获取工具使用历史
    getToolUseHistory() {
        return JSON.parse(localStorage.getItem('lsq_emergencyToolUses') || '[]');
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmergencyService, BREATHING_EXERCISES, GROUNDING_TECHNIQUES, SELF_TALK_GUIDES, CRISIS_RESOURCES };
}

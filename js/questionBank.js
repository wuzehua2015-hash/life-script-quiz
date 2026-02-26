/**
 * 动态题库系统 v3.0
 * 支持题库扩展、智能选题、历史轮换
 */

const QuestionBank = {
    // 题库缓存
    cache: {},
    
    // 初始化题库
    async init() {
        try {
            const response = await fetch('data/questions/index.json');
            this.cache.index = await response.json();
            console.log('题库系统初始化完成:', this.cache.index.totalQuestions, '题');
            return true;
        } catch (error) {
            console.error('题库初始化失败:', error);
            return false;
        }
    },
    
    // 加载指定维度的题库
    async loadDimensionQuestions(dimension) {
        if (this.cache[dimension]) {
            return this.cache[dimension];
        }
        
        try {
            // 加载该维度的所有题目
            const questions = [];
            const dimConfig = this.cache.index.dimensions[dimension];
            
            for (let i = 1; i <= dimConfig.questionCount; i++) {
                try {
                    const response = await fetch(`data/questions/${dimension}/q${i}.json`);
                    if (response.ok) {
                        const q = await response.json();
                        questions.push(q);
                    }
                } catch (e) {
                    // 题目可能不存在，跳过
                }
            }
            
            this.cache[dimension] = questions;
            return questions;
        } catch (error) {
            console.error(`加载${dimension}题库失败:`, error);
            return [];
        }
    },
    
    // 智能选题算法
    async selectQuestions(config = {}) {
        const {
            dimensions = ['drive', 'world', 'self', 'time'],
            questionsPerDim = 3,
            excludeIds = [],  // 排除已做过的题目
            userProfile = {}  // 用户画像，用于个性化选题
        } = config;
        
        const selected = [];
        
        for (const dim of dimensions) {
            const pool = await this.loadDimensionQuestions(dim);
            
            // 过滤已做过的题目
            const available = pool.filter(q => !excludeIds.includes(q.id));
            
            // 如果可用题目不足，使用全部
            const source = available.length >= questionsPerDim ? available : pool;
            
            // 随机选题
            const dimQuestions = this.randomSelect(source, questionsPerDim);
            
            // 添加维度标记
            dimQuestions.forEach(q => {
                q.dimension = dim;
                selected.push(q);
            });
        }
        
        // 打乱顺序
        return this.shuffle(selected);
    },
    
    // 随机选择n个元素
    randomSelect(array, n) {
        const shuffled = this.shuffle([...array]);
        return shuffled.slice(0, n);
    },
    
    // 打乱数组
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // 获取题库统计
    getStats() {
        if (!this.cache.index) return null;
        
        const stats = {
            total: this.cache.index.totalQuestions,
            byDimension: {}
        };
        
        for (const [dim, config] of Object.entries(this.cache.index.dimensions)) {
            const cached = this.cache[dim];
            stats.byDimension[dim] = {
                name: config.name,
                total: config.questionCount,
                loaded: cached ? cached.length : 0
            };
        }
        
        return stats;
    }
};

// 导出
if (typeof window !== 'undefined') {
    window.QuestionBank = QuestionBank;
}

/**
 * 角色收集图鉴系统 v1.0
 * 用于管理用户解锁的角色，提供角色卡片展示和详情弹窗
 */

const RoleCollection = {
    // localStorage 键名
    KEYS: {
        unlockedRoles: 'lsq_unlockedRoles',
        collectionStats: 'lsq_collectionStats',
        lastViewedRole: 'lsq_lastViewedRole'
    },

    // 12种原型定义
    ARCHETYPES: {
        lone_hero: { name: '孤勇者', icon: '⚔️', color: '#e74c3c', description: '独自前行，坚守信念' },
        pleaser: { name: '讨好者', icon: '😢', color: '#3498db', description: '渴望被爱，委屈求全' },
        hermit: { name: '隐士', icon: '🏔️', color: '#95a5a6', description: '远离喧嚣，独善其身' },
        controller: { name: '控制狂', icon: '🎮', color: '#9b59b6', description: '掌控一切，追求完美' },
        victim: { name: '受害者', icon: '😔', color: '#34495e', description: '命运不公，无力反抗' },
        performer: { name: '表演者', icon: '🎭', color: '#f39c12', description: '渴望关注，追求独特' },
        savior: { name: '拯救者', icon: '🦸', color: '#27ae60', description: '帮助他人，获得价值' },
        wanderer: { name: '漫游者', icon: '🎒', color: '#e67e22', description: '自由不羁，探索世界' },
        warrior: { name: '战士', icon: '⚔️', color: '#c0392b', description: '勇敢战斗，永不退缩' },
        healer: { name: '治愈者', icon: '💚', color: '#16a085', description: '温暖他人，治愈创伤' },
        observer: { name: '观察者', icon: '🔍', color: '#2980b9', description: '冷静分析，保持距离' },
        awakened: { name: '觉醒者', icon: '✨', color: '#8e44ad', description: '接纳自我，活在当下' }
    },

    /**
     * 初始化角色收集系统
     */
    init() {
        // 确保存储结构存在
        if (!this.getUnlockedRoles()) {
            this.setUnlockedRoles([]);
        }
        if (!this.getCollectionStats()) {
            this.setCollectionStats({
                totalUnlocked: 0,
                firstUnlockDate: null,
                lastUnlockDate: null,
                archetypeProgress: {}
            });
        }
    },

    /**
     * 获取已解锁的角色列表
     */
    getUnlockedRoles() {
        try {
            const data = localStorage.getItem(this.KEYS.unlockedRoles);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('获取已解锁角色失败:', e);
            return [];
        }
    },

    /**
     * 设置已解锁的角色列表
     */
    setUnlockedRoles(roles) {
        try {
            localStorage.setItem(this.KEYS.unlockedRoles, JSON.stringify(roles));
            return true;
        } catch (e) {
            console.error('设置已解锁角色失败:', e);
            return false;
        }
    },

    /**
     * 获取收集统计
     */
    getCollectionStats() {
        try {
            const data = localStorage.getItem(this.KEYS.collectionStats);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('获取收集统计失败:', e);
            return null;
        }
    },

    /**
     * 设置收集统计
     */
    setCollectionStats(stats) {
        try {
            localStorage.setItem(this.KEYS.collectionStats, JSON.stringify(stats));
            return true;
        } catch (e) {
            console.error('设置收集统计失败:', e);
            return false;
        }
    },

    /**
     * 解锁角色
     * @param {string} archetypeId - 原型ID
     * @param {Object} character - 匹配的角色数据
     * @param {number} matchPercentage - 匹配度百分比
     */
    unlockRole(archetypeId, character, matchPercentage) {
        const unlockedRoles = this.getUnlockedRoles();
        const stats = this.getCollectionStats();
        const now = new Date().toISOString();

        // 检查是否已解锁
        const existingIndex = unlockedRoles.findIndex(r => r.archetypeId === archetypeId);
        
        const roleData = {
            archetypeId: archetypeId,
            characterName: character ? character.name : null,
            characterWork: character ? character.work : null,
            matchPercentage: matchPercentage || 0,
            unlockDate: now,
            quote: character ? character.quote : null,
            similarity: character ? character.similarity : [],
            story: character ? character.story : null,
            advice: character ? character.advice : null,
            growthPath: character ? character.growthPath : null,
            turningPoint: character ? character.turningPoint : null,
            realCase: character ? character.realCase : null
        };

        if (existingIndex >= 0) {
            // 更新已有记录（保留最早的解锁日期）
            roleData.unlockDate = unlockedRoles[existingIndex].unlockDate;
            // 如果新的匹配度更高，更新匹配信息
            if (matchPercentage > unlockedRoles[existingIndex].matchPercentage) {
                unlockedRoles[existingIndex] = roleData;
            }
        } else {
            // 新增解锁
            unlockedRoles.push(roleData);
            
            // 更新统计
            stats.totalUnlocked = unlockedRoles.length;
            if (!stats.firstUnlockDate) {
                stats.firstUnlockDate = now;
            }
            stats.lastUnlockDate = now;
            
            // 更新原型进度
            if (!stats.archetypeProgress[archetypeId]) {
                stats.archetypeProgress[archetypeId] = {
                    unlockedAt: now,
                    unlockCount: 1
                };
            } else {
                stats.archetypeProgress[archetypeId].unlockCount++;
            }
        }

        this.setUnlockedRoles(unlockedRoles);
        this.setCollectionStats(stats);

        return {
            isNew: existingIndex < 0,
            role: roleData,
            totalUnlocked: stats.totalUnlocked
        };
    },

    /**
     * 检查角色是否已解锁
     */
    isRoleUnlocked(archetypeId) {
        const unlockedRoles = this.getUnlockedRoles();
        return unlockedRoles.some(r => r.archetypeId === archetypeId);
    },

    /**
     * 获取解锁进度
     */
    getProgress() {
        const stats = this.getCollectionStats();
        const totalArchetypes = Object.keys(this.ARCHETYPES).length;
        const unlockedCount = stats ? stats.totalUnlocked : 0;
        
        return {
            unlocked: unlockedCount,
            total: totalArchetypes,
            percentage: Math.round((unlockedCount / totalArchetypes) * 100),
            remaining: totalArchetypes - unlockedCount
        };
    },

    /**
     * 获取特定原型的解锁信息
     */
    getRoleUnlockInfo(archetypeId) {
        const unlockedRoles = this.getUnlockedRoles();
        return unlockedRoles.find(r => r.archetypeId === archetypeId) || null;
    },

    /**
     * 获取所有角色（包括未解锁的）
     * 用于图鉴展示
     */
    getAllRolesForCollection() {
        const unlockedRoles = this.getUnlockedRoles();
        const allArchetypes = Object.keys(this.ARCHETYPES);
        
        return allArchetypes.map(archetypeId => {
            const archetype = this.ARCHETYPES[archetypeId];
            const unlocked = unlockedRoles.find(r => r.archetypeId === archetypeId);
            
            return {
                archetypeId: archetypeId,
                name: archetype.name,
                icon: archetype.icon,
                color: archetype.color,
                description: archetype.description,
                isUnlocked: !!unlocked,
                unlockData: unlocked || null
            };
        });
    },

    /**
     * 设置最后查看的角色
     */
    setLastViewedRole(archetypeId) {
        localStorage.setItem(this.KEYS.lastViewedRole, archetypeId);
    },

    /**
     * 获取最后查看的角色
     */
    getLastViewedRole() {
        return localStorage.getItem(this.KEYS.lastViewedRole);
    },

    /**
     * 清除所有角色收集数据（调试用）
     */
    clearAll() {
        localStorage.removeItem(this.KEYS.unlockedRoles);
        localStorage.removeItem(this.KEYS.collectionStats);
        localStorage.removeItem(this.KEYS.lastViewedRole);
        this.init();
    },

    /**
     * 导出收集数据
     */
    exportData() {
        return {
            unlockedRoles: this.getUnlockedRoles(),
            stats: this.getCollectionStats(),
            progress: this.getProgress(),
            exportDate: new Date().toISOString()
        };
    },

    /**
     * 导入收集数据
     */
    importData(data) {
        if (data.unlockedRoles) {
            this.setUnlockedRoles(data.unlockedRoles);
        }
        if (data.stats) {
            this.setCollectionStats(data.stats);
        }
        return true;
    }
};

// 导出
if (typeof window !== 'undefined') {
    window.RoleCollection = RoleCollection;
}

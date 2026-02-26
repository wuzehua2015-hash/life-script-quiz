/**
 * 本地存储系统 v3.0
 * 支持测试历史、用户配置、数据备份
 */

const LocalStorage = {
    // 命名空间，避免冲突
    prefix: 'lsq_',
    
    // 存储键名
    keys: {
        userId: 'userId',
        tests: 'tests',
        config: 'config',
        cache: 'cache',
        backup: 'backup'
    },
    
    // 生成唯一用户ID
    getUserId() {
        let userId = this.get(this.keys.userId);
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.set(this.keys.userId, userId);
        }
        return userId;
    },
    
    // 基础存储方法
    set(key, value) {
        try {
            const fullKey = this.prefix + key;
            const data = JSON.stringify({
                value: value,
                timestamp: Date.now()
            });
            window.localStorage.setItem(fullKey, data);
            return true;
        } catch (error) {
            console.error('存储失败:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const fullKey = this.prefix + key;
            const data = window.localStorage.getItem(fullKey);
            if (!data) return defaultValue;
            
            const parsed = JSON.parse(data);
            return parsed.value;
        } catch (error) {
            console.error('读取失败:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        const fullKey = this.prefix + key;
        window.localStorage.removeItem(fullKey);
    },
    
    // 测试历史
    saveTest(testData) {
        const tests = this.get(this.keys.tests, []);
        const record = {
            id: 'test_' + Date.now(),
            date: new Date().toISOString(),
            ...testData
        };
        tests.push(record);
        
        // 只保留最近50次测试
        if (tests.length > 50) {
            tests.shift();
        }
        
        this.set(this.keys.tests, tests);
        return record.id;
    },
    
    getTests(limit = 50) {
        const tests = this.get(this.keys.tests, []);
        return tests.slice(-limit).reverse();
    },
    
    getTestById(testId) {
        const tests = this.get(this.keys.tests, []);
        return tests.find(t => t.id === testId);
    },
    
    // 计算趋势
    getTrends() {
        const tests = this.get(this.keys.tests, []);
        if (tests.length < 2) return null;
        
        const trends = {
            drive: [],
            world: [],
            self: [],
            time: [],
            dates: []
        };
        
        tests.forEach(test => {
            if (test.dimensions) {
                trends.drive.push(test.dimensions.drive);
                trends.world.push(test.dimensions.world);
                trends.self.push(test.dimensions.self);
                trends.time.push(test.dimensions.time);
                trends.dates.push(test.date);
            }
        });
        
        return trends;
    },
    
    // 备份功能
    createBackup() {
        const backup = {
            userId: this.getUserId(),
            tests: this.get(this.keys.tests, []),
            config: this.get(this.keys.config, {}),
            timestamp: Date.now()
        };
        
        this.set(this.keys.backup, backup);
        
        // 同时下载为文件
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lsq_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return backup;
    },
    
    restoreBackup(backupData) {
        if (backupData.tests) {
            this.set(this.keys.tests, backupData.tests);
        }
        if (backupData.config) {
            this.set(this.keys.config, backupData.config);
        }
        return true;
    },
    
    // 清除所有数据
    clearAll() {
        for (const key of Object.values(this.keys)) {
            this.remove(key);
        }
    },
    
    // 获取存储统计
    getStats() {
        const tests = this.get(this.keys.tests, []);
        return {
            testCount: tests.length,
            firstTest: tests.length > 0 ? tests[0].date : null,
            lastTest: tests.length > 0 ? tests[tests.length - 1].date : null,
            storageUsed: this.getStorageSize()
        };
    },
    
    getStorageSize() {
        let size = 0;
        for (const key in this.keys) {
            const data = window.localStorage.getItem(this.prefix + this.keys[key]);
            if (data) size += data.length;
        }
        return (size / 1024).toFixed(2) + ' KB';
    }
};

// 导出
if (typeof window !== 'undefined') {
    window.LSQStorage = LocalStorage;
}

/**
 * 紧急干预工具箱 UI 组件
 * Emergency Intervention Toolkit UI Components
 */

// ==================== 呼吸练习 UI ====================
const BreathingUI = {
    currentExercise: null,
    currentStep: 0,
    currentCycle: 0,
    isRunning: false,
    animationId: null,

    // 渲染呼吸练习列表
    renderExerciseList(container) {
        const exercises = EmergencyService.getBreathingExercises();
        
        container.innerHTML = `
            <div class="emergency-section">
                <h3 class="emergency-section-title">
                    <span class="section-icon">🫁</span>
                    呼吸练习
                </h3>
                <p class="emergency-section-desc">选择一种呼吸方式，让呼吸带你回到平静</p>
                <div class="breathing-list">
                    ${exercises.map(ex => `
                        <div class="breathing-card" data-id="${ex.id}" style="--card-color: ${ex.color}">
                            <div class="breathing-card-icon">${ex.icon}</div>
                            <div class="breathing-card-info">
                                <h4>${ex.name}</h4>
                                <p>${ex.desc}</p>
                                <span class="breathing-meta">${ex.steps.length}步 · ${ex.cycles}轮</span>
                            </div>
                            <button class="btn-breathing-start" onclick="BreathingUI.startExercise('${ex.id}')">
                                开始
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 开始呼吸练习
    startExercise(exerciseId) {
        const exercise = EmergencyService.getBreathingExercise(exerciseId);
        if (!exercise) return;

        this.currentExercise = exercise;
        this.currentStep = 0;
        this.currentCycle = 1;
        this.isRunning = true;

        // 记录使用
        EmergencyService.recordToolUse('breathing', exerciseId);

        // 显示练习界面
        this.showExerciseInterface();
        this.runBreathingCycle();
    },

    // 显示练习界面
    showExerciseInterface() {
        const container = document.getElementById('emergency-content');
        const ex = this.currentExercise;

        container.innerHTML = `
            <div class="breathing-exercise-active">
                <div class="breathing-header">
                    <button class="btn-back" onclick="BreathingUI.stopExercise(); EmergencyUI.showMainPanel();">
                        ← 返回
                    </button>
                    <h3>${ex.name}</h3>
                    <span class="breathing-cycle">第 ${this.currentCycle}/${ex.cycles} 轮</span>
                </div>
                
                <div class="breathing-visual" style="--breath-color: ${ex.color}">
                    <div class="breathing-circle" id="breathing-circle">
                        <div class="breathing-inner">
                            <span class="breathing-phase" id="breathing-phase">准备</span>
                            <span class="breathing-desc" id="breathing-desc">点击开始</span>
                        </div>
                    </div>
                    <div class="breathing-progress-ring">
                        <svg viewBox="0 0 100 100">
                            <circle class="progress-bg" cx="50" cy="50" r="45"/>
                            <circle class="progress-fill" id="progress-circle" cx="50" cy="50" r="45"/>
                        </svg>
                    </div>
                </div>

                <div class="breathing-controls">
                    <button class="btn-breathing-control" id="breathing-toggle" onclick="BreathingUI.togglePause()">
                        暂停
                    </button>
                    <button class="btn-breathing-control secondary" onclick="BreathingUI.stopExercise(); EmergencyUI.showMainPanel();">
                        结束
                    </button>
                </div>

                <div class="breathing-instruction" id="breathing-instruction">
                    准备开始呼吸练习
                </div>
            </div>
        `;
    },

    // 运行呼吸周期
    async runBreathingCycle() {
        if (!this.isRunning || !this.currentExercise) return;

        const steps = this.currentExercise.steps;
        
        for (let i = 0; i < steps.length; i++) {
            if (!this.isRunning) break;
            
            this.currentStep = i;
            const step = steps[i];
            
            await this.executeStep(step);
        }

        if (this.isRunning) {
            this.currentCycle++;
            if (this.currentCycle <= this.currentExercise.cycles) {
                // 更新轮数显示
                const cycleEl = document.querySelector('.breathing-cycle');
                if (cycleEl) {
                    cycleEl.textContent = `第 ${this.currentCycle}/${this.currentExercise.cycles} 轮`;
                }
                this.runBreathingCycle();
            } else {
                this.completeExercise();
            }
        }
    },

    // 执行单个步骤
    executeStep(step) {
        return new Promise((resolve) => {
            const phaseEl = document.getElementById('breathing-phase');
            const descEl = document.getElementById('breathing-desc');
            const circle = document.getElementById('breathing-circle');
            const progressCircle = document.getElementById('progress-circle');
            const instructionEl = document.getElementById('breathing-instruction');

            if (phaseEl) phaseEl.textContent = step.text;
            if (descEl) descEl.textContent = step.desc;
            if (instructionEl) instructionEl.textContent = step.desc;

            // 设置圆圈动画
            if (circle) {
                circle.className = 'breathing-circle';
                circle.classList.add(`phase-${step.phase}`);
            }

            // 进度环动画
            if (progressCircle) {
                const circumference = 2 * Math.PI * 45;
                progressCircle.style.strokeDasharray = circumference;
                progressCircle.style.strokeDashoffset = circumference;
                progressCircle.style.animation = `progress-ring ${step.duration}ms linear forwards`;
            }

            setTimeout(() => {
                resolve();
            }, step.duration);
        });
    },

    // 暂停/继续
    togglePause() {
        // 简化版本：重新开始
        this.stopExercise();
        this.startExercise(this.currentExercise.id);
    },

    // 停止练习
    stopExercise() {
        this.isRunning = false;
        this.currentExercise = null;
        this.currentStep = 0;
        this.currentCycle = 0;
    },

    // 完成练习
    completeExercise() {
        const container = document.getElementById('emergency-content');
        
        container.innerHTML = `
            <div class="breathing-complete">
                <div class="complete-icon">✨</div>
                <h3>练习完成</h3>
                <p>你做得很好。感受此刻的平静。</p>
                <div class="complete-actions">
                    <button class="btn-primary" onclick="BreathingUI.stopExercise(); EmergencyUI.showMainPanel();">
                        返回工具箱
                    </button>
                    <button class="btn-secondary" onclick="BreathingUI.startExercise('${this.currentExercise.id}')">
                        再练一次
                    </button>
                </div>
            </div>
        `;
        
        this.stopExercise();
    }
};

// ==================== Grounding 技巧 UI ====================
const GroundingUI = {
    currentTechnique: null,
    currentStep: 0,

    // 渲染 grounding 技巧列表
    renderTechniqueList(container) {
        const techniques = EmergencyService.getGroundingTechniques();
        
        container.innerHTML = `
            <div class="emergency-section">
                <h3 class="emergency-section-title">
                    <span class="section-icon">🌍</span>
                    Grounding 技巧
                </h3>
                <p class="emergency-section-desc">用感官回到当下，回到安全</p>
                <div class="grounding-list">
                    ${techniques.map(t => `
                        <div class="grounding-card" data-id="${t.id}" style="--card-color: ${t.color}">
                            <div class="grounding-card-icon">${t.icon}</div>
                            <div class="grounding-card-info">
                                <h4>${t.name}</h4>
                                <p>${t.desc}</p>
                                <span class="grounding-meta">${t.steps.length}个步骤</span>
                            </div>
                            <button class="btn-grounding-start" onclick="GroundingUI.startTechnique('${t.id}')">
                                开始
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 开始 grounding 练习
    startTechnique(techniqueId) {
        const technique = EmergencyService.getGroundingTechnique(techniqueId);
        if (!technique) return;

        this.currentTechnique = technique;
        this.currentStep = 0;

        // 记录使用
        EmergencyService.recordToolUse('grounding', techniqueId);

        this.showTechniqueInterface();
    },

    // 显示技巧界面
    showTechniqueInterface() {
        const container = document.getElementById('emergency-content');
        const t = this.currentTechnique;

        container.innerHTML = `
            <div class="grounding-technique-active">
                <div class="grounding-header">
                    <button class="btn-back" onclick="GroundingUI.stopTechnique(); EmergencyUI.showMainPanel();">
                        ← 返回
                    </button>
                    <h3>${t.name}</h3>
                </div>
                
                <div class="grounding-progress">
                    ${t.steps.map((step, idx) => `
                        <div class="grounding-step-dot ${idx === 0 ? 'active' : ''}" data-step="${idx}"></div>
                    `).join('')}
                </div>

                <div class="grounding-content" id="grounding-content">
                    ${this.renderStep(t.steps[0], 0, t.steps.length)}
                </div>

                <div class="grounding-navigation">
                    <button class="btn-nav-prev" id="grounding-prev" onclick="GroundingUI.prevStep()" disabled>
                        ← 上一步
                    </button>
                    <span class="step-counter">1 / ${t.steps.length}</span>
                    <button class="btn-nav-next" id="grounding-next" onclick="GroundingUI.nextStep()">
                        下一步 →
                    </button>
                </div>
            </div>
        `;
    },

    // 渲染步骤
    renderStep(step, index, total) {
        return `
            <div class="grounding-step-card" style="animation: fade-in 0.3s ease">
                <div class="step-number-badge" style="--step-color: ${this.currentTechnique.color}">
                    <span class="step-icon">${step.icon}</span>
                    <span class="step-number">${step.number}</span>
                </div>
                <h4 class="step-title">${step.sense} - ${step.desc}</h4>
                <div class="step-prompt">
                    <span class="prompt-icon">💡</span>
                    <p>${step.prompt}</p>
                </div>
                ${step.examples ? `
                    <div class="step-examples">
                        <p class="examples-label">例如：</p>
                        <ul>
                            ${step.examples.map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // 下一步
    nextStep() {
        if (this.currentStep < this.currentTechnique.steps.length - 1) {
            this.currentStep++;
            this.updateStepDisplay();
        } else {
            this.completeTechnique();
        }
    },

    // 上一步
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    },

    // 更新步骤显示
    updateStepDisplay() {
        const content = document.getElementById('grounding-content');
        const prevBtn = document.getElementById('grounding-prev');
        const nextBtn = document.getElementById('grounding-next');
        const counter = document.querySelector('.step-counter');

        content.innerHTML = this.renderStep(
            this.currentTechnique.steps[this.currentStep],
            this.currentStep,
            this.currentTechnique.steps.length
        );

        // 更新进度点
        document.querySelectorAll('.grounding-step-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx <= this.currentStep);
        });

        // 更新按钮状态
        prevBtn.disabled = this.currentStep === 0;
        nextBtn.textContent = this.currentStep === this.currentTechnique.steps.length - 1 ? '完成' : '下一步 →';
        counter.textContent = `${this.currentStep + 1} / ${this.currentTechnique.steps.length}`;
    },

    // 停止技巧
    stopTechnique() {
        this.currentTechnique = null;
        this.currentStep = 0;
    },

    // 完成技巧
    completeTechnique() {
        const container = document.getElementById('emergency-content');
        
        container.innerHTML = `
            <div class="grounding-complete">
                <div class="complete-icon">🌍</div>
                <h3>做得好</h3>
                <p>你已经完成了 grounding 练习。</p>
                <p class="complete-tip">记住，你可以随时回到当下。</p>
                <div class="complete-actions">
                    <button class="btn-primary" onclick="GroundingUI.stopTechnique(); EmergencyUI.showMainPanel();">
                        返回工具箱
                    </button>
                </div>
            </div>
        `;
        
        this.stopTechnique();
    }
};

// ==================== 自我对话 UI ====================
const SelfTalkUI = {
    currentGuide: null,
    currentMessage: 0,

    // 渲染自我对话列表
    renderGuideList(container) {
        const guides = EmergencyService.getSelfTalkGuides();
        
        container.innerHTML = `
            <div class="emergency-section">
                <h3 class="emergency-section-title">
                    <span class="section-icon">💭</span>
                    自我对话引导
                </h3>
                <p class="emergency-section-desc">选择你现在的状态，让引导帮助你</p>
                <div class="selftalk-list">
                    ${guides.map(g => `
                        <div class="selftalk-card" data-id="${g.id}" style="--card-color: ${g.color}">
                            <div class="selftalk-card-icon">${g.icon}</div>
                            <div class="selftalk-card-info">
                                <h4>${g.title}</h4>
                                <span class="selftalk-meta">${g.messages.length}条引导</span>
                            </div>
                            <button class="btn-selftalk-start" onclick="SelfTalkUI.startGuide('${g.id}')">
                                开始
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 开始引导
    startGuide(guideId) {
        const guide = EmergencyService.getSelfTalkGuide(guideId);
        if (!guide) return;

        this.currentGuide = guide;
        this.currentMessage = 0;

        // 记录使用
        EmergencyService.recordToolUse('selftalk', guideId);

        this.showGuideInterface();
    },

    // 显示引导界面
    showGuideInterface() {
        const container = document.getElementById('emergency-content');
        const g = this.currentGuide;

        container.innerHTML = `
            <div class="selftalk-active">
                <div class="selftalk-header">
                    <button class="btn-back" onclick="SelfTalkUI.stopGuide(); EmergencyUI.showMainPanel();">
                        ← 返回
                    </button>
                    <h3>${g.title}</h3>
                </div>
                
                <div class="selftalk-progress-bar">
                    <div class="selftalk-progress-fill" style="width: 0%"></div>
                </div>

                <div class="selftalk-messages" id="selftalk-messages">
                    <!-- 消息将动态添加 -->
                </div>

                <div class="selftalk-input-area" id="selftalk-input-area">
                    <button class="btn-selftalk-next" onclick="SelfTalkUI.showNextMessage()">
                        开始引导
                    </button>
                </div>
            </div>
        `;
    },

    // 显示下一条消息
    showNextMessage() {
        const messagesContainer = document.getElementById('selftalk-messages');
        const inputArea = document.getElementById('selftalk-input-area');
        const progressFill = document.querySelector('.selftalk-progress-fill');
        
        if (this.currentMessage < this.currentGuide.messages.length) {
            const msg = this.currentGuide.messages[this.currentMessage];
            
            // 添加消息
            const msgEl = document.createElement('div');
            msgEl.className = `selftalk-message ${msg.type}`;
            msgEl.style.animation = 'slide-in-up 0.4s ease';
            msgEl.innerHTML = `
                <span class="message-type-badge">${this.getMessageTypeLabel(msg.type)}</span>
                <p>${msg.text}</p>
            `;
            messagesContainer.appendChild(msgEl);
            
            // 滚动到底部
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // 更新进度
            const progress = ((this.currentMessage + 1) / this.currentGuide.messages.length) * 100;
            progressFill.style.width = `${progress}%`;
            
            this.currentMessage++;
            
            // 更新按钮
            if (this.currentMessage < this.currentGuide.messages.length) {
                inputArea.innerHTML = `
                    <button class="btn-selftalk-next" onclick="SelfTalkUI.showNextMessage()">
                        继续 →
                    </button>
                `;
            } else {
                inputArea.innerHTML = `
                    <button class="btn-selftalk-next" onclick="SelfTalkUI.completeGuide()">
                        完成 ✓
                    </button>
                `;
            }
        }
    },

    // 获取消息类型标签
    getMessageTypeLabel(type) {
        const labels = {
            acknowledge: '觉察',
            validate: '接纳',
            reality: '现实',
            action: '行动',
            encourage: '鼓励'
        };
        return labels[type] || type;
    },

    // 停止引导
    stopGuide() {
        this.currentGuide = null;
        this.currentMessage = 0;
    },

    // 完成引导
    completeGuide() {
        const container = document.getElementById('emergency-content');
        
        container.innerHTML = `
            <div class="selftalk-complete">
                <div class="complete-icon">💚</div>
                <h3>你已经完成了自我对话</h3>
                <p>记住这些话语，它们会在你需要时出现。</p>
                <div class="complete-actions">
                    <button class="btn-primary" onclick="SelfTalkUI.stopGuide(); EmergencyUI.showMainPanel();">
                        返回工具箱
                    </button>
                </div>
            </div>
        `;
        
        this.stopGuide();
    }
};

// ==================== 危机资源 UI ====================
const CrisisResourceUI = {
    // 渲染危机资源列表
    renderResourceList(container) {
        const categories = EmergencyService.getCrisisResources();
        
        container.innerHTML = `
            <div class="emergency-section">
                <h3 class="emergency-section-title">
                    <span class="section-icon">🆘</span>
                    心理援助资源
                </h3>
                <p class="emergency-section-desc">当你需要专业帮助时，这些资源在这里</p>
                
                <div class="crisis-notice">
                    <span class="notice-icon">⚠️</span>
                    <div class="notice-content">
                        <p><strong>如果你正在经历紧急情况</strong></p>
                        <p>请立即拨打 120（急救）或 110（报警）</p>
                    </div>
                </div>

                <div class="crisis-categories">
                    ${categories.map(cat => `
                        <div class="crisis-category" style="--category-color: ${cat.color}">
                            <h4 class="category-header">
                                <span class="category-icon">${cat.icon}</span>
                                ${cat.category}
                            </h4>
                            <div class="resource-list">
                                ${cat.resources.map(r => `
                                    <div class="resource-card">
                                        <div class="resource-info">
                                            <h5>${r.name}</h5>
                                            <p class="resource-desc">${r.desc}</p>
                                            ${r.hours ? `<span class="resource-hours">⏰ ${r.hours}</span>` : ''}
                                        </div>
                                        ${r.phone ? `
                                            <a href="tel:${r.phone.replace(/-/g, '')}" class="btn-call">
                                                <span class="call-icon">📞</span>
                                                <span class="call-number">${r.phone}</span>
                                            </a>
                                        ` : ''}
                                        ${r.website ? `
                                            <a href="https://${r.website}" target="_blank" class="btn-visit">
                                                <span>访问网站 →</span>
                                            </a>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

// ==================== 安全确认 UI ====================
const SafetyCheckUI = {
    // 渲染安全确认
    renderSafetyCheck(container) {
        const message = EmergencyService.getRandomSafetyMessage();
        const history = EmergencyService.getSafetyCheckHistory();
        
        container.innerHTML = `
            <div class="emergency-section safety-check-section">
                <h3 class="emergency-section-title">
                    <span class="section-icon">✋</span>
                    安全确认
                </h3>
                <p class="emergency-section-desc">确认你现在的状态，这是最重要的一步</p>
                
                <div class="safety-check-card">
                    <div class="safety-message" id="safety-message">
                        <span class="safety-quote">"</span>
                        <p>${message}</p>
                        <span class="safety-quote">"</span>
                    </div>
                    
                    <button class="btn-safety-confirm" onclick="SafetyCheckUI.confirmSafety()">
                        <span class="confirm-icon">✓</span>
                        <span class="confirm-text">我现在是安全的</span>
                    </button>
                    
                    <button class="btn-safety-refresh" onclick="SafetyCheckUI.refreshMessage()">
                        🔄 换一句话
                    </button>
                </div>

                ${history.length > 0 ? `
                    <div class="safety-history">
                        <p class="history-title">你已经确认安全 ${history.length} 次</p>
                        <p class="history-encourage">每一次确认都是对自己的关爱 💚</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // 确认安全
    confirmSafety() {
        const count = EmergencyService.recordSafetyCheck();
        
        // 显示确认反馈
        const container = document.getElementById('emergency-content');
        container.innerHTML = `
            <div class="safety-confirmed">
                <div class="confirmed-animation">
                    <div class="confirmed-ring"></div>
                    <div class="confirmed-icon">✓</div>
                </div>
                <h3>已确认</h3>
                <p>你现在是安全的。</p>
                <p class="confirmed-count">这是你第 ${count} 次确认安全</p>
                <div class="confirmed-actions">
                    <button class="btn-primary" onclick="EmergencyUI.showMainPanel()">
                        返回工具箱
                    </button>
                </div>
            </div>
        `;
    },

    // 刷新消息
    refreshMessage() {
        const messageEl = document.querySelector('#safety-message p');
        if (messageEl) {
            const newMessage = EmergencyService.getRandomSafetyMessage();
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.textContent = newMessage;
                messageEl.style.opacity = '1';
            }, 200);
        }
    }
};

// ==================== 紧急干预主 UI ====================
const EmergencyUI = {
    // 初始化
    init() {
        this.showMainPanel();
    },

    // 显示主面板
    showMainPanel() {
        const container = document.getElementById('emergency-content');
        
        container.innerHTML = `
            <div class="emergency-main">
                <!-- 安全确认 -->
                <div id="safety-check-container"></div>
                
                <!-- 工具网格 -->
                <div class="emergency-tools-grid">
                    <div class="tool-card" onclick="EmergencyUI.showBreathing()">
                        <div class="tool-icon">🫁</div>
                        <h4>呼吸练习</h4>
                        <p>用呼吸平复情绪</p>
                    </div>
                    <div class="tool-card" onclick="EmergencyUI.showGrounding()">
                        <div class="tool-icon">🌍</div>
                        <h4>Grounding</h4>
                        <p>用感官回到当下</p>
                    </div>
                    <div class="tool-card" onclick="EmergencyUI.showSelfTalk()">
                        <div class="tool-icon">💭</div>
                        <h4>自我对话</h4>
                        <p>温柔地陪伴自己</p>
                    </div>
                    <div class="tool-card" onclick="EmergencyUI.showResources()">
                        <div class="tool-icon">🆘</div>
                        <h4>援助热线</h4>
                        <p>专业帮助资源</p>
                    </div>
                </div>
            </div>
        `;
        
        // 渲染安全确认
        SafetyCheckUI.renderSafetyCheck(document.getElementById('safety-check-container'));
    },

    // 显示呼吸练习
    showBreathing() {
        const container = document.getElementById('emergency-content');
        container.innerHTML = '<div id="breathing-container"></div>';
        BreathingUI.renderExerciseList(document.getElementById('breathing-container'));
    },

    // 显示 grounding
    showGrounding() {
        const container = document.getElementById('emergency-content');
        container.innerHTML = '<div id="grounding-container"></div>';
        GroundingUI.renderTechniqueList(document.getElementById('grounding-container'));
    },

    // 显示自我对话
    showSelfTalk() {
        const container = document.getElementById('emergency-content');
        container.innerHTML = '<div id="selftalk-container"></div>';
        SelfTalkUI.renderGuideList(document.getElementById('selftalk-container'));
    },

    // 显示资源
    showResources() {
        const container = document.getElementById('emergency-content');
        container.innerHTML = '<div id="resources-container"></div>';
        CrisisResourceUI.renderResourceList(document.getElementById('resources-container'));
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmergencyUI, BreathingUI, GroundingUI, SelfTalkUI, CrisisResourceUI, SafetyCheckUI };
}

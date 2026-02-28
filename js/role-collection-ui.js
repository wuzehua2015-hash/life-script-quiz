/**
 * 角色图鉴UI组件
 * 提供角色卡片展示、详情弹窗、收集进度等功能
 */

const RoleCollectionUI = {
    // 当前打开的弹窗
    currentModal: null,

    /**
     * 创建角色卡片HTML
     */
    createRoleCard(role) {
        const isUnlocked = role.isUnlocked;
        
        if (isUnlocked) {
            return `
                <div class="role-card unlocked" data-archetype="${role.archetypeId}" onclick="RoleCollectionUI.openRoleDetail('${role.archetypeId}')">
                    <div class="role-card-icon" style="background: ${role.color}20; color: ${role.color};">
                        ${role.icon}
                    </div>
                    <div class="role-card-info">
                        <div class="role-card-name">${role.name}</div>
                        <div class="role-card-character">${role.unlockData.characterName || ''}</div>
                        <div class="role-card-match">
                            <span class="match-badge">${role.unlockData.matchPercentage}% 匹配</span>
                        </div>
                    </div>
                    <div class="role-card-unlock-date">
                        ${this.formatDate(role.unlockData.unlockDate)}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="role-card locked" data-archetype="${role.archetypeId}">
                    <div class="role-card-icon locked-icon">
                        🔒
                    </div>
                    <div class="role-card-info">
                        <div class="role-card-name">???</div>
                        <div class="role-card-hint">完成测试解锁此角色</div>
                    </div>
                    <div class="role-card-progress">
                        <span>未解锁</span>
                    </div>
                </div>
            `;
        }
    },

    createProgressBar(progress) {
        return `
            <div class="collection-progress">
                <div class="progress-header">
                    <span class="progress-title">📚 角色收集进度</span>
                    <span class="progress-count">${progress.unlocked} / ${progress.total}</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress.percentage}%"></div>
                </div>
                <div class="progress-stats">
                    <span>已完成 ${progress.percentage}%</span>
                    <span>还差 ${progress.remaining} 个角色</span>
                </div>
            </div>
        `;
    },

    renderCollectionPage(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const allRoles = RoleCollection.getAllRolesForCollection();
        const progress = RoleCollection.getProgress();

        allRoles.sort((a, b) => {
            if (a.isUnlocked && !b.isUnlocked) return -1;
            if (!a.isUnlocked && b.isUnlocked) return 1;
            return 0;
        });

        const html = `
            <div class="role-collection-page">
                ${this.createProgressBar(progress)}
                <div class="role-collection-grid">
                    ${allRoles.map(role => this.createRoleCard(role)).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    openRoleDetail(archetypeId) {
        const roleInfo = RoleCollection.getRoleUnlockInfo(archetypeId);
        const archetype = RoleCollection.ARCHETYPES[archetypeId];
        
        if (!roleInfo) return;

        RoleCollection.setLastViewedRole(archetypeId);

        const modalHtml = `
            <div class="role-modal-overlay" id="role-modal" onclick="RoleCollectionUI.closeModal(event)">
                <div class="role-modal-content" onclick="event.stopPropagation()">
                    <button class="role-modal-close" onclick="RoleCollectionUI.closeModal()">&times;</button>
                    
                    <div class="role-modal-header" style="background: linear-gradient(135deg, ${archetype.color}20 0%, ${archetype.color}05 100%);">
                        <div class="role-modal-icon" style="background: ${archetype.color}; color: white;">
                            ${archetype.icon}
                        </div>
                        <div class="role-modal-title">
                            <h2>${archetype.name}</h2>
                            <span class="role-modal-subtitle">${archetype.description}</span>
                        </div>
                        <div class="role-modal-match">
                            <span class="match-value">${roleInfo.matchPercentage}%</span>
                            <span class="match-label">匹配度</span>
                        </div>
                    </div>

                    <div class="role-modal-body">
                        <div class="role-character-section">
                            <h3>🎭 你的角色化身</h3>
                            <div class="character-info">
                                <div class="character-name">${roleInfo.characterName}</div>
                                <div class="character-work">${roleInfo.characterWork}</div>
                            </div>
                            <blockquote class="character-quote">
                                「${roleInfo.quote}」
                            </blockquote>
                        </div>

                        <div class="role-similarity-section">
                            <h3>🎯 你们相似的地方</h3>
                            <ul class="similarity-list">
                                ${roleInfo.similarity.map(s => `<li><span class="similarity-dot">•</span>${s}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="role-story-section">
                            <h3>📖 角色故事</h3>
                            <p>${roleInfo.story}</p>
                        </div>

                        ${roleInfo.growthPath ? `
                        <div class="role-growth-section">
                            <h3>🌱 成长路径</h3>
                            <div class="growth-timeline">
                                <div class="growth-stage">
                                    <span class="stage-label">早期</span>
                                    <p>${roleInfo.growthPath.early}</p>
                                </div>
                                <div class="growth-stage">
                                    <span class="stage-label">中期</span>
                                    <p>${roleInfo.growthPath.middle}</p>
                                </div>
                                <div class="growth-stage">
                                    <span class="stage-label">后期</span>
                                    <p>${roleInfo.growthPath.late}</p>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        ${roleInfo.turningPoint ? `
                        <div class="role-turning-section">
                            <h3>⚡ 人生转折点</h3>
                            <div class="turning-point">
                                <p><strong>事件：</strong>${roleInfo.turningPoint.event}</p>
                                <p><strong>影响：</strong>${roleInfo.turningPoint.impact}</p>
                            </div>
                        </div>
                        ` : ''}

                        ${roleInfo.realCase ? `
                        <div class="role-realcase-section">
                            <h3>💡 现实启示</h3>
                            <div class="real-case">
                                <p><strong>场景：</strong>${roleInfo.realCase.situation}</p>
                                <p class="case-example">${roleInfo.realCase.example}</p>
                            </div>
                        </div>
                        ` : ''}

                        <div class="role-advice-section">
                            <h3>💬 给你的建议</h3>
                            <p class="advice-text">${roleInfo.advice}</p>
                        </div>

                        <div class="role-unlock-info">
                            <span>🗓️ 解锁于 ${this.formatDate(roleInfo.unlockDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.style.overflow = 'hidden';
        this.currentModal = document.getElementById('role-modal');
    },

    closeModal(event) {
        if (event && event.target !== event.currentTarget) return;
        
        const modal = document.getElementById('role-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
            this.currentModal = null;
        }
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    }
};

if (typeof window !== 'undefined') {
    window.RoleCollectionUI = RoleCollectionUI;
}

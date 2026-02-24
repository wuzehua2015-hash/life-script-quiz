/**
 * 人生剧本测试 - 主应用逻辑
 */

(function() {
    'use strict';

    // 应用状态
    const state = {
        currentQuestion: 0,
        answers: [],
        scores: {
            drive: {},
            world: {},
            self: {},
            time: {}
        },
        result: null
    };

    // DOM 元素引用
    const elements = {};

    // 初始化
    function init() {
        cacheElements();
        bindEvents();
        initScores();
    }

    // 缓存DOM元素
    function cacheElements() {
        elements.screens = {
            intro: document.getElementById('intro-screen'),
            quiz: document.getElementById('quiz-screen'),
            loading: document.getElementById('loading-screen'),
            result: document.getElementById('result-screen')
        };

        elements.intro = {
            startBtn: document.getElementById('start-btn')
        };

        elements.quiz = {
            progressFill: document.getElementById('progress-fill'),
            currentScene: document.getElementById('current-scene'),
            sceneNumber: document.getElementById('scene-number'),
            sceneLocation: document.getElementById('scene-location'),
            sceneDialogue: document.getElementById('scene-dialogue'),
            choicesContainer: document.getElementById('choices-container'),
            sceneCard: document.getElementById('scene-card'),
            prevBtn: document.getElementById('prev-btn')
        };

        elements.result = {
            poster: document.getElementById('result-poster'),
            ratingBadge: document.getElementById('rating-badge'),
            movieTitle: document.getElementById('movie-title'),
            tagline: document.getElementById('tagline'),
            archetypeBadge: document.getElementById('archetype-badge'),
            archetypeName: document.getElementById('archetype-name'),
            archetypeSubtitle: document.getElementById('archetype-subtitle'),
            badMovieContent: document.getElementById('bad-movie-content'),
            castGrid: document.getElementById('cast-grid'),
            newScriptContent: document.getElementById('new-script-content'),
            actionPlan: document.getElementById('action-plan'),
            radarChart: document.getElementById('radar-chart'),
            dimensionTags: document.getElementById('dimension-tags'),
            shareBtn: document.getElementById('share-btn'),
            retakeBtn: document.getElementById('retake-btn')
        };

        elements.modal = {
            shareModal: document.getElementById('share-modal'),
            closeModal: document.getElementById('close-modal'),
            sharePosterContainer: document.getElementById('share-poster-container')
        };
    }

    // 绑定事件
    function bindEvents() {
        elements.intro.startBtn.addEventListener('click', startQuiz);
        elements.result.shareBtn.addEventListener('click', showShareModal);
        elements.result.retakeBtn.addEventListener('click', retakeQuiz);
        elements.modal.closeModal.addEventListener('click', hideShareModal);
        elements.quiz.prevBtn.addEventListener('click', goToPrevQuestion);
        
        // 点击模态框外部关闭
        elements.modal.shareModal.addEventListener('click', (e) => {
            if (e.target === elements.modal.shareModal) {
                hideShareModal();
            }
        });
    }

    // 返回上一题
    function goToPrevQuestion() {
        if (state.currentQuestion > 0) {
            // 清除上一题的答案和分数
            const lastAnswer = state.answers.pop();
            if (lastAnswer) {
                state.scores[lastAnswer.dimension][lastAnswer.choice.type] -= lastAnswer.choice.score;
            }
            // 回退到上一题
            state.currentQuestion--;
            renderQuestion(state.currentQuestion);
        }
    }

    // 初始化分数
    function initScores() {
        // 等待数据加载
        if (!window.QUIZ_DATA) {
            setTimeout(initScores, 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        
        // 初始化每个维度的分数
        Object.keys(data.DIMENSIONS).forEach(dim => {
            state.scores[dim] = {};
            const types = data.DIMENSIONS[dim].types;
            // 支持对象或数组格式
            const typeKeys = Array.isArray(types) ? types : Object.keys(types);
            typeKeys.forEach(type => {
                state.scores[dim][type] = 0;
            });
        });
    }

    // 开始测试
    function startQuiz() {
        switchScreen('quiz');
        renderQuestion(0);
    }

    // 切换屏幕
    function switchScreen(screenName) {
        Object.values(elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        elements.screens[screenName].classList.add('active');
    }

    // 渲染问题
    function renderQuestion(index) {
        console.log('Rendering question', index);
        console.log('QUIZ_DATA available:', !!window.QUIZ_DATA);
        
        // 等待数据加载
        if (!window.QUIZ_DATA) {
            console.log('Data not loaded, retrying...');
            setTimeout(() => renderQuestion(index), 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        console.log('QUESTIONS length:', data.QUESTIONS.length);
        const question = data.QUESTIONS[index];
        console.log('Current question:', question);

        // 更新进度
        const progress = ((index + 1) / data.QUESTIONS.length) * 100;
        elements.quiz.progressFill.style.width = `${progress}%`;
        elements.quiz.currentScene.textContent = index + 1;
        elements.quiz.sceneNumber.textContent = index + 1;

        // 更新当前题号
        state.currentQuestion = index;
        elements.quiz.sceneCard.style.animation = 'none';
        setTimeout(() => {
            elements.quiz.sceneCard.style.animation = 'card-enter 0.5s ease-out';
        }, 10);

        // 渲染场景信息
        elements.quiz.sceneLocation.textContent = question.location;

        // 渲染对话
        elements.quiz.sceneDialogue.innerHTML = '';
        
        question.dialogue.forEach((line, i) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'dialogue-line';
            lineDiv.style.animationDelay = `${i * 0.1}s`;
            lineDiv.innerHTML = `
                <div class="character-name">${line.character}</div>
                <div class="character-line">${line.line}</div>
            `;
            elements.quiz.sceneDialogue.appendChild(lineDiv);
        });

        // 渲染旁白
        if (question.narration) {
            const narrationDiv = document.createElement('div');
            narrationDiv.className = 'narration';
            narrationDiv.textContent = question.narration;
            elements.quiz.sceneDialogue.appendChild(narrationDiv);
        }

        // 渲染选项
        elements.quiz.choicesContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D', 'E'];
        
        question.choices.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
                <span class="choice-letter">${letters[i]}</span>
                ${choice.text}
            `;
            btn.addEventListener('click', () => handleChoice(index, choice));
            elements.quiz.choicesContainer.appendChild(btn);
        });

        // 显示/隐藏返回按钮
        if (index > 0) {
            elements.quiz.prevBtn.style.display = 'inline-flex';
        } else {
            elements.quiz.prevBtn.style.display = 'none';
        }
    }

    // 处理选择
    function handleChoice(questionIndex, choice) {
        // 等待数据加载
        if (!window.QUIZ_DATA) {
            setTimeout(() => handleChoice(questionIndex, choice), 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        const question = data.QUESTIONS[questionIndex];

        // 记录答案
        state.answers.push({
            questionId: question.id,
            dimension: question.dimension,
            choice: choice
        });

        // 更新分数
        state.scores[question.dimension][choice.type] += choice.score;

        // 更新当前题号
        state.currentQuestion = questionIndex + 1;

        // 下一题或结束
        if (questionIndex < data.QUESTIONS.length - 1) {
            renderQuestion(state.currentQuestion);
        } else {
            finishQuiz();
        }
    }

    // 完成测试
    function finishQuiz() {
        switchScreen('loading');
        
        // 模拟计算时间
        setTimeout(() => {
            calculateResult();
            renderResult();
            switchScreen('result');
        }, 2000);
    }

    // 计算结果 - 改进版：计算匹配度和动态描述
    function calculateResult() {
        // 等待数据加载
        if (!window.QUIZ_DATA) {
            setTimeout(calculateResult, 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        
        // 计算每个维度的详细结果（包括得分和百分比）
        const dimensionResults = {};
        const dimensionDetails = {};
        
        Object.keys(state.scores).forEach(dim => {
            const scores = state.scores[dim];
            const types = Object.keys(scores);
            const maxScore = Math.max(...types.map(t => scores[t]));
            const totalScore = types.reduce((sum, t) => sum + scores[t], 0);
            
            // 找出最高分的类型
            const maxType = types.reduce((a, b) => scores[a] > scores[b] ? a : b);
            
            // 计算百分比
            const percentage = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 0;
            
            dimensionResults[dim] = maxType;
            dimensionDetails[dim] = {
                type: maxType,
                score: maxScore,
                total: totalScore,
                percentage: percentage,
                allScores: scores
            };
        });

        // 计算与每个原型的匹配度
        const archetypeMatches = calculateArchetypeMatches(dimensionResults);
        
        // 找出最佳匹配
        const bestMatch = archetypeMatches[0];
        
        // 生成动态描述
        const dynamicDescription = generateDynamicDescription(dimensionResults);

        state.result = {
            archetype: bestMatch.archetype,
            matchPercentage: bestMatch.percentage,
            dimensions: dimensionResults,
            dimensionDetails: dimensionDetails,
            allMatches: archetypeMatches,
            dynamicDescription: dynamicDescription
        };
    }

    // 计算与所有原型的匹配度
    function calculateArchetypeMatches(dimensionResults) {
        const data = window.QUIZ_DATA;
        const matches = [];
        
        for (const rule of data.ARCHETYPE_MATCHING_RULES) {
            let matchCount = 0;
            let totalWeight = 0;
            
            for (const [dim, allowedTypes] of Object.entries(rule.conditions)) {
                totalWeight++;
                if (allowedTypes.includes(dimensionResults[dim])) {
                    matchCount++;
                }
            }
            
            const percentage = totalWeight > 0 ? Math.round((matchCount / totalWeight) * 100) : 0;
            matches.push({
                archetype: rule.archetype,
                percentage: percentage,
                matched: matchCount,
                total: totalWeight
            });
        }
        
        // 按匹配度排序
        return matches.sort((a, b) => b.percentage - a.percentage);
    }

    // 生成动态描述
    function generateDynamicDescription(dimensionResults) {
        const data = window.QUIZ_DATA;
        const desc = data.DYNAMIC_DESCRIPTIONS;
        const transitions = data.COMBINATION_TRANSITIONS;
        
        // 从每个维度随机选择一个描述片段
        const driveDesc = getRandomItem(desc.drive[dimensionResults.drive]);
        const worldDesc = getRandomItem(desc.world[dimensionResults.world]);
        const selfDesc = getRandomItem(desc.self[dimensionResults.self]);
        const timeDesc = getRandomItem(desc.time[dimensionResults.time]);
        
        // 组合成段落
        const parts = [
            `你是一个${driveDesc}的人，`,
            `${worldDesc}。`,
            `${getRandomItem(transitions)}${selfDesc}，`,
        ];
        
        // 根据时间维度类型调整结尾
        if (dimensionResults.time === 'chasing') {
            parts.push(`总是在${timeDesc}。`);
        } else if (dimensionResults.time === 'stagnation') {
            parts.push(`常常${timeDesc}。`);
        } else {
            parts.push(`${timeDesc}。`);
        }
        
        return parts.join('');
    }

    // 辅助函数：随机选择数组元素
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 匹配原型
    function matchArchetype(dimensionResults) {
        const data = window.QUIZ_DATA;
        
        for (const rule of data.ARCHETYPE_MATCHING_RULES) {
            let match = true;
            for (const [dim, allowedTypes] of Object.entries(rule.conditions)) {
                if (!allowedTypes.includes(dimensionResults[dim])) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return rule.archetype;
            }
        }
        return null;
    }

    // 找最接近的原型
    function findClosestArchetype(dimensionResults) {
        const data = window.QUIZ_DATA;
        let bestMatch = 'awakened'; // 默认
        let maxMatches = 0;

        for (const rule of data.ARCHETYPE_MATCHING_RULES) {
            let matches = 0;
            for (const [dim, allowedTypes] of Object.entries(rule.conditions)) {
                if (allowedTypes.includes(dimensionResults[dim])) {
                    matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = rule.archetype;
            }
        }

        return bestMatch;
    }

    // 渲染结果
    function renderResult() {
        const data = window.QUIZ_DATA;
        const archetype = data.ARCHETYPES[state.result.archetype];
        const dims = state.result.dimensions;

        // 基本信息
        elements.result.movieTitle.textContent = archetype.movieTitle;
        elements.result.tagline.textContent = archetype.tagline;
        elements.result.archetypeName.textContent = archetype.name;
        elements.result.archetypeSubtitle.textContent = archetype.englishName;

        // 动态描述
        const dynamicDescHtml = state.result.dynamicDescription ? `
            <div class="dynamic-description">
                <h4>🎭 你的专属画像</h4>
                <p class="dynamic-text">${state.result.dynamicDescription}</p>
            </div>
        ` : '';

        // 匹配度显示
        const matchPercentHtml = state.result.matchPercentage ? `
            <div class="match-percentage">
                <span class="match-label">原型匹配度</span>
                <span class="match-value">${state.result.matchPercentage}%</span>
            </div>
        ` : '';

        // 日常场景代入
        const dailyScenesHtml = archetype.dailyScenes ? `
            <div class="daily-scenes">
                <h4>💭 这些场景，你是不是很熟悉？</h4>
                <ul>
                    ${archetype.dailyScenes.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        // 当前主演的烂片
        elements.result.badMovieContent.innerHTML = `
            ${dynamicDescHtml}
            <p class="quote">${archetype.badMovie.synopsis}</p>
            ${dailyScenesHtml}
            <p><strong>你可能有的体验：</strong></p>
            <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
                ${archetype.badMovie.symptoms.map(s => `<li style="margin-bottom: 0.5rem;">${s}</li>`).join('')}
            </ul>
        `;

        // 4维详细解读
        const dimensionAnalysisHtml = archetype.dimensionAnalysis ? `
            <div class="dimension-analysis">
                <h4>🔍 你的四维画像详解</h4>
                <div class="dim-analysis-grid">
                    <div class="dim-analysis-item">
                        <span class="dim-label">核心驱动力</span>
                        <p>${archetype.dimensionAnalysis.drive}</p>
                    </div>
                    <div class="dim-analysis-item">
                        <span class="dim-label">与世界的关系</span>
                        <p>${archetype.dimensionAnalysis.world}</p>
                    </div>
                    <div class="dim-analysis-item">
                        <span class="dim-label">与自我的关系</span>
                        <p>${archetype.dimensionAnalysis.self}</p>
                    </div>
                    <div class="dim-analysis-item">
                        <span class="dim-label">与时间的关系</span>
                        <p>${archetype.dimensionAnalysis.time}</p>
                    </div>
                </div>
            </div>
        ` : '';

        // 剧组卡司表 - 优化版
        elements.result.castGrid.innerHTML = `
            <div class="cast-section">
                <h4>👨‍👩‍👧 先天配角：父母/原生家庭</h4>
                <p class="cast-intro">这些人塑造了你最初的「剧本」，他们的行为模式成为你潜意识里的「默认设置」。</p>
                <div class="cast-list">
                    ${archetype.cast.innate.parts.map(p => `
                        <div class="cast-item-detailed">
                            <span class="cast-name">${p.name}</span>
                            <p>${p.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="cast-section">
                <h4>👥 后天配角：你吸引来的人</h4>
                <p class="cast-intro">你的剧本会吸引特定的人进入你的生活。看看你现在身边有没有这些角色：</p>
                <div class="cast-list">
                    ${archetype.cast.acquired.parts.map(p => `
                        <div class="cast-item-detailed">
                            <span class="cast-name">${p.name}</span>
                            <p>${p.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${dimensionAnalysisHtml}
        `;

        // 新剧本大纲
        elements.result.newScriptContent.innerHTML = `
            <p class="quote">${archetype.newScript.synopsis}</p>
            <p><strong>关键转变：</strong></p>
            <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
                ${archetype.newScript.keyChanges.map(c => `<li style="margin-bottom: 0.5rem;">${c}</li>`).join('')}
            </ul>
        `;

        // 明日拍摄计划
        elements.result.actionPlan.innerHTML = archetype.actionPlan.map(action => `
            <div class="action-item">
                <span class="action-icon">${action.icon}</span>
                <span>${action.text}</span>
            </div>
        `).join('');

        // 维度详细解读卡片
        const dimensionCardsHtml = Object.entries(dims).map(([dim, type]) => {
            const dimData = data.DIMENSIONS[dim];
            const typeData = dimData.types[type];
            return `
                <div class="dimension-detail-card">
                    <div class="dim-header">
                        <span class="dim-title">${dimData.name}</span>
                        <span class="dim-type">${typeData.name}</span>
                    </div>
                    <div class="dim-content">
                        <p class="dim-desc">${typeData.fullDesc}</p>
                        <div class="dim-scene">
                            <span class="scene-label">💭 日常场景</span>
                            <p>${typeData.dailyScene}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 插入维度解读到页面
        const dimAnalysisContainer = document.getElementById('dimension-analysis-container');
        if (dimAnalysisContainer) {
            dimAnalysisContainer.innerHTML = `
                <div class="dimension-analysis-section">
                    <h3>📊 你的四维画像详解</h3>
                    <p class="analysis-intro">以下是你四个维度的详细解读。看看这些描述，是不是有一种「这就是我」的感觉？</p>
                    <div class="dimension-cards-grid">
                        ${dimensionCardsHtml}
                    </div>
                </div>
            `;
        }

        // 维度标签（简化版）
        const dimNames = {
            drive: '核心驱动力',
            world: '与世界的关系',
            self: '与自我的关系',
            time: '与时间的关系'
        };

        elements.result.dimensionTags.innerHTML = Object.entries(dims).map(([dim, type]) => `
            <div class="dimension-tag">
                <span class="dim-name">${dimNames[dim]}</span>
                <span class="dim-value">${data.DIMENSION_TYPE_NAMES[dim][type]}</span>
            </div>
        `).join('');

        // 绘制雷达图
        drawRadarChart();
    }

    // 绘制雷达图
    function drawRadarChart() {
        const canvas = elements.result.radarChart;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 维度标签
        const labels = ['核心驱动力', '与世界的关系', '与自我的关系', '与时间的关系'];
        const dims = ['drive', 'world', 'self', 'time'];

        // 计算每个维度的得分百分比
        const scores = dims.map(dim => {
            const dimScores = state.scores[dim];
            const maxScore = Math.max(...Object.values(dimScores));
            const totalScore = Object.values(dimScores).reduce((a, b) => a + b, 0);
            return maxScore / totalScore;
        });

        // 绘制背景网格
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 1;

        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            const r = (radius / 4) * i;
            for (let j = 0; j < 4; j++) {
                const angle = (Math.PI * 2 / 4) * j - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }

        // 绘制轴线
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // 绘制标签
            const labelX = centerX + (radius + 25) * Math.cos(angle);
            const labelY = centerY + (radius + 25) * Math.sin(angle);
            ctx.fillStyle = '#d4af37';
            ctx.font = '12px Noto Sans SC';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], labelX, labelY);
        }

        // 绘制数据区域
        ctx.beginPath();
        ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i - Math.PI / 2;
            const r = radius * scores[i];
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 绘制数据点
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i - Math.PI / 2;
            const r = radius * scores[i];
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            ctx.beginPath();
            ctx.fillStyle = '#d4af37';
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 显示分享模态框
    function showShareModal() {
        const data = window.QUIZ_DATA;
        const archetype = data.ARCHETYPES[state.result.archetype];
        
        // 生成分享链接（包含结果参数）
        const shareUrl = `https://wuzehua2015-hash.github.io/life-script-quiz/?result=${state.result.archetype}`;

        // 生成分享海报HTML（用于生成图片）
        const posterHtml = `
            <div id="poster-capture" style="background: linear-gradient(135deg, #1a1a25 0%, #12121a 100%); padding: 40px; text-align: center; border-radius: 16px; width: 300px;">
                <div style="font-size: 12px; color: #d4af37; margin-bottom: 10px; letter-spacing: 2px;">PTK LIFE SCRIPT STUDIOS</div>
                <h2 style="font-family: 'Noto Serif SC', serif; font-size: 24px; color: #d4af37; margin-bottom: 20px; margin-top: 0;">人生剧本测试</h2>
                <div style="font-size: 32px; font-weight: 700; color: #f5f5f5; margin: 20px 0;">${archetype.name}</div>
                <div style="font-size: 14px; color: #a0a0b0; margin-bottom: 30px; font-style: italic;">${archetype.tagline}</div>
                <div id="qrcode-container" style="width: 140px; height: 140px; margin: 20px auto; background: white; padding: 10px; border-radius: 8px;"></div>
                <div style="font-size: 12px; color: #6a6a7a; margin-top: 20px;">扫码测试你的人生剧本</div>
                <div style="font-size: 10px; color: #4a4a5a; margin-top: 10px;">wuzehua2015-hash.github.io</div>
            </div>
        `;

        elements.modal.sharePosterContainer.innerHTML = posterHtml;

        // 生成二维码
        new QRCode(document.getElementById('qrcode-container'), {
            text: shareUrl,
            width: 120,
            height: 120,
            colorDark: '#0a0a0f',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });

        // 显示模态框
        elements.modal.shareModal.classList.add('active');

        // 使用 html2canvas 生成图片
        setTimeout(() => {
            const posterElement = document.getElementById('poster-capture');
            if (posterElement && typeof html2canvas !== 'undefined') {
                html2canvas(posterElement, {
                    backgroundColor: null,
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    // 将 canvas 转为图片
                    const imgData = canvas.toDataURL('image/png');
                    
                    // 替换为图片
                    elements.modal.sharePosterContainer.innerHTML = `
                        <img src="${imgData}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
                        <div style="margin-top: 1rem; color: var(--text-muted); font-size: 0.85rem;">👆 长按上方图片保存</div>
                    `;
                }).catch(err => {
                    console.error('生成图片失败:', err);
                    // 如果生成失败，保持原样
                });
            }
        }, 500);
    }

    // 隐藏分享模态框
    function hideShareModal() {
        elements.modal.shareModal.classList.remove('active');
    }

    // 重新测试
    function retakeQuiz() {
        // 重置状态
        state.currentQuestion = 0;
        state.answers = [];
        initScores();
        state.result = null;

        // 返回开始页面
        switchScreen('intro');
    }

    // 启动应用
    document.addEventListener('DOMContentLoaded', init);
})();
// cache bust Tue Feb 24 05:44:04 PM CST 2026

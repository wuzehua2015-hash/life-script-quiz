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
            // 清除当前题的答案
            state.answers.pop();
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
            data.DIMENSIONS[dim].types.forEach(type => {
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

        // 场景切换动画
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

        // 下一题或结束
        if (questionIndex < data.QUESTIONS.length - 1) {
            renderQuestion(questionIndex + 1);
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

    // 计算结果
    function calculateResult() {
        // 等待数据加载
        if (!window.QUIZ_DATA) {
            setTimeout(calculateResult, 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        
        // 找出每个维度得分最高的类型
        const dimensionResults = {};
        Object.keys(state.scores).forEach(dim => {
            const scores = state.scores[dim];
            const maxType = Object.keys(scores).reduce((a, b) => 
                scores[a] > scores[b] ? a : b
            );
            dimensionResults[dim] = maxType;
        });

        // 匹配原型
        let matchedArchetype = matchArchetype(dimensionResults);
        
        // 如果没有精确匹配，找最接近的
        if (!matchedArchetype) {
            matchedArchetype = findClosestArchetype(dimensionResults);
        }

        state.result = {
            archetype: matchedArchetype,
            dimensions: dimensionResults,
            scores: state.scores
        };
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

        // 当前主演的烂片
        elements.result.badMovieContent.innerHTML = `
            <p class="quote">${archetype.badMovie.synopsis}</p>
            <p><strong>你可能有的体验：</strong></p>
            <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
                ${archetype.badMovie.symptoms.map(s => `<li style="margin-bottom: 0.5rem;">${s}</li>`).join('')}
            </ul>
        `;

        // 剧组卡司表
        elements.result.castGrid.innerHTML = `
            <div class="cast-item">
                <span class="cast-role">${archetype.cast.innate.role}</span>
                <div class="cast-info">
                    ${archetype.cast.innate.parts.map(p => `
                        <h4>${p.name}</h4>
                        <p>${p.desc}</p>
                    `).join('')}
                </div>
            </div>
            <div class="cast-item">
                <span class="cast-role">${archetype.cast.acquired.role}</span>
                <div class="cast-info">
                    ${archetype.cast.acquired.parts.map(p => `
                        <h4>${p.name}</h4>
                        <p>${p.desc}</p>
                    `).join('')}
                </div>
            </div>
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

        // 维度标签
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

        // 生成分享海报HTML
        elements.modal.sharePosterContainer.innerHTML = `
            <div class="share-poster" style="background: linear-gradient(135deg, #1a1a25 0%, #12121a 100%); padding: 2rem; text-align: center; border-radius: 12px;">
                <div style="font-size: 0.8rem; color: #d4af37; margin-bottom: 0.5rem;">PTK LIFE SCRIPT STUDIOS</div>
                <h2 style="font-family: 'Noto Serif SC', serif; font-size: 1.5rem; color: #d4af37; margin-bottom: 0.5rem;">人生剧本测试</h2>
                <div style="font-size: 2rem; font-weight: 700; color: #f5f5f5; margin: 1rem 0;">${archetype.name}</div>
                <div style="font-size: 0.9rem; color: #a0a0b0; margin-bottom: 1.5rem; font-style: italic;">${archetype.tagline}</div>
                <div id="qrcode-container" style="width: 120px; height: 120px; margin: 1rem auto; background: white; padding: 8px; border-radius: 8px;"></div>
                <div style="font-size: 0.75rem; color: #6a6a7a; margin-top: 1rem;">扫码测试你的人生剧本</div>
            </div>
        `;

        // 生成真实二维码
        setTimeout(() => {
            new QRCode(document.getElementById('qrcode-container'), {
                text: shareUrl,
                width: 104,
                height: 104,
                colorDark: '#0a0a0f',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        }, 100);

        elements.modal.shareModal.classList.add('active');
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

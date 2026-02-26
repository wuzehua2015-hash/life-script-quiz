/**
 * 人生剧本测试 v2.0 - 主应用逻辑
 * 新增：前置问题、80角色库、混合原型匹配、海报分享
 */

(function() {
    'use strict';

    // 应用状态
    const state = {
        currentScreen: 'intro',
        basicInfo: {},
        currentQuestion: 0,
        answers: [],
        scores: {
            drive: {},
            world: {},
            self: {},
            time: {}
        },
        result: null,
        matchedCharacter: null
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
            basic: document.getElementById('basic-screen'),
            quiz: document.getElementById('quiz-screen'),
            loading: document.getElementById('loading-screen'),
            result: document.getElementById('result-screen')
        };

        elements.intro = {
            startBtn: document.getElementById('start-btn')
        };

        elements.basic = {
            container: document.getElementById('basic-questions-container'),
            nextBtn: document.getElementById('basic-next-btn'),
            progress: document.getElementById('basic-progress')
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
            retakeBtn: document.getElementById('retake-btn'),
            // v2.0 新增
            characterCard: document.getElementById('character-card'),
            similarityPoints: document.getElementById('similarity-points'),
            characterStory: document.getElementById('character-story'),
            lifePrediction: document.getElementById('life-prediction'),
            characterAdvice: document.getElementById('character-advice'),
            matchPercentage: document.getElementById('match-percentage')
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

    // 初始化分数
    function initScores() {
        if (!window.QUIZ_DATA) {
            setTimeout(initScores, 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        Object.keys(data.DIMENSIONS).forEach(dim => {
            state.scores[dim] = {};
            const types = data.DIMENSIONS[dim].types;
            const typeKeys = Array.isArray(types) ? types : Object.keys(types);
            typeKeys.forEach(type => {
                state.scores[dim][type] = 0;
            });
        });
    }

    // ==================== 基础问题流程（12题之后） ====================
    
    function startBasicQuestions() {
        switchScreen('basic');
        renderBasicQuestions();
    }

    function renderBasicQuestions() {
        const data = window.QUIZ_DATA;
        const container = elements.basic.container;
        container.innerHTML = '';

        data.BASIC_QUESTIONS.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'basic-question';
            questionDiv.dataset.questionId = q.id;
            
            let optionsHtml = '';
            q.options.forEach(opt => {
                optionsHtml += `
                    <button class="basic-option" data-value="${opt.value}">
                        <span class="option-icon">${opt.icon}</span>
                        <span class="option-label">${opt.label}</span>
                    </button>
                `;
            });

            questionDiv.innerHTML = `
                <div class="basic-question-header">
                    <span class="basic-question-number">${index + 1}</span>
                    <h3>${q.title}</h3>
                </div>
                <p class="basic-question-desc">${q.description}</p>
                <div class="basic-options">
                    ${optionsHtml}
                </div>
            `;

            container.appendChild(questionDiv);

            // 绑定选项点击事件
            questionDiv.querySelectorAll('.basic-option').forEach(btn => {
                btn.addEventListener('click', () => selectBasicOption(q.id, btn.dataset.value, btn));
            });
        });

        // 绑定下一步按钮
        elements.basic.nextBtn.addEventListener('click', () => {
            if (Object.keys(state.basicInfo).length === data.BASIC_QUESTIONS.length) {
                finishQuiz();
            } else {
                showToast('请回答所有问题');
            }
        });

        updateBasicProgress();
    }

    function selectBasicOption(questionId, value, btn) {
        state.basicInfo[questionId] = value;
        
        // 更新UI
        const questionDiv = btn.closest('.basic-question');
        questionDiv.querySelectorAll('.basic-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        updateBasicProgress();
    }

    function updateBasicProgress() {
        const data = window.QUIZ_DATA;
        const answered = Object.keys(state.basicInfo).length;
        const total = data.BASIC_QUESTIONS.length;
        const percent = (answered / total) * 100;
        
        elements.basic.progress.style.width = `${percent}%`;
        
        if (answered === total) {
            elements.basic.nextBtn.classList.add('active');
        }
    }

    // ==================== 测试流程 ====================

    function startQuiz() {
        switchScreen('quiz');
        renderQuestion(0);
    }

    function switchScreen(screenName) {
        Object.values(elements.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        if (elements.screens[screenName]) {
            elements.screens[screenName].classList.add('active');
        }
    }

    function renderQuestion(index) {
        if (!window.QUIZ_DATA) {
            setTimeout(() => renderQuestion(index), 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        const question = data.QUESTIONS[index];

        // 更新进度
        const progress = ((index + 1) / data.QUESTIONS.length) * 100;
        elements.quiz.progressFill.style.width = `${progress}%`;
        elements.quiz.currentScene.textContent = index + 1;
        elements.quiz.sceneNumber.textContent = index + 1;

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

        elements.quiz.prevBtn.style.display = index > 0 ? 'inline-flex' : 'none';
    }

    function handleChoice(questionIndex, choice) {
        if (!window.QUIZ_DATA) {
            setTimeout(() => handleChoice(questionIndex, choice), 100);
            return;
        }
        
        const data = window.QUIZ_DATA;
        const question = data.QUESTIONS[questionIndex];

        state.answers.push({
            questionId: question.id,
            dimension: question.dimension,
            choice: choice
        });

        state.scores[question.dimension][choice.type] += choice.score;
        state.currentQuestion = questionIndex + 1;

        if (questionIndex < data.QUESTIONS.length - 1) {
            renderQuestion(state.currentQuestion);
        } else {
            startBasicQuestions();
        }
    }

    function goToPrevQuestion() {
        if (state.currentQuestion > 0) {
            const lastAnswer = state.answers.pop();
            if (lastAnswer) {
                state.scores[lastAnswer.dimension][lastAnswer.choice.type] -= lastAnswer.choice.score;
            }
            state.currentQuestion--;
            renderQuestion(state.currentQuestion);
        }
    }

    function finishQuiz() {
        switchScreen('loading');
        
        setTimeout(() => {
            if (!window.QUIZ_DATA) {
                setTimeout(finishQuiz, 100);
                return;
            }
            calculateResult();
            renderResult();
            switchScreen('result');
        }, 2000);
    }

    // ==================== 结果计算 ====================

    function calculateResult() {
        const data = window.QUIZ_DATA;
        
        // 计算维度结果
        const dimensionResults = {};
        const dimensionDetails = {};
        
        Object.keys(state.scores).forEach(dim => {
            const scores = state.scores[dim];
            const types = Object.keys(scores);
            const maxScore = Math.max(...types.map(t => scores[t]));
            const totalScore = types.reduce((sum, t) => sum + scores[t], 0);
            const maxType = types.reduce((a, b) => scores[a] > scores[b] ? a : b);
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

        // 计算原型匹配度
        const archetypeMatches = calculateArchetypeMatches(dimensionResults);
        const bestMatch = archetypeMatches[0];
        
        // 检查是否混合原型
        let isMixed = false;
        let mixedArchetypes = null;
        if (archetypeMatches.length > 1) {
            const secondMatch = archetypeMatches[1];
            if (bestMatch.percentage - secondMatch.percentage < 10) {
                isMixed = true;
                mixedArchetypes = [bestMatch.archetype, secondMatch.archetype];
            }
        }

        // 匹配角色
        const matchedCharacter = matchCharacter(bestMatch.archetype, isMixed ? mixedArchetypes : null);

        // 计算综合匹配度
        const totalMatchPercentage = calculateTotalMatchPercentage(bestMatch.percentage, matchedCharacter);

        state.result = {
            archetype: bestMatch.archetype,
            isMixed: isMixed,
            mixedArchetypes: mixedArchetypes,
            matchPercentage: totalMatchPercentage,
            archetypeMatchPercentage: bestMatch.percentage,
            dimensions: dimensionResults,
            dimensionDetails: dimensionDetails,
            allMatches: archetypeMatches,
            character: matchedCharacter
        };
    }

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
        
        return matches.sort((a, b) => b.percentage - a.percentage);
    }

    function matchCharacter(archetypeKey, mixedArchetypes) {
        const data = window.QUIZ_DATA;
        const characters = data.CHARACTER_LIBRARY[archetypeKey] || [];
        
        if (characters.length === 0) return null;

        // 根据基础信息筛选和排序
        let scoredCharacters = characters.map(char => {
            let score = 0;
            
            // 性别匹配 (15%)
            if (char.gender.includes(state.basicInfo.gender) || char.gender.includes('other')) {
                score += 15;
            }
            
            // 年龄匹配 (15%)
            if (char.age.includes(state.basicInfo.age)) {
                score += 15;
            }
            
            // 职业匹配 (15%)
            if (char.career.includes(state.basicInfo.career)) {
                score += 15;
            }
            
            // 人生阶段匹配 (15%)
            if (char.stage.includes(state.basicInfo.life_stage)) {
                score += 15;
            }
            
            return { character: char, score: score };
        });

        // 按分数排序，返回最佳匹配
        scoredCharacters.sort((a, b) => b.score - a.score);
        return scoredCharacters[0]?.character || characters[0];
    }

    function calculateTotalMatchPercentage(archetypePercentage, character) {
        // 基础匹配度计算
        // 原型匹配 40% + 角色属性匹配（性别15% + 年龄15% + 职业15% + 人生阶段15%）
        
        let attributeScore = 0;
        if (character) {
            if (character.gender.includes(state.basicInfo.gender)) attributeScore += 15;
            if (character.age.includes(state.basicInfo.age)) attributeScore += 15;
            if (character.career.includes(state.basicInfo.career)) attributeScore += 15;
            if (character.stage.includes(state.basicInfo.life_stage)) attributeScore += 15;
        }

        // 原型匹配占40%，属性匹配占60%
        const totalScore = (archetypePercentage * 0.4) + (attributeScore * 0.6);
        
        // 根据单一原型或混合原型调整范围
        if (!state.result?.isMixed) {
            // 单一原型：70-95%
            return Math.min(95, Math.max(70, Math.round(totalScore)));
        } else {
            // 混合原型：60-85%
            return Math.min(85, Math.max(60, Math.round(totalScore)));
        }
    }

    // ==================== 渲染结果 ====================

    function renderResult() {
        const data = window.QUIZ_DATA;
        const archetype = data.ARCHETYPES[state.result.archetype];
        const character = state.result.character;
        const dims = state.result.dimensions;

        // 基础信息
        elements.result.movieTitle.textContent = archetype.movieTitle;
        elements.result.tagline.textContent = archetype.tagline;
        elements.result.archetypeName.textContent = archetype.name;
        elements.result.archetypeSubtitle.textContent = state.result.isMixed ? 
            `${state.result.mixedArchetypes.map(a => data.ARCHETYPES[a].name).join(' + ')}` : 
            archetype.englishName;

        // 匹配度显示 - 已移到角色卡片内显示，此处不再重复显示
        /*
        if (elements.result.matchPercentage) {
            elements.result.matchPercentage.innerHTML = `
                <div class="match-percentage-large">
                    <span class="match-value">${state.result.matchPercentage}%</span>
                    <span class="match-label">角色匹配度</span>
                </div>
            `;
        }
        */

        // 渲染角色卡片
        renderCharacterCard(character, archetype);

        // 渲染相似点
        renderSimilarityPoints(character);

        // 渲染角色故事
        renderCharacterStory(character);

        // 渲染人生预测
        renderLifePrediction(character, archetype);

        // 渲染建议
        renderAdvice(character);

        // 渲染原有的原型分析
        renderArchetypeAnalysis(archetype, dims, data);

        // 渲染四维解读（新增）
        renderDimensionAnalysis(data);

        // 绘制雷达图
        drawRadarChart();
    }

    // 新增：四维解读渲染函数
    function renderDimensionAnalysis(data) {
        const container = document.getElementById('dimension-analysis');
        if (!container) return;

        const dimNames = {
            drive: { name: '核心驱动力', icon: '🔥' },
            world: { name: '与世界的关系', icon: '🌍' },
            self: { name: '与自我的关系', icon: '💫' },
            time: { name: '与时间的关系', icon: '⏳' }
        };

        const dims = state.result.dimensions;
        const dimensionDetails = state.result.dimensionDetails;

        let html = '<h3>📊 四维深度解读</h3><div class="dimension-analysis-list">';

        Object.entries(dims).forEach(([dim, type]) => {
            const dimConfig = data.DIMENSIONS[dim];
            const typeConfig = dimConfig.types[type];
            const detail = dimensionDetails[dim];
            const percentage = detail.percentage;

            html += `
                <div class="dimension-analysis-item">
                    <div class="dim-analysis-header">
                        <span class="dim-analysis-icon">${dimNames[dim].icon}</span>
                        <div class="dim-analysis-title">
                            <h4>${dimConfig.name}</h4>
                            <span class="dim-analysis-type">${typeConfig.name}</span>
                        </div>
                        <div class="dim-analysis-score">${percentage}%</div>
                    </div>
                    <div class="dim-analysis-content">
                        <p class="dim-short-desc">${typeConfig.shortDesc}</p>
                        <p class="dim-full-desc">${typeConfig.fullDesc}</p>
                        <div class="dim-daily-scene">
                            <strong>💭 日常场景：</strong>${typeConfig.dailyScene}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    function renderCharacterCard(character, archetype) {
        if (!character || !elements.result.characterCard) return;

        const isMixed = state.result.isMixed;
        const mixedText = isMixed ? `<span class="mixed-badge">混合原型</span>` : '';

        elements.result.characterCard.innerHTML = `
            <div class="character-card-v2">
                <div class="character-image-placeholder">
                    <div class="character-avatar">${character.name.charAt(0)}</div>
                    <div class="character-work">${character.work}</div>
                </div>
                <div class="character-info">
                    <h2 class="character-name">${character.name}</h2>
                    ${mixedText}
                    <p class="character-quote">「${character.quote}」</p>
                    <div class="character-match">
                        <span class="match-percent">${state.result.matchPercentage}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSimilarityPoints(character) {
        if (!character || !elements.result.similarityPoints) return;

        const points = character.similarity || [];
        elements.result.similarityPoints.innerHTML = `
            <h4>🎭 为什么你像${character.name}</h4>
            <ul class="similarity-list">
                ${points.map(point => `<li><span class="similarity-dot">◆</span>${point}</li>`).join('')}
            </ul>
        `;
    }

    function renderCharacterStory(character) {
        if (!character || !elements.result.characterStory) return;

        elements.result.characterStory.innerHTML = `
            <h4>📖 ${character.name}的人生剧本</h4>
            <p class="story-text">${character.story}</p>
        `;
    }

    function renderLifePrediction(character, archetype) {
        if (!elements.result.lifePrediction) return;

        const predictions = generateLifePredictions(archetype, character);
        elements.result.lifePrediction.innerHTML = `
            <h4>🔮 你的人生剧本预测</h4>
            <div class="prediction-list">
                ${predictions.map(p => `
                    <div class="prediction-item">
                        <span class="prediction-icon">${p.icon}</span>
                        <p>${p.text}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function generateLifePredictions(archetype, character) {
        const predictions = [
            { icon: "🌟", text: `你像${character.name}一样，${character.similarity?.[0] || '有着独特的魅力'}` },
            { icon: "⚠️", text: `需要注意：${archetype.badMovie.symptoms[0]}` },
            { icon: "💡", text: `转机时刻：当你学会${archetype.newScript.keyChanges[0].replace('从', '').split('到')[1] || '接纳自己'}时` }
        ];
        return predictions;
    }

    function renderAdvice(character) {
        if (!character || !elements.result.characterAdvice) return;

        elements.result.characterAdvice.innerHTML = `
            <h4>💌 来自${character.name}的启示</h4>
            <div class="advice-box">
                <p class="advice-text">${character.advice}</p>
            </div>
        `;
    }

    function renderArchetypeAnalysis(archetype, dims, data) {
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
        `;

        // 新剧本大纲
        elements.result.newScriptContent.innerHTML = `
            <p class="quote">${archetype.newScript.synopsis}</p>
            <p><strong>关键转变：</strong></p>
            <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
                ${archetype.newScript.keyChanges.map(c => `<li style="margin-bottom: 0.5rem;">${c}</li>`).join('')}
            </ul>
        `;

        // 行动计划
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
    }

    function drawRadarChart() {
        const canvas = elements.result.radarChart;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const labels = ['核心驱动力', '与世界的关系', '与自我的关系', '与时间的关系'];
        const dims = ['drive', 'world', 'self', 'time'];

        const scores = dims.map(dim => {
            const dimScores = state.scores[dim];
            const maxScore = Math.max(...Object.values(dimScores));
            const totalScore = Object.values(dimScores).reduce((a, b) => a + b, 0);
            return maxScore / totalScore;
        });

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 1;

        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            const r = (radius / 4) * i;
            for (let j = 0; j < 4; j++) {
                const angle = (Math.PI * 2 / 4) * j - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            const labelX = centerX + (radius + 25) * Math.cos(angle);
            const labelY = centerY + (radius + 25) * Math.sin(angle);
            ctx.fillStyle = '#d4af37';
            ctx.font = '12px Noto Sans SC';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], labelX, labelY);
        }

        ctx.beginPath();
        ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i - Math.PI / 2;
            const r = radius * scores[i];
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

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

    // ==================== 分享功能 ====================

    function showShareModal() {
        const data = window.QUIZ_DATA;
        const archetype = data.ARCHETYPES[state.result.archetype];
        const character = state.result.character;
        
        const shareUrl = `https://wuzehua2015-hash.github.io/life-script-quiz/?result=${state.result.archetype}`;

        const posterHtml = `
            <div id="poster-capture" style="background: linear-gradient(135deg, #1a1a25 0%, #12121a 100%); padding: 40px; text-align: center; border-radius: 16px; width: 320px;">
                <div style="font-size: 10px; color: #d4af37; margin-bottom: 10px; letter-spacing: 2px;">PTK LIFE SCRIPT STUDIOS v2.0</div>
                <h2 style="font-family: 'Noto Serif SC', serif; font-size: 22px; color: #d4af37; margin-bottom: 15px; margin-top: 0;">人生剧本测试</h2>
                
                <div style="background: rgba(212, 175, 55, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(212, 175, 55, 0.3);">
                    <div style="font-size: 14px; color: #a0a0b0; margin-bottom: 8px;">你的角色匹配</div>
                    <div style="font-size: 36px; font-weight: 700; color: #f5f5f5; margin: 10px 0;">${character ? character.name : archetype.name}</div>
                    <div style="font-size: 12px; color: #d4af37; margin-bottom: 15px;">${character ? character.work : ''}</div>
                    <div style="font-size: 28px; font-weight: 700; color: #d4af37; margin: 15px 0;">${state.result.matchPercentage}%</div>
                    <div style="font-size: 12px; color: #6a6a7a;">匹配度</div>
                </div>
                
                <div style="font-size: 13px; color: #a0a0b0; margin: 20px 0; font-style: italic; padding: 0 10px;">
                    「${character ? character.quote.substring(0, 30) + '...' : archetype.tagline.substring(1, archetype.tagline.length - 1)}」
                </div>
                
                <div id="qrcode-container" style="width: 100px; height: 100px; margin: 15px auto; background: white; padding: 8px; border-radius: 8px;"></div>
                <div style="font-size: 11px; color: #6a6a7a; margin-top: 15px;">扫码测试你的人生剧本</div>
                <div style="font-size: 9px; color: #4a4a5a; margin-top: 8px;">wuzehua2015-hash.github.io</div>
            </div>
        `;

        elements.modal.sharePosterContainer.innerHTML = posterHtml;

        new QRCode(document.getElementById('qrcode-container'), {
            text: shareUrl,
            width: 84,
            height: 84,
            colorDark: '#0a0a0f',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });

        elements.modal.shareModal.classList.add('active');

        setTimeout(() => {
            const posterElement = document.getElementById('poster-capture');
            if (posterElement && typeof html2canvas !== 'undefined') {
                html2canvas(posterElement, {
                    backgroundColor: null,
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    elements.modal.sharePosterContainer.innerHTML = `
                        <img src="${imgData}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />
                        <div style="margin-top: 1rem; color: var(--text-muted); font-size: 0.85rem;">👆 长按上方图片保存分享</div>
                    `;
                }).catch(err => {
                    console.error('生成图片失败:', err);
                });
            }
        }, 500);
    }

    function hideShareModal() {
        elements.modal.shareModal.classList.remove('active');
    }

    function retakeQuiz() {
        state.currentQuestion = 0;
        state.answers = [];
        state.basicInfo = {};
        state.result = null;
        state.matchedCharacter = null;
        initScores();
        switchScreen('intro');
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    // 启动应用
    document.addEventListener('DOMContentLoaded', init);
})();
// v2.0 - 80 characters, mixed archetypes, enhanced matching

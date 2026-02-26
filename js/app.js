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
        matchedCharacter: null,
        questions: [] // 动态加载的题目
    };

    // DOM 元素引用
    const elements = {};

    // 初始化
    async function init() {
        cacheElements();
        bindEvents();
        initScores();
        
        // 预加载动态题库（在后台静默加载）
        if (window.QuestionBank) {
            QuestionBank.init().then(() => {
                console.log('动态题库预加载完成');
                // 提前加载题目到缓存
                QuestionBank.loadDimensionQuestions('drive');
                QuestionBank.loadDimensionQuestions('world');
                QuestionBank.loadDimensionQuestions('self');
                QuestionBank.loadDimensionQuestions('time');
            });
        }
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
        elements.intro.startBtn.addEventListener('click', () => {
            startQuiz().catch(err => {
                console.error('启动测试失败:', err);
                // 降级：直接使用静态题目
                state.questions = window.QUIZ_DATA.QUESTIONS;
                switchScreen('quiz');
                renderQuestion(0);
            });
        });
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
        elements.basic.nextBtn.addEventListener('click', async () => {
            if (Object.keys(state.basicInfo).length === data.BASIC_QUESTIONS.length) {
                // 所有信息填写完成，生成报告
                await finishQuiz();
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

    async function startQuiz() {
        // 显示加载动画
        showLoading('正在生成你的专属剧本...');
        
        try {
            // 加载动态题目
            if (window.QuestionBank) {
                const excludeIds = [];
                state.questions = await QuestionBank.selectQuestions({
                    questionsPerDim: 3,
                    excludeIds: excludeIds
                });
                console.log('加载题目:', state.questions.length, '道');
            } else {
                // 降级：使用静态题目
                state.questions = window.QUIZ_DATA.QUESTIONS;
            }
            
            // 隐藏加载动画
            hideLoading();
            
            switchScreen('quiz');
            renderQuestion(0);
        } catch (error) {
            console.error('加载题目失败:', error);
            hideLoading();
            // 降级处理
            state.questions = window.QUIZ_DATA.QUESTIONS;
            switchScreen('quiz');
            renderQuestion(0);
        }
    }
    
    // 显示加载动画（带进度文字）
    function showLoading(text = '加载中...') {
        let loadingEl = document.getElementById('loading-overlay');
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.id = 'loading-overlay';
            loadingEl.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">${text}</div>
                    <div class="loading-subtext">从80个角色中寻找最匹配的你</div>
                </div>
            `;
            document.body.appendChild(loadingEl);
        } else {
            const textEl = loadingEl.querySelector('.loading-text');
            if (textEl) textEl.textContent = text;
            loadingEl.style.display = 'flex';
        }
    }
    
    // 更新加载文字
    function updateLoadingText(text) {
        const loadingEl = document.getElementById('loading-overlay');
        if (loadingEl) {
            const textEl = loadingEl.querySelector('.loading-text');
            if (textEl) textEl.textContent = text;
        }
    }
    
    // 隐藏加载动画
    function hideLoading() {
        const loadingEl = document.getElementById('loading-overlay');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
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
        const question = state.questions[index] || data.QUESTIONS[index];
        
        // 检查题目是否存在
        if (!question) {
            console.error('题目不存在:', index);
            // 降级：重新使用静态题目
            state.questions = data.QUESTIONS;
            const fallbackQuestion = data.QUESTIONS[index];
            if (!fallbackQuestion) {
                console.error('静态题目也不存在');
                return;
            }
            // 递归调用，使用降级后的题目
            renderQuestion(index);
            return;
        }

        // 更新进度
        const total = state.questions.length || data.QUESTIONS.length;
        const progress = ((index + 1) / total) * 100;
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

        // 判断是否完成所有题目
        const totalQuestions = state.questions.length > 0 ? state.questions.length : data.QUESTIONS.length;
        if (state.currentQuestion < totalQuestions) {
            renderQuestion(state.currentQuestion);
        } else {
            // 完成所有题目，进入基础信息页面
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

    async function finishQuiz() {
        // 直接计算并显示报告，不使用loading动画
        if (!window.QUIZ_DATA) {
            setTimeout(finishQuiz, 100);
            return;
        }
        
        // 计算结果
        calculateResult();
        
        // 切换页面并渲染
        switchScreen('result');
        await renderResult();
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
        // 基础匹配度计算 - 优化版本
        // 原型匹配 50% + 角色属性匹配 50%（性别12.5% + 年龄12.5% + 职业12.5% + 人生阶段12.5%）
        
        let attributeScore = 0;
        if (character) {
            if (character.gender.includes(state.basicInfo.gender)) attributeScore += 12.5;
            if (character.age.includes(state.basicInfo.age)) attributeScore += 12.5;
            if (character.career.includes(state.basicInfo.career)) attributeScore += 12.5;
            if (character.stage.includes(state.basicInfo.life_stage)) attributeScore += 12.5;
        }

        // 原型匹配占50%，属性匹配占50%
        const totalScore = (archetypePercentage * 0.5) + attributeScore;
        
        // 根据原型匹配度和属性匹配度综合计算，不再强制限制范围
        // 使用更平滑的映射：50-100% 范围
        const finalScore = Math.min(98, Math.max(52, Math.round(totalScore)));
        
        return finalScore;
    }

    // ==================== 渲染结果 ====================

    async function renderResult() {
        const data = window.QUIZ_DATA;
        const archetype = data.ARCHETYPES[state.result.archetype];
        const character = state.result.character;
        const dims = state.result.dimensions;

        // 基础信息 - 立即渲染
        elements.result.movieTitle.textContent = archetype.movieTitle;
        elements.result.tagline.textContent = archetype.tagline;
        elements.result.archetypeName.textContent = archetype.name;
        elements.result.archetypeSubtitle.textContent = state.result.isMixed ? 
            `${state.result.mixedArchetypes.map(a => data.ARCHETYPES[a].name).join(' + ')}` : 
            archetype.englishName;

        // 核心内容 - 立即渲染
        renderCharacterCard(character, archetype);
        drawRadarChart();

        // 其他内容 - 延迟渲染，避免卡顿
        await new Promise(resolve => setTimeout(resolve, 50));
        renderSimilarityPoints(character);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        renderCharacterStory(character);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        renderLifePrediction(character, archetype);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        renderAdvice(character);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        renderArchetypeAnalysis(archetype, dims, data);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        renderDimensionAnalysis(data);
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
            <div id="poster-capture" style="background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%); padding: 0; text-align: center; border-radius: 20px; width: 340px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212, 175, 55, 0.2);">
                <!-- 电影胶片顶部 -->
                <div style="background: linear-gradient(90deg, #0a0a0f 0%, #1a1a25 50%, #0a0a0f 100%); padding: 12px 0; border-bottom: 2px solid #d4af37;">
                    <div style="display: flex; justify-content: center; gap: 8px;">
                        ${Array(8).fill('<div style="width: 12px; height: 16px; background: #2a2a3a; border-radius: 2px;"></div>').join('')}
                    </div>
                </div>
                
                <!-- 主内容区 -->
                <div style="padding: 30px 25px; position: relative;">
                    <!-- 装饰角标 -->
                    <div style="position: absolute; top: 15px; left: 15px; width: 30px; height: 30px; border-left: 2px solid #d4af37; border-top: 2px solid #d4af37;"></div>
                    <div style="position: absolute; top: 15px; right: 15px; width: 30px; height: 30px; border-right: 2px solid #d4af37; border-top: 2px solid #d4af37;"></div>
                    <div style="position: absolute; bottom: 15px; left: 15px; width: 30px; height: 30px; border-left: 2px solid #d4af37; border-bottom: 2px solid #d4af37;"></div>
                    <div style="position: absolute; bottom: 15px; right: 15px; width: 30px; height: 30px; border-right: 2px solid #d4af37; border-bottom: 2px solid #d4af37;"></div>
                    
                    <!-- 标题 -->
                    <div style="font-size: 9px; color: #d4af37; margin-bottom: 8px; letter-spacing: 3px; text-transform: uppercase;">PTK Life Script Studios</div>
                    <h2 style="font-family: 'Noto Serif SC', serif; font-size: 26px; color: #d4af37; margin: 0 0 5px 0; font-weight: 700; text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);">人生剧本测试</h2>
                    <div style="font-size: 11px; color: #6a6a8a; margin-bottom: 20px;">v2.0 角色觉醒</div>
                    
                    <!-- 角色卡片 -->
                    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%); border-radius: 16px; padding: 25px 20px; margin: 20px 0; border: 1px solid rgba(212, 175, 55, 0.3); position: relative; overflow: hidden;">
                        <!-- 装饰背景 -->
                        <div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%); pointer-events: none;"></div>
                        
                        <div style="font-size: 11px; color: #8a8a9a; margin-bottom: 10px; letter-spacing: 1px;">YOUR CHARACTER MATCH</div>
                        
                        <!-- 角色头像 -->
                        <div style="width: 70px; height: 70px; margin: 0 auto 15px; background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #1a1a2e; font-weight: 700; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);">
                            ${character ? character.name.charAt(0) : archetype.name.charAt(0)}
                        </div>
                        
                        <div style="font-size: 28px; font-weight: 700; color: #f5f5f5; margin: 10px 0; font-family: 'Noto Serif SC', serif;">${character ? character.name : archetype.name}</div>
                        <div style="font-size: 12px; color: #d4af37; margin-bottom: 15px;">${character ? character.work : archetype.englishName}</div>
                        
                        <!-- 匹配度 -->
                        <div style="display: inline-block; background: rgba(212, 175, 55, 0.2); border-radius: 20px; padding: 8px 20px; margin-top: 5px;">
                            <span style="font-size: 24px; font-weight: 700; color: #d4af37;">${state.result.matchPercentage}%</span>
                            <span style="font-size: 10px; color: #8a8a9a; margin-left: 4px;">匹配度</span>
                        </div>
                    </div>
                    
                    <!-- 经典台词 -->
                    <div style="background: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 15px; margin: 20px 0; border-left: 3px solid #d4af37;">
                        <div style="font-size: 13px; color: #a0a0b0; font-style: italic; line-height: 1.6;">
                            「${character ? (character.quote.length > 40 ? character.quote.substring(0, 40) + '...' : character.quote) : archetype.tagline.substring(1, archetype.tagline.length - 1)}」
                        </div>
                    </div>
                    
                    <!-- 二维码区域 -->
                    <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <div id="qrcode-container" style="width: 80px; height: 80px; background: white; padding: 6px; border-radius: 8px; flex-shrink: 0;"></div>
                        <div style="text-align: left;">
                            <div style="font-size: 12px; color: #d4af37; margin-bottom: 4px;">扫码测试</div>
                            <div style="font-size: 10px; color: #6a6a8a; line-height: 1.5;">发现你的人生剧本<br/>匹配你的专属角色</div>
                        </div>
                    </div>
                </div>
                
                <!-- 电影胶片底部 -->
                <div style="background: linear-gradient(90deg, #0a0a0f 0%, #1a1a25 50%, #0a0a0f 100%); padding: 12px 0; border-top: 2px solid #d4af37;">
                    <div style="display: flex; justify-content: center; gap: 8px;">
                        ${Array(8).fill('<div style="width: 12px; height: 16px; background: #2a2a3a; border-radius: 2px;"></div>').join('')}
                    </div>
                </div>
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

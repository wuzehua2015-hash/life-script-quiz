/**
 * 人生剧本测试 v2.0 - 主应用逻辑
 * 新增：前置问题、80角色库、混合原型匹配、海报分享
 */

(function() {
    'use strict';

    // 安全访问辅助函数
    function safeGet(obj, path, defaultValue = '') {
        if (!obj) return defaultValue;
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            if (result == null || typeof result !== 'object') return defaultValue;
            result = result[key];
        }
        return result !== undefined && result !== null ? result : defaultValue;
    }

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
        restoreProgress(); // 恢复之前的进度
    }

    // 恢复之前的进度
    function restoreProgress() {
        try {
            // 恢复基础信息
            const savedBasicInfo = localStorage.getItem('lsq_basicInfo');
            if (savedBasicInfo) {
                state.basicInfo = JSON.parse(savedBasicInfo);
            }

            // 恢复测试进度
            const savedProgress = localStorage.getItem('lsq_testProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                if (progress.currentQuestion > 0) {
                    // 有未完成的测试，询问用户是否继续
                    state.currentQuestion = progress.currentQuestion;
                    state.answers = progress.answers || [];
                    // 合并保存的scores，确保所有类型都存在
                    if (progress.scores) {
                        Object.keys(progress.scores).forEach(dim => {
                            if (state.scores[dim]) {
                                Object.assign(state.scores[dim], progress.scores[dim]);
                            }
                        });
                    }
                    state.selectedQuestions = progress.selectedQuestions;
                    
                    // 显示继续测试的提示
                    showContinuePrompt();
                }
            }

            // 恢复测试结果
            const savedResult = localStorage.getItem('lsq_testResult');
            if (savedResult) {
                const result = JSON.parse(savedResult);
                state.result = result;
                // 恢复scores用于绘制雷达图（优先使用保存的scores）
                if (result.scores) {
                    // 合并保存的scores，确保所有类型都存在
                    Object.keys(result.scores).forEach(dim => {
                        if (state.scores[dim]) {
                            Object.assign(state.scores[dim], result.scores[dim]);
                        }
                    });
                } else if (result.dimensions) {
                    // 兼容旧数据，从dimensions重建
                    state.scores = {
                        drive: { [result.dimensions.drive]: 10 },
                        world: { [result.dimensions.world]: 10 },
                        self: { [result.dimensions.self]: 10 },
                        time: { [result.dimensions.time]: 10 }
                    };
                }
            }
        } catch (error) {
            console.error('恢复进度失败:', error);
        }
    }

    // 显示继续测试提示
    function showContinuePrompt() {
        // 延迟执行，确保DOM已加载
        setTimeout(() => {
            const introScreen = elements.screens.intro;
            if (!introScreen) {
                console.log('introScreen not found, retrying...');
                setTimeout(showContinuePrompt, 500);
                return;
            }

            const existingPrompt = introScreen.querySelector('.continue-prompt');
            if (existingPrompt) existingPrompt.remove();

            const promptDiv = document.createElement('div');
            promptDiv.className = 'continue-prompt';
            promptDiv.style.cssText = 'margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--accent-gold); text-align: center;';
            promptDiv.innerHTML = `
                <p style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 1rem;">📌 你有未完成的测试进度（第${state.currentQuestion + 1}题）</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="continue-test-btn" class="btn-primary">继续测试</button>
                    <button id="restart-test-btn" class="btn-secondary" style="background: transparent; border: 1px solid var(--text-muted); color: var(--text-muted);">重新开始</button>
                </div>
            `;

            // 插入到intro-screen中
            introScreen.appendChild(promptDiv);

            // 绑定事件
            document.getElementById('continue-test-btn')?.addEventListener('click', () => {
                switchScreen('quiz');
                renderQuestion(state.currentQuestion);
            });

            document.getElementById('restart-test-btn')?.addEventListener('click', () => {
                clearSavedProgress();
                promptDiv.remove();
            });
            
            console.log('Continue prompt shown successfully');
        }, 500); // 延迟500ms确保DOM加载完成
    }

    // 保存测试进度
    function saveProgress() {
        try {
            const progress = {
                currentQuestion: state.currentQuestion,
                answers: state.answers,
                scores: state.scores,
                selectedQuestions: state.selectedQuestions,
                timestamp: Date.now()
            };
            localStorage.setItem('lsq_testProgress', JSON.stringify(progress));
            
            // 保存基础信息
            localStorage.setItem('lsq_basicInfo', JSON.stringify(state.basicInfo));
        } catch (error) {
            console.error('保存进度失败:', error);
        }
    }

    // 保存测试结果
    function saveTestResult() {
        try {
            if (state.result) {
                // 同时保存scores用于恢复雷达图
                const resultWithScores = {
                    ...state.result,
                    scores: state.scores
                };
                console.log('保存测试结果:', resultWithScores);
                localStorage.setItem('lsq_testResult', JSON.stringify(resultWithScores));
            }
        } catch (error) {
            console.error('保存结果失败:', error);
        }
    }

    // 清除保存的进度
    function clearSavedProgress() {
        localStorage.removeItem('lsq_testProgress');
        localStorage.removeItem('lsq_basicInfo');
        state.currentQuestion = 0;
        state.answers = [];
        state.basicInfo = {};
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
            totalScenes: document.getElementById('total-scenes'),
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
        console.log('开始基础问题');
        if (!window.QUIZ_DATA) {
            console.error('QUIZ_DATA未加载');
            setTimeout(startBasicQuestions, 100);
            return;
        }
        if (!elements.basic.container) {
            console.error('basic container未找到');
            return;
        }
        switchScreen('basic');
        renderBasicQuestions();
    }

    function renderBasicQuestions() {
        const data = window.QUIZ_DATA;
        const container = elements.basic.container;

        if (!data || !data.BASIC_QUESTIONS) {
            console.error('BASIC_QUESTIONS未找到');
            return;
        }

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
        // 确保分数已初始化
        if (!window.QUIZ_DATA) {
            setTimeout(startQuiz, 100);
            return;
        }

        // 重置分数
        Object.keys(window.QUIZ_DATA.DIMENSIONS).forEach(dim => {
            state.scores[dim] = {};
            const types = window.QUIZ_DATA.DIMENSIONS[dim].types;
            const typeKeys = Array.isArray(types) ? types : Object.keys(types);
            typeKeys.forEach(type => {
                state.scores[dim][type] = 0;
            });
        });

        // 重置其他状态
        state.answers = [];
        state.currentQuestion = 0;

        // 随机选择12道题（每个维度3道）
        state.selectedQuestions = selectRandomQuestions();
        state.totalQuestions = state.selectedQuestions.length;

        switchScreen('quiz');
        renderQuestion(0);
    }

    // 随机选题函数：从30道中选12道，每维3道
    function selectRandomQuestions() {
        const data = window.QUIZ_DATA;
        if (!data || !data.QUESTIONS) return [];

        // 按维度分组
        const byDimension = {
            drive: [],
            world: [],
            self: [],
            time: []
        };

        data.QUESTIONS.forEach((q, idx) => {
            if (byDimension[q.dimension]) {
                byDimension[q.dimension].push({ ...q, originalIndex: idx });
            }
        });

        // 每个维度随机选3道
        const selected = [];
        Object.keys(byDimension).forEach(dim => {
            const questions = byDimension[dim];
            // Fisher-Yates洗牌
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            // 取前3道
            selected.push(...questions.slice(0, 3));
        });

        // 打乱顺序
        for (let i = selected.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selected[i], selected[j]] = [selected[j], selected[i]];
        }

        return selected;
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

        // 使用选中的题目
        const questions = state.selectedQuestions || window.QUIZ_DATA.QUESTIONS;
        const question = questions[index];

        if (!question) {
            console.error('题目不存在:', index);
            return;
        }

        // 更新进度
        const progress = ((index + 1) / questions.length) * 100;
        elements.quiz.progressFill.style.width = `${progress}%`;
        elements.quiz.currentScene.textContent = index + 1;
        elements.quiz.totalScenes.textContent = questions.length;
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

        // 使用选中的题目
        const questions = state.selectedQuestions || window.QUIZ_DATA.QUESTIONS;
        const question = questions[questionIndex];

        if (!question) {
            console.error('题目不存在:', questionIndex);
            return;
        }

        state.answers.push({
            questionId: question.id,
            dimension: question.dimension,
            choice: choice
        });

        state.scores[question.dimension][choice.type] += choice.score;
        state.currentQuestion = questionIndex + 1;

        // 保存进度
        saveProgress();

        if (questionIndex < questions.length - 1) {
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
                // alert('QUIZ_DATA不存在');
                setTimeout(finishQuiz, 100);
                return;
            }
            
            try {
                calculateResult();
                
                // 保存测试结果
                saveTestResult();
                
                // 清除进行中的进度（已完成）
                localStorage.removeItem('lsq_testProgress');
                
                renderResult();
                
                switchScreen('result');
                
            } catch (e) {
                console.error('错误:', e.message);
            }
        }, 500);
    }

    // ==================== 结果计算 ====================

    function calculateResult() {
        console.log('calculateResult开始');
        const data = window.QUIZ_DATA;

        if (!data) {
            console.error('QUIZ_DATA不存在');
            return;
        }

        if (!state.scores) {
            console.error('state.scores不存在');
            return;
        }

        // 计算维度结果
        const dimensionResults = {};
        const dimensionDetails = {};

        try {
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
            console.log('维度计算完成:', dimensionResults);
        } catch (e) {
            console.error('维度计算错误:', e);
            return;
        }

        // 计算原型匹配度
        let archetypeMatches;
        try {
            archetypeMatches = calculateArchetypeMatches(dimensionResults);
            console.log('原型匹配计算完成:', archetypeMatches);
        } catch (e) {
            console.error('原型匹配计算错误:', e);
            return;
        }

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
        let matchedCharacter;
        try {
            matchedCharacter = matchCharacter(bestMatch.archetype, isMixed ? mixedArchetypes : null);
            console.log('角色匹配完成:', matchedCharacter);
        } catch (e) {
            console.error('角色匹配错误:', e);
            return;
        }

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
        
        // 同时保存原型到localStorage，供行动指导页面使用
        localStorage.setItem('lsq_selected_archetype', bestMatch.archetype);
        
        console.log('calculateResult完成:', state.result);
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

        // 只在匹配的原型中选择角色
        // 角色匹配考虑：基础信息 + 四维倾向契合度
        let scoredCharacters = characters.map(char => {
            let score = 0;

            // 基础信息匹配 (40%)
            if (char.gender.includes(state.basicInfo.gender) || char.gender.includes('other')) score += 10;
            if (char.age.includes(state.basicInfo.age)) score += 10;
            if (char.career.includes(state.basicInfo.career)) score += 10;
            if (char.stage.includes(state.basicInfo.life_stage)) score += 10;

            // 四维倾向契合度 (60%) - 根据角色的similarity与用户最高维度的匹配
            const userTopDim = getUserTopDimension();
            if (userTopDim && char.similarity) {
                // 检查角色的similarity是否与用户最高维度相关
                const relevance = calculateDimensionRelevance(char, userTopDim);
                score += relevance * 0.6;
            }

            return { character: char, score: score };
        });

        // 按分数排序，返回最佳匹配
        scoredCharacters.sort((a, b) => b.score - a.score);
        return scoredCharacters[0]?.character || characters[0];
    }

    // 获取用户最高维度
    function getUserTopDimension() {
        if (!state.result?.dimensionDetails) return null;
        
        let topDim = null;
        let topPercent = 0;
        
        Object.entries(state.result.dimensionDetails).forEach(([dim, detail]) => {
            if (detail.percentage > topPercent) {
                topPercent = detail.percentage;
                topDim = { dimension: dim, type: detail.type, percentage: detail.percentage };
            }
        });
        
        return topDim;
    }

    // 计算角色与维度的相关度
    function calculateDimensionRelevance(character, userDim) {
        // 根据角色的similarity关键词判断与维度的相关度
        const dimKeywords = {
            drive: {
                achievement: ['追求', '成功', '证明', '目标', '竞争', '卓越'],
                relationship: ['关系', '连接', '接纳', '陪伴', '温暖', '归属'],
                security: ['稳定', '安全', '保护', '谨慎', '保守', '可预期'],
                unique: ['独特', '不同', '个性', '创意', '特别', '与众不同'],
                service: ['帮助', '付出', '关怀', '服务', '贡献', '利他']
            },
            world: {
                battle: ['战斗', '竞争', '挑战', '对抗', '胜利', '强者'],
                victim: ['不公平', '伤害', '无力', '被动', '抱怨', '命运'],
                cooperation: ['合作', '共赢', '共识', '和谐', '团队', '连接'],
                detachment: ['疏离', '旁观', '距离', '独立', '冷静', '抽离'],
                control: ['控制', '规划', '掌控', '秩序', '预测', '安排']
            },
            self: {
                perfection: ['完美', '苛刻', '标准', '批评', '改进', '更好'],
                inferiority: ['自卑', '不够好', '比较', '怀疑', ' insecure', '低价值'],
                narcissism: ['关注', '焦点', '赞美', '认可', '特殊', '优越'],
                authenticity: ['真实', '接纳', '自我', '本色', '真诚', '自然'],
                lost: ['迷茫', '不确定', '寻找', '迷失', '方向', '身份']
            },
            time: {
                chasing: ['追赶', '紧迫', '时间不够', '忙碌', '效率', '加速'],
                stagnation: ['停滞', '定型', '无力改变', '循环', '困住', '无望'],
                exploration: ['探索', '体验', '旅程', '好奇', '尝试', '过程'],
                fate: ['命运', '顺其自然', '接受', '注定', '安排', '缘分'],
                creation: ['创造', '主动', '决定', '目标', '努力', '改变']
            }
        };

        const keywords = dimKeywords[userDim.dimension]?.[userDim.type] || [];
        let matchCount = 0;
        
        character.similarity?.forEach(trait => {
            keywords.forEach(keyword => {
                if (trait.includes(keyword) || keyword.includes(trait)) {
                    matchCount++;
                }
            });
        });

        // 返回0-100的相关度分数
        return Math.min(100, matchCount * 25);
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

    function renderResult() {
        console.log('renderResult开始');
        try {
            const data = window.QUIZ_DATA;
            
            if (!data) {
                console.error('QUIZ_DATA不存在');
                return;
            }
            if (!state.result) {
                console.error('state.result不存在');
                return;
            }
            
            console.log('数据检查通过，开始渲染');
            
            const archetype = data.ARCHETYPES[state.result.archetype];
            const character = state.result.character;
            const dims = state.result.dimensions;
            
            if (!archetype) {
                console.error('archetype不存在:', state.result.archetype);
                return;
            }
            
            if (!character) {
                console.error('character不存在');
                return;
            }
            
            console.log('开始渲染基础信息，角色:', character.name);

            // 基础信息
            elements.result.movieTitle.textContent = archetype.movieTitle || '';
            elements.result.tagline.textContent = archetype.tagline || '';
            elements.result.archetypeName.textContent = archetype.name || '';
            elements.result.archetypeSubtitle.textContent = state.result.isMixed ?
                `${state.result.mixedArchetypes.map(a => (data.ARCHETYPES[a] && data.ARCHETYPES[a].name) || a).join(' + ')}` :
                archetype.englishName;

            // 渲染角色卡片
            renderCharacterCard(character, archetype);

            // 渲染匹配逻辑解释（新增）
            renderMatchExplanation(character, archetype, dims, state.result.dimensionDetails);

            // 渲染相似点
            renderSimilarityPoints(character);

            // 渲染角色故事
            renderCharacterStory(character);

            // 渲染人生预测
            renderLifePrediction(character, archetype);

            // 渲染建议
            renderAdvice(character);

            // 渲染相似角色推荐（新增）
            renderSimilarCharacters(character, archetype);

            // 渲染原有的原型分析
            renderArchetypeAnalysis(archetype, dims, data);

            // 渲染四维解读（新增）
            renderDimensionAnalysis(data);

            // 绘制雷达图
            console.log('开始绘制雷达图');
            drawRadarChart();
            console.log('renderResult完成');
        } catch (e) {
            console.error('renderResult错误:', e);
        }
    }

    // 新增：四维解读渲染函数
    function renderDimensionAnalysis(data) {
        const container = document.getElementById('dimension-analysis');
        if (!container) return;

        // 使用传入的data或全局QUIZ_DATA
        const quizData = data || window.QUIZ_DATA;
        if (!quizData || !quizData.DIMENSIONS) {
            console.error('QUIZ_DATA 或 DIMENSIONS 不存在');
            return;
        }

        const dimNames = {
            drive: { name: '核心驱动力', icon: '🔥' },
            world: { name: '与世界的关系', icon: '🌍' },
            self: { name: '与自我的关系', icon: '💫' },
            time: { name: '与时间的关系', icon: '⏳' }
        };

        const dims = state.result?.dimensions;
        const dimensionDetails = state.result?.dimensionDetails;
        
        if (!dims || !dimensionDetails) {
            console.error('维度数据不存在');
            return;
        }

        let html = '<h3>📊 四维深度解读</h3><div class="dimension-analysis-list">';

        Object.entries(dims).forEach(([dim, type]) => {
            const dimConfig = quizData.DIMENSIONS[dim];
            const typeConfig = dimConfig?.types?.[type];
            const detail = dimensionDetails[dim];
            
            // 使用DIMENSION_TYPE_NAMES获取中文类型名
            const typeNameCN = quizData.DIMENSION_TYPE_NAMES?.[dim]?.[type] || type;
            
            // 使用安全访问，如果配置缺失则使用默认值
            const percentage = detail?.percentage || 0;
            const dimName = dimNames[dim] || { name: dim, icon: '❓' };
            
            html += `
                <div class="dimension-analysis-item">
                    <div class="dim-analysis-header">
                        <span class="dim-analysis-icon">${dimName.icon}</span>
                        <div class="dim-analysis-title">
                            <h4>${dimConfig?.name || dimName.name || dim}</h4>
                            <span class="dim-analysis-type">${typeNameCN}</span>
                        </div>
                        <div class="dim-analysis-score">${percentage}%</div>
                    </div>
                    <div class="dim-analysis-content">
                        <p class="dim-short-desc">${typeConfig?.shortDesc || ''}</p>
                        <p class="dim-full-desc">${typeConfig?.fullDesc || ''}</p>
                        <div class="dim-daily-scene">
                            <strong>💭 日常场景：</strong>${typeConfig?.dailyScene || ''}
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
                    <div class="character-avatar">${(character.name && character.name.charAt(0)) || '?'}</div>
                    <div class="character-work">${character.work || ''}</div>
                </div>
                <div class="character-info">
                    <h2 class="character-name">${character.name || '未知角色'}</h2>
                    ${mixedText}
                    <p class="character-quote">「${character.quote || ''}」</p>
                    <div class="character-match">
                        <span class="match-percent">${state.result.matchPercentage || 0}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSimilarityPoints(character) {
        if (!character || !elements.result.similarityPoints) return;

        const points = character.similarity || [];
        elements.result.similarityPoints.innerHTML = `
            <h4>🎭 为什么你像${character.name || '这个角色'}</h4>
            <ul class="similarity-list">
                ${points.map(point => `<li><span class="similarity-dot">◆</span>${point}</li>`).join('')}
            </ul>
        `;
    }

    // 新增：匹配逻辑解释
    function renderMatchExplanation(character, archetype, dims, dimensionDetails) {
        const container = document.getElementById('match-explanation');
        if (!container) return;

        const data = window.QUIZ_DATA;
        if (!data || !data.DIMENSIONS) return;

        // 找出得分最高的维度
        let highestDim = null;
        let highestType = null;
        let highestPercentage = 0;

        Object.entries(dimensionDetails || {}).forEach(([dim, detail]) => {
            if (detail.percentage > highestPercentage) {
                highestPercentage = detail.percentage;
                highestDim = dim;
                highestType = detail.type;
            }
        });

        if (!highestDim || !highestType) return;

        const dimConfig = data.DIMENSIONS[highestDim];
        const typeConfig = dimConfig?.types?.[highestType];
        const dimNameCN = data.DIMENSION_TYPE_NAMES?.[highestDim]?.[highestType] || highestType;

        // 生成个性化解释文案
        const explanations = generateMatchExplanation(highestDim, highestType, character, archetype);

        container.innerHTML = `
            <div class="match-explanation-card">
                <h4>🔍 为什么你像${character.name || '这个角色'}？</h4>
                <div class="explanation-content">
                    <p class="explanation-intro">${explanations.intro}</p>
                    <div class="explanation-highlight">
                        <span class="highlight-label">你的核心${dimConfig?.name || '特质'}</span>
                        <span class="highlight-value">${dimNameCN} (${highestPercentage}%)</span>
                    </div>
                    <p class="explanation-detail">${explanations.detail}</p>
                    <div class="explanation-connection">
                        <span class="connection-icon">🔗</span>
                        <p>${explanations.connection}</p>
                    </div>
                </div>            </div>
        `;
    }

    // 生成匹配解释文案
    function generateMatchExplanation(dim, type, character, archetype) {
        const dimNames = {
            drive: '核心驱动力',
            world: '与世界的关系',
            self: '与自我的关系',
            time: '与时间的关系'
        };

        const explanations = {
            drive: {
                achievement: {
                    intro: '你的测试结果显示，你做事的底层动力来自对成就的追求。',
                    detail: '你渴望证明自己，不断追求卓越。这种驱动力让你在面对挑战时不轻言放弃，但也可能让你忽视过程中的美好。',
                    connection: `${character.name}也是如此。TA在${character.work}中展现出的执着和坚持，正是源于同样的成就驱动力。`
                },
                relationship: {
                    intro: '你的测试结果显示，你最看重的是与他人的连接。',
                    detail: '你做事的动力来自被接纳、被喜爱的渴望。关系对你来说比成就更重要，你常常为了维持和谐而委屈自己。',
                    connection: `${character.name}也是如此。TA在${character.work}中对关系的重视，与你如出一辙。`
                },
                security: {
                    intro: '你的测试结果显示，你追求的是稳定和可预期的生活。',
                    detail: '变化让你焦虑，你倾向于选择熟悉但可能不够好的选项。安全感是你做决定的优先考虑。',
                    connection: `${character.name}也是如此。TA在${character.work}中对稳定的追求，反映了同样的内心需求。`
                },
                unique: {
                    intro: '你的测试结果显示，你渴望与众不同，害怕被淹没在人群中。',
                    detail: '你不断寻找自己的独特标签，平凡对你来说像是一种死亡。你需要被看见、被记住。',
                    connection: `${character.name}也是如此。TA在${character.work}中展现出的独特性，正是你内心渴望的投射。`
                },
                service: {
                    intro: '你的测试结果显示，你通过帮助他人获得价值感。',
                    detail: '被需要让你感到存在有意义。你常常把别人的需求放在自己之前，直到精疲力竭。',
                    connection: `${character.name}也是如此。TA在${character.work}中的付出和关怀，与你有着同样的初心。`
                }
            },
            world: {
                battle: {
                    intro: '你的测试结果显示，你把世界看作竞技场。',
                    detail: '人生就是一场接一场的战役，放松警惕意味着被击败。你很难信任他人，总是处于戒备状态。',
                    connection: `${character.name}也是如此。TA在${character.work}中面对的每一个挑战，都是你内心战斗的写照。`
                },
                victim: {
                    intro: '你的测试结果显示，你觉得世界对你不公平。',
                    detail: '好事轮不到你，坏事总是找上门。你感到无力改变现状，常常陷入「为什么是我」的抱怨。',
                    connection: `${character.name}也是如此。TA在${character.work}中的遭遇，或许正是你内心恐惧的投射。`
                },
                cooperation: {
                    intro: '你的测试结果显示，你相信世界可以共赢。',
                    detail: '你重视关系，相信通过合作可以创造更好的结果。冲突让你不安，你倾向于寻求共识。',
                    connection: `${character.name}也是如此。TA在${character.work}中建立的合作关系，正是你理想中的人际模式。`
                },
                detachment: {
                    intro: '你的测试结果显示，你选择与世界保持距离。',
                    detail: '不参与、不卷入，这样就不会受伤。你习惯做一个旁观者，观察但不投入。',
                    connection: `${character.name}也是如此。TA在${character.work}中的疏离感，正是你内心状态的映射。`
                },
                control: {
                    intro: '你的测试结果显示，你需要掌控才有安全感。',
                    detail: '未知和失控让你极度焦虑。你需要知道每一步的走向，讨厌 surprises。',
                    connection: `${character.name}也是如此。TA在${character.work}中对掌控的追求，反映了你同样的需求。`
                }
            },
            self: {
                perfection: {
                    intro: '你的测试结果显示，你对自己有极高的标准。',
                    detail: '永远觉得自己还不够好，不断鞭策自己。休息是奢侈，放松是堕落。你的内心住着一个严厉的批评者。',
                    connection: `${character.name}也是如此。TA在${character.work}中对自己的苛刻，正是你内心声音的投射。`
                },
                inferiority: {
                    intro: '你的测试结果显示，你内心深处觉得自己不够好。',
                    detail: '需要外界的认可来证明自己的价值。你常常拿自己和别人比较，总是看到别人比自己强的地方。',
                    connection: `${character.name}也是如此。TA在${character.work}中的挣扎，或许正是你内心自卑的写照。`
                },
                narcissism: {
                    intro: '你的测试结果显示，你需要被关注、被看见。',
                    detail: '被忽视对你来说像是一种惩罚。你习惯成为焦点，当注意力转移到别人身上时，你会感到失落。',
                    connection: `${character.name}也是如此。TA在${character.work}中对关注的渴望，与你如出一辙。`
                },
                authenticity: {
                    intro: '你的测试结果显示，你对自己有比较客观的认知。',
                    detail: '你接纳自己的优点和缺点，不会为了迎合别人而伪装自己。这种真实让你与众不同。',
                    connection: `${character.name}也是如此。TA在${character.work}中展现出的真实，正是你内心追求的状态。`
                },
                lost: {
                    intro: '你的测试结果显示，你不太确定自己是谁、想要什么。',
                    detail: '你可能一直在按照别人的期待生活，或者不断尝试不同的角色，但始终没有找到真正的自己。',
                    connection: `${character.name}也是如此。TA在${character.work}中的迷茫，或许正是你内心状态的映射。`
                }
            },
            time: {
                chasing: {
                    intro: '你的测试结果显示，你总觉得时间不够用。',
                    detail: '必须不断奔跑，停下来意味着落后。你活在未来，很少享受当下。',
                    connection: `${character.name}也是如此。TA在${character.work}中与时间的赛跑，正是你生活节奏的写照。`
                },
                stagnation: {
                    intro: '你的测试结果显示，你觉得人生已经定型。',
                    detail: '很难再有大的改变，感到一种深深的无力感。你可能有过梦想，但现在觉得「就这样吧」。',
                    connection: `${character.name}也是如此。TA在${character.work}中的停滞感，或许正是你内心状态的投射。`
                },
                exploration: {
                    intro: '你的测试结果显示，你把人生看作一场探索的旅程。',
                    detail: '重要的不是目的地，而是沿途的风景。你对新事物充满好奇，喜欢尝试不同的可能性。',
                    connection: `${character.name}也是如此。TA在${character.work}中的探索精神，与你如出一辙。`
                },
                fate: {
                    intro: '你的测试结果显示，你相信「命里有时终须有」。',
                    detail: '你倾向于接受现状，而不是强行改变。你相信一切都有安排，顺其自然就好。',
                    connection: `${character.name}也是如此。TA在${character.work}中对命运的接纳，正是你人生态度的映射。`
                },
                creation: {
                    intro: '你的测试结果显示，你相信未来是由自己创造的。',
                    detail: '你有明确的目标，并愿意为之付出努力。你相信只要努力，就可以改变现状。',
                    connection: `${character.name}也是如此。TA在${character.work}中的创造力，正是你内心力量的投射。`
                }
            }
        };

        const dimExplanations = explanations[dim] || {};
        const typeExplanation = dimExplanations[type] || {
            intro: `你的测试结果显示，你在${dimNames[dim] || '这个维度'}上有独特的倾向。`,
            detail: '这种特质塑造了你独特的行为模式和人生选择。',
            connection: `${character.name}在${character.work}中展现出的特质，与你有着惊人的相似之处。`
        };

        return typeExplanation;
    }

    function renderCharacterStory(character) {
        if (!character || !elements.result.characterStory) return;

        const hasExtension = character.growthPath && character.turningPoint && character.realCase;
        
        let extensionHTML = '';
        if (hasExtension) {
            extensionHTML = `
                <div class="character-extension">
                    <div class="extension-section">
                        <h5>🌱 成长路径</h5>
                        <div class="growth-path">
                            <div class="growth-stage">
                                <span class="stage-label">早期</span>
                                <p>${character.growthPath.early}</p>
                            </div>
                            <div class="growth-stage">
                                <span class="stage-label">中期</span>
                                <p>${character.growthPath.middle}</p>
                            </div>
                            <div class="growth-stage">
                                <span class="stage-label">后期</span>
                                <p>${character.growthPath.late}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="extension-section">
                        <h5>⚡ 人生转折点</h5>
                        <div class="turning-point">
                            <p><strong>关键事件：</strong>${character.turningPoint.event}</p>
                            <p><strong>深远影响：</strong>${character.turningPoint.impact}</p>
                        </div>
                    </div>
                    
                    <div class="extension-section">
                        <h5>🎯 现实映照</h5>
                        <div class="real-case">
                            <p><strong>你可能遇到的情况：</strong>${character.realCase.situation}</p>
                            <p class="case-example"><strong>启示：</strong>${character.realCase.example}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        elements.result.characterStory.innerHTML = `
            <h4>📖 ${character.name || '角色'}的人生剧本</h4>
            <p class="story-text">${character.story || ''}</p>
            ${extensionHTML}
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
            { icon: "🌟", text: `你像${character?.name || '这个角色'}一样，${character?.similarity?.[0] || '有着独特的魅力'}` },
            { icon: "⚠️", text: `需要注意：${archetype?.badMovie?.symptoms?.[0] || '保持觉察'}` },
            { icon: "💡", text: `转机时刻：当你学会${archetype?.newScript?.keyChanges?.[0]?.replace('从', '')?.split('到')?.[1] || '接纳自己'}时` }
        ];
        return predictions;
    }

    function renderAdvice(character) {
        if (!character || !elements.result.characterAdvice) return;

        elements.result.characterAdvice.innerHTML = `
            <h4>💌 来自${character.name || '角色'}的启示</h4>
            <div class="advice-box">
                <p class="advice-text">${character.advice || ''}</p>
            </div>
        `;
    }

    // 新增：相似角色推荐
    function renderSimilarCharacters(currentCharacter, currentArchetype) {
        const container = document.getElementById('similar-characters');
        if (!container) return;

        const data = window.QUIZ_DATA;
        if (!data || !state.result) return;

        // 获取所有原型匹配结果
        const allMatches = state.result.allMatches || [];
        
        // 只推荐同一原型内的其他角色（避免跨原型推荐的尴尬）
        const currentArchetypeChars = data.CHARACTER_LIBRARY[currentArchetype?.key] || [];
        
        if (currentArchetypeChars.length <= 1) return;

        // 在当前原型中找其他匹配的角色（排除当前角色）
        const scoredChars = currentArchetypeChars.map(char => {
            let score = 0;
            
            // 基础信息匹配
            if (char.gender.includes(state.basicInfo.gender) || char.gender.includes('other')) score += 25;
            if (char.age.includes(state.basicInfo.age)) score += 25;
            if (char.career.includes(state.basicInfo.career)) score += 25;
            if (char.stage.includes(state.basicInfo.life_stage)) score += 25;
            
            // 四维契合度
            const userTopDim = getUserTopDimension();
            if (userTopDim && char.similarity) {
                const relevance = calculateDimensionRelevance(char, userTopDim);
                score += relevance * 0.5;
            }
            
            return { character: char, score: score };
        }).filter(item => item.character.name !== currentCharacter.name)
          .sort((a, b) => b.score - a.score);

        if (scoredChars.length === 0) return;

        // 取前3个推荐
        const recommendations = scoredChars.slice(0, 3).map(item => {
            // 计算综合匹配度：原型匹配度 * 0.6 + 角色契合度 * 0.4
            const currentArchetypeMatch = allMatches.find(m => m.archetype === currentArchetype?.key);
            const archetypePercent = currentArchetypeMatch?.percentage || 70;
            const totalMatch = Math.round(archetypePercent * 0.6 + item.score * 0.4);
            
            return {
                character: item.character,
                matchPercent: totalMatch,
                score: item.score
            };
        });

        container.innerHTML = `
            <h4>🎭 同类型的其他角色</h4>
            <p class="similar-intro">作为${currentArchetype?.name || '这个类型'}，这些角色也可能与你产生共鸣：</p>
            <div class="similar-characters-list">
                ${recommendations.map(rec => `
                    <div class="similar-character-card">
                        <div class="similar-character-header">
                            <span class="similar-type">${rec.character.name}</span>
                            <span class="similar-match">${rec.matchPercent}% 匹配</span>
                        </div>
                        <div class="similar-character-info">
                            <div class="similar-avatar">${rec.character.name.charAt(0)}</div>
                            <div class="similar-details">
                                <span class="similar-work">${rec.character.work}</span>
                                <span class="similar-archetype">${currentArchetype?.name || ''}</span>
                            </div>
                        </div>
                        <p class="similar-reason">${rec.character.similarity?.slice(0, 2).join('、') || '有着相似的特质'}</p>
                        <div class="similar-quote">「${rec.character.quote || ''}」</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 生成相似原因说明
    function generateSimilarReason(archetypeKey, currentArchetypeKey) {
        const relations = {
            'lone_hero-controller': '都有强烈的掌控欲，只是表达方式不同',
            'lone_hero-warrior': '都习惯独自面对挑战，只是战场不同',
            'pleaser-healer': '都关注他人需求，只是方式不同',
            'pleaser-rescuer': '都倾向于付出，只是动机不同',
            'hermit-observer': '都选择保持距离，只是原因不同',
            'hermit-wanderer': '都追求自由，只是形式不同',
            'controller-performer': '都需要被看见，只是舞台不同',
            'victim-pleaser': '都在关系中寻求安全感',
            'performer-wanderer': '都渴望被关注，只是方式不同',
            'rescuer-pleaser': '都通过付出来获得价值感',
            'warrior-lone_hero': '都有战斗精神，只是目标不同',
            'healer-rescuer': '都有治愈他人的愿望',
            'observer-hermit': '都选择旁观，只是心态不同',
            'awakened-observer': '都在寻找真相，只是路径不同'
        };

        const key1 = `${archetypeKey}-${currentArchetypeKey}`;
        const key2 = `${currentArchetypeKey}-${archetypeKey}`;
        
        return relations[key1] || relations[key2] || '你们在某些维度上有着相似的倾向';
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
        if (!canvas) {
            console.error('雷达图canvas不存在');
            return;
        }

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const labels = ['核心驱动力', '与世界的关系', '与自我的关系', '与时间的关系'];
        const dims = ['drive', 'world', 'self', 'time'];

        // 优先使用result.dimensionDetails中的百分比（和四维解读一致）
        let scores;
        if (state.result?.dimensionDetails) {
            scores = dims.map(dim => {
                const detail = state.result.dimensionDetails[dim];
                return detail ? detail.percentage / 100 : 0;
            });
        } else {
            // 兼容旧数据，使用state.scores计算
            scores = dims.map(dim => {
                const dimScores = state.scores[dim];
                if (!dimScores) return 0;
                const values = Object.values(dimScores);
                if (values.length === 0) return 0;
                const maxScore = Math.max(...values);
                const totalScore = values.reduce((a, b) => a + b, 0);
                return totalScore > 0 ? maxScore / totalScore : 0;
            });
        }

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

        const shareUrl = `https://lifescript.lynkedu.com/?result=${state.result.archetype}`;

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
                            ${character?.name?.charAt(0) || archetype?.name?.charAt(0) || '?'}
                        </div>

                        <div style="font-size: 28px; font-weight: 700; color: #f5f5f5; margin: 10px 0; font-family: 'Noto Serif SC', serif;">${character?.name || archetype?.name || '未知'}</div>
                        <div style="font-size: 12px; color: #d4af37; margin-bottom: 15px;">${character?.work || archetype?.englishName || ''}</div>

                        <!-- 匹配度 -->
                        <div style="display: inline-block; background: rgba(212, 175, 55, 0.2); border-radius: 20px; padding: 8px 20px; margin-top: 5px;">
                            <span style="font-size: 24px; font-weight: 700; color: #d4af37;">${state.result.matchPercentage}%</span>
                            <span style="font-size: 10px; color: #8a8a9a; margin-left: 4px;">匹配度</span>
                        </div>
                    </div>

                    <!-- 经典台词 -->
                    <div style="background: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 15px; margin: 20px 0; border-left: 3px solid #d4af37;">
                        <div style="font-size: 13px; color: #a0a0b0; font-style: italic; line-height: 1.6;">
                            「${safeGet(character, 'quote', safeGet(archetype, 'tagline', ''))}」
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
    document.addEventListener('DOMContentLoaded', () => {
        // 首先检查是否需要显示结果页（从行动指导返回）
        if (window.location.hash === '#result') {
            const savedResult = localStorage.getItem('lsq_testResult');
            if (savedResult) {
                try {
                    const result = JSON.parse(savedResult);
                    state.result = result;
                    // 先初始化（会设置所有scores类型为0）
                    init();
                    // 然后合并保存的scores
                    if (result.scores) {
                        Object.keys(result.scores).forEach(dim => {
                            if (state.scores[dim]) {
                                Object.assign(state.scores[dim], result.scores[dim]);
                            }
                        });
                    }
                    // 延迟显示结果页，确保DOM渲染完成
                    setTimeout(() => {
                        renderResult();
                        switchScreen('result');
                    }, 200);
                    return; // 跳过默认init流程
                } catch (e) {
                    console.error('加载保存的结果失败:', e);
                }
            }
        }
        
        // 正常初始化流程
        init();
    });
    // 暴露到全局供调试
    window.lsqState = state;
    window.lsqFinishQuiz = finishQuiz;

})();
// v2.0 - 80 characters, mixed archetypes, enhanced matching

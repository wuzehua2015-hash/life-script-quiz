# 人生剧本测试 - 项目制作文档

## 项目概述
- **项目名称**: 人生剧本测试 (Life Script Quiz)
- **理论原创**: PTK（夜航船纪事）
- **灵感来源**: 《皮格马利翁效应》
- **在线地址**: https://wuzehua2015-hash.github.io/life-script-quiz/

---

## 核心理论

### 人生剧本理论
每个人的人生都是一部「自编自导自演的人设使命剧」：
- **编剧**: 潜意识的创作者，设定"你是谁、你会经历什么"
- **导演**: 执行与控场，筛选配角、引导剧情
- **演员**: 角色演绎，把剧本演成日常生活

### 四个维度
1. **核心驱动力** - 为什么而活（成就/关系/安全/独特/服务）
2. **与世界的关系** - 如何看待外界（战斗/受害者/合作/疏离/掌控）
3. **与自我的关系** - 如何看待自己（完美/自卑/自恋/真实/迷失）
4. **与时间的关系** - 如何看待人生（追赶/停滞/探索/宿命/创造）

### 12种人设原型
孤勇者、讨好者、隐士、控制狂、受害者、表演者、拯救者、漫游者、战士、治愈者、观察者、觉醒者

---

## 文件结构

```
life-script-quiz/
├── index.html          # 主页面（单页应用）
├── css/
│   └── style.css       # 样式表（电影胶片风格）
├── js/
│   ├── data.js         # 12题问答 + 12原型结果数据
│   └── app.js          # 应用逻辑 + 计分算法
└── README.md           # 项目说明
```

---

## 技术实现

### 前端技术栈
- 纯 HTML/CSS/JavaScript，无框架依赖
- 响应式设计，适配移动端
- Canvas 绘制雷达图
- 电影胶片风格 UI

### 核心算法
1. **计分系统**: 4维度 × 3题，每题5选项对应5种类型
2. **原型匹配**: 4维度组合匹配12原型
3. **模糊匹配**: 支持混合原型（当得分接近时）

### 结果呈现
- 🎬 当前主演的烂片（温柔吐槽旧模式）
- 🎭 剧组卡司表（先天/后天配角分析）
- 📝 新剧本大纲（改写方向）
- 🎬 明日拍摄计划（具体行动建议）
- 📊 四维雷达图（可视化心理画像）

---

## 设计规范

### 视觉风格
- **主色调**: 黑色背景 (#0a0a0f) + 金色强调 (#d4af37)
- **字体**: Noto Sans SC + Noto Serif SC
- **风格**: 电影胶片、场记板、聚光灯效果

### 交互设计
- 剧本杀风格场景呈现
- 分镜感对话展示
- 场记板开场动画
- 胶片进度条

### 文案规范
- 禁止生硬心理学术语
- 保持剧本格式（短句、分镜感）
- 温柔吐槽而非批判
- 提供「选角内幕」揭秘感

---

## 制作步骤

### 1. 准备阶段
```bash
mkdir -p life-script-quiz/{css,js}
cd life-script-quiz
```

### 2. 创建文件

#### index.html
- 单页应用结构
- 4个 screen: intro, quiz, loading, result
- 引入 Google Fonts

#### css/style.css
- CSS 变量定义
- 屏幕切换动画
- 胶片效果样式
- 响应式布局

#### js/data.js
- DIMENSIONS: 4维度定义
- QUESTIONS: 12题剧本杀问答
- ARCHETYPES: 12原型完整结果
- 计分规则

#### js/app.js
- 状态管理
- 计分逻辑
- 原型匹配算法
- 雷达图绘制
- 分享功能

### 3. 部署到 GitHub Pages
```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/用户名/life-script-quiz.git
git push -u origin main
```

在 GitHub 仓库设置中开启 GitHub Pages。

---

## 数据格式

### 题目格式
```javascript
{
    id: 1,
    dimension: "drive",
    location: "INT. 深夜办公室 - 23:00",
    dialogue: [
        { character: "你", line: "终于改完第18版方案了..." },
        { character: "同事", line: "走吧，一起去吃宵夜？" }
    ],
    narration: "你连续加班两周...",
    choices: [
        { text: "这个项目必须完美...", type: "achievement", score: 2 },
        // ...
    ]
}
```

### 原型格式
```javascript
{
    name: "孤勇者",
    englishName: "Lone Hero",
    movieTitle: "《永不言败》",
    tagline: "「只有赢才能证明我活着」",
    dimensions: { drive: "achievement", world: "battle", ... },
    badMovie: { title: "...", synopsis: "...", symptoms: [...] },
    cast: { innate: {...}, acquired: {...} },
    newScript: { title: "...", synopsis: "...", keyChanges: [...] },
    actionPlan: [{ icon: "🛑", text: "..." }, ...]
}
```

---

## 常见问题

### 1. 中文引号导致语法错误
**问题**: data.js 中的中文引号 "..." 嵌套在字符串中导致 JS 语法错误

**解决**: 将中文引号替换为书名号「...」或使用转义

### 2. GitHub Pages 缓存
**问题**: 更新后网页未立即生效

**解决**: 等待 2-5 分钟，或强制刷新 (Ctrl+F5)

### 3. 移动端适配
**问题**: 小屏幕显示不正常

**解决**: 使用 viewport meta 标签 + 响应式 CSS

---

## 后续优化方向

1. **增加题目**: 从12题扩展到20题，提高精确度
2. **结果分享**: 生成图片海报分享
3. **用户统计**: 收集匿名数据优化算法
4. **多语言**: 支持英文版本
5. **小程序**: 开发微信小程序版本

---

## 相关文件

- 理论文档: `/root/.openclaw/workspace/research/人生剧本理论_四个维度.md`
- 原型文档: `/root/.openclaw/workspace/research/人生剧本理论_12种人设原型.md`
- 项目存档: `/root/.openclaw/workspace/archive/life-script-quiz/`

---

## 一键重做脚本

```bash
#!/bin/bash
# 一键重做人生剧本测试项目

# 1. 克隆模板
cp -r /root/.openclaw/workspace/archive/life-script-quiz ./life-script-quiz-new

# 2. 修改配置（可选）
# 编辑 js/data.js 修改题目和结果

# 3. 部署
cd life-script-quiz-new
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main

echo "完成！访问 https://你的用户名.github.io/你的仓库名/"
```

---

*制作时间: 2026-02-24*
*制作人: PTK + AI Assistant*

# 人生剧本测试系统 - UI设计系统文档

> 版本: v2.4.1  
> 更新日期: 2026-02-28  
> 设计灵感: 哈利波特官网 (harrypotter.com)

---

## 1. 设计理念

### 1.1 设计愿景

人生剧本测试系统采用**魔法学院风格**，营造神秘、温暖、有力量的视觉体验。设计灵感源自哈利波特官网，将"魔法世界"的沉浸感与"自我探索"的心理学主题相结合。

### 1.2 设计原则

| 原则 | 描述 |
|------|------|
| **神秘沉浸** | 深色背景营造专注、内省的氛围，让用户沉浸在自我探索中 |
| **温暖有力** | 金色强调色象征成就与成长，给予用户正向反馈 |
| **优雅复古** | 衬线字体带来书卷气，呼应"人生剧本"的叙事感 |
| **清晰易读** | 保证文字对比度，确保长时间阅读的舒适性 |
| **响应优先** | 移动端优先设计，确保各设备体验一致 |

### 1.3 情绪板

- **主情绪**: 神秘、温暖、有力量感
- **视觉隐喻**: 古老图书馆、魔法卷轴、星空、烛光
- **关键词**: 深邃、璀璨、沉淀、蜕变、觉醒

---

## 2. 颜色系统

### 2.1 主色调

```css
/* 深邃蓝紫 - 代表神秘和内省 */
--color-primary-900: #0a0a1a;      /* 最深背景 */
--color-primary-800: #12122a;      /* 主背景 */
--color-primary-700: #1a1a3e;      /* 次级背景 */
--color-primary-600: #252550;      /* 卡片背景 */
--color-primary-500: #3a3a6e;      /* 边框/分割线 */
--color-primary-400: #5a5a9e;      /* 禁用状态 */
--color-primary-300: #8a8ace;      /* 次要文字 */
--color-primary-200: #b8b8e8;      /* 辅助文字 */
--color-primary-100: #e8e8ff;      /* 最浅强调 */
```

### 2.2 强调色（古铜金）

```css
/* 古铜金 - 代表成就和魔法 */
--color-accent-600: #8b6914;       /* 深金（hover状态） */
--color-accent-500: #b8860b;       /* 主金色 */
--color-accent-400: #d4a520;       /* 亮金 */
--color-accent-300: #e6c35c;       /* 浅金 */
--color-accent-200: #f0d78c;       /* 柔金 */
--color-accent-100: #f8edc4;       /* 淡金背景 */
```

### 2.3 功能色

```css
/* 成功 - 翡翠绿 */
--color-success-600: #059669;
--color-success-500: #10b981;
--color-success-400: #34d399;
--color-success-100: #d1fae5;

/* 警告 - 琥珀橙 */
--color-warning-600: #d97706;
--color-warning-500: #f59e0b;
--color-warning-400: #fbbf24;
--color-warning-100: #fef3c7;

/* 错误 - 深红 */
--color-error-600: #dc2626;
--color-error-500: #ef4444;
--color-error-400: #f87171;
--color-error-100: #fee2e2;

/* 信息 - 星蓝 */
--color-info-600: #2563eb;
--color-info-500: #3b82f6;
--color-info-400: #60a5fa;
--color-info-100: #dbeafe;
```

### 2.4 中性色

```css
/* 文字颜色 */
--color-text-primary: #f5f5f5;     /* 主要文字 - 暖白 */
--color-text-secondary: #a1a1aa;   /* 次要文字 - 灰白 */
--color-text-tertiary: #71717a;    /* 辅助文字 - 深灰 */
--color-text-disabled: #52525b;    /* 禁用文字 */

/* 背景颜色 */
--color-bg-primary: #0f0f1a;       /* 主背景 */
--color-bg-secondary: #1a1a2e;     /* 次级背景 */
--color-bg-tertiary: #252540;      /* 第三层背景 */
--color-bg-elevated: #2a2a4a;      /* 浮层背景 */

/* 边框颜色 */
--color-border-primary: #3a3a5e;   /* 主边框 */
--color-border-secondary: #2a2a4a; /* 次边框 */
--color-border-accent: #b8860b;    /* 强调边框 */
```

### 2.5 渐变定义

```css
/* 主渐变 - 深邃星空 */
--gradient-primary: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #252550 100%);

/* 金色渐变 - 成就光环 */
--gradient-accent: linear-gradient(135deg, #b8860b 0%, #d4a520 50%, #e6c35c 100%);

/* 卡片渐变 - 微妙层次 */
--gradient-card: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);

/* 悬停渐变 */
--gradient-hover: linear-gradient(180deg, rgba(184,134,11,0.1) 0%, rgba(184,134,11,0) 100%);
```

---

## 3. 字体系统

### 3.1 字体家族

```css
/* 标题字体 - 优雅衬线 */
--font-heading: 'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif;

/* 正文字体 - 清晰无衬线 */
--font-body: 'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif;

/* 装饰字体 - 特殊场景 */
--font-decorative: 'Cinzel', 'Noto Serif SC', serif;

/* 等宽字体 - 数据展示 */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### 3.2 字体层级

| 层级 | 大小 | 字重 | 行高 | 字间距 | 用途 |
|------|------|------|------|--------|------|
| H1 | 2.5rem (40px) | 700 | 1.2 | -0.02em | 页面主标题 |
| H2 | 2rem (32px) | 600 | 1.3 | -0.01em | 区块标题 |
| H3 | 1.5rem (24px) | 600 | 1.4 | 0 | 卡片标题 |
| H4 | 1.25rem (20px) | 600 | 1.4 | 0 | 小标题 |
| H5 | 1.125rem (18px) | 500 | 1.5 | 0 | 列表标题 |
| H6 | 1rem (16px) | 500 | 1.5 | 0 | 最小标题 |
| Body Large | 1.125rem (18px) | 400 | 1.7 | 0.01em | 重要正文 |
| Body | 1rem (16px) | 400 | 1.7 | 0.01em | 默认正文 |
| Body Small | 0.875rem (14px) | 400 | 1.6 | 0.02em | 辅助文字 |
| Caption | 0.75rem (12px) | 400 | 1.5 | 0.02em | 说明文字 |

### 3.3 字体变量

```css
/* 标题样式 */
--font-h1: 700 2.5rem/1.2 var(--font-heading);
--font-h2: 600 2rem/1.3 var(--font-heading);
--font-h3: 600 1.5rem/1.4 var(--font-heading);
--font-h4: 600 1.25rem/1.4 var(--font-body);
--font-h5: 500 1.125rem/1.5 var(--font-body);
--font-h6: 500 1rem/1.5 var(--font-body);

/* 正文样式 */
--font-body-lg: 400 1.125rem/1.7 var(--font-body);
--font-body: 400 1rem/1.7 var(--font-body);
--font-body-sm: 400 0.875rem/1.6 var(--font-body);
--font-caption: 400 0.75rem/1.5 var(--font-body);

/* 特殊样式 */
--font-button: 500 1rem/1.5 var(--font-body);
--font-label: 500 0.875rem/1.5 var(--font-body);
```

---

## 4. 间距系统

### 4.1 基础间距

```css
/* 基础单位: 4px */
--space-unit: 0.25rem;

/* 间距刻度 */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### 4.2 语义化间距

```css
/* 组件间距 */
--space-xs: var(--space-2);    /* 8px - 紧凑间距 */
--space-sm: var(--space-3);    /* 12px - 小间距 */
--space-md: var(--space-4);    /* 16px - 默认间距 */
--space-lg: var(--space-6);    /* 24px - 大间距 */
--space-xl: var(--space-8);    /* 32px - 超大间距 */
--space-2xl: var(--space-12);  /* 48px - 区块间距 */
--space-3xl: var(--space-16);  /* 64px - 页面间距 */
```

### 4.3 布局间距

```css
/* 页面边距 */
--page-padding-x: var(--space-4);      /* 移动端 */
--page-padding-x-md: var(--space-6);   /* 平板 */
--page-padding-x-lg: var(--space-8);   /* 桌面 */
--page-padding-x-xl: var(--space-12);  /* 大屏 */

/* 容器宽度 */
--container-max: 1200px;
--container-narrow: 800px;
--container-wide: 1400px;

/* 网格间距 */
--grid-gap: var(--space-4);
--grid-gap-lg: var(--space-6);
```

---

## 5. 阴影系统

### 5.1 阴影层级

```css
/* 无阴影 */
--shadow-none: none;

/* 小阴影 - 按钮、输入框 */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);

/* 默认阴影 - 卡片 */
--shadow-md: 
  0 4px 6px -1px rgba(0, 0, 0, 0.3),
  0 2px 4px -2px rgba(0, 0, 0, 0.2);

/* 大阴影 - 浮层 */
--shadow-lg: 
  0 10px 15px -3px rgba(0, 0, 0, 0.4),
  0 4px 6px -4px rgba(0, 0, 0, 0.2);

/* 超大阴影 - 弹窗 */
--shadow-xl: 
  0 20px 25px -5px rgba(0, 0, 0, 0.5),
  0 8px 10px -6px rgba(0, 0, 0, 0.3);

/* 内阴影 */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.3);
```

### 5.2 特殊阴影

```css
/* 金色发光 - 强调元素 */
--shadow-gold: 
  0 0 20px rgba(184, 134, 11, 0.3),
  0 0 40px rgba(184, 134, 11, 0.1);

/* 卡片悬停阴影 */
--shadow-card-hover: 
  0 8px 16px -4px rgba(0, 0, 0, 0.5),
  0 4px 8px -2px rgba(184, 134, 11, 0.1);

/* 按钮激活阴影 */
--shadow-button-active: inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

---

## 6. 圆角系统

### 6.1 圆角变量

```css
/* 无圆角 */
--radius-none: 0;

/* 小圆角 - 按钮、标签 */
--radius-sm: 0.25rem;    /* 4px */

/* 默认圆角 - 输入框、小卡片 */
--radius-md: 0.5rem;     /* 8px */

/* 大圆角 - 卡片 */
--radius-lg: 0.75rem;    /* 12px */

/* 超大圆角 - 大卡片、弹窗 */
--radius-xl: 1rem;       /* 16px */

/* 圆形 */
--radius-full: 9999px;
```

### 6.2 语义化圆角

```css
--radius-button: var(--radius-md);      /* 按钮 */
--radius-card: var(--radius-lg);        /* 卡片 */
--radius-input: var(--radius-md);       /* 输入框 */
--radius-tag: var(--radius-sm);         /* 标签 */
--radius-avatar: var(--radius-full);    /* 头像 */
--radius-modal: var(--radius-xl);       /* 弹窗 */
```

---

## 7. 组件规范

### 7.1 按钮 (Button)

#### 按钮类型

```css
/* 主按钮 */
.btn-primary {
  background: linear-gradient(135deg, #b8860b 0%, #d4a520 100%);
  color: #0a0a1a;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-button);
  font: var(--font-button);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #d4a520 0%, #e6c35c 100%);
  box-shadow: var(--shadow-gold);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-button-active);
}

/* 次级按钮 */
.btn-secondary {
  background: transparent;
  color: var(--color-accent-400);
  border: 1px solid var(--color-accent-500);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-button);
  font: var(--font-button);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(184, 134, 11, 0.1);
  border-color: var(--color-accent-400);
}

/* 幽灵按钮 */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-button);
  font: var(--font-button);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-color: var(--color-border-secondary);
}

/* 危险按钮 */
.btn-danger {
  background: var(--color-error-600);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-button);
  font: var(--font-button);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: var(--color-error-500);
}
```

#### 按钮尺寸

```css
/* 小按钮 */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* 默认按钮 */
.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* 大按钮 */
.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* 全宽按钮 */
.btn-block {
  width: 100%;
}
```

### 7.2 卡片 (Card)

#### 基础卡片

```css
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-card);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-border-secondary);
}
```

#### 角色卡片

```css
.card-role {
  background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-card);
  overflow: hidden;
  position: relative;
}

.card-role::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent-600), var(--color-accent-400), var(--color-accent-600));
}

.card-role-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.card-role-content {
  padding: var(--space-lg);
}

.card-role-title {
  font: var(--font-h4);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.card-role-subtitle {
  font: var(--font-body-sm);
  color: var(--color-accent-400);
  margin-bottom: var(--space-3);
}

.card-role-description {
  font: var(--font-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
```

#### 成就卡片

```css
.card-achievement {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-card);
  padding: var(--space-lg);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card-achievement.unlocked {
  border-color: var(--color-accent-500);
  box-shadow: 0 0 20px rgba(184, 134, 11, 0.15);
}

.card-achievement-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-accent-600), var(--color-accent-400));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-achievement.locked .card-achievement-icon {
  background: var(--color-bg-tertiary);
  filter: grayscale(100%);
  opacity: 0.5;
}
```

#### 日记卡片

```css
.card-diary {
  background: var(--color-bg-secondary);
  border-left: 3px solid var(--color-accent-500);
  border-radius: 0 var(--radius-card) var(--radius-card) 0;
  padding: var(--space-lg);
}

.card-diary-date {
  font: var(--font-caption);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
}

.card-diary-title {
  font: var(--font-h5);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.card-diary-preview {
  font: var(--font-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
```

### 7.3 输入框 (Input)

#### 文本输入

```css
.input {
  width: 100%;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-input);
  padding: 0.75rem 1rem;
  font: var(--font-body);
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:hover {
  border-color: var(--color-border-secondary);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent-500);
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
}

.input:disabled {
  background: var(--color-bg-secondary);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.input-error {
  border-color: var(--color-error-500);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### 文本域

```css
.textarea {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-input);
  padding: 0.75rem 1rem;
  font: var(--font-body);
  color: var(--color-text-primary);
  line-height: 1.6;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--color-accent-500);
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
}
```

#### 选择框

```css
.select {
  width: 100%;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-input);
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font: var(--font-body);
  color: var(--color-text-primary);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select:focus {
  outline: none;
  border-color: var(--color-accent-500);
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
}
```

### 7.4 标签和徽章 (Tag & Badge)

#### 标签

```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-tag);
  font: var(--font-caption);
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.tag:hover {
  border-color: var(--color-accent-500);
  color: var(--color-accent-400);
}

/* 标签变体 */
.tag-primary {
  background: rgba(184, 134, 11, 0.1);
  border-color: var(--color-accent-600);
  color: var(--color-accent-400);
}

.tag-success {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--color-success-600);
  color: var(--color-success-400);
}

.tag-warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: var(--color-warning-600);
  color: var(--color-warning-400);
}

.tag-error {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--color-error-600);
  color: var(--color-error-400);
}
```

#### 徽章

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  background: var(--color-accent-600);
  border-radius: var(--radius-full);
  font: var(--font-caption);
  font-weight: 600;
  color: white;
}

.badge-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  min-width: auto;
}
```

### 7.5 导航 (Navigation)

#### 顶部导航

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border-primary);
  z-index: 1000;
}

.navbar-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--page-padding-x);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font: var(--font-h4);
  font-family: var(--font-heading);
  color: var(--color-accent-400);
  text-decoration: none;
}

.navbar-nav {
  display: flex;
  gap: var(--space-6);
}

.navbar-link {
  font: var(--font-body-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-link:hover,
.navbar-link.active {
  color: var(--color-accent-400);
}
```

#### 底部导航（移动端）

```css
.navbar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(15, 15, 26, 0.98);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border-primary);
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.navbar-bottom-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-bottom-item.active {
  color: var(--color-accent-400);
}

.navbar-bottom-icon {
  font-size: 1.25rem;
}

.navbar-bottom-label {
  font: var(--font-caption);
}
```

#### 面包屑

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font: var(--font-body-sm);
  color: var(--color-text-tertiary);
}

.breadcrumb-item {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: var(--color-accent-400);
}

.breadcrumb-item.active {
  color: var(--color-text-primary);
  pointer-events: none;
}

.breadcrumb-separator {
  color: var(--color-text-tertiary);
}
```

### 7.6 弹窗 (Modal)

#### 模态框

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-4);
}

.modal {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-modal);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  animation: modal-in 0.3s ease;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border-primary);
}

.modal-title {
  font: var(--font-h4);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-lg);
  overflow-y: auto;
  max-height: 60vh;
}

.modal-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border-primary);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

#### Toast 提示

```css
.toast-container {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.toast {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 300px;
  animation: toast-in 0.3s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-success {
  border-left: 3px solid var(--color-success-500);
}

.toast-error {
  border-left: 3px solid var(--color-error-500);
}

.toast-warning {
  border-left: 3px solid var(--color-warning-500);
}

.toast-info {
  border-left: 3px solid var(--color-info-500);
}
```

#### Tooltip

```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font: var(--font-caption);
  color: var(--color-text-primary);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1500;
}

.tooltip:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
}
```

---

## 8. 动画系统

### 8.1 过渡时间

```css
--transition-fast: 150ms;
--transition-normal: 250ms;
--transition-slow: 350ms;
--transition-slower: 500ms;
```

### 8.2 缓动函数

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 8.3 关键动画

```css
/* 淡入 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 淡入上移 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 淡入缩放 */
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 脉冲发光 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(184, 134, 11, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(184, 134, 11, 0.5);
  }
}

/* 闪烁 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 弹跳 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

---

## 9. 响应式断点

### 9.1 断点定义

```css
/* 移动端优先 */
--breakpoint-sm: 640px;   /* 大手机 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 小桌面 */
--breakpoint-xl: 1280px;  /* 大桌面 */
--breakpoint-2xl: 1536px; /* 超大屏 */
```

### 9.2 响应式工具类

```css
/* 容器 */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--page-padding-x);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--page-padding-x-md);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--page-padding-x-lg);
  }
}

@media (min-width: 1280px) {
  .container {
    padding: 0 var(--page-padding-x-xl);
  }
}

/* 隐藏/显示 */
.hidden { display: none; }
.block { display: block; }
.flex { display: flex; }
.grid { display: grid; }

@media (min-width: 640px) {
  .sm\:hidden { display: none; }
  .sm\:block { display: block; }
  .sm\:flex { display: flex; }
}

@media (min-width: 768px) {
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:flex { display: flex; }
}

@media (min-width: 1024px) {
  .lg\:hidden { display: none; }
  .lg\:block { display: block; }
  .lg\:flex { display: flex; }
}
```

---

## 10. 图标系统

### 10.1 图标尺寸

```css
--icon-xs: 0.75rem;   /* 12px */
--icon-sm: 1rem;      /* 16px */
--icon-md: 1.25rem;   /* 20px */
--icon-lg: 1.5rem;    /* 24px */
--icon-xl: 2rem;      /* 32px */
--icon-2xl: 2.5rem;   /* 40px */
```

### 10.2 图标使用规范

- 按钮内图标: `--icon-sm`
- 导航图标: `--icon-md`
- 功能图标: `--icon-lg`
- 装饰图标: `--icon-xl`

---

## 11. 使用示例

### 11.1 完整页面结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>人生剧本测试系统</title>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <!-- 导航 -->
  <nav class="navbar">
    <div class="navbar-container">
      <a href="/" class="navbar-logo">人生剧本</a>
      <div class="navbar-nav">
        <a href="/" class="navbar-link active">首页</a>
        <a href="/profile" class="navbar-link">个人中心</a>
      </div>
    </div>
  </nav>

  <!-- 主内容 -->
  <main class="container" style="margin-top: 80px;">
    <!-- 页面内容 -->
  </main>

  <!-- 底部导航（移动端） -->
  <nav class="navbar-bottom lg:hidden">
    <a href="/" class="navbar-bottom-item active">
      <span class="navbar-bottom-icon">🏠</span>
      <span class="navbar-bottom-label">首页</span>
    </a>
    <a href="/profile" class="navbar-bottom-item">
      <span class="navbar-bottom-icon">👤</span>
      <span class="navbar-bottom-label">我的</span>
    </a>
  </nav>
</body>
</html>
```

### 11.2 卡片网格布局

```html
<div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-lg);">
  <div class="card-role">
    <img src="role.jpg" alt="角色" class="card-role-image">
    <div class="card-role-content">
      <h3 class="card-role-title">觉醒者</h3>
      <p class="card-role-subtitle">深度内省型</p>
      <p class="card-role-description">善于自我反思，在困境中寻找意义...</p>
    </div>
  </div>
  <!-- 更多卡片... -->
</div>
```

---

## 12. 附录

### 12.1 文件结构

```
css/
├── variables.css    # CSS变量定义
├── components.css   # 组件样式
├── utilities.css    # 工具类
└── animations.css   # 动画定义
```

### 12.2 设计资源

- **字体**: Noto Serif SC, Noto Sans SC
- **图标**: 使用 emoji 或自定义 SVG
- **图片**: 建议使用深色调、神秘风格的插画

### 12.3 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v2.4.1 | 2026-02-28 | 初始版本，建立完整设计系统 |

---

> 🎨 **设计理念**: 让每一次自我探索都像翻开一本魔法书，神秘而充满期待。

# 人生剧本测试系统 v2.4 - 性能优化建议

## 🚀 性能优化策略

### 1. CSS优化

#### 1.1 关键CSS内联
将首屏关键CSS直接内联到HTML中，减少渲染阻塞：

```html
<style>
  /* 关键CSS：变量定义 + 基础布局 */
  :root {
    --bg-primary: #0a0a0f;
    --text-primary: #f5f5f5;
    /* ... 其他关键变量 */
  }
  
  /* 首屏必需样式 */
  body {
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-primary);
  }
  
  #intro-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<!-- 非关键CSS异步加载 -->
<link rel="preload" href="css/variables.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link rel="preload" href="css/components.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

#### 1.2 CSS压缩
使用构建工具压缩CSS：
```bash
# 使用cssnano或clean-css
npx cssnano css/variables.css css/variables.min.css
npx cssnano css/components.css css/components.min.css
```

#### 1.3 移除未使用CSS
使用PurgeCSS移除未使用的样式：
```javascript
// purgecss.config.js
module.exports = {
  content: ['**/*.html', '**/*.js'],
  css: ['css/components.css'],
  safelist: ['active', 'show', 'hidden'] // 保留动态类名
}
```

---

### 2. 图片优化

#### 2.1 格式选择
| 格式 | 使用场景 | 优势 |
|------|----------|------|
| WebP | 照片、复杂图像 | 体积小30-80% |
| AVIF | 高质量要求 | 体积更小 |
| SVG | 图标、Logo | 矢量缩放 |
| PNG | 透明图像 | 无损压缩 |

#### 2.2 响应式图片
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述" loading="lazy">
</picture>
```

#### 2.3 懒加载
```html
<!-- 原生懒加载 -->
<img src="poster.jpg" loading="lazy" alt="海报">

<!-- 背景图懒加载（使用Intersection Observer）-->
<div class="lazy-bg" data-bg="url(image.jpg)"></div>
```

---

### 3. 字体优化

#### 3.1 字体加载策略
```css
@font-face {
  font-family: 'Noto Serif SC';
  font-display: swap; /* 关键：使用swap避免FOIT */
  src: url('fonts/noto-serif-sc.woff2') format('woff2');
}
```

#### 3.2 字体子集化
仅加载需要的字符：
```html
<!-- 仅加载中文字符 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap&text=人生剧本测试..." rel="stylesheet">
```

#### 3.3 预连接
```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

---

### 4. JavaScript优化

#### 4.1 代码分割
```javascript
// 动态导入非关键模块
const loadChartModule = async () => {
  const { renderRadarChart } = await import('./js/chart-module.js');
  renderRadarChart(data);
};

// 仅在结果页加载
if (document.getElementById('radar-chart')) {
  loadChartModule();
}
```

#### 4.2 延迟加载
```html
<!-- 非关键脚本延迟加载 -->
<script src="js/analytics.js" defer></script>
<script src="js/share.js" async></script>
```

#### 4.3 事件委托
```javascript
// 优化前：多个监听器
document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', handleChoice);
});

// 优化后：事件委托
document.getElementById('choices-container').addEventListener('click', (e) => {
  if (e.target.closest('.choice-btn')) {
    handleChoice(e.target.closest('.choice-btn'));
  }
});
```

---

### 5. 动画性能优化

#### 5.1 使用transform和opacity
```css
/* ✅ 推荐：GPU加速属性 */
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
}

/* ❌ 避免：触发重排的属性 */
.card {
  transition: top 0.3s ease, left 0.3s ease;
}
```

#### 5.2 will-change使用
```css
/* 仅在需要时添加 */
.card-interactive {
  will-change: transform;
}

/* 动画结束后移除 */
.card-interactive:hover {
  will-change: auto;
}
```

#### 5.3 requestAnimationFrame
```javascript
// 优化动画循环
let ticking = false;

function updateAnimation() {
  // 更新动画状态
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateAnimation);
    ticking = true;
  }
});
```

---

### 6. 缓存策略

#### 6.1 Service Worker
```javascript
// sw.js
const CACHE_NAME = 'life-script-v2.4';
const urlsToCache = [
  '/',
  '/css/variables.css',
  '/css/components.css',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中则返回，否则请求网络
        return response || fetch(event.request);
      })
  );
});
```

#### 6.2 资源哈希
```html
<!-- 构建时添加哈希 -->
<link rel="stylesheet" href="css/components.a3f2b1c.css">
<script src="js/app.7e8d9f0.js"></script>
```

---

### 7. 网络优化

#### 7.1 HTTP/2 Server Push（如支持）
```nginx
# nginx配置
location / {
  http2_push /css/variables.css;
  http2_push /css/components.css;
}
```

#### 7.2 资源预加载
```html
<!-- 预加载关键资源 -->
<link rel="preload" href="fonts/noto-serif-sc.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="images/hero-bg.webp" as="image">

<!-- 预获取下一页资源 -->
<link rel="prefetch" href="profile/index.html">
<link rel="prefetch" href="css/profile.css">
```

---

### 8. 存储优化

#### 8.1 LocalStorage优化
```javascript
// 使用压缩存储
const saveData = (key, data) => {
  const compressed = LZString.compress(JSON.stringify(data));
  localStorage.setItem(key, compressed);
};

const loadData = (key) => {
  const compressed = localStorage.getItem(key);
  return compressed ? JSON.parse(LZString.decompress(compressed)) : null;
};
```

#### 8.2 IndexedDB用于大数据
```javascript
// 存储测试历史等大容量数据
const db = await openDB('LifeScriptDB', 1, {
  upgrade(db) {
    db.createObjectStore('testHistory', { keyPath: 'id' });
    db.createObjectStore('diary', { keyPath: 'date' });
  }
});
```

---

### 9. 渲染优化

#### 9.1 虚拟滚动（长列表）
```javascript
// 角色收集页使用虚拟滚动
const VirtualList = {
  itemHeight: 80,
  containerHeight: 600,
  renderVisibleItems() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const endIndex = startIndex + visibleCount;
    
    // 只渲染可见项
    this.renderItems(startIndex, endIndex);
  }
};
```

#### 9.2 防抖和节流
```javascript
// 防抖：搜索输入
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

// 节流：滚动事件
const throttledScroll = throttle(() => {
  updateParallax();
}, 16); // ~60fps
```

---

### 10. 性能监控

#### 10.1 Core Web Vitals监控
```javascript
// 使用Web Vitals库
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

#### 10.2 性能预算
| 指标 | 目标值 | 警告值 |
|------|--------|--------|
| FCP | < 1.8s | > 2.5s |
| LCP | < 2.5s | > 4s |
| FID | < 100ms | > 300ms |
| CLS | < 0.1 | > 0.25 |
| TTI | < 3.8s | > 5s |

---

## 📊 优化前后对比预估

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 首屏加载 | 3.5s | 1.8s | 48% |
| CSS大小 | 85KB | 25KB | 70% |
| JS大小 | 120KB | 45KB | 62% |
| 可交互时间 | 4.2s | 2.1s | 50% |
| Lighthouse评分 | 65 | 95 | 46% |

---

## 🛠️ 实施建议

### 第一阶段（立即实施）
1. ✅ 启用Gzip/Brotli压缩
2. ✅ 添加图片懒加载
3. ✅ 优化字体加载
4. ✅ 压缩CSS/JS

### 第二阶段（短期）
1. 实现Service Worker缓存
2. 代码分割和动态导入
3. 添加资源预加载
4. 优化动画性能

### 第三阶段（长期）
1. 实现虚拟滚动
2. 添加性能监控
3. 建立性能预算
4. 自动化性能测试

---

*文档版本: v2.4*  
*最后更新: 2026-02-28*

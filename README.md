# AI协作美育教学 · AI-assisted aesthetic

根据 6 张设计稿还原的纯静态网站（HTML + CSS + JS），无需构建工具，可直接部署到 GitHub Pages。

## 页面结构

| 区块 | 对应设计稿 | 说明 |
|------|-----------|------|
| Hero 首屏 | Desktop 8 | 主标题、双按钮、图片气泡、打字机效果 |
| 01 教学理念 | Desktop 9 | 双卡片 + 侧图，滚动进场动画 |
| 02 教学流程 | Desktop 10 | 传统 vs AI 工作流对比图，可点击「播放AI工作流」逐步高亮 |
| 03 教学任务 | Desktop 11 | 提示词打字机（可直接编辑），三张方案卡可点击选择 |
| 04 教学方案 | Desktop 12 | 四维度比较卡 + 结果卡，与方案选择实时联动 |
| 开始备课 | Desktop 13 | 六步备课流程卡 + 循环迭代横幅 |

## 本地预览

```bash
# 任选其一
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

或直接双击 `index.html` 在浏览器中打开。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `ai-aesthetic-teaching`。
2. 将本文件夹中的所有文件上传（保持目录结构）：

```
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/ (hero.jpg, art-1~3.jpg, scheme-1~3.jpg, plan.jpg, favicon.svg)
```

3. 打开仓库 **Settings → Pages**，Source 选择 `Deploy from a branch`，Branch 选择 `main` / `(root)`，保存。
4. 稍等一两分钟，访问 `https://<你的用户名>.github.io/ai-aesthetic-teaching/` 即可。

也可以用命令行推送：

```bash
cd ai-aesthetic-teaching
git init
git add .
git commit -m "init: AI协作美育教学网站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/ai-aesthetic-teaching.git
git push -u origin main
```

## 技术说明

- 无任何框架与依赖，字体通过 Google Fonts 加载（Noto Serif SC），离线时自动回退到系统宋体。
- 交互均基于原生 JS：IntersectionObserver 滚动动画、导航高亮、流程播放、方案联动、回到顶部、移动端汉堡菜单。
- 支持 `prefers-reduced-motion`，对减少动态偏好的用户关闭动画。
- 响应式适配桌面 / 平板 / 手机。

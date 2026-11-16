/* ============================================================
   AI协作美育教学 · main.js
   交互：导航高亮 / 滚动进场 / 流程播放动画 /
        提示词打字机 / 方案选择联动 / 回到顶部 / 移动端菜单
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 移动端菜单 ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var siteNav = document.getElementById("siteNav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        siteNav.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 滚动进场动画 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 导航高亮 ---------- */
  var navLinks = document.querySelectorAll("[data-nav]");
  var navSections = ["idea", "flow", "task", "plan"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setActiveNav() {
    var scrollY = window.scrollY + 140;
    var current = "";
    navSections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === current);
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* ---------- 回到顶部 ---------- */
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 提示词打字机（首次进入视口时播放） ---------- */
  var promptInput = document.getElementById("promptInput");
  var PROMPTS = [
    "我想画一副主题与香港建筑相关的画",
    "帮我生成三个不同构图与符号的方案",
    "我想表现传统与现代城市的对话"
  ];
  var typingPlayed = false;

  function typePrompt() {
    if (typingPlayed) return;
    typingPlayed = true;
    var seq = PROMPTS.concat(PROMPTS[0]);
    var i = 0;
    setTimeout(function nextLine() {
      var text = seq[i];
      var j = 0;
      promptInput.textContent = "";
      (function tick() {
        if (j <= text.length) {
          promptInput.textContent = text.slice(0, j);
          j++;
          setTimeout(tick, 45);
        } else if (++i < seq.length) {
          setTimeout(nextLine, 1800);
        }
      })();
    }, 600);
  }

  /* 用户手动编辑时停止自动演示 */
  if (promptInput) {
    promptInput.addEventListener("input", function () { typingPlayed = true; });

    var promptRow = promptInput.closest(".prompt-row");
    if ("IntersectionObserver" in window) {
      var promptObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            typePrompt();
            promptObserver.disconnect();
          }
        });
      }, { threshold: 0.6 });
      promptObserver.observe(promptRow);
    }
  }

  /* ---------- AI工作流播放动画 ---------- */
  var stepsNew = document.getElementById("stepsNew");
  var playBtn = document.getElementById("playFlow");
  var playTimer = null;

  function stopPlay() {
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
  }

  function playFlow() {
    if (!stepsNew) return;
    stopPlay();
    var steps = stepsNew.querySelectorAll(".flow-step");
    steps.forEach(function (s) { s.classList.remove("is-hot"); });
    var idx = 0;
    steps[0].classList.add("is-hot");
    playBtn.textContent = "■ 停止播放";
    playTimer = setInterval(function () {
      steps[idx].classList.remove("is-hot");
      idx++;
      if (idx >= steps.length) {
        stopPlay();
        playBtn.textContent = "▶ 播放AI工作流";
        return;
      }
      steps[idx].classList.add("is-hot");
    }, 1200);
  }

  if (playBtn && stepsNew) {
    playBtn.addEventListener("click", function () {
      if (playTimer) { stopPlay(); playBtn.textContent = "▶ 播放AI工作流"; }
      else { playFlow(); }
    });
  }

  /* ---------- 方案选择 → 教学方案区联动 ---------- */
  var RESULT_DATA = {
    "1": {
      title: "提取合适的教学方案：方案一 · 维多利亚港天际线",
      items: [
        "主题表达力强：天际线天然具备清晰的视觉焦点，夕阳与暮色的情感张力直观易感。",
        "符号丰富度适中：玻璃幕墙折面、暖橙夕阳与紫蓝暮色构成明确的几何语言。",
        "构图可操作性强：水平全景构图简单稳定，天空占2/3便于课堂分步指导。",
        "契合美育核心：引导学生观察城市与自然光影的关系，练习色彩情绪的表达。"
      ]
    },
    "2": {
      title: "提取合适的教学方案：方案二 · 旧式唐楼市井生活",
      items: [
        "主题贴近生活：市井生活与学生的日常经验直接相关，容易引出真实表达。",
        "符号丰富度高：霓虹招牌、铁闸门、马赛克瓷砖与晾衣杆提供充足的叙事细节。",
        "构图具冲击力：低角度仰望与视觉隧道带来强烈的空间纵深感。",
        "契合美育核心：在市井烟火中理解城市记忆，练习观察与再现的能力。"
      ]
    },
    "3": {
      title: "提取合适的教学方案：方案三 · 摩天大楼与庙宇对话",
      items: [
        "主题张力强：新旧建筑并置，天然具备对话结构，容易引发学生思考传统与现代的关系。",
        "符号对比鲜明：直线 VS 曲线，玻璃反射 VS 庙脊雕花，视觉语言清晰，便于课堂分析。",
        "构图有叙事性：框景构图操作简单，但能制造前景、暗亮景的空间层次与情感距离。",
        "契合美育核心：不只是画一栋楼，而是通过选择符号与构图，表达对城市文化冲突与融合的理解。"
      ]
    }
  };

  var resultCard = document.getElementById("resultCard");
  var resultTitle = document.getElementById("resultTitle");
  var resultList = document.getElementById("resultList");
  var planCards = document.querySelectorAll(".plan-card");

  function selectPlan(planId) {
    var data = RESULT_DATA[planId];
    if (!data) return;
    planCards.forEach(function (card) {
      var picked = card.getAttribute("data-plan") === planId;
      card.classList.toggle("is-picked", picked);
      card.setAttribute("aria-pressed", picked ? "true" : "false");
    });
    resultTitle.textContent = data.title;
    resultList.innerHTML = data.items.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");
    resultCard.classList.remove("is-updated");
    void resultCard.offsetWidth; /* 触发重排以重播动画 */
    resultCard.classList.add("is-updated");
  }

  planCards.forEach(function (card) {
    card.addEventListener("click", function () {
      selectPlan(card.getAttribute("data-plan"));
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectPlan(card.getAttribute("data-plan"));
      }
    });
  });
})();

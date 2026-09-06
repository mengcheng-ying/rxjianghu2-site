/* 热血江湖2.0 - 官网交互 */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 导航开合 ---------- */
  var header = $("#siteHeader");
  var navToggle = $("#navToggle");
  var siteNav = $("#siteNav");
  var navOverlay = $("#navOverlay");

  function setNav(open) {
    siteNav.classList.toggle("open", open);
    navOverlay.classList.toggle("show", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setNav(!siteNav.classList.contains("open"));
    });
    navOverlay.addEventListener("click", function () { setNav(false); });
    $$(".site-nav a", siteNav).forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
  }

  /* ---------- 滚动状态：header 阴影 + 底部下载条 ---------- */
  var bottomBar = $("#bottomBar");

  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (bottomBar) bottomBar.classList.toggle("show", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 公告 Tab 切换 ---------- */
  var newsTabs = $("#newsTabs");
  var newsList = $("#newsList");
  var newsItems = $$(".news-item", newsList);

  if (newsTabs && newsItems.length) {
    newsTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (!btn) return;
      var tab = btn.dataset.tab;
      $$(".tab", newsTabs).forEach(function (t) { t.classList.remove("active"); });
      btn.classList.add("active");
      newsItems.forEach(function (item) {
        item.classList.toggle("hide", item.dataset.group !== tab);
      });
    });
  }

  /* ---------- 职业切换 ---------- */
  var classTabs = $("#classTabs");
  var classStage = $("#classStage");
  var classCards = $$(".class-card", classStage);

  if (classTabs && classCards.length) {
    classTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".classtab");
      if (!btn) return;
      var key = btn.dataset.class;
      if (btn.classList.contains("active")) return;
      $$(".classtab", classTabs).forEach(function (t) { t.classList.remove("active"); });
      btn.classList.add("active");
      classCards.forEach(function (card) {
        card.classList.toggle("active", card.dataset.class === key);
      });
    });
  }

  /* ---------- 滚动进入动画 ---------- */
  var revealEls = [];
  $$(".section").forEach(function (sec) {
    sec.classList.add("fade-up");
    revealEls.push(sec);
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 平滑锚点（桌面端备用） ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) return; // 交给 CSS scroll-behavior
    });
  });

  /* ---------- iOS 企业签名安装触发 ---------- */
  // manifest 清单与站点同域名（必须 HTTPS），itms-services 协议引导安装
  function manifestUrl() {
    var base = location.origin + location.pathname.replace(/\/[^/]*$/, "/");
    return base + "ios/install.plist";
  }
  // 触发苹果企业安装协议
  function triggerIOSInstall() {
    location.href = "itms-services://?action=download-manifest&url=" +
      encodeURIComponent(manifestUrl());
  }
  // 构建引导弹窗 DOM
  function buildGuide() {
    var d = document.createElement("div");
    d.className = "ios-guide";
    d.innerHTML =
      '<div class="ios-guide-mask"></div>' +
      '<div class="ios-guide-card" role="dialog" aria-modal="true">' +
        '<button class="ios-guide-close" type="button" aria-label="关闭">&times;</button>' +
        '<img class="ios-guide-icon" src="assets/images/icon-role.webp?v=20260906m" alt="iOS">' +
        '<h3 class="ios-guide-title">苹果安装引导</h3>' +
        '<ol class="ios-guide-steps">' +
          '<li>在<span>Safari</span>浏览器中打开本页，点击下方「下载并安装」；若提示「未受信任的企业开发者」，属正常现象，并非失败。</li>' +
          '<li>前往<span>设置 → 通用 → VPN与设备管理</span>。</li>' +
          '<li>找到本应用的证书，点击「<span>信任</span>」。</li>' +
          '<li>信任完成后回到本页，再次点击「下载并安装」，即可自动下载安装包并完成安装。</li>' +
        '</ol>' +
        '<button class="ios-guide-btn" type="button" id="iosGuideStart">下载并安装</button>' +
        '<p class="ios-guide-tip">提示：请务必使用 iPhone 自带的 Safari 浏览器打开官网。</p>' +
      '</div>';
    document.body.appendChild(d);
    return d;
  }
  var iosGuide = buildGuide();
  var guideCard = $(".ios-guide-card", iosGuide);
  function showGuide(show) {
    iosGuide.classList.toggle("open", show);
    document.body.style.overflow = show ? "hidden" : "";
  }
  // 关闭
  $(".ios-guide-mask", iosGuide).addEventListener("click", function () { showGuide(false); });
  $(".ios-guide-close", iosGuide).addEventListener("click", function () { showGuide(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") showGuide(false); });
  // 开始安装按钮（可重复点击，信任后可再次触发）
  var guideStart = $("#iosGuideStart", iosGuide);
  guideStart.addEventListener("click", function () {
    showGuide(false);
    triggerIOSInstall();
  });
  // 点击下载按钮：iOS 弹引导，其余走原逻辑
  function iosInstall(e) {
    e.preventDefault();
    var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    var isAndroid = /Android/.test(navigator.userAgent);
    if (isIOS) {
      showGuide(true);
    } else if (isAndroid) {
      // 安卓：走 apk 直链
      window.open("https://res-engine-rxyqcy.cyltc.com/package/rx/4510454/promote/4510454_4515285_c866021f3ef54b8bdece6de6a4ae7951.apk?v=1788665710", "_blank");
    } else {
      // 桌面：打开安装清单
      window.open(manifestUrl(), "_blank");
    }
  }
  var iosBtns = $$(".btn-ios-install, #iosInstall");
  iosBtns.forEach(function (btn) {
    if (btn) btn.addEventListener("click", iosInstall);
  });
})();
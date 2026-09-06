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
  function iosInstall(e) {
    e.preventDefault();
    // 判断设备
    var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    var isAndroid = /Android/.test(navigator.userAgent);
    if (isIOS) {
      // iOS：企业安装必须先信任证书；直接打开 itms-services
      location.href = "itms-services://?action=download-manifest&url=" +
        encodeURIComponent(manifestUrl());
    } else if (isAndroid) {
      // 安卓：走 apk 直链
      window.open("https://res-engine-rxyqcy.cyltc.com/package/rx/4510454/promote/4510454_4515285_c866021f3ef54b8bdece6de6a4ae7951.apk?v=1788665710", "_blank");
    } else {
      // 桌面：提示扫码/或打开安装页
      window.open(manifestUrl(), "_blank");
    }
  }
  var iosBtns = $$(".btn-ios-install, #iosInstall");
  iosBtns.forEach(function (btn) {
    if (btn) btn.addEventListener("click", iosInstall);
  });
})();
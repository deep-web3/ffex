/* ffex site behaviour: nav, reveal, showcase tabs, demo video control, reading progress. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- nav ---------- */
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navPanel = document.querySelector("[data-nav-panel]");
  var MOBILE_LABEL_OPEN = (navToggle && navToggle.getAttribute("aria-label")) || "Open menu";

  function setNavScrolled() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  setNavScrolled();
  window.addEventListener("scroll", setNavScrolled, { passive: true });

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", MOBILE_LABEL_OPEN);
    }
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute(
        "aria-label",
        open ? (navPanel.getAttribute("data-close-label") || "Close menu") : MOBILE_LABEL_OPEN
      );
    });
    navPanel.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) closeNav();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealItems.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (el) {
        el.classList.add("is-in");
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealItems.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- demo videos + showcase tabs ---------- */
  var videoFrames = Array.prototype.slice.call(document.querySelectorAll(".demo__frame"));
  var videos = Array.prototype.slice.call(document.querySelectorAll("[data-demo-video]"));
  var showcase = document.querySelector("[data-showcase]");
  var activePanel = 0;

  function panelIndexFor(video) {
    var panel = video.closest("[data-showcase-panel]");
    return panel ? Number(panel.getAttribute("data-showcase-panel")) : null;
  }

  var labelPlay = document.body.getAttribute("data-label-play") || "Play demo";
  var labelPause = document.body.getAttribute("data-label-pause") || "Pause demo";

  function setFrameState(frame, playing) {
    if (!frame) return;
    frame.classList.toggle("is-paused", !playing);
    var btn = frame.querySelector("[data-video-toggle]");
    if (btn) btn.setAttribute("aria-label", playing ? labelPause : labelPlay);
  }

  function playVideo(video) {
    var frame = video.closest(".demo__frame");
    if (reduceMotion) {
      setFrameState(frame, false);
      return;
    }
    var promise = video.play();
    if (promise && promise.catch) {
      promise
        .then(function () {
          setFrameState(frame, true);
        })
        .catch(function () {
          setFrameState(frame, false);
        });
    }
  }

  function pauseVideo(video) {
    video.pause();
    setFrameState(video.closest(".demo__frame"), false);
  }

  function playVisibleVideos() {
    videos.forEach(function (video) {
      if (video.offsetParent === null) return;
      var idx = panelIndexFor(video);
      if (idx !== null && idx !== activePanel) return;
      if (video.dataset.inView === "1") playVideo(video);
    });
  }

  if (videos.length && "IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          video.dataset.inView = entry.isIntersecting ? "1" : "0";
          if (!entry.isIntersecting) {
            pauseVideo(video);
          } else {
            playVisibleVideos();
          }
        });
      },
      { threshold: 0.25 }
    );
    videos.forEach(function (video) {
      videoObserver.observe(video);
      setFrameState(video.closest(".demo__frame"), false);
    });
  }

  videoFrames.forEach(function (frame) {
    var video = frame.querySelector("[data-demo-video]");
    var btn = frame.querySelector("[data-video-toggle]");
    if (!video || !btn) return;
    btn.addEventListener("click", function () {
      if (video.paused) {
        playVideo(video);
      } else {
        pauseVideo(video);
      }
    });
    video.addEventListener("play", function () {
      setFrameState(frame, true);
    });
    video.addEventListener("pause", function () {
      setFrameState(frame, false);
    });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      videos.forEach(pauseVideo);
    } else {
      playVisibleVideos();
    }
  });

  if (showcase) {
    var tabs = Array.prototype.slice.call(showcase.querySelectorAll("[data-showcase-tab]"));
    var panels = Array.prototype.slice.call(showcase.querySelectorAll("[data-showcase-panel]"));

    function activateTab(index, focus) {
      activePanel = index;
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.setAttribute("tabindex", active ? "0" : "-1");
        if (active && focus) tab.focus();
      });
      panels.forEach(function (panel, i) {
        var active = i === index;
        panel.classList.toggle("is-active", active);
        if (active) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });
      videos.forEach(function (video) {
        var idx = panelIndexFor(video);
        if (idx === null) return;
        if (idx !== index) pauseVideo(video);
      });
      playVisibleVideos();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        activateTab(i, false);
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== null) {
          e.preventDefault();
          activateTab(next, true);
        }
      });
    });
  }

  /* ---------- reading progress ---------- */
  var progress = document.querySelector("[data-reading-progress]");
  var articleBody = document.querySelector(".article__body");
  if (progress && articleBody) {
    var updateProgress = function () {
      var rect = articleBody.getBoundingClientRect();
      var total = articleBody.offsetHeight - window.innerHeight * 0.35;
      var scrolled = Math.min(Math.max(-rect.top + 120, 0), Math.max(total, 1));
      var pct = total > 0 ? Math.min((scrolled / total) * 100, 100) : 0;
      progress.style.width = pct.toFixed(2) + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* ---------- subscribe: no form backend ---------- */
  var newsletter = document.querySelector("[data-newsletter]");
  if (newsletter) {
    newsletter.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = newsletter.querySelector("[data-newsletter-status]");
      if (status) status.textContent = status.getAttribute("data-message") || "";
    });
  }

  /* ---------- pointer spotlight (desktop only) ---------- */
  if (canHover && !reduceMotion) {
    var spots = Array.prototype.slice.call(document.querySelectorAll("[data-spotlight]"));
    spots.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }
})();

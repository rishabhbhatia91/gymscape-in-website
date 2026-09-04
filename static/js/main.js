(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  var navLinks = mainNav ? Array.prototype.slice.call(mainNav.querySelectorAll("a")) : [];

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function openNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) { closeNav(); } else { openNav(); }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  // Scrollspy: highlight the nav link for the section currently in view.
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return null;
      var el = document.getElementById(id.slice(1));
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            match.link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  // ================================================================
  // Shop Online – Category Cards & Filter Tabs Interaction
  // ================================================================
  var shopFilters = document.getElementById("shop-filters");
  var shopGrid = document.getElementById("shop-grid");
  var shopEmpty = document.getElementById("shop-empty");
  var shopCatCards = Array.prototype.slice.call(document.querySelectorAll(".shop-cat-card"));

  if (shopFilters && shopGrid) {
    var filterBtns = Array.prototype.slice.call(shopFilters.querySelectorAll(".shop-filter-btn"));
    var shopCards = Array.prototype.slice.call(shopGrid.querySelectorAll(".shop-card"));

    function setFilterActive(category, scrollIntoView) {
      // Update filter tabs
      filterBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute("data-category") === category;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-selected", isMatch ? "true" : "false");
      });

      // Update category cards active styling
      shopCatCards.forEach(function (card) {
        var isMatch = card.getAttribute("data-category") === category;
        card.classList.toggle("is-active", isMatch);
      });

      // Filter product cards
      var visibleCount = 0;
      shopCards.forEach(function (card) {
        var cardCat = card.getAttribute("data-category");
        var match = category === "All" || cardCat === category;
        card.classList.toggle("is-hidden", !match);
        if (match) visibleCount++;
      });

      // Empty state toggle
      if (shopEmpty) {
        if (visibleCount === 0) {
          shopEmpty.removeAttribute("hidden");
          shopGrid.style.display = "none";
        } else {
          shopEmpty.setAttribute("hidden", "");
          shopGrid.style.display = "";
        }
      }

      if (scrollIntoView) {
        var targetEl = document.getElementById("shop-products-view") || shopFilters;
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    // Filter button clicks
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-category");
        setFilterActive(cat, false);
      });
    });

    // Category card clicks
    shopCatCards.forEach(function (card) {
      card.addEventListener("click", function () {
        var cat = card.getAttribute("data-category");
        setFilterActive(cat, true);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var cat = card.getAttribute("data-category");
          setFilterActive(cat, true);
        }
      });
    });

    // Empty state reset button
    var resetBtn = shopEmpty ? shopEmpty.querySelector(".shop-empty-reset") : null;
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        setFilterActive("All", true);
      });
    }
  }

  // ================================================================
  // Hero Section – Cursor-Reactive Ambient Slideshow Controller
  // ================================================================
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var heroSection = document.getElementById("top");
  var heroGlow = heroSection ? heroSection.querySelector(".hero-glow") : null;

  if (heroSlides.length && heroSection) {
    var currentSlide = 0;
    var slideDuration = 4800;
    var autoTimer = null;
    var isHovered = false;

    function showSlide(index) {
      currentSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === currentSlide);
      });
    }

    function nextSlide() {
      if (!isHovered) {
        showSlide(currentSlide + 1);
      }
    }

    function startTimer() {
      stopTimer();
      autoTimer = setInterval(nextSlide, slideDuration);
    }

    function stopTimer() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Cursor movement listener
    var rafId = null;
    heroSection.addEventListener("mousemove", function (e) {
      isHovered = true;
      stopTimer();

      var rect = heroSection.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var normX = Math.max(0, Math.min(1, x / rect.width));
      var normY = Math.max(0, Math.min(1, y / rect.height));

      // 1. Cursor horizontal position smoothly selects corresponding category slide
      var targetSlideIndex = Math.min(Math.floor(normX * heroSlides.length), heroSlides.length - 1);
      if (targetSlideIndex !== currentSlide) {
        showSlide(targetSlideIndex);
      }

      // 2. Parallax depth offset
      var offsetX = (normX - 0.5) * -34;
      var offsetY = (normY - 0.5) * -22;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        var activeSlide = heroSlides[currentSlide];
        if (activeSlide) {
          activeSlide.style.transform = "translate3d(" + offsetX + "px, " + offsetY + "px, 0) scale(1.06)";
        }
        if (heroGlow) {
          heroGlow.style.left = x + "px";
          heroGlow.style.top = y + "px";
        }
      });
    });

    heroSection.addEventListener("mouseleave", function () {
      isHovered = false;
      heroSlides.forEach(function (slide) {
        slide.style.transform = "";
      });
      if (heroGlow) {
        heroGlow.style.left = "";
        heroGlow.style.top = "";
      }
      startTimer();
    });

    startTimer();
  }
})();

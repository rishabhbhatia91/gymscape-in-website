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
})();

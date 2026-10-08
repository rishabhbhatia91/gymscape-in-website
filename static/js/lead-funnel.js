(function () {
  "use strict";

  var waNumber = "919696422319";

  // Category Configuration for Step 2 dynamic options
  var categoryConfigs = {
    "Pickleball & Sports Courts": {
      label1: "Number of Courts / Space Footprint:",
      options1: [
        "1 Standard Court (30×60 ft)",
        "2 Courts (60×60 ft)",
        "3 to 4 Courts (Arena Complex)",
        "5+ Courts Academy Setup",
        "Custom Space / Area Conversion"
      ],
      label2: "Surface System & Turnkey Scope:",
      options2: [
        "8-Layer Cushioned Acrylic System",
        "PP Interlocking Weatherproof Tiles",
        "Court + 12ft Fencing + LED Floodlights",
        "Full Turnkey (Civil Base to Line Marking)"
      ]
    },
    "Commercial Gym Setup": {
      label1: "Facility Type & Area:",
      options1: [
        "Commercial Gym (1,500 – 2,500 sq.ft.)",
        "Large Mega Club (3,500 – 6,000+ sq.ft.)",
        "Society / RWA Club Gym (800 – 1,500 sq.ft.)",
        "Corporate / Institutional Fitness Room",
        "Personal Home Fitness Studio"
      ],
      label2: "Equipment Package Scope:",
      options2: [
        "Complete Turnkey (Cardio + Strength + Flooring)",
        "Heavy Commercial AC Treadmills & Cardio",
        "Selectorized Strength Stations & Racks",
        "Free Weights, Dumbbells & 20mm Rubber Flooring"
      ]
    },
    "Treadmills & Cardio Equipment": {
      label1: "Treadmill Category Required:",
      options1: [
        "Commercial AC Motor Treadmill (6.0 HP Peak)",
        "Smart Foldable Home Motorized Treadmill",
        "4-in-1 Manual Roller Jogger (Zero Electricity)",
        "Curved Slat-Belt Runner (CrossFit / HIIT)"
      ],
      label2: "Required Quantity / Purpose:",
      options2: [
        "1 Unit for Home Fitness",
        "2 to 4 Units for Club / Society Gym",
        "5+ Units Bulk Order for Commercial Gym"
      ]
    },
    "Playground & Swings": {
      label1: "Playground Equipment Type:",
      options1: [
        "Multi-Play Combination Station (Slides & Bridges)",
        "Heavy Park Swings (Single & Multi-Seater)",
        "Outdoor Open Gym Fitness Stations",
        "School & Society Kids Play Area Set"
      ],
      label2: "Safety Flooring Scope:",
      options2: [
        "Equipment with EPDM Soft-Fall Flooring",
        "Equipment with Rubber Safety Tiles",
        "Equipment Supply & Installation Only"
      ]
    },
    "Sports Tables (TT / Snooker / Pool)": {
      label1: "Table Category Required:",
      options1: [
        "25mm Tournament Table Tennis Table (ITTF Spec)",
        "12ft Championship English Snooker Table (Slate Bed)",
        "8ft / 9ft Slate Pool Table",
        "Commercial Heavy-Duty Foosball / Soccer Table",
        "Arcade Dual-Blower Air Hockey Table"
      ],
      label2: "Deployment Location:",
      options2: [
        "School / College / University",
        "Clubhouse / Residential Society",
        "Sports Academy / Gaming Lounge",
        "Home Game Room"
      ]
    },
    "Sports & Gym Flooring": {
      label1: "Flooring Area / Requirement:",
      options1: [
        "Under 1,000 sq.ft.",
        "1,000 to 3,000 sq.ft.",
        "3,000 to 6,000+ sq.ft.",
        "Sample / Inspection First"
      ],
      label2: "Flooring Material Type:",
      options2: [
        "15mm / 20mm High-Density Rubber Gym Tiles",
        "PP Interlocking Multi-Sport Outdoor Tiles",
        "Cushioned Acrylic Synthetic Court System",
        "PVC Vinyl Sports Flooring"
      ]
    }
  };

  function getEl(id) {
    return document.getElementById(id);
  }

  function openModal(preselectedCategory) {
    var backdrop = getEl("leadModalBackdrop");
    var form = getEl("leadFunnelForm");
    if (!backdrop) return;

    backdrop.classList.add("is-visible");
    document.body.style.overflow = "hidden";

    if (preselectedCategory && form) {
      var radio = form.querySelector('input[name="service_category"][value="' + preselectedCategory + '"]');
      if (radio) {
        radio.checked = true;
      }
    }
    goToStep(1);
  }

  function closeModal() {
    var backdrop = getEl("leadModalBackdrop");
    if (!backdrop) return;
    backdrop.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  function goToStep(step) {
    var step1 = getEl("leadStep1");
    var step2 = getEl("leadStep2");
    var step3 = getEl("leadStep3");
    var stepSuccess = getEl("leadStepSuccess");
    var progressBar = getEl("leadProgressBar");
    var stepIndicators = Array.prototype.slice.call(document.querySelectorAll(".lead-step-indicator"));

    [step1, step2, step3, stepSuccess].forEach(function (pane) {
      if (pane) pane.classList.remove("is-active");
    });

    stepIndicators.forEach(function (ind, idx) {
      ind.classList.toggle("is-active", idx + 1 <= step);
    });

    if (step === 1 && step1) {
      step1.classList.add("is-active");
      if (progressBar) progressBar.style.width = "33%";
    } else if (step === 2 && step2) {
      renderStep2Options();
      step2.classList.add("is-active");
      if (progressBar) progressBar.style.width = "66%";
    } else if (step === 3 && step3) {
      renderStep3Summary();
      step3.classList.add("is-active");
      if (progressBar) progressBar.style.width = "100%";
    } else if (step === 4 && stepSuccess) {
      stepSuccess.classList.add("is-active");
      if (progressBar) progressBar.style.width = "100%";
    }
  }

  function getSelectedCategory() {
    var form = getEl("leadFunnelForm");
    if (!form) return "Pickleball & Sports Courts";
    var checked = form.querySelector('input[name="service_category"]:checked');
    return checked ? checked.value : "Pickleball & Sports Courts";
  }

  function renderStep2Options() {
    var cat = getSelectedCategory();
    var config = categoryConfigs[cat] || categoryConfigs["Pickleball & Sports Courts"];
    var dynamicLabel1 = getEl("leadDynamicLabel1");
    var chipsContainer1 = getEl("leadChipsContainer1");
    var dynamicLabel2 = getEl("leadDynamicLabel2");
    var chipsContainer2 = getEl("leadChipsContainer2");

    if (dynamicLabel1) dynamicLabel1.textContent = config.label1;
    if (dynamicLabel2) dynamicLabel2.textContent = config.label2;

    if (chipsContainer1) {
      chipsContainer1.innerHTML = config.options1.map(function (opt, idx) {
        var isChecked = idx === 0 ? "checked" : "";
        return '<label class="lead-chip"><input type="radio" name="spec_scale" value="' + opt + '" ' + isChecked + '><span>' + opt + '</span></label>';
      }).join("");
    }

    if (chipsContainer2) {
      chipsContainer2.innerHTML = config.options2.map(function (opt, idx) {
        var isChecked = idx === 0 ? "checked" : "";
        return '<label class="lead-chip"><input type="radio" name="spec_type" value="' + opt + '" ' + isChecked + '><span>' + opt + '</span></label>';
      }).join("");
    }
  }

  function renderStep3Summary() {
    var summaryPreview = getEl("leadSummaryPreview");
    var form = getEl("leadFunnelForm");
    if (!summaryPreview || !form) return;

    var cat = getSelectedCategory();
    var scaleEl = form.querySelector('input[name="spec_scale"]:checked');
    var typeEl = form.querySelector('input[name="spec_type"]:checked');
    var timelineEl = form.querySelector('input[name="timeline"]:checked');

    var scale = scaleEl ? scaleEl.value : "";
    var type = typeEl ? typeEl.value : "";
    var timeline = timelineEl ? timelineEl.value : "";

    summaryPreview.innerHTML = [
      '<span class="lead-summary-pill">🏷️ ' + cat + '</span>',
      '<span class="lead-summary-pill">📐 ' + scale + '</span>',
      '<span class="lead-summary-pill">🛠️ ' + type + '</span>',
      '<span class="lead-summary-pill">⏱️ ' + timeline + '</span>'
    ].join("");
  }

  function handleLeadSubmit() {
    var nameInput = getEl("leadName");
    var cityInput = getEl("leadCity");
    var phoneInput = getEl("leadPhone");
    var form = getEl("leadFunnelForm");
    var directWaLink = getEl("leadDirectWaLink");

    var name = nameInput ? nameInput.value.trim() : "";
    var city = cityInput ? cityInput.value.trim() : "";
    var phone = phoneInput ? phoneInput.value.trim() : "";

    if (!city) {
      alert("Please enter your city/location.");
      if (cityInput) cityInput.focus();
      return;
    }

    if (!name) {
      alert("Please enter your name.");
      if (nameInput) nameInput.focus();
      return;
    }

    var cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      if (phoneInput) phoneInput.focus();
      return;
    }

    var cat = getSelectedCategory();
    var scaleEl = form ? form.querySelector('input[name="spec_scale"]:checked') : null;
    var typeEl = form ? form.querySelector('input[name="spec_type"]:checked') : null;
    var timelineEl = form ? form.querySelector('input[name="timeline"]:checked') : null;

    var scale = scaleEl ? scaleEl.value : "";
    var type = typeEl ? typeEl.value : "";
    var timeline = timelineEl ? timelineEl.value : "";

    var lines = [
      "⚡ *NEW QUOTATION REQUEST (Website Lead)*",
      "----------------------------------",
      "👤 *Name:* " + name,
      "📍 *Location:* " + city,
      "📞 *Phone:* +91 " + cleanPhone,
      "----------------------------------",
      "🏷️ *Category:* " + cat,
      "📐 *Scale / Size:* " + scale,
      "🛠️ *Scope / Type:* " + type,
      "⏱️ *Timeline:* " + timeline,
      "----------------------------------",
      "_Please share the itemized estimate & product catalog on WhatsApp._"
    ];

    var message = lines.join("\n");
    var waUrl = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(message);

    if (directWaLink) {
      directWaLink.href = waUrl;
    }

    goToStep(4);
    window.open(waUrl, "_blank");
  }

  // Document Event Delegation for ALL triggers across the whole site
  document.addEventListener("click", function (e) {
    var target = e.target;

    // Check for open quote button
    var openBtn = target.closest("#openLeadModalBtn, .js-open-quote-modal, [data-open-quote='true']");
    if (openBtn) {
      e.preventDefault();
      e.stopPropagation();
      var cat = openBtn.getAttribute("data-category") || "";
      openModal(cat);
      return;
    }

    // Check for close buttons
    if (target.closest("#leadModalCloseBtn, #leadSuccessCloseBtn")) {
      e.preventDefault();
      closeModal();
      return;
    }

    // Check backdrop click
    var backdrop = getEl("leadModalBackdrop");
    if (backdrop && target === backdrop) {
      closeModal();
      return;
    }

    // Step navigation buttons
    if (target.closest("#step1NextBtn")) {
      e.preventDefault();
      goToStep(2);
      return;
    }
    if (target.closest("#step2PrevBtn")) {
      e.preventDefault();
      goToStep(1);
      return;
    }
    if (target.closest("#step2NextBtn")) {
      e.preventDefault();
      goToStep(3);
      return;
    }
    if (target.closest("#step3PrevBtn")) {
      e.preventDefault();
      goToStep(2);
      return;
    }
    if (target.closest("#leadSubmitBtn")) {
      e.preventDefault();
      handleLeadSubmit();
      return;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var backdrop = getEl("leadModalBackdrop");
      if (backdrop && backdrop.classList.contains("is-visible")) {
        closeModal();
      }
    }
  });

  window.openQuoteCalculator = openModal;

})();

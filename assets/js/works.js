// Works page: keep the sticky index below the header and highlight the project in view.
(function () {
  var header = document.querySelector(".site-header");
  var strip = document.querySelector(".works-index-inner");
  var projectToggle = document.querySelector(".works-index-toggle");
  var compactIndex = window.matchMedia("(max-width: 860px)");
  var works = Array.prototype.slice.call(document.querySelectorAll(".work"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".works-index a"));
  var bySlug = {};
  links.forEach(function (a) { bySlug[a.hash.slice(1)] = a; });

  function setHeaderHeight() {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function setIndexMode() {
    if (compactIndex.matches) {
      strip.hidden = projectToggle.getAttribute("aria-expanded") !== "true";
      projectToggle.hidden = false;
    } else {
      strip.hidden = false;
      projectToggle.hidden = true;
      projectToggle.setAttribute("aria-expanded", "false");
    }
  }

  projectToggle.addEventListener("click", function () {
    var open = projectToggle.getAttribute("aria-expanded") !== "true";
    projectToggle.setAttribute("aria-expanded", String(open));
    projectToggle.setAttribute("aria-label", open ? "Close projects menu" : "Open projects menu");
    strip.hidden = !open;
  });
  strip.addEventListener("click", function (event) {
    if (event.target.closest("a") && compactIndex.matches) {
      projectToggle.setAttribute("aria-expanded", "false");
      projectToggle.setAttribute("aria-label", "Open projects menu");
      strip.hidden = true;
    }
  });
  compactIndex.addEventListener("change", setIndexMode);

  function activate(slug) {
    var link = bySlug[slug];
    if (!link || link.getAttribute("aria-current") === "true") return;
    links.forEach(function (a) { a.removeAttribute("aria-current"); });
    link.setAttribute("aria-current", "true");
    // On narrow screens the index scrolls sideways; bring the active name into view.
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: link.offsetLeft - strip.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
    }
  }

  // The current project is the last one whose top has passed a line near the top of the screen.
  function update() {
    var margin = parseFloat(getComputedStyle(works[0]).scrollMarginTop) || 0;
    var line = Math.max(window.innerHeight * 0.3, margin + 10);
    var current = works[0];
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      current = works[works.length - 1];
    } else {
      works.forEach(function (el) {
        if (el.getBoundingClientRect().top <= line) current = el;
      });
    }
    activate(current.id);
  }

  var pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; update(); });
  }

  setHeaderHeight();
  setIndexMode();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { setHeaderHeight(); onScroll(); });
})();

(function () {
  var toc = document.querySelector("[data-post-toc]");
  var tocInner = toc ? toc.querySelector(".post-toc-inner") : null;
  var tocNav = document.querySelector("[data-post-toc-nav]");
  var content = document.querySelector(".post-body");
  var postMain = document.querySelector(".post-main");
  var postArticle = document.querySelector(".post-article");
  var headerTitle = document.querySelector(".post-article .header-title");
  var navbar = document.querySelector(".navbar");
  var wideScreenQuery = window.matchMedia("(min-width: 1394px)");

  if (!toc || !tocInner || !tocNav || !content) {
    return;
  }

  var headings = Array.prototype.slice.call(
    content.querySelectorAll("h1[id], h2[id]")
  );

  if (!headings.length) {
    return;
  }

  var fragment = document.createDocumentFragment();

  headings.forEach(function (heading) {
    var link = document.createElement("a");
    var level = heading.tagName.toLowerCase();

    link.className = "post-toc-link post-toc-" + level;
    link.href = "#" + heading.id;
    link.textContent = heading.textContent.trim();
    link.setAttribute("data-toc-link", heading.id);

    fragment.appendChild(link);
  });

  tocNav.appendChild(fragment);
  toc.hidden = false;

  var links = Array.prototype.slice.call(
    tocNav.querySelectorAll("[data-toc-link]")
  );

  function setActiveLink(id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute("data-toc-link") === id;

      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function updateActiveLink() {
    var currentHeading = headings[0];
    var offset = 140;

    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top - offset <= 0) {
        currentHeading = heading;
      }
    });

    setActiveLink(currentHeading.id);
  }

  function syncTocOffset() {
    if (!postMain || !postArticle || !headerTitle || !navbar) {
      return;
    }

    if (!wideScreenQuery.matches) {
      tocInner.style.position = "";
      tocInner.style.top = "";
      tocInner.style.left = "";
      tocInner.style.width = "";
      return;
    }

    var mainRect = postMain.getBoundingClientRect();
    var articleRect = postArticle.getBoundingClientRect();
    var tocRect = toc.getBoundingClientRect();
    var titleRect = headerTitle.getBoundingClientRect();
    var navbarRect = navbar.getBoundingClientRect();
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    var initialTop = Math.max(0, titleRect.top - mainRect.top);
    var stickyTop = Math.max(24, navbarRect.bottom + 24);
    var initialDocTop = scrollY + mainRect.top + initialTop;
    var fixedLeft = scrollX + tocRect.left;
    var maxRelativeTop = Math.max(
      initialTop,
      articleRect.bottom - mainRect.top - tocInner.offsetHeight
    );
    var maxDocTop = scrollY + mainRect.top + maxRelativeTop;

    if (scrollY + stickyTop <= initialDocTop) {
      tocInner.style.position = "absolute";
      tocInner.style.top = initialTop + "px";
      tocInner.style.left = "0";
      tocInner.style.width = "100%";
      return;
    }

    if (scrollY + stickyTop < maxDocTop) {
      tocInner.style.position = "fixed";
      tocInner.style.top = stickyTop + "px";
      tocInner.style.left = fixedLeft + "px";
      tocInner.style.width = toc.clientWidth + "px";
      return;
    }

    tocInner.style.position = "absolute";
    tocInner.style.top = maxRelativeTop + "px";
    tocInner.style.left = "0";
    tocInner.style.width = "100%";
  }

  syncTocOffset();
  updateActiveLink();

  window.addEventListener("scroll", function () {
    updateActiveLink();
    syncTocOffset();
  }, { passive: true });
  window.addEventListener("load", syncTocOffset);
  window.addEventListener("resize", updateActiveLink);
  window.addEventListener("resize", syncTocOffset);
})();

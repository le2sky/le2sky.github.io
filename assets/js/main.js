(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
    } else {
      initTheme(state);
    }
  };

  lamp.addEventListener("click", () =>
    toggleTheme(localStorage.getItem("theme"))
  );

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });

  // Footnote preview
  const postBody = document.querySelector(".post-body");

  if (postBody) {
    const footnoteLinks = postBody.querySelectorAll('sup[id] > a[href^="#"]');
    const preview = document.createElement("div");

    preview.className = "footnote-preview";
    preview.setAttribute("role", "tooltip");
    preview.setAttribute("aria-hidden", "true");
    document.body.appendChild(preview);

    const getFootnoteText = (link) => {
      if (link.dataset.footnotePreview) {
        return link.dataset.footnotePreview;
      }

      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);

      if (!target || target.tagName.toLowerCase() !== "small") {
        return "";
      }

      const targetClone = target.cloneNode(true);
      const backLink = targetClone.querySelector("sup");

      if (backLink) {
        backLink.remove();
      }

      const text = targetClone.textContent.trim();

      link.dataset.footnotePreview = text;
      link.setAttribute("title", text);

      return text;
    };

    const placePreview = (link) => {
      const linkRect = link.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      const gap = 10;
      const edgeGap = 14;
      const top =
        linkRect.top - previewRect.height - gap > edgeGap
          ? linkRect.top - previewRect.height - gap
          : linkRect.bottom + gap;
      const left = Math.min(
        Math.max(
          linkRect.left + linkRect.width / 2 - previewRect.width / 2,
          edgeGap
        ),
        window.innerWidth - previewRect.width - edgeGap
      );

      preview.style.top = `${top + window.scrollY}px`;
      preview.style.left = `${left + window.scrollX}px`;
    };

    const showPreview = (event) => {
      const text = getFootnoteText(event.currentTarget);

      if (!text) {
        return;
      }

      preview.textContent = text;
      preview.classList.add("is-visible");
      preview.setAttribute("aria-hidden", "false");
      placePreview(event.currentTarget);
    };

    const hidePreview = () => {
      preview.classList.remove("is-visible");
      preview.setAttribute("aria-hidden", "true");
    };

    footnoteLinks.forEach((link) => {
      getFootnoteText(link);
      link.addEventListener("pointerenter", showPreview);
      link.addEventListener("pointerleave", hidePreview);
      link.addEventListener("mouseover", showPreview);
      link.addEventListener("mouseout", hidePreview);
      link.addEventListener("mouseenter", showPreview);
      link.addEventListener("focus", showPreview);
      link.addEventListener("mouseleave", hidePreview);
      link.addEventListener("blur", hidePreview);
    });

    window.addEventListener("scroll", hidePreview, { passive: true });
    window.addEventListener("resize", hidePreview);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hidePreview();
      }
    });
  }
})();

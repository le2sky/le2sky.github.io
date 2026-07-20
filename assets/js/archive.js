(function () {
  var triggers = document.querySelectorAll("[data-archive-view-trigger]");
  var panels = document.querySelectorAll("[data-archive-view-panel]");
  var toggle = document.querySelector(".archive-view-toggle");
  var tagButtons = document.querySelectorAll("[data-tag-filter]");
  var tagPanels = document.querySelectorAll("[data-tag-panel]");
  var tagEmptyState = document.querySelector("[data-tag-empty]");

  if (!triggers.length || !panels.length) {
    return;
  }

  function currentHashTargetsTags() {
    var hash = window.location.hash.replace(/^#/, "");
    return hash.indexOf("tag-") === 0;
  }

  function getTagFromHash() {
    var hash = window.location.hash.replace(/^#/, "");

    if (hash.indexOf("tag-") !== 0) {
      return "";
    }

    return hash.replace(/^tag-/, "");
  }

  function hasTagPanel(tag) {
    for (var index = 0; index < tagPanels.length; index += 1) {
      if (tagPanels[index].getAttribute("data-tag-panel") === tag) {
        return true;
      }
    }

    return false;
  }

  function writeArchiveState(view, tag) {
    if (!window.history || !window.history.replaceState) {
      return;
    }

    var url = new URL(window.location.href);

    if (view === "tags") {
      url.searchParams.set("view", "tags");
    } else {
      url.searchParams.delete("view");
    }

    if (view === "tags" && tag) {
      url.hash = "tag-" + tag;
    } else {
      url.hash = "";
    }

    window.history.replaceState({}, "", url.toString());
  }

  function setActiveView(view, options) {
    var skipUrlUpdate = options && options.skipUrlUpdate;
    var activeTag = options && options.activeTag;

    if (toggle) {
      toggle.setAttribute("data-active-view", view);
    }

    for (var index = 0; index < panels.length; index += 1) {
      var panel = panels[index];
      var isActive = panel.getAttribute("data-archive-view-panel") === view;

      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    }

    for (var triggerIndex = 0; triggerIndex < triggers.length; triggerIndex += 1) {
      var trigger = triggers[triggerIndex];
      var isCurrent = trigger.getAttribute("data-archive-view-trigger") === view;

      trigger.classList.toggle("is-active", isCurrent);
      trigger.setAttribute("aria-selected", isCurrent ? "true" : "false");
      trigger.setAttribute("tabindex", isCurrent ? "0" : "-1");
    }

    if (!skipUrlUpdate) {
      writeArchiveState(view, view === "tags" ? activeTag : "");
    }
  }

  function setActiveTag(tag, options) {
    var skipUrlUpdate = options && options.skipUrlUpdate;

    for (var buttonIndex = 0; buttonIndex < tagButtons.length; buttonIndex += 1) {
      var button = tagButtons[buttonIndex];
      var isActiveButton = button.getAttribute("data-tag-filter") === tag;

      button.classList.toggle("is-active", isActiveButton);
      button.setAttribute("aria-pressed", isActiveButton ? "true" : "false");
    }

    for (var panelIndex = 0; panelIndex < tagPanels.length; panelIndex += 1) {
      var panel = tagPanels[panelIndex];
      var isActivePanel = panel.getAttribute("data-tag-panel") === tag;

      panel.hidden = !isActivePanel;
    }

    if (tagEmptyState) {
      tagEmptyState.hidden = !!tag;
    }

    if (!skipUrlUpdate) {
      writeArchiveState("tags", tag);
    }
  }

  var params = new URLSearchParams(window.location.search);
  var requestedView = params.get("view");
  var initialView = requestedView === "tags" || currentHashTargetsTags() ? "tags" : "years";
  var initialTag = getTagFromHash();

  setActiveView(initialView, {
    skipUrlUpdate: true,
    activeTag: hasTagPanel(initialTag) ? initialTag : ""
  });

  if (tagPanels.length) {
    setActiveTag(hasTagPanel(initialTag) ? initialTag : "", { skipUrlUpdate: true });
  }

  for (var buttonIndex = 0; buttonIndex < triggers.length; buttonIndex += 1) {
    triggers[buttonIndex].addEventListener("click", function (event) {
      var view = event.currentTarget.getAttribute("data-archive-view-trigger");

      setActiveView(view, {
        activeTag: view === "tags" && hasTagPanel(getTagFromHash()) ? getTagFromHash() : ""
      });

      if (view === "years" && tagPanels.length) {
        setActiveTag("", { skipUrlUpdate: true });
      }
    });
  }

  for (var tagButtonIndex = 0; tagButtonIndex < tagButtons.length; tagButtonIndex += 1) {
    tagButtons[tagButtonIndex].addEventListener("click", function (event) {
      var tag = event.currentTarget.getAttribute("data-tag-filter");

      setActiveView("tags", { skipUrlUpdate: true, activeTag: tag });
      setActiveTag(tag);
    });
  }

  window.addEventListener("hashchange", function () {
    var tag = getTagFromHash();

    if (hasTagPanel(tag)) {
      setActiveView("tags", { skipUrlUpdate: true, activeTag: tag });
      setActiveTag(tag, { skipUrlUpdate: true });
    } else if (!tag && tagPanels.length) {
      setActiveTag("", { skipUrlUpdate: true });
    }
  });
})();

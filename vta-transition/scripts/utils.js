/**
 * URL先のHTMLのbody要素の中身を抜き出します。
 * @param url {string}
 * @returns {Promise<string>}
 */
export async function getPageContent(url) {
  // This is a really scrappy way to do this.
  // Don't do this in production!
  const response = await fetch(url);
  const text = await response.text();
  // Particularly as it uses regexp
  return /<body[^>]*>([\w\W]*)<\/body>/.exec(text)[1];
}

function isBackNavigation(navigateEvent) {
  if (navigateEvent.navigationType === "push" || navigateEvent.navigationType === "replace") {
    return false;
  }
  if (navigateEvent.destination.index !== -1 && navigateEvent.destination.index < navigation.currentEntry.index) {
    return true;
  }
  return false;
}

// Intercept navigations
// https://developer.chrome.com/docs/web-platform/navigation-api/
// This is a naive usage of the navigation API, to keep things simple.
export async function onLinkNavigate(callback) {
  // Navigation APIが利用可能なブラウザの場合（2024年現在、ChromeとEdgeを想定）
  if ("navigation" in window) {
    navigation.addEventListener("navigate", (event) => {
      const toUrl = new URL(event.destination.url);

      if (location.origin !== toUrl.origin) return;

      const fromPath = location.pathname;
      const isBack = isBackNavigation(event);

      event.intercept({
        async handler() {
          if (event.info === "ignore") return;

          await callback({
            toPath: toUrl.pathname,
            fromPath,
            isBack,
          });
        },
      });
    });
  } else {
    // Navigation APIが使わないブラウザでは類似の処理を記載（互換ではない）
    // おもにSafari 18.0向け
    document.addEventListener("click", (event) => {
      const target = event.target.closest("a");

      if (!target) return;

      const toUrl = new URL(target.href);

      if (location.origin !== toUrl.origin) return;

      event.preventDefault();

      callback({
        toPath: toUrl.pathname,
        fromPath: location.pathname,
        isBack: false,
      });

      history.pushState(null, "", toUrl.pathname);
    });
  }
}

// This helper function returns a View-Transition-like object, even for browsers that don't support view transitions.
// It won't do the transition in unsupported browsers, it'll act as if the transition is skipped.
// It also makes it easier to add class names to the document element.
export function transitionHelper({ skipTransition = false, classNames = "", updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => undefined);

    return {
      ready: Promise.reject(Error("View transitions unsupported")),
      domUpdated: updateCallbackDone,
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }

  const classNamesArray = classNames.split(/\s+/g).filter(Boolean);

  document.documentElement.classList.add(...classNamesArray);

  const transition = document.startViewTransition(updateDOM);

  transition.finished.finally(() => document.documentElement.classList.remove(...classNamesArray));

  return transition;
}

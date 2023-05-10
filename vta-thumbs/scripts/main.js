import { getPageContent, onLinkNavigate, transitionHelper, getLink } from "./utils.js";

const galleryPath = "index.html";
const detailPath = `detail-`;

/**
 * 遷移先の種類を判定します。
 * @param fromPath {string}
 * @param toPath {string}
 * @returns {string}
 */
function getNavigationType(fromPath, toPath) {
  if (fromPath.includes(detailPath) && toPath.endsWith(galleryPath)) {
    return "detail-page-to-index";
  }

  if (fromPath.endsWith(galleryPath) && toPath.includes(detailPath)) {
    return "index-to-detail-page";
  }

  if (fromPath.includes(detailPath) && toPath.includes(detailPath)) {
    return "detail-to-detail-page";
  }

  return "other";
}

onLinkNavigate(async ({ fromPath, toPath, isBack }) => {
  const navigationType = getNavigationType(fromPath, toPath);
  const content = await getPageContent(toPath);

  let targetThumbnail;
  let classNames = "";

  if (navigationType === "index-to-detail-page") {
    targetThumbnail = getLink(toPath).querySelector("img");
    targetThumbnail.style.viewTransitionName = "banner-img";
    classNames = "from-index to-detail";
  } else if (navigationType === "detail-page-to-index") {
    classNames = "to-index from-detail";
  } else if (navigationType === "detail-to-detail-page") {
    classNames = "to-detail from-detail" + (isBack ? " back-transition" : "");
  }

  const transition = transitionHelper({
    updateDOM() {
      document.body.innerHTML = content;

      if (navigationType === "detail-page-to-index") {
        targetThumbnail = getLink(fromPath).querySelector("img");
        targetThumbnail.style.viewTransitionName = "banner-img";
      }
    },
    classNames,
  });

  transition.finished.finally(() => {
    if (targetThumbnail) targetThumbnail.style.viewTransitionName = "";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 初期表示時の演出
  document.querySelectorAll(".photo-list > li").forEach((element, index) => {
    element.style = "opacity: 0";
    element.animate([{ scale: 0.9 }, { opacity: 1 }], {
      duration: 500,
      delay: 75 * index + 100,
      fill: "forwards",
      // back-out
      easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    });
  });
});

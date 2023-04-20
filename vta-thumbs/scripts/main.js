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
    return "detail-page-to-gallery";
  }

  if (fromPath.endsWith(galleryPath) && toPath.includes(detailPath)) {
    return "gallery-to-detail-page";
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

  if (navigationType === "gallery-to-detail-page") {
    targetThumbnail = getLink(toPath).querySelector("img");
    targetThumbnail.style.viewTransitionName = "banner-img";
    classNames = "from-thumbs to-video";
  } else if (navigationType === "detail-page-to-gallery") {
    classNames = "to-thumbs from-video";
  } else if (navigationType === "detail-to-detail-page") {
    classNames = "to-video from-video" + (isBack ? " back-transition" : "");
  }

  const transition = transitionHelper({
    updateDOM() {
      document.body.innerHTML = content;

      if (navigationType === "detail-page-to-gallery") {
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

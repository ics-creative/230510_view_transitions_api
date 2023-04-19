import {
  getPageContent,
  onLinkNavigate,
  transitionHelper,
} from "./utils.js";


onLinkNavigate(async ({fromPath, toPath}) => {
  const content = await getPageContent(toPath);

  transitionHelper({
    updateDOM() {
      document.body.innerHTML = content;
    },
  });
});



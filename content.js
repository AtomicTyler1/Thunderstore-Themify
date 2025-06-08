const TARGET_STYLE_REGEX = /\/static\/css\/all\..*\.css$/;

fetch(chrome.runtime.getURL('style.css'))
  .then(res => res.text())
  .then(customCss => {
    const link = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .find(l => TARGET_STYLE_REGEX.test(l.href));

    if (link) {
      const style = document.createElement('style');
      style.textContent = customCss;
      link.parentNode.insertBefore(style, link.nextSibling);
    }
  })
  .catch(console.error);

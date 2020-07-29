export function makeOnClickAccessible() {
  const linkSelector = ':scope > a, :scope > span > .link-wrapper';
  window.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      const target = ev.target as HTMLUnknownElement;

      const isAnWebComponent = target.tagName.includes('-');

      if (isAnWebComponent) {
        const relatedLink = target.querySelector(linkSelector) as HTMLUnknownElement;

        if (relatedLink) {
          relatedLink.click();
        } else {
          target.click();
        }
      }
    }
  });

  window.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement;

    if ((target as unknown) === window || target === document.body) {
      return;
    }

    const isAnWebComponent = target.tagName.includes('-');

    if (isAnWebComponent) {
      const relatedLink = target.querySelector(linkSelector) as HTMLUnknownElement;

      if (relatedLink) {
        relatedLink.click();
      }
    }
  });
}

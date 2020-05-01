export const injectChromeWebstoreInstallButton = () => {
  const baseUrl =
    'https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=%VERSION&x=id%3D%ID%26installsource%3Dondemand%26uc';
  const ibText = 'Add to Wexond';
  const ibTemplate =
    '<div role="button" class="dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c" aria-label="' +
    ibText +
    '" tabindex="0" style="user-select: none;"><div class="g-c-Hf"><div class="g-c-x"><div class="g-c-R  webstore-test-button-label">' +
    ibText +
    '</div></div></div></div>';

  function waitForCreation(selector: any, callback: any) {
    const element = document.querySelector(selector);
    if (element != null) {
      callback(element);
    } else {
      setTimeout(() => {
        waitForCreation(selector, callback);
      }, 50);
    }
  }

  waitForCreation('.h-F-f-k.F-f-k', (element: any) => {
    element.addEventListener('DOMNodeInserted', (event: any) => {
      if (event.relatedNode != element) return;

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        new (InstallButton as any)(
          event.target.querySelector('.h-e-f-Ra-c.e-f-oh-Md-zb-k'),
        );
      }, 10);
    });
  });

  document.addEventListener('DOMNodeInserted', (event: any) => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      Array.from(document.getElementsByClassName('a-na-d-K-ea')).forEach(
        (el) => {
          el.parentNode.removeChild(el);
        },
      );
    }, 10);
  });

  function installPlugin(
    id: string,
    version = navigator.userAgent.match(/(?<=Chrom(e|ium)\/)\d+\.\d+/)[0],
  ) {
    window.location.href = baseUrl
      .replace('%VERSION', version)
      .replace('%ID', id);
  }

  function InstallButton(
    this: any,
    wrapper: any,
    id = document.URL.match(/(?<=\/)(\w+)(\?|$)/)[1],
  ) {
    if (wrapper == null) return;
    wrapper.innerHTML += ibTemplate;
    this.DOM = wrapper.children[0];

    /* Styling */
    this.DOM.addEventListener('mouseover', () => {
      this.DOM.className =
        'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-0c-td-jb-oa g-c g-c-l';
    });
    this.DOM.addEventListener('mouseout', () => {
      this.DOM.className = 'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c';
    });
    this.DOM.addEventListener('mousedown', () => {
      this.DOM.className =
        'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c g-c-Xc g-c-Sc-ci g-c-l g-c-Bd';
    });
    this.DOM.addEventListener('mouseup', () => {
      this.DOM.className =
        'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-0c-td-jb-oa g-c g-c-l';
    });
    this.DOM.addEventListener('click', () => {
      installPlugin(id);
    });
  }
};

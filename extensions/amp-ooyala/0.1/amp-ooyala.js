import {addParamsToUrl} from '../../../src/url';
import {isLayoutSizeDefined} from '../../../src/layout';
import {loadPromise} from '../../../src/event-helper';
import {user} from '../../../src/log';

class AmpOoyala extends AMP.BaseElement {

  /** @override */
  preconnectCallback(onLayout) {
    this.preconnect.url('https://player.ooyala.com');
  }

  /** @override */
  createPlaceholderCallback() {
    const placeholderUrl = this.element.getAttribute("data-placeholder");
    if (placeholderUrl) {
      const placeholder = this.getWin().document.createElement('div');
      placeholder.setAttribute('placeholder', '');
      const image = this.getWin().document.createElement('amp-img');

      image.setAttribute('src', placeholderUrl);
      image.setAttribute('layout', 'fill');

      placeholder.appendChild(image);
      return placeholder;
    } else {
      return null;
    }
  }

  /** @override */
  layoutCallback() {
    const iframe = this.element.ownerDocument.createElement('iframe');
    const width = this.element.getAttribute('width');
    const height = this.element.getAttribute('height');

    const embedCode = user.assert(
        this.element.getAttribute('data-embedcode'),
        'The data-embedcode attribute is required for <amp-ooyala> %s',
        this.element);
    const pCode = user.assert(
        this.element.getAttribute('data-pcode'),
        'The data-pcode attribute is required for <amp-ooyala> %s',
        this.element);
    const playerId = user.assert(
        this.element.getAttribute('data-playerid'),
        'The data-playerid attribute is required for <amp-ooyala> %s',
        this.element);

    let src = 'https://player.ooyala.com/iframe.html?platform=html5-priority';
    let playerVersion = this.element.getAttribute('data-playerversion') || '';
    if (playerVersion.toLowerCase() == 'v4') {
      src = 'https://player.ooyala.com/static/v4/stable/latest/skin-plugin/amp_iframe.html?pcode=' + pCode;
      let configUrl = this.element.getAttribute('data-config');
      if (configUrl) {
        src += "&options[skin.config]=" + configUrl;
      }
    }

    src += '&ec=' + embedCode + '&pbid=' + playerId;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('sandbox', "allow-scripts allow-popups allow-same-origin");
    iframe.src = src;
    this.applyFillContent(iframe);
    iframe.width = width;
    iframe.height = height;

    this.element.appendChild(iframe);
    return loadPromise(iframe);
  }

};

AMP.registerElement('amp-ooyala', AmpOoyala);
/* eslint-disable */
(function () {
    init();
    overlay();
    window.addEventListener('message', receiveMessage, false);
  })();
  
  function init() {
    sb.p = sb.p || {};
    sb.tq = window.parent.location.href.split('?')[1];
    for (p of sb.s) {
      sb.css = 'https://embed.subsbase.com/sb.min.css';
      sb.r = 'https://subscribe.subsbase.io';
      if (p[0] === 'siteId') sb.sid = p[1];
      if (p[0] === 'attachPlan') {
        sb.p[p[2]] = p[1];
        let planBtns;
        try {
          if (p[3] === 'class') {
            planBtns = Array.from(document.getElementsByClassName(p[2]));
          } else {
            planBtns = [document.getElementById(p[2])];
          }
          planBtns.forEach((btn) => btn.setAttribute('data-sb_plan', p[1]));
          planBtns.forEach((btn) =>
            btn.addEventListener(p[4] || 'click', openCheckout)
          );
        } catch (error) {
          console.warn(
            `Unable to attach plan with code ${p[1]}, make sure your configuration is set properly.`
          );
        }
      }
      if (p[0] === 'attachPlanPicker') {
        sb.pps = 'https://embed.subsbase.com/sb-pp.min.css';
        const config = p[1];
        const mobileConfig = p[2];
        attachPlanPicker(config, mobileConfig);
      }
      if (p[0] === 'callback') {
        sb.cb = p[1];
        sb.ac = p.length === 3 ? p[2] : false;
      }
      if (p[0] === 'theme') {
        sb.t = p[1].replace('#', '');
      }
      if (p[0] === 'queryParam') {
        sb.qp = sb.qp || [];
        if (p[1].includes('redirects')) {
          p[2] = encodeURIComponent(p[2]);
        }
        sb.qp = [[p[1], p[2]], ...sb.qp];
      }
      if (p[0] === 'inlinePlan') {
        const planCode = p[1];
        sb.p[p[2]] = planCode;
        let iframeContainer;
  
        try {
          if (p[3] === 'class') {
            iframeContainer = document.getElementsByClassName(p[2])[0];
          } else {
            iframeContainer = document.getElementById(p[2]);
          }
          setTimeout(() => {
            attachInlinePlan(iframeContainer, planCode);
          }, 0);
        } catch (error) {
          console.error(
            `Unable to attach plan with code ${planCode}, make sure your configuration is set properly.`
          );
        }
      }
    }
  }
  
  function receiveMessage(evt) {
    if (evt.origin === sb.r) {
      let { type, data } = evt.data;
      if (type === 'sb-checkout') {
        if (sb.ac) {
          setTimeout(closeOverlay, 500);
        }
        if (sb.cb) {
          sb.cb(data);
        }
      }
    }
  }
  
  function overlay() {
    requireCss(sb.css);
  
    const container = document.createElement('div');
    container.setAttribute('id', 'sb-overlay-div');
    container.setAttribute('class', 'sb-overlay-class');
    container.addEventListener('click', closeOverlay);
  
    const content = document.createElement('div');
    content.setAttribute('class', 'sb-overlay-content-class');
  
    const closeButton = document.createElement('a');
    closeButton.setAttribute('class', 'closebtn');
    closeButton.href = 'javascript:void(0)';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeOverlay);
  
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'sb--iframe');
    iframe.allowTransparency = 'true';
  
    const body = document.getElementsByTagName('body')[0];
  
    content.appendChild(closeButton);
    content.appendChild(iframe);
    container.appendChild(content);
    body.appendChild(container);
  }
  
  function openCheckout(e) {
    e.preventDefault();
    e.stopPropagation();
    const planCode = e.currentTarget.getAttribute('data-sb_plan');
    const theme = sb.t ? `&theme=${sb.t}` : '';
    const topQuery = sb.tq && sb.tq.length > 0 ? `&${sb.tq}` : '';
    const query =
      (sb.qp &&
        sb.qp.length > 0 &&
        sb.qp.reduce((a, c) => `${a}${c[0]}=${c[1]}&`, '&').slice(0, -1)) ||
      '';
    const src = `${sb.r}/${sb.sid}/${planCode}?embed=iframe${theme}${topQuery}${query}`;
    document.getElementById('sb--iframe').setAttribute('src', src);
    document.getElementById('sb-overlay-div').style.width = '100%';
  
    const html = document.getElementsByTagName('html')[0];
    html.classList.add('sb--overlay_open');
  }
  
  function closeOverlay() {
    const overlay = document.getElementById('sb-overlay-div');
    const subscribeBtn = document.getElementById('sb--subscribe__btn');
  
    overlay.style.width = '0';
  
    if (overlay.classList.contains('sb--plan_picker')) {
      overlay.classList.remove('sb--plan_picker');
    }
  
    if (subscribeBtn) {
      subscribeBtn.classList.remove('hidden');
    }
  
    const html = document.getElementsByTagName('html')[0];
    html.classList.remove('sb--overlay_open');
  }
  
  function requireCss(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.type = 'text/css';
    l.href = href;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(l);
  }
  
  /**
   * Plan Picker
   */
  function openPlanPicker(query) {
    const src = `${sb.r}/${sb.sid}${query}`;
  
    document.getElementById('sb--iframe').setAttribute('src', src);
    document.getElementById('sb-overlay-div').style.width = '100%';
    document.getElementById('sb-overlay-div').classList.add('sb--plan_picker');
    document.getElementById('sb--subscribe__btn').classList.add('hidden');
  
    const html = document.getElementsByTagName('html')[0];
    html.classList.add('sb--overlay_open');
  }
  
  function attachPlanPicker(config = {}, mobileConfig) {
    const defaultConfig = {
      text: 'Subscribe',
      shape: 'rectangle',
      icon: 'data:image/png;base64,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',
      textColor: '#f7b547',
      backgroundColor: '#20407d',
      position: 'right',
      alignment: 'center',
      uprightText: true,
      showDelay: 0,
      flashDelay: 0,
      planPicker: {
        disableGrouping: false,
        displayAll: true,
        expanded: false,
        collapsable: true,
        sortable: true,
        defaultSorting: 'price:ascending',
      },
    };
  
    if (
      mobileConfig &&
      typeof mobileConfig === 'object' &&
      window.innerWidth < 1024
    ) {
      config = mobileConfig;
    }
  
    const button = document.createElement('button');
    const textContent = document.createElement('span');
    const icon = document.createElement('img');
  
    button.classList.add('sb--subscribe__btn');
    button.id = 'sb--subscribe__btn';
    textContent.classList.add('sb--subscribe__btn_content');
    icon.classList.add('sb--subscribe__btn_icon');
  
    if (config.shape === 'circle') {
      button.classList.add('sb--shape__circle');
    } else {
      button.classList.add('sb--shape__rectangle');
    }
  
    if (config.position === 'left') {
      button.classList.add('sb--pos__left');
    } else {
      button.classList.add('sb--pos__right');
    }
  
    if (config.alignment === 'top') {
      button.classList.add('sb--align__top');
    } else if (config.alignment === 'bottom') {
      button.classList.add('sb--align__bottom');
    } else {
      button.classList.add('sb--align__center');
    }
    if (typeof config.uprightText === 'undefined') {
      button.classList.add('sb--text_align__upright');
    } else if (!config.uprightText) {
      button.classList.add('sb--text_align__normal');
    } else {
      button.classList.add('sb--text_align__upright');
    }
  
    button.style.backgroundColor =
      config.backgroundColor || defaultConfig.backgroundColor;
    button.style.color = config.textColor || defaultConfig.textColor;
  
    textContent.textContent = config.text || defaultConfig.text;
    icon.src = config.icon || defaultConfig.icon;
    icon.title = config.text || defaultConfig.text;
    icon.alt = config.text || defaultConfig.text;
  
    button.append(textContent);
    button.append(icon);
  
    if (config.showDelay && config.showDelay > 0) {
      setShowDelay(button, config.showDelay * 1000);
    }
    if (config.flashDelay && config.flashDelay > 0) {
      flash(button, config.flashDelay * 1000);
    }
  
    let query = '?';
  
    for (key in config.planPicker) {
      query += `${key}=${config.planPicker[key]}&`;
    }
  
    query = query.substr(0, query.length - 1);
  
    requireCss(sb.pps);
  
    button.addEventListener('click', () => openPlanPicker(query));
  
    if (window.innerWidth < 1024) {
      if (typeof mobileConfig === 'object' || !mobileConfig) {
        document.body.append(button);
      }
    } else {
      document.body.append(button);
    }
  }
  
  function setShowDelay(button, delay) {
    button.classList.add('hidden');
    setTimeout(() => {
      button.classList.remove('hidden');
    }, delay);
  }
  
  function flash(button, delay) {
    setTimeout(() => {
      button.classList.add('flash');
      setTimeout(() => {
        button.classList.remove('flash');
      }, 500);
    }, delay);
  }
  
  /**
   * Inline Checkout
   */
  function attachInlinePlan(container, planCode) {
    const theme = sb.t ? `?theme=${sb.t}` : '';
    const topQuery =
      sb.tq && sb.tq.length > 0 ? `${sb.t ? '&' : '?'}${sb.tq}` : '';
    const query =
      (sb.qp &&
        sb.qp.length > 0 &&
        sb.qp
          .reduce((a, c) => `${a}${c[0]}=${c[1]}&`, sb.t || sb.tq ? '&' : '?')
          .slice(0, -1)) ||
      '';
    const src = `${sb.r}/${sb.sid}/${planCode}${theme}${topQuery}${query}`;
    const iframe = document.createElement('iframe');
    iframe.classList.add('sb--inline-checkout_iframe');
    iframe.src = src;
    container.append(iframe);
  }
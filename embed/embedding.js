/* eslint-disable */
(function () {
  init();
  createIframe();
})();

function init() {
  sb.p = sb.p || {};
  sb.tq = window.parent.location.href.split("?")[1];
  for (p of sb.s) {
    sb.css = "../../assets/embed.css";
    sb.r = "https://subscribe.subsbase.io";
    // if (p[0] === 'siteId') sb.sid = p[1];
    if (p[0] === "url") sb.url = p[1];
    if (p[0] === "subscriberId") sb.subid = p[1];
    if (p[0] === "theme") sb.t = p[1];
    if (p[0] === "realmHeader") sb.realm = p[1];
    // if (p[0] === 'queryParam') {
    //   sb.qp = sb.qp || [];
    //   if (p[1].includes('redirects')) {
    //     p[2] = encodeURIComponent(p[2]);
    //   }
    //   sb.qp = [[p[1], p[2]], ...sb.qp];
    // }
  }
}

function createIframe() {
  const bellParent = document.getElementById("bell-parent");
  const bellContainer = document.createElement("div");
  const bellWrapper = document.createElement("div");
  bellContainer.id = "bellContainer";
  bellWrapper.id = "bellWrapper";
  bellContainer.appendChild(bellWrapper);
  bellParent.appendChild(bellContainer);
  const iframeBell = document.createElement("iframe");
  iframeBell.setAttribute("id", "nc-iframe-bell");
  iframeBell.allowTransparency = "true";
  iframeBell.style.border = "0";
  bellWrapper.addEventListener("click", () => openNcWindow());
  bellContainer.appendChild(iframeBell);

  const notificationWindowParent = document.getElementById(
    "notification-window"
  );
  const notificationWindowContainer = document.createElement("div");
  notificationWindowContainer.id = "notificationWindowContainer";
  notificationWindowParent.appendChild(notificationWindowContainer);
  const iframeNotification = document.createElement("iframe");
  iframeNotification.setAttribute("id", "iframeNotification");
  iframeNotification.allowTransparency = "true";
  iframeNotification.style.border = "0";
  notificationWindowContainer.appendChild(iframeNotification);

  loadNotificationsIndexPage();
  loadIframeBell();
}

function loadNotificationsIndexPage() {
  const notificationIndexParent = document.getElementById("notificationIndex");
  if (notificationIndexParent) {
    const iframeNotificationIndex = document.createElement("iframe");
    iframeNotificationIndex.setAttribute("id", "iframeNotificationIndex");
    iframeNotificationIndex.allowTransparency = "true";
    iframeNotificationIndex.style.border = "0";
    notificationIndexParent.appendChild(iframeNotificationIndex);
    iframeNotificationIndex.style.height = "100vh";
    iframeNotificationIndex.setAttribute("width", "100%");
    const src = `${sb.url}/notificationsIndex??subscriberId=${sb.subid}&themeID=${sb.t}`;
    iframeNotificationIndex.setAttribute("src", src);
  }
}
function openNcWindow() {
  if (document.getElementById("iframeNotification").getAttribute("src")) {
    document.getElementById("iframeNotification").setAttribute("src", "");
    iframeNotification.style.height = "0";
  } else {
    const src = `${sb.url}?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}`;
    document.getElementById("iframeNotification").setAttribute("src", src);
    iframeNotification.style.height = "600px";
  }
}

function loadIframeBell() {
  const src = `${sb.url}/notificationsBell?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}`;
  document.getElementById("nc-iframe-bell").setAttribute("src", src);
}

function requireCss(href) {
  var l = document.createElement("link");
  l.rel = "stylesheet";
  l.type = "text/css";
  l.href = href;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(l);
}
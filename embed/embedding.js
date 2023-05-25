/* eslint-disable */
(function () {
  init();
  createIframe();
})();
function init() {
  sb.p = sb.p || {};
  for (p of sb.s) {
    sb.css = "../../assets/embed.css";
    if (p[0] === "url") sb.url = p[1];
    if (p[0] === "subscriberId") sb.subid = p[1];
    if (p[0] === "realmHeader") sb.realm = p[1];
    if (p[0] === "theme") sb.t = p[1];
    if (p[0] === "attachBell") {
      sb.p.bell = sb.p.bell || {};
      sb.p["bell"]["type"] = p[1];
      sb.p["bell"][p[1]] = `${p[2]}`;
      try {
      } catch (error) {
        console.warn(
          `Unable to attach notification center to element with ${p[1]}, make sure your configuration is set properly.`
        );
      }
    }
  }
}

function createIframe() {
  const bellParent =
    sb.p.bell.type === "id"
      ? document.getElementById(sb.p.bell.id)
      : document.getElementsByClassName(sb.p.bell.class)[0];
  bellParent.style.position = "relative";
  bellParent.style.cursor = "pointer";

  const bellWrapper = document.createElement("div");
  bellWrapper.style.position = "absolute";
  bellWrapper.style.top = "0";
  bellWrapper.style.left = "0";
  bellWrapper.style.width = "100%";
  bellWrapper.style.height = "100%";
  bellParent.appendChild(bellWrapper);

  const iframeBell = document.createElement("iframe");
  iframeBell.setAttribute("id", "nc-iframe-bell");
  iframeBell.allowTransparency = "true";
  iframeBell.style.border = "0";
  iframeBell.style.overflow = "hidden";
  bellParent.appendChild(iframeBell);
  bellWrapper.addEventListener("click", function (e) {
    e.stopPropagation();
    openNcWindow();
  });

  window.addEventListener("message", function (e) {
    iframeBell.height = e.data.height;
    iframeBell.width = e.data.height;
    bellParent.style.height = e.data.height + "px";
    bellParent.style.width = e.data.height + "px";
  });

  const notificationWindowParent = document.createElement("div");
  notificationWindowParent.id = "notification-window";
  document.body.appendChild(notificationWindowParent);
  const iframeNotification = document.createElement("iframe");
  iframeNotification.id = "iframeNotification";
  notificationWindowParent.appendChild(iframeNotification);
  iframeNotification.allowTransparency = "true";
  iframeNotification.style.border = "0";
  notificationWindowParent.style.display = "none";
  loadNotificationsIndexPage();
  loadIframeBell();
  setTimeout(() => {
    getBellPosition();
  }, 700);
  window.addEventListener("resize", getBellPosition);
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
    const src = `${sb.url}/notificationsIndex?subscriberId=${sb.subid}&themeID=${sb.t}`;
    iframeNotificationIndex.setAttribute("src", src);
  }
}

function openNcWindow() {
  const notificationIndexParent = document.getElementById(
    "notification-window"
  );
  if (document.getElementById("iframeNotification").getAttribute("src")) {
    document.getElementById("iframeNotification").setAttribute("src", "");
    iframeNotification.style.height = "0";
    notificationIndexParent.style.display = "none";
  } else {
    const src = `${sb.url}?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}`;
    document.getElementById("iframeNotification").setAttribute("src", src);
    notificationIndexParent.style.display = "block";
    iframeNotification.style.height = "430px";
    iframeNotification.style.width = "450px";
    iframeNotification.style.position = "fixed";
    iframeNotification.style.zIndex = "1100";
  }

  document.addEventListener("click", function (event) {
    const targetElement = event.target;
    // Check if the clicked element is outside the notification div
    if (!iframeNotification.contains(targetElement)) {
      iframeNotification.setAttribute("src", "");
      iframeNotification.style.height = "0";
      document.removeEventListener("click", arguments.callee);
    }
  });
}

function loadIframeBell() {
  const src = `${sb.url}/notificationsBell?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}`;
  document.getElementById("nc-iframe-bell").setAttribute("src", src);
}

function getBellPosition() {
  const bellRect = document
    .getElementById("nc-iframe-bell")
    .getBoundingClientRect();
  const iframeNotification = document.getElementById("iframeNotification");

  const topPosition = bellRect.bottom + "px";
  const leftPosition = bellRect.left - 410 + "px";

  iframeNotification.style.top = topPosition;
  iframeNotification.style.left = leftPosition;
}

function requireCss(href) {
  var l = document.createElement("link");
  l.rel = "stylesheet";
  l.type = "text/css";
  l.href = href;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(l);
}

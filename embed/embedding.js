/* eslint-disable */
(function () {
  init();
  createIframe();
})();
function init() {
  sb.p = sb.p || {};
  for (p of sb.s) {
    if (p[0] === "url") sb.url = p[1];
    if (p[0] === "subscriberId") sb.subid = p[1];
    if (p[0] === "realm") sb.realm = p[1];
    if (p[0] === "theme") sb.t = p[1];
    if (p[0] === "allNotifications") sb.notifRoute = p[1];
    if (p[0] === "iconOptions") {
      sb.iconOptions = sb.iconOptions || {};
      if (sb["iconOptions"][p[2]] === "auto") {
        sb["iconOptions"][p[1]] = "auto";
      } else {
        sb["iconOptions"][p[1]] = p[2];
      }
    }
    if (p[0] === "attachIcon") {
      sb.p.icon = sb.p.icon || {};
      sb.p["icon"]["type"] = p[1];
      sb.p["icon"][p[1]] = `${p[2]}`;
      try {
      } catch (error) {
        console.warn(
          `Unable to attach notification center to element with ${p[1]} ${p[2]}, make sure your configuration is set properly.`
        );
      }
    }
  }
}

function createIframe() {
  const iconParent =
    sb.p.icon.type === "id"
      ? document.getElementById(sb.p.icon.id)
      : document.getElementsByClassName(sb.p.icon.class)[0];
  iconParent.style.position = "relative";
  iconParent.style.cursor = "pointer";

  const iconWrapper = document.createElement("div");
  iconWrapper.style.position = "absolute";
  iconWrapper.style.top = "0";
  iconWrapper.style.left = "0";
  iconWrapper.style.width = "100%";
  iconWrapper.style.height = "100%";
  iconParent.appendChild(iconWrapper);

  const iframeIcon = document.createElement("iframe");
  iframeIcon.setAttribute("id", "nc-iframe-icon");
  iframeIcon.allowTransparency = "true";
  iframeIcon.style.border = "0";
  iframeIcon.style.overflow = "hidden";
  iconParent.appendChild(iframeIcon);
  iconWrapper.addEventListener("click", function (e) {
    e.stopPropagation();
    openNcWindow();
  });
  if (sb.iconOptions.height === "auto") {
    window.addEventListener("message", function (e) {
      iframeIcon.height = e.data.height;
      iframeIcon.width = e.data.height;
      iconParent.style.height = e.data.height + "px";
      iconParent.style.width = e.data.height + "px";
    });
  } else {
    iframeIcon.height = sb.iconOptions.height;
    iframeIcon.width = sb.iconOptions.width;
    iconParent.style.height = sb.iconOptions.height + "px";
    iconParent.style.width = sb.iconOptions.width + "px";
  }

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
  loadiframeIcon();
  setTimeout(() => {
    getIconPosition();
  }, 700);
  window.addEventListener("resize", getIconPosition);
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
    const src = `${sb.url}/notificationsIndex?subscriberId=${sb.subid}&themeID=${sb.t}&allNotifications=${sb.notifRoute}`;
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
    const src = `${sb.url}?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}&allNotifications=${sb.notifRoute}`;
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

function loadiframeIcon() {
  const src = `${sb.url}/notificationsicon?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}&allNotifications=${sb.notifRoute}`;
  document.getElementById("nc-iframe-icon").setAttribute("src", src);
}

function getIconPosition() {
  const iconRect = document
    .getElementById("nc-iframe-icon")
    .getBoundingClientRect();
  const iframeNotification = document.getElementById("iframeNotification");

  const topPosition = iconRect.bottom + "px";
  const leftPosition = iconRect.left - 410 + "px";

  iframeNotification.style.top = topPosition;
  iframeNotification.style.left = leftPosition;
}

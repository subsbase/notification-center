/* eslint-disable */
(function () {
  init();
  createIframe();
})();
function init() {
  sb.p = sb.p || {};
  for (p of sb.s) {
    if (p[0] === "url") sb.url = p[1];
    if (p[0] === "serverUrl") sb.serverUrl = p[1];
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
    if (p[0] === "attachAllNotificationsPage") {
      sb.p.allNotifications = sb.p.allNotifications || {};
      sb.p["allNotifications"]["type"] = p[1];
      sb.p["allNotifications"][p[1]] = `${p[2]}`;
      try {
      } catch (error) {
        console.warn(
          `Unable to attach all notifications page to element with ${p[1]} ${p[2]}, make sure your configuration is set properly.`
        );
      }
    }
  }
}

function createIframe() {
  if (sb.p?.allNotifications) {
    const allNotificationsParent =
      sb.p.allNotifications.type === "id"
        ? document.getElementById(sb.p.allNotifications.id)
        : document.getElementsByClassName(sb.p.allNotifications.class)[0];
    openAllNotificationsPage(allNotificationsParent);
  }
  const iconParent =
    sb.p.icon?.type === "id"
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
  if (!document.getElementById("notification-window")) {
    notificationWindowParent.id = "notification-window";
    document.body.appendChild(notificationWindowParent);
    loadNotificationsIndexPage();
  }
  loadiframeIcon();
  setTimeout(() => {
    getIconPosition();
  }, 700);
  window.addEventListener("resize", getIconPosition);
}

function loadNotificationsIndexPage() {
  const notificationIndexParent = document.getElementById(
    "notification-window"
  );
  if (notificationIndexParent) {
    const iframeNotificationIndex = document.createElement("iframe");
    iframeNotificationIndex.setAttribute("id", "iframeNotificationIndex");
    iframeNotificationIndex.allowTransparency = "true";
    iframeNotificationIndex.style.border = "0";
    notificationIndexParent.appendChild(iframeNotificationIndex);
    notificationIndexParent.style.display = "none";
    iframeNotificationIndex.style.height = "0";
    iframeNotificationIndex.setAttribute("width", "100%");
  }
}

function openNcWindow() {
  const notificationIndexParent = document.getElementById(
    "notification-window"
  );
  const notificationWindow = document.getElementById("iframeNotificationIndex");
  if (notificationWindow.getAttribute("src")) {
    notificationWindow.setAttribute("src", "");
    notificationWindow.style.height = "0";
    notificationIndexParent.style.display = "none";
  } else {
    const src = `${sb.url}?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}&allNotifications=${sb.notifRoute}&serverUrl=${sb.serverUrl}`;
    notificationWindow.setAttribute("src", src);
    notificationIndexParent.style.display = "block";
    notificationWindow.style.height = "550px";
    notificationWindow.style.overflow = "hidden";
    notificationWindow.style.width = "450px";
    notificationWindow.style.position = "fixed";
    notificationWindow.style.zIndex = "1100";
  }

  document.addEventListener("click", function (event) {
    const targetElement = event.target;
    // Check if the clicked element is outside the notification div
    if (!notificationWindow.contains(targetElement)) {
      notificationWindow.setAttribute("src", "");
      notificationWindow.style.height = "0";
      document.removeEventListener("click", arguments.callee);
    }
  });
}

function openAllNotificationsPage(parent) {
  const src = `${sb.url}/notificationsIndex?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}&serverUrl=${sb.serverUrl}`;
  const iframeAllNotifications = document.createElement("iframe");
  iframeAllNotifications.setAttribute("id", "iframeAllNotifications");
  iframeAllNotifications.setAttribute("src", src);
  iframeAllNotifications.allowTransparency = "true";
  iframeAllNotifications.style.border = "0";
  iframeAllNotifications.style.height = "100%";
  iframeAllNotifications.style.width = "100%";
  parent.appendChild(iframeAllNotifications);
}
function loadiframeIcon() {
  const src = `${sb.url}/notificationsicon?subscriberId=${sb.subid}&themeID=${sb.t}&realmHeader=${sb.realm}&allNotifications=${sb.notifRoute}&serverUrl=${sb.serverUrl}`;
  document.getElementById("nc-iframe-icon").setAttribute("src", src);
}

function getIconPosition() {
  const iconRect = document
    .getElementById("nc-iframe-icon")
    .getBoundingClientRect();
  const iframeNotification = document.getElementById("iframeNotificationIndex");

  const topPosition = iconRect.bottom + "px";
  const leftPosition = iconRect.left - 410 + "px";

  iframeNotification.style.top = topPosition;
  iframeNotification.style.left = leftPosition;
}

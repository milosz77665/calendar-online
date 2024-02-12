function pushNotification() {
  self.addEventListener("push", function (event) {
    const notificationData = event.data.json();
    const title = notificationData.title;
    const options = {
      body: notificationData.body,
      icon: "/icon.png",
      tag: notificationData.tag,
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
}

pushNotification();

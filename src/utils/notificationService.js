export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  return permission;
}

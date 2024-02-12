export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported by this browser");
    return;
  }
  try {
    await navigator.serviceWorker.register("/serviceWorker.js");
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
}

export function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported by this browser");
  }
  return navigator.serviceWorker.ready;
}

export async function requestLocationPermissions(): Promise<boolean> {
  return false;
}

export async function startBackgroundTracking(): Promise<boolean> {
  return false;
}

export async function stopBackgroundTracking(): Promise<void> {}

export async function isTrackingActive(): Promise<boolean> {
  return false;
}

export async function getCurrentLocation(): Promise<null> {
  return null;
}

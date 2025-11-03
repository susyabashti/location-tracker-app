export const ALERT_LOCATION_TITLE = 'Location Access Required';
export const ALERT_LOCATION_DESC =
  'This app needs location access to function properly. Please enable it in Settings.';

export const ALERT_BACKGROUND_LOCATION_TITLE =
  'Background Location Access Required';
export const ALERT_BACKGROUND_LOCATION_DESC =
  'Go to Settings → Location → Your App → Allow all the time';

export const STATIONARY_NOTIFICATION_CHANNEL = {
  id: 'stationary-alerts',
  name: 'Stationary Alerts',
};
export const STATIONARY_NOTIFICATION_SETTINGS = {
  id: 'stop-tracking',
  title: "Hey, you've been still for a while!",
  body: 'Tap to stop location tracking.',
  channelId: STATIONARY_NOTIFICATION_CHANNEL.id,
};

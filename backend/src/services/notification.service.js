/**
 * Notification service — emits socket events.
 * Extend with push notifications (FCM, APNS) as needed.
 */
const sendOrderNotification = (io, event, payload) => {
  if (!io) return;
  io.emit(event, payload);
  console.log(`[Socket] Emitted '${event}':`, payload?.orderNumber || payload?.orderId);
};

module.exports = { sendOrderNotification };

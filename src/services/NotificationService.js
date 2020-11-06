import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';

class NotificationService {
  /* 
    Get notifications when refresh f5 page
    string currentUserId
    number limit
  */
  getNotifications(currentUserId, limit = 10){
    return new Promise(async (resolve, reject) => {
      try {
        let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);
        let getNotifContent = notifications.map(async (notification) => {
          let sender = await UserModel.findUserById(notification.senderId);
          return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
        });

        resolve(await Promise.all(getNotifContent));
      } catch (error) {
        reject(error);
      }
    })
  };
}

module.exports = new NotificationService

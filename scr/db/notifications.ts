import mongoose from "mongoose"



const NotificationSchema = new mongoose.Schema({
    // User reference
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Notifications for user
    notifications: [
      {
        type: { type: String, required: true },
        data: { type: Object, required: true },
      },
    ],
  });
  

// Exporting the Notification model
export const NotificationModel = mongoose.model('Notification', NotificationSchema);

// Attempt to find the notification by a user id
export const getUserNotification = (id: string) => NotificationModel.findOne({ user: id });

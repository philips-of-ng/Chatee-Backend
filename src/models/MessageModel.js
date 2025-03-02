const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  message: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);

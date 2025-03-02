import mongoose from 'mongoose'

const otpschema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
})

export default mongoose.model('OTP', otpschema)

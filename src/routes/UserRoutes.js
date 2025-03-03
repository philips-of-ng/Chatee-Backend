import express from 'express'
import { getUsers, getUserByEmail, sendAccountCreationOtp, verifyAccountCreationOtp, getUserByUsername } from '../controllers/UserController.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/get-user-by-email', getUserByEmail)
router.post('/cru-otp', sendAccountCreationOtp)
router.post('/vcru-otp', verifyAccountCreationOtp)
router.get('/get-user-by-username', getUserByUsername)

// router.post('/reset-password', resetPassword)
// router.patch('/change-password/:email', changePassword_ResetMode)

// router.post('/', createUser)

// router.post('/login', loginUser)

export default router




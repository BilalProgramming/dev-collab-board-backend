
import { userSignup, userLogin ,userLogout,currentUserInfo} from '../controllers/userController'
import express from 'express'
import { body } from 'express-validator'

const router = express.Router()

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], userSignup)
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.get('/me', currentUserInfo)

export default router
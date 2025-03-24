import express from 'express';
import { registerUser, loginUser, sendFriendRequest, acceptFriendRequest, getFriendRecommendations } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/send-request', sendFriendRequest);
router.post('/accept-request', acceptFriendRequest);
router.get('/recommend/:userId', getFriendRecommendations);

export default router;

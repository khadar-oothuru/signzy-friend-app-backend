import express from 'express';
import { 
    registerUser, 
    loginUser, 
    sendFriendRequest, 
    acceptFriendRequest, 
    removeFriend,
    getFriendRecommendations,
    updateProfile,
    friendList,
    getFriendRequests,
    searchUsers
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

router.post('/send-request', sendFriendRequest);
router.post('/accept-request', acceptFriendRequest);
router.post('/remove-friend', removeFriend);

router.get('/recommend/:userId', getFriendRecommendations);
router.get('/:userId/friends', friendList);
router.put('/:userId', updateProfile);
router.get('/:userId/requests', getFriendRequests);
router.get("/search", searchUsers);

export default router;

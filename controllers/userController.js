import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        const receiver = await User.findById(receiverId);
        if (!receiver.friendRequests.includes(senderId)) {
            receiver.friendRequests.push(senderId);
            await receiver.save();
        }
        res.json({ message: 'Friend request sent' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            friend.friends.push(userId);
            user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
            await user.save();
            await friend.save();
        }
        res.json({ message: 'Friend request accepted' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove Friend
export const removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) return res.status(404).json({ message: 'User not found' });

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.json({ message: 'Friend removed successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Friend List
export const friendList = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('friends', 'username email');
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Friend Requests
export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('friendRequests', 'username email');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.friendRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Friend Recommendations
export const getFriendRecommendations = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('friends');
        const allUsers = await User.find({ _id: { $ne: userId } });

        const recommended = allUsers.filter(u =>
            u.friends.some(f => user.friends.includes(f)) || !user.friends.includes(u._id)
        );

        res.json(recommended);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username) user.username = username;
        if (email) user.email = email;
        if (password && password.length > 5) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search Users
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("-password");

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

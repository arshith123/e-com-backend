import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { genrateToken } from "../utils/generateToken.js";


export const createUser = async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;

        if (!username || !email || !password || !mobile) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            mobile
        });

        await user.save();

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const validateUser = async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'User Name and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = genrateToken(user.id);

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
            },
            token,
        });


    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
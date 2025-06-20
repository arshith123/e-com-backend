import jwt from "jsonwebtoken";


const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ status: false, message: "Forbidden: Invalid token" });

        req.user = user;
        next();
    });
};

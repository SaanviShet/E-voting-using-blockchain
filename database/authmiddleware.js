const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided, access denied!" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    if (!token) {
        return res.status(401).json({ error: "Token missing, access denied!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token!" });
        }

        req.user = user; // Attach user data to request for further use
        next();
    });
}

module.exports = authenticateToken;

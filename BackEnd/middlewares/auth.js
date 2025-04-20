
const jwt = require("jsonwebtoken")

// verifytoken middleware 
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.MY_SECRET_KEY, (err, decoded) => {
        if(err) return res.status(401).json({message: "Invalid Token."})
        req.user = decoded

        next()
    })
}

// allowroles middleware
exports.allowRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // Trim and normalize case just to be sure
        const userRole = req.user.role.trim().toLowerCase();
        const normalizedRoles = allowedRoles.map(role => role.trim().toLowerCase());
        if(!normalizedRoles.includes(userRole)){
            console.log("Access Denied: Role mismatch");
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }

        next();
    };
};

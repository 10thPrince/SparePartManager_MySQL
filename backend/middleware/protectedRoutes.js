
export const protect = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "Unauthorized, You Don't have Access!"
        })
    }


}
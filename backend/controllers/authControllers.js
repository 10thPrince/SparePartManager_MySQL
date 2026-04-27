import {db} from '../config/db.js'

export const register = (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all Required Fileds"
            })
        }

        const q = "SELECT * from users WHERE Email = ?"
        db.query(q, [email], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }
            // Email do not exist
            if (result.length === 0) {

                const q = "INSERT INTO users (UserName, Email, Password) VALUES (?, ?, ?)";
                db.query(q, [name, email, password], (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }
                    res.status(201).json({
                        success: true,
                        message: "User Registered Successfully!"
                    })

                })
            }

            // email exist
            if (result.length !== 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email Already Exist Please Login Instead!"
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            data: error
        })
    }
}

export const login = (req, res) => {
    try {
        
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields!"
            })
        }

        const q = "SELECT * FROM users WHERE Email = ?";
        db.query(q, [email], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            // email do not exist
            if(result.length === 0){
                return res.status(400).json({
                    success: false,
                    message: "Please Register Email don't exist!"
                })
            }
            // email exist
            if(result.length !== 0){
                const match = result[0].Password == password ? true : false

                if(!match){
                    return res.status(400).json({
                        success: false,
                        message: "Pasuwadi siyo wamuginga weee!"
                    })
                }

                req.session.user = {
                    id: result[0].UserId,
                    username: result[0].UserName
                }

                res.status(200).json({
                    success: true,
                    message: "Wagezemo shaaa!",
                    user: req.session.user
                })
            }
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            data: error
        })
    }
}

export const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: "Logout Failed!"
                })
            }

            res.clearCookie('sid');

            res.status(200).json({
                success: true,
                message: "Logout Successfully!"
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            data: error
        })
    }
}


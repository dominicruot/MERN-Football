import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmpty from 'is-empty';
import validator from 'validator'
import keys from "../config/key.js";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({ msg: "Registered!" });
    } catch (error) {
        console.log(error);
    }
}

// export const Login = async (req, res) => {
//     try {
//         function validateLoginInput(data) {
//             let errors = {};

//             // Convert empty fields to an empty string so we can use validator functions
//             data.email = !isEmpty(data.email) ? data.email : "";
//             data.password = !isEmpty(data.password) ? data.password : "";

//             //Email Checks
//             if (validator.isEmpty(data.email)) {
//                 errors.email = res.status(400).json({ msg: "Email field is required" });
//             } else if (!validator.isEmail(data.email)) {
//                 errors.email = res.status(400).json({ msg: "Email is Invalid" });
//             }

//             //Password Checks
//             if (validator.isEmpty(data.password)) return errors.password = res.status(400).json({ msg: "Password field is required" });

//             return {
//                 errors,
//                 isValid: isEmpty(errors)
//             };
//         }
//         const { errors, isValid } = validateLoginInput(req.body);

//         // Check validation
//         if (!isValid) return console.log(errors);


//         const email = req.body.email;
//         const password = req.body.password;

//         // Find user by email
//         await Users.findOne({ email }).then(user => {
//             // Check if user exists
//             if (!user) {
//                 return res.status(404).json({ msg: "Email not found" });
//             }

//             // Check password
//             bcrypt.compare(password, user.password).then(isMatch => {
//                 if (isMatch) {
//                     // User matched
//                     // Create JWT Payload
//                     const Payload = {
//                         id: user.id,
//                         name: user.name,
//                     };

//                     // Sign token
//                     jwt.sign(
//                         Payload,
//                         keys.secretOrKey,
//                         {
//                             expiresIn: '1d'
//                         },
//                         (err, token) => {
//                             res.json({
//                                 success: true,
//                                 token: "Bearer " + token
//                             });
//                         }
//                     );
//                     res.json({ Payload });

//                 } else {
//                     return res
//                         .status(400)
//                         .json({ msg: "Password incorrect" });
//                 }
//             });

//         });

//     } catch (error) {
//         res.status(404).json({ msg: "an error occured!" });
//         console.log(error)

//     }
//     // Form validation
//     //Login Validator



// }

export const Login = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;

        const password = req.body.password;
        const user = await Users.findOne({
            where: {
                email: email,
                password: password
            }
        });
        // const match = await bcrypt.compare(req.body.password, user.password);
        // if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = user.id;
        // const name = user[0].name;
        // const email = user[0].email;
        const userEmail = await Users.findOne({ email })
        if (!userEmail) return res.status(404).json({ msg: "Email not found" });


        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "an error occured!" });
        console.log(error)
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findOne({
        refresh_token: refreshToken

    });
    if (!user) return res.sendStatus(204);
    const userId = user.id;
    await Users.updateOne({ refresh_token: null }, {

        id: userId
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}
const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require('express-validator');


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret ="ThisisgofoodappbyBaji"
router.post("/createuser", body("email").isEmail(), body("name").isLength({ min: 4 }), body("password", "Invalid Password Mawa").isLength({ min: 6 }), async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {


        User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            location: req.body.location
        })
        res.json({ success: true });
    } catch (error) {
        res.json({ success: true });

    }

})



router.post("/loginuser", [body("email").isEmail(), body("password", "Invalid Password Mawa").isLength({ min: 6 })], async (req, res) => {
    let email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }

    try {


        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ err: "Wrong Email" });
        }
        const pwd = await bcrypt.compare(req.body.password,userData.password);
        if (!pwd) {
            return res.status(400).json({ err: "Wrong Password" });

        }
        const data={
            user:{
                id:userData.id
            }
        }

        const authToken =jwt.sign(data,jwtSecret)
        return res.json({ success: true, authToken:authToken });


    } catch (error) {
        res.json({ success: false });

    }

})


module.exports = router;
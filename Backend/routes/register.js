const express = require('express');
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();

router.post("/register",async (req,res) => {
    try{

        const {name , email , password} = req.body;

        const emailCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if(emailCheck.rows.length > 0){
            return res.status(400).json({
                error:"User With This Email alerdy exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
            [name, email, hashedPassword]
        );

        res.json({
        message: "Registered successfully"
        });

    } catch(err) {
        console.log(err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

module.exports = router;

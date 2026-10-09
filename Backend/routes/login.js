const express = require('express');
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();

router.post('/login',async (req,res) => {
    try{
        const {email,password} = req.body;

        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if(userCheck.rows.length === 0){
            return res.status(400).json({
                error:"Invalid Email or Password"
            });
        }

        const user = userCheck.rows[0];

        const validPassword = await bcrypt.compare(password,user.password);

        if(!validPassword){
            return res.status(400).json({
            error:"Invalid Email or Password"
            }); 
        }

        res.json({
        message: "Login successful",
        user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({error : "Server error During Login"});
    }
})

module.exports = router;
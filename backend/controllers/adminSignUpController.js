const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin= require('../models/adminModel')

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await admin.findByEmail(email);

        if (!existing) return ({ message: "User not found" })
        const match =await bcrypt.compare(password, existing.password)
        if (!match) return ({ message: "Invalid password" })
        const token = jwt.sign({ id: existing.id, email: existing.email }, process.env.JWT_SECRET, { expiresIn: "1h",algorithm: 'HS256' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 100
        })
        res.status(200).json({ message: "Login successful" })
    } catch (error) {
        console.error('Error during user authentication:', error)
        res.status(500).json({ message: "Internal server errror" })
    }
}

const signUp = async (req, res) => {
    try {
        const { email, password } = req.body

        const existing = await admin.findByEmail(email);
        if (existing) {
            return res.status(400).json({ message: "EMail is already in use" })
        }

        const hashed = await bcrypt.hash(password, 10)

        const newAdmin = await admin.create({
            email, password: hashed
        })

        const token = jwt.sign({ id: newAdmin.id, email: newAdmin.email }, process.env.JWT_SECRET, { 
            expiresIn: '1h',
        algorithm: 'HS256'
    })

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 100
        })

        console.log('Signup Succeess')
        res.status(200).json({ message: "Signup successful" })
    } catch (error) {
        console.error('Error in signup process', error)
        res.status(500).json({ error: "Internal Server errror" })
    }
}

module.exports ={signUp, login}
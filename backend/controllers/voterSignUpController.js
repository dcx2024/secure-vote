const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')
const voter= require('../models/votersModel')

const signup= async(req,res)=>{
    try{
        const {full_name,phone_no,visitor_id}= req.body
        const ip = req.ip;
        

        const newVoter= await voter.create({
            full_name,
            phone_no,
          visitor_id,
            ip_address: ip
        })

        const token=jwt.sign({id: newVoter.id,ip_address: newVoter.ip_address,visitor_id: newVoter.visitor_id}, process.env.JWT_SECRET, {expiresIn: '1h'})
       /* localStorage.setItem('token',token)*/
        console.log('Signup successful')
        res.status(200).json({message:"SIngup successful"})

    }catch(error){
        console.error('Error in signup process', error)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports={signup}
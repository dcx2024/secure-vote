const knex=require('../config/db')
const jwt= require('jsonwebtoken')
const voter= require('../models/votersModel')

const signup= async(req,res)=>{
    try{
        const {full_name,phone_no,visitor_id}= req.body
        const ip =req.headers['x-real-ip'] || req.ip;
        
        const existingVoter = await knex('voters').where({full_name,phone_no}).first()
        if(existingVoter){
            console.log('This user has already signed in and voted')
            return res.status(400).json({error: "This user has already signed in and voted"})
        }

        const newVoter= await voter.create({
            full_name,
            phone_no,
          visitor_id,
            ip_address: ip
        })

        const token=jwt.sign({id: newVoter.id,ip_address: newVoter.ip_address,visitor_id: newVoter.visitor_id}, process.env.JWT_SECRET, {expiresIn: '1h',algorithm:'HS256'})
        res.cookie('voterToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 100
        })
        
        console.log('Signup successful')
        res.status(200).json({message:"Signup successful"})

    }catch(error){
        console.error('Error in signup process', error)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports={signup}
const express = require('express')
const router = express.Router()
const {signup}=require('../controllers/voterSignUpController')
const voteController=require('../controllers/voteController')
const {authentication,voterAuth} = require('../middleware/authMiddleware')
router.post('/voterLogin',signup)
router.post('/castVote',voterAuth,voteController.castVote)

router.get('/result',authentication,voteController.getPollResults)
module.exports= router;
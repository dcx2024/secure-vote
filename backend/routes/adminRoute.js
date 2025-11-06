const express=require('express')
const router=express.Router()
const {signUp, login} = require('../controllers/adminSignUpController')

const {upload}= require('../middleware/awsUpload')
const {authentication}=require('../middleware/authMiddleware')
const {createPoll,
  generateShareLink,
  fetchSharedPolls,
  fetchPollsByAdmin} = require('../controllers/pollController')

router.post('/signup',signUp)
router.post('/login', login)

router.post('/createPoll',authentication, upload.array('candidateImages'), createPoll)
router.get('/adminPolls',authentication, fetchPollsByAdmin)

router.post('/share',authentication, generateShareLink)
router.get('/share/:token', fetchSharedPolls)
module.exports =router
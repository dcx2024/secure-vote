const express=require('express')
const cookieParser = require("cookie-parser");
const cors=require('cors')
const path=require('path')
const app = express()
const voter=require('./routes/voterRoute')
const admin=require('./routes/adminRoute')
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())
app.use(cors({
    origin: 'https://secure-vote-frontend-11q2.onrender.com/',
    credentials: true
}))

app.use('/voter',voter)
app.use('/admin',admin)
app.listen(3000,()=>console.log('Server running on port 3000'))
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const voter = require('./routes/voterRoute');
const admin = require('./routes/adminRoute');


// Optional: only if your frontend is on a different domain
 app.use(cors({
   origin: 'http://localhost:8080',
   credentials: true
 }));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('trust proxy', true)
// Routes
app.use('/api/voter', voter);
app.use('/api/admin', admin);





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

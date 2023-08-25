const express=require('express');
const connectDB = require('./config/database')
const bodyparser=require('body-parser');
const nodemailer=require('nodemailer');
const path=require('path');
const sendMail = require('./routes/otp')

const app=express();

require('dotenv').config({ path: './config/.env' })
connectDB()

// view engine setup
app.set('view engine','ejs');

// body parser middleware
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());


//static folder
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use('/', sendMail)


const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
})
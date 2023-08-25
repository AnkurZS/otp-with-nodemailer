const { render } = require('ejs')
const nodemailer=require('nodemailer');
const Signup = require('../models/Signup')
require('dotenv').config({ path: './config/.env' })

let email
let otp
let otpTimestamp

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    service: 'Gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
});

module.exports = {
    getOTP: (req, res) => {
        try{
            res.render('contact')
        }catch(err){
            console.error(err)
        }
    },

    sendOTP: async (req, res) => {
        try{    
            otp = Math.random();
            otp = otp * 1000000;
            otp = parseInt(otp);

            otpTimestamp = Date.now() 

            await Signup.create({
                email: req.body.email,
                firstname: req.body.firstname,
                pass: req.body.pass,
                phone: req.body.phone,
                otp,
                otpTimestamp
            })
            firstname=req.body.firstname


            // send mail with defined transport object
            const mailOptions={
                to: req.body.email,
                subject: `Otp for registration is: ${otp}`,
                html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
                    </div>
                    <p style="font-size:1.1em">Hi ${firstname},</p>
                    <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Your Brand Inc</p>
                    <p>1600 Amphitheatre Parkway</p>
                    <p>California</p>
                    </div>
                </div>
                </div>` // html body
                };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);   
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
                res.render('otp',
                    {
                        msg:"otp has been sent",
                        email: req.body.email,
                    },                    
                );
            });
        }catch(err){
            console.error(err)
        }
    },    


    verifyOTP: async (req, res) => {
        let userEnteredOtp = req.body.otp;
        let userEmail = req.body.email;

        let user = await Signup.find({ email: userEmail })
        let otpTimestampFromDB = user[0].otpTimestamp

        console.log(user)
        console.log(otpTimestamp)
        console.log(otpTimestampFromDB)

        // Check if OTP data exists and is within 5 minutes
        // if (otpTimestampFromDB && (Date.now() - otpTimestampFromDB <= 2 * 60 * 1000)) {
        //     if (userEnteredOtp == otp) {
        //         // Valid OTP
        //         res.render('success');
        //     } else {
        //         // Invalid OTP
        //         res.render('otp', { 
        //             msg: 'otp is incorrect',
                   
        //         });
        //     }
        // } else {
        //     // OTP expired
        //     res.render('otp', { 
        //         msg: 'otp has expired',
        //         email: req.body.email, 
        //     });
        // }
    },

    resendOTP:  (req, res) => {
        // email=req.body.email;
        // firstname=req.body.firstname

        let email = req.body.email

        otp = Math.random();
        otp = otp * 1000000;
        otp = parseInt(otp);

        
        const mailOptions={
            to: email,
            subject: `Otp for registration is: ${otp}`,
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
                </div>
                <p style="font-size:1.1em">Hi ${firstname},</p>
                <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Your Brand Inc</p>
                <p>1600 Amphitheatre Parkway</p>
                <p>California</p>
                </div>
            </div>
            </div>` // html body
            };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            res.render('otp',{
                msg:"otp has been sent",
                email: req.body.email,
            });
        });
    },
}
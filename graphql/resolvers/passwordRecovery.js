const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../../models/User');
const {UserInputError, ApolloError} = require('apollo-server');

const { validateEmailInput } = require('../../utils/validators');
const { getMaxListeners } = require('../../models/User');


module.exports = {
    Mutation: {
        async recover(_, { email }){
            
            const{valid, errors} = validateEmailInput(email)

            if(!valid){
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ email })

            if(!user){
                throw new ApolloError('Email not found', 'BAD_INPUT', {errors: { email: 'Provide a valid email' }});
            }

            const token = crypto.randomBytes(20).toString('hex')

            await user.updateOne({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 360000
            })


            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: 'chrisprtesting@gmail.com',
                  pass: '8U@BW*P;vQ/x=X&($nRC',
                },
            });
            
            let message = {
                from: 'chrisprtesting@gmail.com', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: 'Hi! You or someone else requested to reset your password click this link to proceed, \n\n' + `http://localhost:3004/reset/${token} \n\n`, // plain text body
                html: "<b>Hi! You or someone else requested to reset your password click this to proceed</b> " + `http://localhost:3004/reset/${token}`, // html body TODO!!!! send to right link and finish 
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return process.exit(1);
                }
        
                console.log(info);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            
        }
    }
    
}


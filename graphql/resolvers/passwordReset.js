

const bcrypt = require('bcryptjs');
const {UserInputError, ApolloError} = require('apollo-server')

const { validatePasswordInput } = require('../../utils/validators')
const User = require('../../models/User');

module.exports = {
    Mutation: {
        async passwordReset(_, {username, token, password, confirmPassword}){
            
            if(username.trim() === ''){
                throw new ApolloError('Username not found', 'BAD_INPUT', {errors: {username: 'Please provide a username'}});
            }
            
            const { valid, errors } = validatePasswordInput(password, confirmPassword)
            

            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            

            const user = await User.findOne({username})

            if(!user){
                throw new UserInputError('Errors', { errors })
            }

            if(!user.resetPasswordToken){
                throw new ApolloError('Recovery token not found', 'BAD_INPUT', {errors: { token: 'Please send a new password change request' }});
            }

            if(token !== user.resetPasswordToken){
                throw new ApolloError('Invalid token', 'BAD_INPUT', {errors: { token: 'Could not verify your email, please click the URL sent to you' }});
            }

            if(token.resetPasswordExpires < Date.now()){
                throw new ApolloError('Expired Token', 'BAD_INPUT', {errors: { token: 'Your recovery URL is expired, please try with a new one' }});
            }

            password = await bcrypt.hash(password, 12);

            await user.updateOne({
                password,
                resetPasswordToken: '',
                resetPasswordExpires: ''
            })

            console.log('Success!')
        }
    }
}
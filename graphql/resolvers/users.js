const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError, ApolloError} = require('apollo-server');


const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')
const { SECRET_KEY, CLOUDINARY_CONFIG } = require('../../config.js')
const User = require('../../models/User');

function generateToken(user) {
     return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}



module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const{ valid, errors } = validateLoginInput(username, password);
            
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            
            const user = await User.findOne({ username });

            if(!user){
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                erorrs.general = 'Wrong Credentials'
                throw new UserInputError('Wrong Credentials', { errors });
            }

            const token = generateToken(user) 
            

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(
            _, 
            {
                registerInput: { username, email, password, confirmPassword, imageURL}
            }
            )   {
            //validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            //Make sure user does not exist
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            // hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User ({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
                image: imageURL
            });

            const result = await newUser.save();

            const token = generateToken(result);
            return {
                ...result._doc,
                id: result._id,
                token
            }
        }

    }
}
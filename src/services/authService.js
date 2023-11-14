const User = require('../models/User');
const { driver } = require('../connectors/neo4j');
const { ApolloError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const authService = {

    /**
    * Registers a new user.
    * 
    * @param {object} _ - The parent object (not used in this function).
    * @param {object} registerInput - The input object containing username, email, phone, and password.
    * @returns {object} - The newly registered user.
    * @throws {ApolloError} - If email and phone are not provided, or if the user already exists.
    * @throws {ApolloError} - If the username is already taken.
    */
    register: async (_, { registerInput: { username, email, phone, password } }) => {
        // Check if either email or phone is provided
        if (!phone && !email) {
            throw new ApolloError('Please provide email or phone number');
        }
        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            throw new ApolloError('Username already taken! Please try some other username');
        }

        // Check if user already exists
        if (email) {
            const mailUsed = await User.findOne({ email: email },);
            // Throw error if user already exists
            if (mailUsed) {
                throw new ApolloError(`email already in use`);
            }
        }

        if (phone) {
            const phoneUsed = await User.findOne({ phone: phone });
            if (phoneUsed) {
                throw new ApolloError(`phone already in use`);
            }
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = await new User({
            username: username,
            email: email ? email.toLowerCase() : null,
            password: hashedPassword,
            phone: phone ? phone : null
        });

        try {
            // Create a new session
            const session = driver.session();

            // Create a new user node in the graph database
            await session.run(
                `CREATE (u:User {id:$id}) RETURN u`,
                { id: newUser._id.toString() },
            );

            await session.close();
        } catch (error) {
            throw error;
        }

        // Create token
        const token = jwt.sign({ user_id: newUser._id, email }, "unsafe string", { expiresIn: '24h' });

        // Save user
        newUser.token = token;
        const res = await newUser.save();

        return {
            id: res._id,
            ...res._doc,
        };
    },

    /**
    * Log in a user.
    * 
    * @param {object} _ - The parent object.
    * @param {object} args - The arguments object.
    * @param {object} args.loginInput - The login input object.
    * @param {string} args.loginInput.identifier - The user's email or phone number.
    * @param {string} args.loginInput.password - The user's password.
    * 
    * @returns {object} - The user object with an access token.
    * 
    * @throws {ApolloError} - If the identifier or password is not provided, or if the credentials are invalid.
    */
    login: async (_, { loginInput: { identifier, password } }) => {
        // Check if identifier and password are provided
        if (!identifier || !password) {
            throw new ApolloError('Please provide email/phone number and password');
        }

        // Check if user exists by email or phone number
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create new token
            const token = jwt.sign({ user_id: user._id, email }, "unsafe string", { expiresIn: '1h' });
            // Add token to user
            user.token = token;
            // Return user
            return {
                id: user._id,
                ...user._doc,
            }
        } else {
            throw new ApolloError('Invalid Credentials');
        }
    },
}


module.exports = authService;
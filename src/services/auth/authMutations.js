const User = require('../../models/User');
const VerifyUser = require('../../models/VerificationCode');
const { driver } = require('../../connectors/neo4j');
const { ApolloError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('../../utils/jwt');
const otp = require('../../utils/otp')
const { sendEmail } = require('../../utils/email');


const authMutations = {

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
        const newUser = new User({
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
        const token = jwt.token(newUser._id, newUser.email, "48hrs");
        newUser.token = token;

        // Create verification code
        const verificationCode = otp.generateOTP();
        const newUserVerification = new VerifyUser({
            id: newUser._id,
            code: verificationCode
        });

        // save verification code
        await newUserVerification.save().then((result) => console.log(result));

        // Save user
        const res = await newUser.save();
        const sendermail = 'satyam@capcons.com'.trim();

        //send mail or sms
        await sendEmail(
            sendermail,
            sendermail,
            `Your verification code is ${verificationCode}`,
            'dasjlkaj'
        );

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
            const token = jwt.token(user._id, user.email, "48hrs");
            // Add token to user
            user.token = token;

            await user.save();
            // Return user
            return {
                id: user._id,
                ...user._doc,
            }
        } else {
            throw new ApolloError('Invalid Credentials');
        }
    },

    /**
     * Verifies the sign-up input by checking if the provided user ID and code are valid.
     *
     * @param {Object} _ - The underscore parameter (unused).
     * @param {Object} verifySignUpInput - The sign-up input object.
     * @param {string} verifySignUpInput.id - The ID of the user to verify.
     * @param {string} verifySignUpInput.code - The verification code.
     * @return {Promise<Object>} The verified user object.
     */
    verify: async (_, { verifySignUpInput: { id, code } }) => {

        try {
            const verifyUser = await VerifyUser.findOne({ id: id });

            if (!verifyUser) {
                throw new ApolloError('invalid user id!');
            }

            if (verifyUser.code !== code) {
                throw new ApolloError('invalid code!please retry or generate a new code');
            }
            console.log(verifyUser.code)
            console.log(code)

            if (verifyUser.code === code) {

                const user = await User.findById(verifyUser.id);

                user.verified = true;
                await user.save();
                await verifyUser.remove();
                return user;
            }
        }
        catch (error) {
            console.log(error);
            throw new ApolloError('Verification failed. Please try again later.');

        }

    }
}


module.exports = authMutations;
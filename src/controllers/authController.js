const User = require('../models/User');
const authService = require('../services/authService');
//const Message = require("../../models/Message");

const userController = {

    registerUser: async (_, { registerInput: { username, email, phone, password } }) => {
        const result = await authService.register(_, { registerInput: { username, email, phone, password } });
        return result;
    },

    loginUser: async (_, { loginInput: { identifier, password } }) => {
        const result = await authService.login(_, { loginInput: { identifier, password } });
        return result;
    },


    verifyUser: async (_, { ID }) => { },

    forgotPassword: async (_, { email }) => { },

    /**
    * Get a user by ID.
    * 
    * @param {object} _ - The parent object.
    * @param {object} args - The arguments object.
    * @param {string} args.ID - The user's ID.
    * 
    * @returns {object} - The user object.
    */
    getUser: async (_, { ID }) => User.findById(ID),

    /**
     * Get all users.
     * 
     * @param {object} _ - The parent object.
     * 
     * @returns {object} - The user object.
     */
    getAllUsers: async () => User.find({}),



}

module.exports = userController

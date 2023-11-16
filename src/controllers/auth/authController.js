const authMutations = require('../../services/auth/authMutations');
const authQueries = require('../../services/auth/authQueries');



const authController = {

    registerUser: async (_, { registerInput: { username, email, phone, password } }) => {
        const result = await authMutations.register(_, { registerInput: { username, email, phone, password } });
        return result;
    },
    loginUser: async (_, { loginInput: { identifier, password } }) => {
        const result = await authMutations.login(_, { loginInput: { identifier, password } });
        return result;
    },

    verifyUser: async (_, { verifySignUpInput: { code, id } }) => {
        const result = await authMutations.verify(_, { verifySignUpInput: { code, id } });
        return result;
    },

    forgotPassword: async (_, { email }) => { },
    getUser: async (_, { ID }) => {
        const user = await authQueries.getUser(_, { ID });
        return user;
    },
    getAllUsers: async (_, { }) => {
        const users = await authQueries.getAllUsers();
        return users;
    }






}

module.exports = authController

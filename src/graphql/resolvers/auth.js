const authController = require('../../controllers/auth/authController');

module.exports = {
    Mutation: {
        registerUser: authController.registerUser,
        loginUser: authController.loginUser,
        verifyUser: authController.verifyUser
    },
    Query: {
        user: authController.getUser,
        users: authController.getAllUsers
    },
}
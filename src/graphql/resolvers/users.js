const userController = require('../../controllers/authController');

module.exports = {
    Mutation: {
        registerUser: userController.registerUser,
        loginUser: userController.loginUser
    },
    Query: {
        user: userController.getUser,
        users: userController.getAllUsers
    },
}
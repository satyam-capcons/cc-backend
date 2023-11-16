const User = require('../../models/User');


const authQueries = {

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

module.exports = authQueries
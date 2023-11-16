const jwt = require('jsonwebtoken');

const token = (id, mail, expiresIn) => {
    return jwt.sign({ user_id: id, mail: mail }, "unsafe string", { expiresIn: expiresIn });
}

module.exports = {
    token
}
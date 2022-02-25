const jwt = require('jsonwebtoken')
const tokenService = require('../validator/tokenService');
const constant = require('../../db/constant')
class TokenService {
    constructor() { }
    create(data, expireTime) {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await jwt.sign(data, constant.JWT_SECRET, expireTime)
                resolve(token);
            } catch (err) {
                reject(err);
            }
        })
    }
    decodedToken(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = jwt.verify(token, constant.JWT_SECRET)
                resolve(data);
            } catch (err) {
                reject(err);
            }
        })
    }
}
module.exports = TokenService
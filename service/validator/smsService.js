const constant = require('../../db/constant')
const accountSid = constant.SMS_ACCOUNT_SID;
const authToken = constant.SMS_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


class SmsService {
    constructor() { }
    OTPsend(token, user, baseURL) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.messages.create({
                    body: `OTP Number is ${user.otp} Link :- ${baseURL + "user/" + token}`,
                    from: constant.SMS_PhoneNumber,
                    to: `+${user.phoneNo}`,
                }).then(message => resolve(message)).catch(err => { reject(err) })
                resolve(true)
            } catch (err) {
                reject(err);
            }
        })
    }
}
module.exports = SmsService
"use strict";
const constant = require('../../db/constant')
const nodemailer = require("nodemailer");

class MailService {
    constructor() { }
    send(data) {
        // console.log('data', data)
        return new Promise(async (resolve, reject) => {
            try {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    auth: {
                        user: constant.EMAIL,
                        pass: constant.PASSWORD,
                    },
                });
                console.log('constant.EMAIL', constant.EMAIL)
                let info = await transporter.sendMail({
                    from: constant.PASSWORD,
                    to: data.email,
                    subject: data.subject,
                    // text: "Hello world?",
                    html: data.html,
                });
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                resolve(true)
            } catch (err) {
                reject(err);
            }
        })
    }
}
module.exports = MailService

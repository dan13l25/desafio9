import nodemailer from "nodemailer"
import { EMAIL_PASSWORD } from "../utils"
import { EMAIL_USERNAME } from "../utils"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
})

transporter.verify().then(()=>{
    console.log("mensajes listos")
})
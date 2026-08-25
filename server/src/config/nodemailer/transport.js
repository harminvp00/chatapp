

import nodemailer from 'nodemailer';
import 'dotenv/config';


const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


export default transport;
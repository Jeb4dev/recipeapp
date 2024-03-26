import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { request } from '../../../lib/datocms';

const router = express.Router();

const USER_EXISTS_QUERY = `
query UserExists($email: String!) {
  user(filter: {email: {eq: $email}}) {
    id
  }
}
`;

router.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    const response = await request({
        query: USER_EXISTS_QUERY,
        variables: { email },
    });

    if (!response.user) {
        return res.status(404).json({ error: 'No user found with this email.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    // Here you should update the user in DatoCMS with the reset token and expiration
    // This is just a placeholder as the DatoCMS API does not support this operation
    const user = { ...response.user, resetPasswordToken: resetToken, resetPasswordExpires: Date.now() + 3600000 };

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        to: email,
        from: 'passwordreset@example.com',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset/${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send email.' });
        }

        res.status(200).json({ message: 'Password reset email sent.' });
    });
});

export default router;
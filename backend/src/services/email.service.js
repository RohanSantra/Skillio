import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

/**
 * Sends an email verification email to the user.
 *
 * @param {string} email
 * @param {string} name
 * @param {string} verificationToken
 */

const sendVerificationEmail = async (
    email,
    name,
    verificationToken
) => {

    const verificationUrl =
        `${config.CLIENT_URL}/verify-email/${verificationToken}`;

    await transporter.sendMail({
        from: `"Skillio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your Skillio email",
        html: `
            <!DOCTYPE html>
            <html>
                <body>
                    <h2>Welcome to Skillio, ${name}!</h2>

                    <p>
                        Thanks for creating your Skillio account.
                        Please verify your email address to continue.
                    </p>

                    <p>
                        <a
                            href="${verificationUrl}"
                            style="
                                display: inline-block;
                                padding: 10px 20px;
                                background: #000;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 6px;
                            "
                        >
                            Verify Email
                        </a>
                    </p>

                    <p>
                        This verification link will expire soon.
                    </p>

                    <p>
                        If you did not create this account,
                        you can safely ignore this email.
                    </p>

                    <p>
                        — Skillio Team
                    </p>
                </body>
            </html>
        `,
    });
};

const sendPasswordResetEmail = async (
    email,
    name,
    resetToken
) => {
    const resetUrl =
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
        from: `"Skillio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your Skillio password",

        html: `
            <!DOCTYPE html>
            <html>
                <body>
                    <h2>Reset your Skillio password</h2>

                    <p>Hi ${name},</p>

                    <p>
                        We received a request to reset your Skillio password.
                    </p>

                    <p>
                        <a
                            href="${resetUrl}"
                            style="
                                display: inline-block;
                                padding: 10px 20px;
                                background: #000;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 6px;
                            "
                        >
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This link will expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <p>— Skillio Team</p>
                </body>
            </html>
        `,
    });
};

export {
    sendVerificationEmail,
    sendPasswordResetEmail
};
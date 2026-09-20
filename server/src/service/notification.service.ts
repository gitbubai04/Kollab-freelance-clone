import nodemailer from "nodemailer";
import twilio from "twilio";

const getBooleanEnv = (value?: string) => value === "true" || value === "1";
const hasRealValue = (value?: string) => {
    const normalizedValue = value?.trim().toLowerCase();
    return Boolean(normalizedValue)
        && !normalizedValue!.startsWith("your_")
        && !normalizedValue!.startsWith("your-")
        && !normalizedValue!.startsWith("replace_")
        && !normalizedValue!.startsWith("replace-");
};

export const sendEmailOtp = async (email: string, otp: string) => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (!hasRealValue(SMTP_HOST) || !hasRealValue(SMTP_PORT) || !hasRealValue(SMTP_USER) || !hasRealValue(SMTP_PASS)) {
        console.info(`[DEV OTP] Email OTP for ${email}: ${otp}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: getBooleanEnv(process.env.SMTP_SECURE),
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: SMTP_FROM || SMTP_USER,
        to: email,
        subject: "Your verification code",
        text: `Your verification code is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
    });
};

export const sendSmsOtp = async (phone: string, otp: string) => {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

    if (!hasRealValue(TWILIO_ACCOUNT_SID) || !hasRealValue(TWILIO_AUTH_TOKEN) || !hasRealValue(TWILIO_FROM_NUMBER)) {
        console.info(`[DEV OTP] Phone OTP for ${phone}: ${otp}`);
        return;
    }

    const accountSid = TWILIO_ACCOUNT_SID!.trim();
    const authToken = TWILIO_AUTH_TOKEN!.trim();
    const fromNumber = TWILIO_FROM_NUMBER!.trim();

    if (!accountSid.startsWith("AC")) {
        console.info(`[DEV OTP] TWILIO_ACCOUNT_SID must start with AC. Phone OTP for ${phone}: ${otp}`);
        return;
    }

    const client = twilio(accountSid, authToken);

    await client.messages.create({
        body: `Your verification code is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
        from: fromNumber,
        to: phone,
    });
};

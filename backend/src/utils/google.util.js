import { OAuth2Client } from "google-auth-library";
import config from "../config/config.js";

const googleClient = new OAuth2Client(
    config.GOOGLE_CLIENT_ID
);

const verifyGoogleToken = async (idToken) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new Error("Invalid Google token.");
    }

    return payload;
};

export default verifyGoogleToken;
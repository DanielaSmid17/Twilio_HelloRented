require('dotenv').config();
const twilio = require('twilio');
// const appSid = process.env.TWILIO_APP_SID  
// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN 
const ClientCapability = twilio.jwt.ClientCapability;

const createToken = (callType, accountSid, authToken, appSid) => {
    const capability = new ClientCapability({
        accountSid: accountSid,
        authToken: authToken,
    });
    if (callType === "outbound"){
        capability.addScope(
            new ClientCapability.OutgoingClientScope({ applicationSid: appSid })
            );
            const token = capability.toJwt();
            return token
        }
    else {
        capability.addScope(
            new ClientCapability.IncomingClientScope('joey'))
            const token = capability.toJwt();
            return token
        }
    }

module.exports = { createToken }
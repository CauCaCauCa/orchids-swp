const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const clientID = '721133937478-2m8nenr610qpuabsgm9ffiu5peumi8vc.apps.googleusercontent.com';
const secretKey = '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'; // Replace with your own secret key

// Google authentication - token from Google - use in login route
function verifyToken(token) {
  const client = new OAuth2Client(clientID);
  async function verify() {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID,
      });
      const payload = ticket.getPayload();

      // Check if the token is issued by Google
      if (payload.aud === clientID) {
        // Token is valid and originated from Google
        const userId = payload.sub;
        const email = payload.email;
        return payload;
      } else {
        // Token is not valid or didn't originate from Google
        return { 'msg': 'Invalid token from Google' };
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Internal server error');
    }
  }
  return verify();
}

// ! token from server
// Generate a token - use in login route
function generateToken(payload) {
  const expiresIn = '100h';
  console.log('payload', payload);
  const token = jwt.sign(payload, secretKey, { expiresIn });
  // const token = jwt.sign(payload, secretKey);
  return token;
}

// Check if a token has expired - use while req/res api
function CheckTimeoutToken(req, res, next) {
  var token = req.headers['authorization'];
  const decoded = jwt.verify(token, secretKey);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (decoded.exp > currentTimestamp) {
    next();
  } else {
    res.status(401);
    res.send({ msg: 'Token has expired' });
  }
}

function decodeToken(token) {
  const decoded = jwt.verify(token, secretKey);
  // console.log(decoded);
  return decoded;
}

function getEmailFromToken(req, res) {
  const token = req.headers['authorization']
  const data = decodeToken(token)

  if(!data) {
    res.send("Invalid")
  }

  return data.email;
}


module.exports = {
  verifyToken,
  generateToken,
  CheckTimeoutToken,
  decodeToken,
  getEmailFromToken
};
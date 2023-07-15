const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const cors = require('cors');
const jwt = require('jwt-decode');


const app = express();
app.use(express.json());

const clientID = '721133937478-2m8nenr610qpuabsgm9ffiu5peumi8vc.apps.googleusercontent.com';

app.post('/verify-token', (req, res) => {
  const token = req.body.token; // The token sent by the client

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
        console.log(payload);
        // Additional checks or processing can be done here
        console.log('oke');
        res.status(200).json({ message: 'Token is valid' });
      } else {
        // Token is not valid or didn't originate from Google
        res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  verify();
});


// Cấu hình CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Chỉ cho phép yêu cầu từ nguồn gốc này
    methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
    allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ cho phép các header cụ thể
  })
);

// Khởi động server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

const Client_ID = "Ov23liGbLOPLVEpeZizT";
const Client_secret = "9bd160848826eeec4fc8b66194c33e5e8a9562aa";

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async (req, res) => {
  try {
    console.log("Code received:", req.query.code);
    const params = `?client_id=${Client_ID}&client_secret=${Client_secret}&code=${req.query.code}`;

    const response = await fetch("https://github.com/login/oauth/access_token" + params, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    });

    const data = await response.json();
    console.log("Token response:", data);
    res.json(data);
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).json({ error: 'Failed to get access token' });
  }
});

app.get('/getUserData', async (req, res) => {
  try {
    const accessToken = req.get("Authorization").replace("Bearer ", "");
    console.log("Access token received:", accessToken);

    const response = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("User response:", data);
    res.json(data);
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

app.listen(PORT, () => {
  console.log("CORS Server running on PORT 4000");
});

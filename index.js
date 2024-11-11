const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/sing', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    // Fetch data from the main API
    const apiUrl = `https://ccprojectapis.ddns.net/api/music?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    // Modify the developer name in the response data
    const modifiedData = {
      ...response.data,
       Owner: 'NZ R'  // Replace 'Your Name Here' with your actual name
    };

    // Send the modified data to the client
    res.json(modifiedData);
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    res.status(500).send('Failed to fetch data from the API');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

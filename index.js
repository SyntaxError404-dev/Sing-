const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Endpoint to download audio from main API and serve to user
app.get('/sing', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    // Fetch data from main API
    const apiUrl = `https://ccprojectapis.ddns.net/api/music?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    
    // Extract download link from response
    const downloadUrl = response.data.data.link;
    const fileName = response.data.data.title + '.mp3';

    // Download the audio file to server
    const writer = fs.createWriteStream(path.join(__dirname, fileName));
    const downloadResponse = await axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'stream',
    });

    // Pipe the download stream to a file
    downloadResponse.data.pipe(writer);

    writer.on('finish', () => {
      // Serve the file to the user
      res.download(path.join(__dirname, fileName), fileName, (err) => {
        if (err) {
          console.error('Error while sending file:', err);
          res.status(500).send('Failed to download file');
        }

        // Delete the file after download
        fs.unlinkSync(path.join(__dirname, fileName));
      });
    });

    writer.on('error', (err) => {
      console.error('Error writing file:', err);
      res.status(500).send('Error downloading the file');
    });

  } catch (error) {
    console.error('Error fetching download URL:', error);
    res.status(500).send('Failed to get download link');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

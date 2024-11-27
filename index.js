const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/sing', async (req, res) => {
  const videoUrl = req.query.url;
  
  if (!videoUrl) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    // Fetch data from the API
    const apiResponse = await axios.get(`https://ccprojectapis.ddns.net/api/music?url=${videoUrl}`);
    const songData = apiResponse.data.data;

    // Download the song
    const songResponse = await axios({
      url: songData.link,
      method: 'GET',
      responseType: 'stream',
    });

    const filePath = path.join(__dirname, `${songData.title}.mp3`);

    // Pipe the download stream to a file
    const writer = fs.createWriteStream(filePath);
    songResponse.data.pipe(writer);

    writer.on('finish', () => {
      res.download(filePath, `${songData.title}.mp3`, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error downloading the file');
        }

        // Clean up the file after download
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      });
    });

    writer.on('error', () => {
      res.status(500).send('Error writing the file');
    });

  } catch (error) {
    console.error('Error fetching the song:', error);
    res.status(500).send('Error processing your request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

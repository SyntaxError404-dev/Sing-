const express = require('express');
const axios = require('axios');
const app = express();

app.get('/sing', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const apiResponse = await axios.get(`https://ccprojectapis.ddns.net/api/music?url=${encodeURIComponent(url)}`);
    const { link, title } = apiResponse.data.data;

    if (!link) {
      return res.status(404).send('No downloadable link found');
    }

    const fileResponse = await axios({
      method: 'get',
      url: link,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0', // Set a User-Agent in case the server checks this
      },
    });

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    fileResponse.data.pipe(res);
  } catch (error) {
    console.error('Error downloading the song:', error.message);
    res.status(500).send('Failed to download the song');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

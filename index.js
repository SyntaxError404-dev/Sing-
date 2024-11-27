const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/sing', async (req, res) => {
    try {
        // Get the YouTube URL from query parameter
        const youtubeUrl = req.query.url;
        
        if (!youtubeUrl) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // First, fetch data from the main API
        const mainApiResponse = await axios.get(`https://ccprojectapis.ddns.net/api/music?url=${youtubeUrl}`);
        
        if (mainApiResponse.data.status !== 'ok') {
            return res.status(400).json({ error: 'Failed to process video' });
        }

        // Get the download link and title from the response
        const { link, title } = mainApiResponse.data.data;

        // Fetch the audio file
        const audioResponse = await axios({
            method: 'get',
            url: link,
            responseType: 'stream'
        });

        // Set headers for file download
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);

        // Pipe the audio stream to response
        audioResponse.data.pipe(res);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = 3000;

app.get('/sing', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "Missing 'url' parameter" });

    try {
        const response = await axios.get(`https://ccprojectapis.ddns.net/api/music?url=${encodeURIComponent(videoUrl)}`);
        const fileLink = response.data.data.link;

        if (fileLink) {
            https.get(fileLink, (fileResponse) => {
                res.setHeader('Content-Disposition', `attachment; filename="song.mp3"`);
                res.setHeader('Content-Type', 'audio/mpeg');
                fileResponse.pipe(res);
            }).on('error', (err) => {
                console.error('Streaming error:', err);
                res.status(500).json({ error: "Failed to stream the file" });
            });
        } else {
            res.status(404).json({ error: "File link not found" });
        }
    } catch (error) {
        console.error('API request error:', error);
        res.status(500).json({ error: "Failed to process the request" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

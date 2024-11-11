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
            res.setHeader('Content-Disposition', 'attachment; filename="song.mp3"');
            res.setHeader('Content-Type', 'audio/mpeg');

            https.get(fileLink, (fileResponse) => {
                fileResponse.pipe(res);
            }).on('error', () => res.status(500).json({ error: "File streaming failed" }));
        } else {
            res.status(404).json({ error: "File not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to process request" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

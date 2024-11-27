const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/sing', async (req, res) => {
    try {
        const youtubeUrl = req.query.url;
        
        if (!youtubeUrl) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const apiUrl = `https://ccprojectapis.ddns.net/api/music?url=${youtubeUrl}`;
        const response = await axios.get(apiUrl);

        if (response.data.data.status === 'ok') {
            const songData = response.data.data;
            const songUrl = songData.link;
            const songTitle = songData.title;

            const songResponse = await axios({
                method: 'get',
                url: songUrl,
                responseType: 'stream'
            });

            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', `attachment; filename="${songTitle}.mp3"`);

            songResponse.data.pipe(res);
        } else {
            res.status(400).json({ error: 'Failed to fetch song data' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const { downloadFile } = require('./fileDownloader');
const app = express();
const port = process.env.PORT || 3000;

app.get('/download', async (req, res) => {
    const musicUrl = req.query.url;

    if (!musicUrl) {
        return res.status(400).send('Music URL is required');
    }

    await downloadFile(musicUrl, res);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// fileDownloader.js
const axios = require('axios');

const downloadFile = async (musicUrl, res) => {
    try {
        // Fetch the download link from the main API
        const apiUrl = `https://ccprojectapis.ddns.net/api/music?url=${encodeURIComponent(musicUrl)}`;
        const { data } = await axios.get(apiUrl);
        const downloadLink = data.downloadUrl; // Adjust this based on the actual response structure

        if (!downloadLink) {
            return res.status(404).send('Download link not found');
        }

        // Setup response headers to prompt download
        res.setHeader('Content-Disposition', `attachment; filename="downloaded_music.mp3"`); // Change extension if needed
        res.setHeader('Content-Type', 'audio/mpeg'); // Adjust based on the file type

        // Stream the file to the user
        const downloadResponse = await axios({
            url: downloadLink,
            method: 'GET',
            responseType: 'stream'
        });

        downloadResponse.data.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error.message);
        res.status(500).send('Error processing the request');
    }
};

module.exports = { downloadFile };

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

        // Fetch data from the main API
        const mainApiResponse = await axios.get(`https://ccprojectapis.ddns.net/api/music?url=${youtubeUrl}`);
        
        // Modify the response with new developer name
        const modifiedResponse = {
            Developer: "NZ R",
            Tools: mainApiResponse.data.Tools,
            data: mainApiResponse.data.data
        };

        // Send the modified JSON response
        res.json(modifiedResponse);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

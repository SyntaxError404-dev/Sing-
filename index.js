const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/download", async (req, res) => {
  try {
    const { url } = req.query; // Get the main API URL from query parameter
    if (!url) {
      return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    // Fetch data from the main API
    const apiResponse = await axios.get(`https://ccprojectapis.ddns.net/api/music?url=${encodeURIComponent(url)}`);
    
    if (apiResponse.data.status !== "ok") {
      return res.status(500).json({ error: "Failed to retrieve download link from main API" });
    }

    // Extract the direct download link
    const downloadLink = apiResponse.data.data.link;
    const fileName = apiResponse.data.data.title + ".mp3"; // Extract title for filename, add extension

    // Download the file and pipe it directly to the response
    const downloadResponse = await axios.get(downloadLink, { responseType: "stream" });
    
    // Set the response headers to prompt download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    // Pipe the data stream to the response
    downloadResponse.data.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during the download process" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

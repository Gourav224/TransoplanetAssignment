import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
    try {
        const { url } = req.query;
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error fetching data");
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

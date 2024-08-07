import axios from "axios";
import Groq from "groq-sdk";

const API_BASE_URL = "http://localhost:3001/proxy";

export const fetchXML = async (url) => {
    const response = await axios.get(
        `${API_BASE_URL}?url=${encodeURIComponent(url)}`
    );
    return response.data;
};

export const fetchProductContent = async (url) => {
    console.log(url);
    const response = await axios.get(url);
    console.log(response);

    return response.data; // Assuming raw HTML is returned
};

const groq = new Groq({ apiKey: "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",dangerouslyAllowBrowser: true});

// const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY });
// 

export async function summarizeContent(text) {
    try {
        let chunks=text.substring(0,  10000)
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Please summarize the following description th description in meta tag name description Give me only content and dnot add this line Here is the content of the <meta name="description without the meta tag:   :\n\n${chunks}`,
                },
            ],
            model: "llama3-8b-8192", // Or any other model suited for summarization
        });
        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error fetching Groq summary:", error);
        throw error;
    }
}

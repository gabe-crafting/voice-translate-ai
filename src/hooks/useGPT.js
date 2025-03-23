import {useState, useEffect} from 'react';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const useGPT = (prompt) => {
    const [gptResponse, setGptResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getChatGPTResponse = async (userInput) => {
        setLoading(true);
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",  // or "gpt-3.5-turbo"
                    messages: [{role: "user", content: userInput}]
                })
            });

            const data = await response.json();
            setGptResponse(data.choices[0].message.content);
        } catch {
            setError("An error occurred while fetching data from the server");
        } finally {
            setLoading(false);
        }
    }

    return {response: gptResponse, loading, error, getChatGPTResponse};
};

export default useGPT;
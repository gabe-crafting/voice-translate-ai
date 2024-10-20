import { ElevenLabsClient } from "elevenlabs";

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE = process.env.VOICE;

const client = new ElevenLabsClient({
    apiKey: ELEVEN_LABS_API_KEY,
});

export const streamAudioFromText = async (text, res) => {
    try {
        const audioStream = await client.generate({
            model_id: "eleven_multilingual_v2",
            voice: "5asM3ZxsegvXfXI5vqKQ",  // Use the voice from environment variables
            text,
            voice_settings: {
                stability: 0.1,
                similarity_boost: 0.3,
                style: 0.2,
            },
        });

        // Set headers to indicate the response contains audio content
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", 'inline; filename="voice.mp3"');

        // Pipe the audio stream directly to the response
        audioStream.pipe(res);
    } catch (error) {
        console.error("Error generating audio:", error);
        res.status(500).json({
            message: "Error generating audio",
            elevenlab_error: JSON.stringify(error)
        });
    }
};

export default async function handler(req, res) {
    const { text } = req.body;

    console.log("ELEVEN_LABS_API_KEY", ELEVEN_LABS_API_KEY);
    console.log("VOICE", VOICE);

    // Stream the generated audio directly to the frontend
    await streamAudioFromText(text, res);
}

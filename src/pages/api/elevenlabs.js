import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream } from "fs";
import path from "path";
import fs from "fs"


const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY
const VOICE = process.env.VOICE

const client = new ElevenLabsClient({
    apiKey: ELEVEN_LABS_API_KEY,
});

export const createAudioFileFromText = async (text) => {
    return new Promise(async (resolve, reject) => {
        try {
            const audio = await client.generate({
                model_id: "eleven_multilingual_v2",
                voice: "5asM3ZxsegvXfXI5vqKQ",
                text,
                voice_settings: {
                    stability: 0.1,
                    similarity_boost: 0.3,
                    style: 0.2
                }
            });
            const fileName = "somevoice.mp3";
            const fileStream = createWriteStream(fileName);

            audio.pipe(fileStream);
            fileStream.on("finish", () => resolve(fileName)); // Resolve with the fileName
            fileStream.on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
};


export default async function handler(req, res) {
    const { text } = req.body
    const link = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`;

    console.log("ELEVEN_LABS_API_KEY", ELEVEN_LABS_API_KEY)
    console.log("VOICE", VOICE)

    const fileName = await createAudioFileFromText(text)
    console.log("newFile: ", fileName)
    const filePath = path.join(process.cwd(), fileName);
    console.log("filePath: ", filePath)

    if (fs.existsSync(filePath)) {
        // Set headers to trigger download
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Read and send the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
    // try {
    //     const response = await fetch(link, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'xi-api-key': ELEVEN_LABS_API_KEY
    //         },
    //         body: JSON.stringify({
    //             text: text,
    //             model_id: "eleven_multilingual_v2",
    //             voice_settings: {
    //                 stability: 0.1,
    //                 similarity_boost: 0.3,
    //                 style: 0.2
    //             }
    //         }),
    //     });

    //     console.log(response)

    //     if (!response.ok) {
    //         return res.status(response.status).send(response.statusText);
    //     }

    //     fs.writeFileSync('output.mp3', response.data);
    //     console.log('Audio file saved as output.mp3');
    // } catch (error) {
    //     res.status(500).send(error);
    // }
}
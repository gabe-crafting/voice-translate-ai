const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY
const VOICE = process.env.VOICE

export const myTextToSpeech = async (text) => {
    try {
        const link = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`
        const response = await fetch(link, {
            method: "POST",
            headers: {
                'xi-api-key': `${ELEVEN_LABS_API_KEY}`, // Use Bearer token for authorization
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.1,
                    similarity_boost: 0.3,
                    style: 0.2
                }
            }),
            responseType: 'arraybuffer'
        })

        if (!response.ok) { throw response.statusText; }


        const audioUrl = data.audio_url; // Adjust this based on the actual response structure
        return audioUrl;

    } catch (error) {
        console.error('Error fetching text to speech:', error);
    }
}
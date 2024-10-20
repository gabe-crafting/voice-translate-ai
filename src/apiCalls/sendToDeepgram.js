const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export const sendUrlToDeepgram = async (audioUrl) => {
    console.log("audioUrl: ", audioUrl)
    const response = await fetch('https://api.deepgram.com/v1/listen?punctuate=true', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${DEEPGRAM_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: audioUrl,
        }),
    });

    if (!response.ok) {
        // Log the response for debugging purposes
        const errorResponse = await response.text();  // Text format for better logging
        console.error('Deepgram API Error:', errorResponse);
        throw new Error(`Failed to transcribe audio: ${response.statusText}`);
    }

    const result = await response.json();
    return result.results.channels[0].alternatives[0].transcript;
}
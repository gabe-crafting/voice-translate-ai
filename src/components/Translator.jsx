import { useState } from "react"


export const Translator = () => {
    const [inititalText, setInitialText] = useState("")
    const [translatedText, setTranslatedText] = useState("")

    const [audioSrc, setAudioSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const translate = async () => {
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inititalText, targetLanguage: "ro" }),
            });

            const data = await response.json();
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error('Error translating:', error);
        }
    }

    const getSpeech = async () => {
        setIsLoading(true);
        setAudioSrc(null);  // Reset audio source before the new request

        // await myTextToSpeech(translatedText)
        try {
            const response = await fetch('/api/elevenlabs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: translatedText })
            });

            if (response.ok) {
                // The response is a binary MP3 file, we need to convert it to a blob
                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob); // Create a URL for the audio blob

                setAudioSrc(audioUrl); // Set the audio URL to the state to play it
            } else {
                console.error("Failed to generate audio");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setIsLoading(false);
    };

    return (<div>
        <h4>Insert text</h4>
        <textarea value={inititalText} onChange={(e) => setInitialText(e.target.value)} />
        <br />
        <h4>Translation</h4>
        <button onClick={translate}>
            Translate
        </button>
        <p>{translatedText}</p>
        <button onClick={getSpeech} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Voice'}
        </button>
        {audioSrc && (
            <div>
                <h2>Generated Audio</h2>
                <audio controls src={audioSrc} />
            </div>
        )}
    </div>)
}
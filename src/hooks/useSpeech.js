import { useContext, useState } from "react";
import { uploadToCloudinary } from "../apiCalls/uploadToCloudinary";
import { sendUrlToDeepgram, sendUrlToDeepgramRO } from "../apiCalls/sendToDeepgram";
import { AppStateContext } from "../contexts/AppStateContext";

export const useSpeech = () => {
    const [speechLoading, setSpeechLoading] = useState("");
    const [speechSrc, setSpeechSrc] = useState(null);
    const [audioText, setAudioText] = useState("");

    const { changeCurrentStatus } = useContext(AppStateContext);

    const getSpeech = async (translatedText) => {
        setSpeechLoading(true);
        setSpeechSrc(null);  // Reset audio source before the new request

        // await myTextToSpeech(translatedText)
        changeCurrentStatus("Generating romanian speech...");
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
                changeCurrentStatus("Finish generating romanian speech...");

                setSpeechSrc(audioUrl); // Set the audio URL to the state to play it
            } else {
                changeCurrentStatus((<span style={{ color: "red" }}>Faild generating audio</span>));
                console.error("Failed to generate audio");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setSpeechLoading(false);
    };

    const speechToText = async (audioBlobRef) => {
        /* send to cloud */
        try {
            /* cloudinary */
            console.log(audioBlobRef.current)
            changeCurrentStatus("Upload to Cloudinary...");
            const cloudLink = await uploadToCloudinary(audioBlobRef.current)
            changeCurrentStatus("Uploaded to Cloudinary...");
            console.log("cloudLink", cloudLink)

            /* deepgram */
            changeCurrentStatus("Send record to deepgram...")
            const audioText = await sendUrlToDeepgram(cloudLink)
            changeCurrentStatus("Record to deepgram sent...")

            /* audio */
            setAudioText(audioText)
        } catch (e) {
            console.error(e)
        }
    }

    const speechToTextRo = async (audioBlobRef) => {
        try {
            /* cloudinary */
            console.log(audioBlobRef.current)
            changeCurrentStatus("Upload to Cloudinary...");
            const cloudLink = await uploadToCloudinary(audioBlobRef.current)
            changeCurrentStatus("Uploaded to Cloudinary...");
            console.log("cloudLink", cloudLink)

            /* deepgram */
            changeCurrentStatus("Send record to deepgram...")
            const audioText = await sendUrlToDeepgramRO(cloudLink)
            changeCurrentStatus("Record to deepgram sent...")

            /* audio */
            setAudioText(audioText)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        audioText,
        setAudioText,
        speechSrc,
        speechLoading,
        setSpeechSrc,
        getSpeech,
        speechToText,
        speechToTextRo
    }
}
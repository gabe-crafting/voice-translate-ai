import {useContext, useEffect, useRef, useState} from "react";
import { sendUrlToDeepgram } from "./../apiCalls/sendToDeepgram";
import { uploadToCloudinary } from "./../apiCalls/uploadToCloudinary";
import {AppStateContext} from "../contexts/AppStateContext";
import {useTranslator} from "./../hooks/useTranslator";


export default function Home() {
    const [audioSrc, setAudioSrc] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState([])
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioBlobRef = useRef(null);
    const [audioText, setAudioText] = useState("")

    const {translatedText, translate} = useTranslator();

    const [speechSrc, setSpeechSrc] = useState(null);
    const [speechLoading, setSpeechLoading] = useState("")

    const uploadAndTranscript = async () => {
        /* send to cloud */
        try {
            setStatus(currentStatus => [...currentStatus, "Upload to Cloudinary..."])
            const cloudLink = await uploadToCloudinary(audioBlobRef.current)

            setStatus(currentStatus => [...currentStatus, "Send record to deepgram..."])
            const audioText = await sendUrlToDeepgram(cloudLink)

            /* audio */
            setAudioText(audioText)
        } catch (e) {
            console.error(e)
        }
    }

    const startRecording = async () => {
        setAudioSrc(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setStatus(currentStatus => [...currentStatus, "start recording..."])

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioSrc(audioUrl);
                audioBlobRef.current = audioBlob

                /* /send to backend */
                audioChunksRef.current = [];
                setIsRecording(false);
            };
        } catch (err) {
            console.error("Error accessing the microphone: ", err);
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setStatus(currentStatus => [...currentStatus, "stoped recording..."])
        }
    };

    const clearLogs = () => {
        setStatus([])
    }

    const getSpeech = async () => {
        setSpeechLoading(true);
        setSpeechSrc(null);  // Reset audio source before the new request

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

                setSpeechSrc(audioUrl); // Set the audio URL to the state to play it
            } else {
                console.error("Failed to generate audio");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setSpeechLoading(false);
    };


    return (
        <div className="full">
            <div className="main-full">
                <button className="main-button" onClick={clearLogs}>Clear Logs</button>
                {!isRecording ? (
                    <button className="main-button" onClick={startRecording}>Start Recording</button>
                ) : (
                    <button className="main-button" onClick={stopRecording}>Stop Recording</button>
                )}
                {audioSrc && (
                    <>
                        <audio controls>
                            <source src={audioSrc} type="audio/wav" />
                            Your browser does not support the audio element.
                        </audio>
                        <button className="main-button" onClick={uploadAndTranscript}>Transcript</button>
                    </>
                )}
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <label>
                        <b>English transcripted Voice</b>
                        <textarea style={{ minWidth: 300, minHeight: 200 }}
                            value={audioText}
                            onChange={(e) => setAudioText(e.target.value)} />
                    </label>
                </div>

                {audioText && <button className="main-button" onClick={translate}>
                    Translate
                </button>}

                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <label >
                        <b>Romanian Translation</b>
                        <textarea style={{ minWidth: 300, minHeight: 200 }}
                            value={translatedText}
                            onChange={(e) => setTranslatedText(e.target.value)} />
                    </label>
                </div>
                {translatedText && <button onClick={getSpeech} disabled={speechLoading} className="main-button">
                    {speechLoading ? 'Generating...' : 'Generate Voice'}
                </button>}
                {speechSrc && (
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <b>Romanian Voice</b>
                        <audio controls src={speechSrc} />
                    </div>
                )}
            </div>
            <div className="main-full" style={{ paddingLeft: 20 }}>
                {status.map((el, i) => <p key={i}>{el}</p>)}
            </div>
        </div>
    );
}

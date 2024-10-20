import { sendUrlToDeepgram } from "@/apiCalls/sendToDeepgram";
import { uploadToCloudinary } from "@/apiCalls/uploadToCloudinary";
import React, { useState, useRef } from "react";

const AudioRecorder = ({ setAudioText }) => {
    const [audioSrc, setAudioSrc] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    const audioBlobRef = useRef(null)

    const uploadAndTranslate = async () => {
        /* send to cloud */
        try {
            const cloudLink = await uploadToCloudinary(audioBlobRef.current)
            const audioText = await sendUrlToDeepgram(cloudLink)
            /* audio */
            console.log(setAudioText)
            setAudioText && setAudioText(audioText)
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
        }
    };


    return (
        <div>
            <h2>Record and Play Audio</h2>
            <div>
                {!isRecording ? (
                    <button onClick={startRecording}>Start Recording</button>
                ) : (
                    <button onClick={stopRecording}>Stop Recording</button>
                )}
                {audioSrc && <button onClick={uploadAndTranslate}>Upload and Translate</button>}
            </div>
            {audioSrc && (
                <audio ref={audioRef} controls>
                    <source src={audioSrc} type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
};

export default AudioRecorder;

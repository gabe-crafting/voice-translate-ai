import {useContext, useRef, useState} from "react";
import {AppStateContext} from "../contexts/AppStateContext";

export const useRecorder = () => {
    const [audioSrc, setAudioSrc] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioBlobRef = useRef(null);

    const {changeCurrentStatus} = useContext(AppStateContext);

    const startRecording = async () => {
        setAudioSrc(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            setIsRecording(true);
            changeCurrentStatus("start recording...");
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
            changeCurrentStatus("stop recording...");
        }
    };

    return {
        audioBlobRef,
        audioSrc,
        isRecording,
        startRecording,
        stopRecording
    }
}
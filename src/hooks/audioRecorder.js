import { useRef, useState } from "react"

export const useAudioRecorder = () => {
    const [audioSrc, setAudioSrc] = useState(null);
    const [isRecording, setIsRecording] = useState(false)
    const audioBlobRef = useRef(null)
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        setAudioSrc(null);
        setIsRecording(true);
        try {
            console.log("startRecording")
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();

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
        } finally {
            setIsRecording(false)
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };


    return { startRecording, stopRecording, audioSrc, isRecording }
}
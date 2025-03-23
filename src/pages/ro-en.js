import { useRecorder } from "../hooks/useRecorder";
import { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateContext";

export default function RoEn() {
    const { audioBlobRef, audioSrc, isRecording, startRecording, stopRecording } = useRecorder();
    const { statuses, clearStatuses } = useContext(AppStateContext);

    return (
        <div className="full">
            <div className="main-full">
                <h1>Hello from ro-en translation</h1>
                <button className="main-button" onClick={clearStatuses}>Clear Logs</button>
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
                        <button className="main-button" onClick={() => speechToText(audioBlobRef)}>Transcript</button>
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

            </div>
        </div>
    )
}
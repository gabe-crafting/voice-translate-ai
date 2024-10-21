import {useContext} from "react";
import {useTranslator} from "./../hooks/useTranslator";
import {useRecorder} from "../hooks/useRecorder";
import {useSpeech} from "../hooks/useSpeech";
import {AppStateContext} from "../contexts/AppStateContext";

export default function Home() {
    const {audioBlobRef, audioSrc, isRecording, startRecording, stopRecording} = useRecorder();
    const {translatedText, setTranslatedText, translate} = useTranslator();
    const {audioText, setAudioText, speechSrc, speechLoading, getSpeech, speechToText} = useSpeech()

    const {statuses, clearStatuses} = useContext(AppStateContext);

    return (
        <div className="full">
            <div className="main-full">
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

                {audioText && <button className="main-button" onClick={() => translate(audioText)}>
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
                {translatedText && <button onClick={() => getSpeech(translatedText)} disabled={speechLoading} className="main-button">
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
                {statuses.map((el, i) => <p key={i}>{el}</p>)}
            </div>
        </div>
    );
}

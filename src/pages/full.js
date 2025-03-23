import { useContext, useEffect } from "react";
import { useRecorder } from "./../hooks/useRecorder";
import { useSpeech } from "./../hooks/useSpeech";
import { useTranslator } from "./../hooks/useTranslator";
import { AppStateContext } from "./../contexts/AppStateContext";


export default function Full() {
    const { audioBlobRef, audioSrc, isRecording, startRecording, stopRecording } = useRecorder();
    const { translatedText, setTranslatedText, translate } = useTranslator();
    const { audioText, setAudioText, speechSrc, setSpeechSrc, speechLoading, getSpeech, speechToText } = useSpeech()

    const { statuses, clearStatuses } = useContext(AppStateContext);

    const handleClickStartRecording = () => {
        clearStatuses();
        setTranslatedText("");
        setAudioText("")
        setSpeechSrc()
        startRecording();
    }

    useEffect(() => {
        if (!isRecording && audioSrc) {
            speechToText(audioBlobRef)
        }
    }, [isRecording, audioSrc])

    useEffect(() => {
        if (audioText) {
            translate(audioText)
        }
    }, [audioText])

    useEffect(() => {
        
        if (translatedText) {
            getSpeech(translatedText)
        }
    }, [translatedText])

    return (
        <div className="full">
            <div className="main-full">
                { /* Recording button */}
                {!isRecording ? (
                    <button className="main-button" onClick={handleClickStartRecording}>Start Recording</button>
                ) : (
                    <button className="main-button" onClick={stopRecording}>Stop Recording</button>
                )}

                { /* English playback */}
                {audioSrc && (
                    <>
                        <audio controls>
                            <source src={audioSrc} type="audio/wav" />
                            Your browser does not support the audio element.
                        </audio>
                    </>
                )}

                { /* English Transcript */}
                {audioText &&
                    (
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <label>
                                <b>English transcribed Voice</b>
                                <div className="paragraph-container">
                                    <p>{audioText}</p>
                                </div>
                            </label>
                        </div>
                    )
                }

                { /* Romanian Transcript */}
                {translatedText && (
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <label>
                            <b>Romanian Translation</b>
                            <div className="paragraph-container">
                                <p>{translatedText}</p>
                            </div>
                        </label>
                    </div>
                )
                }

                { /*  Romanian playback */}
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

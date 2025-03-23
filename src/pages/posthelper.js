import {useRecorder} from "./../hooks/useRecorder";
import {useSpeech} from "./../hooks/useSpeech";
import {useContext, useEffect, useState} from "react";
import {AppStateContext} from "./../contexts/AppStateContext";
import useGPT from "./../hooks/useGPT";

export default function PostHelper() {
    const {audioBlobRef, audioSrc, isRecording, startRecording, stopRecording} = useRecorder();
    const {audioText, setAudioText, speechToText} = useSpeech();
    const {statuses, clearStatuses, changeCurrentStatus} = useContext(AppStateContext);
    const [chatGPTInst, setChatGPTInst] = useState("");
    const {response, getChatGPTResponse} = useGPT()

    const handleChatGpt = () => {
        getChatGPTResponse(chatGPTInst + ": " + audioText).then(() => {
            changeCurrentStatus("GPT response received")
        })
    }

    useEffect(() => {
        if (!isRecording && audioSrc) {
            speechToText(audioBlobRef)
        }
    }, [isRecording, audioSrc])

    return <div>
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
                            <source src={audioSrc} type="audio/wav"/>
                            Your browser does not support the audio element.
                        </audio>
                        <button className="main-button" onClick={() => speechToText(audioBlobRef)}>Transcript</button>
                    </>
                )}
                <div style={{marginTop: 10, marginBottom: 10}}>
                    <label>
                        <b>English transcripted Voice</b>
                        <textarea style={{minWidth: 300, minHeight: 200}}
                                  value={audioText}
                                  onChange={(e) => setAudioText(e.target.value)}/>
                    </label>
                </div>

                <div style={{marginTop: 10, marginBottom: 10}}>
                    <label>
                        <b>Instruction for gpt</b>
                        <textarea style={{minWidth: 300, minHeight: 200}}
                                  value={chatGPTInst}
                                  onChange={(e) => setChatGPTInst(e.target.value)}/>
                    </label>
                </div>

                <button className="main-button" onClick={handleChatGpt}>Sent to gpt</button>

                <div style={{marginTop: 10, marginBottom: 10}}>
                    <label>
                        <b>GPT output</b>
                        <textarea style={{minWidth: 300, minHeight: 200}}
                                  value={response}
                                  onChange={(e) => setChatGPTInst(e.target.value)}/>
                    </label>
                </div>

                <div className="main-full" style={{paddingLeft: 20}}>
                    {statuses.map((el, i) => <p key={i}>{el}</p>)}
                </div>
            </div>
        </div>
    </div>
}
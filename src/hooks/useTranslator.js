import {useContext, useState} from "react";
import {AppStateContext} from "../contexts/AppStateContext";

export const useTranslator = () => {
    const {changeCurrentState} = useContext(AppStateContext)
    const [translatedText, setTranslatedText] = useState('')

    const translate = async (audioText) => {
        try {
            changeCurrentState("Translating...");
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: audioText, targetLanguage: "ro" }),
            });

            const data = await response.json();
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error('Error translating:', error);
        } finally {
            changeCurrentState("Finish translation...")
        }
    }

    return {
        translatedText,
        setTranslatedText,
        translate
    }
}
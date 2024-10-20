// pages/api/translate.js

const GOOGLE_TRANSLATE_KEY = process.env.GOOGLE_TRANSLATE_KEY

export default async function handler(
    req,
    res
) {
    const { text, targetLanguage } = req.body;
    console.log("googletranslate:GOOGLE_TRANSLATE_KEY:", GOOGLE_TRANSLATE_KEY)

    // Replace with your actual translation logic
    const translatedText = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_KEY}&source=en&target=${targetLanguage}&q=${text}`
    )
        .then((response) => response.json())
        .then((data) => data.data.translations[0].translatedText);

    res.status(200).json({ translatedText });
}


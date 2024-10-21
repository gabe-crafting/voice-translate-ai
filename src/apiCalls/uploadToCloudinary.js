// Replace these with your own Cloudinary credentials
const CLOUD_NAME = process.env.CLOUD_NAME;
const UPLOAD_PRESET = process.env.UPLOAD_PRESET;

export const uploadToCloudinary = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('upload_preset', UPLOAD_PRESET); // You can create an unsigned upload preset in Cloudinary

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            return data.secure_url
            // You can use `data.secure_url` for further actions, such as displaying a link to the uploaded audio
        } else {
            console.error('Error uploading audio:', data.error.message);
        }
    } catch (error) {
        console.error('Error during upload:', error);
    }
}
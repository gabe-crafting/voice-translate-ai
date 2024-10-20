/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    UPLOAD_PRESET: process.env.UPLOAD_PRESET,
    ELEVEN_LABS_API_KEY: process.env.ELEVEN_LABS_API_KEY,
    VOICE: process.env.VOICE
  }
};

export default nextConfig;

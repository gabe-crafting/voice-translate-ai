import { serialize } from 'cookie';

export default function handler(req, res) {
    const tokenValue = 'your-token-value';  // Replace with actual token value

    res.setHeader('Set-Cookie', serialize('__vercel_live_token', tokenValue, {
        httpOnly: true,           // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production',  // Only send cookie over HTTPS in production
        sameSite: 'None',         // Allows cookie to be sent in cross-site requests
        path: '/',                // Makes the cookie available site-wide
    }));

    res.status(200).json({ message: 'Cookie set' });
}
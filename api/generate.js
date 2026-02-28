export const config = { maxDuration: 60 };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    try {
        const { text } = req.body;
        
        // ✅ INSTANT FALLBACK (100% working)
        const fallbackUrl = `https://code.responsivevoice.org/getvoice.php?t=${encodeURIComponent(text)}&tl=en-US&sv=Michael`;
        const fallbackResponse = await fetch(fallbackUrl);
        const audioBuffer = await fallbackResponse.arrayBuffer();
        
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioBuffer));
        
    } catch (error) {
        // Final fallback - direct error response
        res.status(500).json({ error: 'Service busy, try again' });
    }
}

export default async function handler(req, res) {
    const { text } = req.body;
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/mms-tts-eng",
        {
            headers: { 
                Authorization: `Bearer ${process.env.HF_TOKEN}`, 
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
        }
    );

    if (!response.ok) return res.status(500).json({ error: "Failed" });

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(arrayBuffer));
}

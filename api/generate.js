export const config = {
  maxDuration: 60, // Vercel timeout fix
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { text } = req.body;
    
    try {
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

        if (!response.ok) {
            // Agar model load ho raha hai (503), toh status bhej do
            return res.status(response.status).json({ error: "Model Loading" });
        }

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg'); // Browser ko batana ki ye aawaaz hai
        res.send(Buffer.from(arrayBuffer));
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

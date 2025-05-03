import { GoogleGenAI } from '@google/genai';
import type { Request, Response } from 'express';
import GEMINI_API_KEY from '../../gemini-key.json' with { type: 'json' };

const client = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});

export async function getTypingSample(req: Request, res: Response) {
    const prompt = req.query.prompt?.toString();
    
    if (!prompt) {
        res.status(204).send();
        return;
    } 

    const response = await client.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: `Generate texts from 100 to 500 words for typing exercise. Respect the length requested in the user prompt, but never exceed 500 words limit. The prompt: ${prompt}`,
    });

    res.status(200).send(response.text);
}
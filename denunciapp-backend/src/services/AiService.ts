import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
import { promptInstructions } from '../utils/prompt'; // Importa las instrucciones del prompt


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function extraerJSONDeRespuesta(texto: string): any {
    const match = texto.match(/```json\s*({[\s\S]*?})\s*```/);
    if (!match) throw new Error("No se pudo extraer el JSON del mensaje de la IA");
    return JSON.parse(match[1]);
}

export const callAIAPI = async (message: string, history: { role: "user" | "assistant"; content: string }[]): Promise<any> => {
    try {
        if (!OPENAI_API_KEY) throw new Error("API key not defined");

        const messages = [
            { role: "system", content: promptInstructions },
            ...history,
            { role: "user", content: message }
        ];

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages,
                temperature: 0.7,
                max_tokens: 1000,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
        const mensajeIA = response.data.choices[0].message.content;
        return mensajeIA;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            console.error("⚠️ Límite de uso excedido (429)");
            throw new Error("Has excedido el límite de peticiones a la API de OpenAI. Intenta más tarde.");
        }
        console.error("Error llamando la API de la IA: ", error);
        throw new Error("Error llamando la API de la IA");
    }
};

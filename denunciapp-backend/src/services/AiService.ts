import axios from "axios";
import { promptInstructions } from '../utils/prompt'; // Importa las instrucciones del prompt


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const callAIAPI = async (message: string, history: { role: "user" | "assistant"; content: string }[]): Promise<string> => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error("API key not defined in environment variables");
        }

        const messages = [
            { role: "system", content: promptInstructions }, // Instrucciones base
            ...history, // Historial corto para contexto
            { role: "user", content: message } // Mensaje actual del usuario
        ];

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error llamando la API de la IA: ", error);
        throw new Error("Error llamando la API de la IA");
    }
};


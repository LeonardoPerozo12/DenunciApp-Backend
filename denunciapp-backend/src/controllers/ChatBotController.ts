import { Request, Response } from 'express';
import { callAIAPI } from '../services/AiService';


export const chatBot = async (req: Request, res: Response): Promise<void> => {
    try {
        let { message, history } = req.body; // Extraemos el mensaje y el historial

        if (!message) {
            res.status(400).json({ error: "Mensaje e historial son requeridos" });
            return;
        }

        // Limitar el historial a los últimos 10 mensajes
        const maxHistorySize = 10;
        if (history && history.length > maxHistorySize) {
            history = history.slice(-maxHistorySize);
        }

        // Llamar al servicio de OpenAI
        const aiResponse = await callAIAPI(message, history);

        // Agregar la respuesta de la IA al historial
        history.push({ role: "user", content: message });
        history.push({ role: "assistant", content: aiResponse });

        // Devolver la respuesta y el historial actualizado
        res.json({ response: aiResponse, history });
    } catch (error) {
        console.error("Error procesando la solicitud", error);
        res.status(500).json({ error: "Error procesando la solicitud" });
    }
};

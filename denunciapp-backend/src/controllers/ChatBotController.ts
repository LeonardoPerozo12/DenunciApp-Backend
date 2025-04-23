import { Request, Response } from 'express';
import { callAIAPI } from '../services/AiService';
import { generarYEnviarReporte } from '../services/GenerarYEnviarReporte';

// Función para extraer JSON desde un texto posiblemente corrupto
function extraerJsonDeTexto(texto: string): string {
    const match = texto.match(/{[\s\S]*}/); // busca lo que parezca un objeto JSON
    return match ? match[0] : '{}';
}

// Función para detectar si el usuario confirmó el envío
function usuarioConfirmoEnvio(message: string, history: { role: "user" | "assistant"; content: string }[]): boolean {
    const confirmaciones = ["si", "sí", "claro", "enviar", "dale", "hazlo"];
    const mensajeNormalizado = message.toLowerCase();

    const confirmo = confirmaciones.some(palabra => mensajeNormalizado.includes(palabra)) &&
        history.some(h =>
            /deseas?.*enviar/i.test(h.content) ||
            /¿.*enviamos.*reporte/i.test(h.content) ||
            /desea.*enviarlo/i.test(h.content)
        );

    return confirmo;
}

export const chatBot = async (req: Request, res: Response): Promise<void> => {
    try {
        let { message, history }: { message: string; history: { role: "user" | "assistant"; content: string }[] } = req.body;

        if (!message) {
            res.status(400).json({ error: "Mensaje e historial son requeridos" });
            return;
        }

        // Limitar historial
        const maxHistorySize = 10;
        if (history && history.length > maxHistorySize) {
            history = history.slice(-maxHistorySize);
        }

        // Verifica si el usuario confirmó el envío
        if (usuarioConfirmoEnvio(message, history)) {
            console.log("⚠️ Usuario confirmó el envío. Procediendo a generar reporte...");

            const aiResponse = await callAIAPI(message, history);
            const jsonLimpiado = extraerJsonDeTexto(aiResponse);
            let reporte;

            try {
                reporte = JSON.parse(jsonLimpiado);
                console.log("✅ JSON extraído y parseado correctamente:", reporte);
            } catch (parseError) {
                console.error("❌ Error al parsear el JSON generado por la IA:", jsonLimpiado);
                res.status(400).json({ error: "No se pudo entender la estructura del reporte. Intenta de nuevo." });
                return;
            }

            try {
                const resultado = await generarYEnviarReporte(reporte, history);
                history.push({ role: "user", content: message });
                history.push({ role: "assistant", content: "El reporte ha sido generado y enviado correctamente." });

                res.json({ response: "El reporte ha sido enviado correctamente.", history });
                return;
            } catch (postError) {
                console.error("❌ Error al enviar el reporte al backend:", postError);
                res.status(500).json({ error: "Hubo un problema al enviar el reporte." });
                return;
            }
        }

        // Caso normal: continuar la conversación
        const aiResponse = await callAIAPI(message, history);

        history.push({ role: "user", content: message });
        history.push({ role: "assistant", content: aiResponse });

        res.json({ response: aiResponse, history });

    } catch (error) {
        console.error("❌ Error procesando la solicitud:", error);
        res.status(500).json({ error: "Error procesando la solicitud" });
    }
};

import axios from "axios";
import { callAIAPI } from "./AiService";

export const generarYEnviarReporte = async (userMessage: string, history: any[]) => {
    try {
        console.log("Generando reporte con AI...");
        const reporte = await callAIAPI(userMessage, history);
        console.log("Respuesta de AI:", reporte);

        const response = await axios.post(`${process.env.BACKEND_URL}/Post-Reporte`, reporte);

        console.log("Reporte creado exitosamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al generar o enviar el reporte:", error);
        throw error;
    }
};

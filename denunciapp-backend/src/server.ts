import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UsarioRoutes from "./routes/UsuarioRoutes";
import { connectDB } from './config/prisma';

dotenv.config();
const app = express();
const port = process.env.PORT 

        
    connectDB(); // Connect to the database
    console.log('Database connected successfully');
    // CROSS ORIGIN RESOURCE SHARING configuration
    app.use(cors({ 
        origin: process.env.FRONTEND_URL, // Permitir peticiones desde el frontend
        credentials: true,
    }));

    app.use(express.json()); // Middleware to parse JSON requests
    app.use('/api', UsarioRoutes); // Mount the user routes on /api


    app.get("/", (req, res) => {
        res.send("<h1>API de DenunciApp<h1>");
    });


    app.listen(port, () => {
        console.log(`Now listening on port http://localhost:${port}` );
    });

    // Log incoming requests
    app.use((req, res, next) => {
        console.log(`[${req.method}] ${req.url} - ${new Date().toISOString()}`);
        next();
    });

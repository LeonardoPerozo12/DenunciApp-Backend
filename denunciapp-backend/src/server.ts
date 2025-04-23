import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/IndexRoutes"
import { connectDB } from './config/prisma';

dotenv.config();
const app = express();
const port = process.env.PORT 

connectDB(); // Connect to the database
console.log('Database connected successfully');
// CROSS ORIGIN RESOURCE SHARING configuration
app.use(cors({
    origin: '*',// Permitir todos los orígenes
    credentials: true,
    }));
    
    app.use(express.json());
    
    app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - ${new Date().toISOString()}`);
    next();
    });

routes.forEach((route, index) => {
    app.use(`/api`, route);
});

app.get("/", (req, res) => {
    res.send("<h1>API de DenunciApp<h1>");
});

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});

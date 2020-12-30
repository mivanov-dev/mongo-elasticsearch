import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { database } from "./mongoose";
import { socket } from './socket';


const app = express();
const server = http.createServer(app);
socket(server);
database('mongodb://localhost:27017/db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('port', 4200);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

server.listen(4200);

export { app };


import { Express } from "express";
import { BodyParser } from "body-parser";
import api from './router/api';
import errorHandler from "./errors/errorHandler";
import * as http from "http";
import { Server } from "socket.io";
import ioServer from "./io-server";
import path from "path";

const 
    express = require("express"),
    app: Express = express(),
    bp: BodyParser = require("body-parser"),
    cors = require("cors"),
    cp = require("cookie-parser");
    
require("dotenv").config();

const corsParams = {
    credentials: true,
    origin: process.env.REACT_APP_HEROKU || "http://localhost:3000"
}

app.use(cors(corsParams));
app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
app.use(cp());

app.use(express.static(path.join(__dirname, '../build')));

app.use("/api", api);

app.get('/*', (q, a) => {
    a.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server, {cors: corsParams});

ioServer(io);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, ()=>{
    console.log(PORT);
})

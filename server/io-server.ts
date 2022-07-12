import { Server } from "socket.io";
import tokenService from "./services/tokenService";
import { AppError } from "./errors/errorHandler";
import dbService from "./services/dbService";
import { IMessage } from '../src/types/message-types';

interface IMessageData {
    id: string;
    message: IMessage;
}

const ioServer = (io: Server) => {

    const usersTyping: string[] = [];

    io.use((socket,next)=>{
        const token = socket.handshake.auth.token;
        const isValid = tokenService.verifyToken(token, "access");
        if(!isValid){
            console.log("user conn rejected");
            next(AppError.Unauthorized());
        }
        next();
    });

    io.on("connection", socket => {
        socket.on("join-room", async(id: string)=>{
            socket.join(id);
            const updatedRoom = await dbService.joinUserToRoom(+id);
            io.to(id).emit("online-count", updatedRoom);
        })
        socket.on("typing-start", (username: string, id: string)=>{
            if(!usersTyping.includes(username)) {
                usersTyping.push(username);
                socket.to(id).emit("typing-start", usersTyping);
            }
        });
        socket.on("typing-end", (username: string, id: string)=>{
            usersTyping.splice(usersTyping.indexOf(username),1);
            socket.to(id).emit("typing-end", usersTyping);
        })
        socket.on("chat-message", (data: IMessageData)=>{
            io.to(data.id).emit("chat-message", {
                ...data.message, 
                timestamp: new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"})
            })
        });
        socket.on("disconnecting", async()=>{
            const [,roomid] = socket.rooms;
            const updatedRoom = await dbService.rmUserFromRoom(+roomid);
            io.to(roomid).emit("online-count", updatedRoom);
        });
    })
}   

export default ioServer;
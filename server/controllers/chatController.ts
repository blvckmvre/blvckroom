import { NextFunction, Request, Response } from "express";
import dbService from "../services/dbService";

class ChatController {
    async createRoom(q: Request, a: Response, next: NextFunction) {
        try {
            const rooms = await dbService.mkRoom(q.body.name, q.body.creator);
            return a.json(rooms);
        } catch(e) {
            next(e);
        }
    }
    async getRooms(q: Request, a: Response, next: NextFunction) {
        try {
            const rooms = await dbService.getRooms();
            return a.json(rooms);
        } catch(e) {
            next(e);
        }
    }
    async deleteRoom(q: Request, a: Response, next: NextFunction) {
        try {
            const rooms = await dbService.rmRoom(q.body.id, q.body.creator);
            return a.json(rooms);
        } catch(e) {
            next(e);
        }
    }
    async getSpecificRoom(q: Request, a: Response, next: NextFunction) {
        try {
            const room = await dbService.getOneRoom(q.query.id as unknown as number);
            return a.json(room);
        } catch(e) {
            next(e);
        }
    }
}


export default new ChatController();
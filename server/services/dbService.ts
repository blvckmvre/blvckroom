import { Pool } from "pg";
require("dotenv").config();

interface IUserRow {
    id: number;
    username: string;
    password: string;
}

interface ITokenRow {
    userid: number;
    token: string;
}

const pool = new Pool({
    connectionString: process.env.POSTGRES,
    ssl: {
        rejectUnauthorized: false
    }
})

class DBService {
    async findToken(token: string){
        try {
            const res = await pool.query(`
                SELECT * FROM chat_tokens
                WHERE token='${token}';
            `)
            return res.rows as ITokenRow[];
        }
        catch(e) {
            throw e;
        }
    }
    async findTokenMatch(userID: number){
        try {
            const res = await pool.query(`
                SELECT * FROM chat_tokens
                WHERE userid=${userID};
            `);
            return res.rows as ITokenRow[];
        } catch(e) {
            throw e;
        }

    }
    async findUserMatch(username: string){
        try {
            const res = await pool.query(`
                SELECT * FROM chat_users 
                WHERE username='${username}';
            `);
            return res.rows as IUserRow[];
        } catch(e) {
            throw e;
        }
    }
    async findUserById(id: number){
        try {
            const res = await pool.query(`
                SELECT * FROM chat_users 
                WHERE id=${id};
            `);
            return res.rows[0] as IUserRow;
        } catch(e) {
            throw e;
        }
    }
    async addUser(username: string, password: string){
        try {
            const res = await pool.query(`
                INSERT INTO chat_users(username,password)
                VALUES('${username}','${password}')
                RETURNING id;
            `);
            return res.rows[0].id as number;
        } catch (e) {
            throw e;
        }
    }
    async addToken(userID: number, token: string){
        try {
            await pool.query(`
                INSERT INTO chat_tokens
                VALUES(${userID},'${token}')
            `);
        } catch(e) {
            throw e;
        }
    }
    async updateToken(userID: number, token: string) {
        try {
            await pool.query(`
                UPDATE chat_tokens
                SET token = '${token}'
                WHERE userid = ${userID};
            `);
        } catch(e) {
            throw e;
        }
    }
    async rmToken(token: string) {
        try {
            await pool.query(`
                DELETE FROM chat_tokens
                WHERE token = '${token}';
            `);
        } catch(e) {
            throw e;
        }
    }
    async createTables(){
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS chat_users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(16) UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
                CREATE TABLE IF NOT EXISTS chat_tokens(
                userid INTEGER UNIQUE NOT NULL,
                token TEXT NOT NULL,
                FOREIGN KEY (userID) REFERENCES chat_users(id)
            );
                CREATE TABLE IF NOT EXISTS chat_rooms(
                roomid SERIAL PRIMARY KEY,
                name VARCHAR(24) UNIQUE NOT NULL,
                users INTEGER NOT NULL,
                creator VARCHAR(16) NOT NULL
            );`)
        } catch(e) {
            throw e;
        }
    }



    async getRooms() {
        try {
            const res = await pool.query(`
                SELECT * FROM chat_rooms
                ORDER BY users DESC;
            `);
            return res.rows;
        } catch(e) {
            throw e;
        }
    }
    async mkRoom(name: string, creator: string) {
        try {
            await pool.query(`
                INSERT INTO chat_rooms(name,creator,users)
                VALUES('${name}','${creator}',0);
            `);
            return this.getRooms();
        } catch(e) {
            throw e;
        }
    }
    async rmRoom(id: number, creator: string) {
        try {
            await pool.query(`
                DELETE FROM chat_rooms
                WHERE roomid=${id} AND creator='${creator}';
            `);
            return this.getRooms();
        } catch(e) {
            throw e;
        }
    }
    async getOneRoom(id: number) {
        try {
            const res = await pool.query(`
                SELECT * FROM chat_rooms
                WHERE roomid=${id};
            `);
            return res.rows[0];
        } catch(e) {
            throw e;
        }
    }
    async joinUserToRoom(id: number) {
        try {
            await pool.query(`
                UPDATE chat_rooms
                SET users = users + 1
                WHERE roomid=${id};
            `);
            return this.getOneRoom(id);
        } catch(e) {
            throw e;
        }
    }
    async rmUserFromRoom(id: number) {
        try {
            await pool.query(`
                UPDATE chat_rooms
                SET users = users - 1
                WHERE roomid=${id};
            `);
            return this.getOneRoom(id);
        } catch(e) {
            throw e;
        }
    }
}

export default new DBService();
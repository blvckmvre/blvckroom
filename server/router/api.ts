import { Router } from "express";
import userController from "../controllers/userController";
import { body } from "express-validator"
import chatController from "../controllers/chatController";

const router = Router();
const auth = require('../auth');

(async function(){
    await userController.initialize();

    router.post("/signup", body(["password","username"]).isLength({max: 16, min: 4}), userController.signUserUp);

    router.post("/login", userController.logUserIn);

    router.get("/logout", userController.logUserOut);

    router.get("/refresh", userController.refresh);

    router.get("/rooms", auth, chatController.getRooms);

    router.post("/mkroom", auth, chatController.createRoom);

    router.post("/rmroom", auth, chatController.deleteRoom);

    router.get("/room", auth, chatController.getSpecificRoom);
})();

export default router;

import express from "express"
import { login, logout, myprofile, register } from "../controllers/user_controller.js";
import { authMiddleware } from "../middleware/auth.js";
const routes = express.Router();


routes.post('/login', login);
routes.post('/singup', register)
routes.post('/me', authMiddleware, myprofile)
routes.post('/logout', logout)


export default routes;

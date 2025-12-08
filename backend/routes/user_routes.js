import express from "express"
import { login, logout, myprofile, register, makeAdmin } from "../controllers/user_controller.js";
import { authMiddleware } from "../middleware/auth.js";
const routes = express.Router();


routes.post('/login', login);
routes.post('/signup', register)
routes.post('/me', authMiddleware, myprofile)
routes.post('/logout', logout)
routes.put('/make-admin', makeAdmin)


export default routes;

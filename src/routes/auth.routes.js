import { Router } from "express";
import { register, login, logout, validateToken, deleteUser, updateUser } from "../controllers/auth.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/validateToken', validateToken);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

export default router;
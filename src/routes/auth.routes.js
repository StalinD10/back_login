import { Router } from "express";
import { register, login, logout, validateToken, deleteUser, updateUser } from "../controllers/auth.controller.js";

import { addDesignToUser, deleteDesign, getAllDesigns, updateDesign } from "../controllers/designsUser.controller.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/validateToken', validateToken);
router.put('/updateUser/:id', updateUser);
router.get('/getDesings/:id', getAllDesigns);
router.post('/addDesignToUser/:id', addDesignToUser);
router.put('/updateDesign/:id,:designId', updateDesign);
router.delete('/deleteDesign/:id,:designId', deleteDesign);

export default router;
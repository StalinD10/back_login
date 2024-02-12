import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js';
import { deleteImage, uploadImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export const register = async (req, res) => {

    const { email, password, username } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            image_user: {
                public_id: "",
                image_url: ""
            }
        });

        if (req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath);
            newUser.image_user = {
                public_id: result.public_id,
                image_url: result.secure_url
            }

            await fs.unlink(req.files.image.tempFilePath)
        }

        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });

        res.json({
            user: {
                id: userSaved._id,
                username: userSaved.username,
                email: userSaved.email,
                image: userSaved.image_user
            },
            token: token

        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });


        const token = await createAccessToken({ id: userFound._id });

        res.json({
            user: {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                image: userFound.image_user
            },
            token: token

        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "El usuario no existe" });

        if (user.image_user?.public_id) {
            await deleteImage(user.image_user.public_id);
        }

        return res.json(user);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        console.log(user)
        if (!user) return res.status(404).json({ message: "El usuario no existe" });

        // Actualiza los campos del usuario con los datos del cuerpo de la solicitud
        if (req.body) {
            Object.assign(user, req.body);
        }

        //Eliminar la anterior imagen
        if (user.image_user && user.image_user.public_id) {
            await deleteImage(user.image_user.public_id);
        }

        // Maneja la subida de imágenes si está presente en la solicitud
        if (req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath);
            user.image_user = {
                public_id: result.public_id,
                image_url: result.secure_url
            };
            await fs.unlink(req.files.image.tempFilePath);
        }

        // Guarda los cambios en la base de datos
        const userUpdated = await user.save();

        return res.json(userUpdated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
}

export const validateToken = async (req, res) => {
    const tokenHeader = req.header('x-token');

    if (!tokenHeader) {
        res.status(401).json({ message: 'No hay token en la petición' });
    }
    try {
        const { id } = jwt.verify(tokenHeader, TOKEN_SECRET);

        const userSaved = await User.findById(id);
        if (!userSaved) {
            return res.status(401).json({ message: 'Token no válido - usuario no existe' })
        }
        res.json({
            user: {
                id: userSaved._id,
                username: userSaved.username,
                email: userSaved.email,
            },
            token: tokenHeader
        });

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
import User from '../models/user.model.js';
import { deleteImage, uploadImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export async function addDesignToUser(req, res) {
    const { id } = req.params;
    const { title, description, message } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const newDesign = { title, description, message };


        if (req.files?.image_design) {

            const result = await uploadImage(req.files.image_design.tempFilePath);
            newDesign.image_design = {
                public_id: result.public_id,
                image_url: result.secure_url
            };

            await fs.unlink(req.files.image_design.tempFilePath);
        }

        user.designs_user.push(newDesign);
        await user.save();
        return res.status(201).json(user.designs_user);
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function updateDesign(req, res) {
    const { id, designId } = req.params;
    const { title, description } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const design = user.designs_user.id(designId);
        if (!design) {
            return res.status(404).json({ error: 'Diseño no encontrado' });
        }

        if (title) design.title = title;
        if (description) design.description = description;

        await user.save();

        return res.status(200).json(design);
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function deleteDesign(req, res) {
    const { id, designId } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const design = user.designs_user.find(design => design._id.toString() === designId);

        if (!design) {
            return res.status(404).json({ error: 'Diseño no encontrado para este usuario' });
        }

        if (user.designs_user[0].image_design.public_id) {
            await deleteImage(user.designs_user[0].image_design.public_id);
        }

        user.designs_user.pull(designId);
        await user.save();

        return res.status(200).json({ correcto: 'Diseño eliminado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export async function getAllDesigns(req, res) {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json(user.designs_user);
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

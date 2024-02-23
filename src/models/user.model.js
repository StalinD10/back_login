import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image_design: {
        public_id: String,
        image_url: String
    },
    message: {
        type: String,
        trim: true
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    image_user: {
        public_id: String,
        image_url: String
    },
    designs_user: [designSchema] // Campo para almacenar múltiples diseños por usuario
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);

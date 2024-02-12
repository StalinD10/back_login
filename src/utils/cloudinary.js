import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config.js';

cloudinary.config({

    cloud_name: 'dzfkp5ble',
    api_key: '825251458227399',
    api_secret: 'xDoYYbrv_21tYbiVl4Xr1nOH4Lc',
    secure: true

});
export async function uploadImage(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'user-image'
    })

} export async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId);
}
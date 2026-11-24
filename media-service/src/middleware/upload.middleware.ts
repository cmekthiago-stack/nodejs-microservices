import multer from 'multer';
import { Request } from 'express';
import { AppError } from 'shared';

/*const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!allowedTypes.includes(file.mimetype)) {
  return cb(new AppError('Only JPEG, PNG, WebP and GIF images are allowed!', 400));
}
  */

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 10 * 1024 * 1024}, // Limit file size to 10MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError('Only image files are allowed!', 400));
    
    }
    cb(null, true);
  },
}).single('image');
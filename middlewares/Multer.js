import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";


const storage = multer.memoryStorage();
export const uploadFiles = multer({ storage }).single("file");

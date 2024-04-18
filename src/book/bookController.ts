import path from "node:path";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] }; //declarating of multer types of typescript

  //extracting the file properties from files
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
  try {
    //uploading coverImage
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    res.json({ messag: "something" });
  } catch (error) {
    return next(createHttpError(500, "Error Occured during the file upload"));
  }

  try {
    //extracting properties from pdf
    const bookFileName = files.file[0].filename;
    const bookFiledPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const pdfFileMimeType = files.file[0].mimetype.split("/").at(-1);

    //uploading pdf here
    const bookFileUploadsResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: pdfFileMimeType,
    });
  } catch (error) {
    return next(createHttpError(500, "error while uploading"));
  }
};

export { createBook };

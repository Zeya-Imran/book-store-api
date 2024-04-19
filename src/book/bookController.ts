import path from "node:path";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, gener } = req.body;

  let uploadPdfFile: any;
  let uploadcoverImage: any;
  let pdfBookFilePath: any;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }; //declarating of multer types of typescript

  //extracting the file properties from files
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const coverImageFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
  try {
    //uploading coverImage
    uploadcoverImage = await cloudinary.uploader.upload(coverImageFilePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
  } catch (error) {
    return next(createHttpError(500, "Error Occured during the file upload"));
  }

  try {
    //extracting properties from pdf
    const bookFileName = files.file[0].filename;
    pdfBookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const pdfFileMimeType = files.file[0].mimetype.split("/").at(-1);

    //uploading pdf here
    uploadPdfFile = await cloudinary.uploader.upload(pdfBookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: pdfFileMimeType,
    });
  } catch (error) {
    return next(createHttpError(500, "error while uploading"));
  }
  //console.log("upload pdf file", uploadPdfFile);

  //db call for save the book data
  try {
    const newBook = await bookModel.create({
      title,
      gener,
      author: "66212988008ad220ec52a21f",
      coverImage: uploadcoverImage.secure_url,
      file: uploadPdfFile.secure_url,
    });
    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(pdfBookFilePath);
    res.status(201).json(newBook);
  } catch (error) {
    console.log(error);

    return next(createHttpError(500, "error while create book"));
  }
};

export { createBook };

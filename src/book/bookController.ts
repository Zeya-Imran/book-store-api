import path from "node:path";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthReques } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

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

  //db call for save the book data
  const _req = req as AuthReques;
  try {
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const { title, genre } = req.body;
  const book = await bookModel.findOne({ _id: bookId });
  if (!book) return res.status(404).json({ message: "book not found" });

  const _req = req as AuthReques;
  if (book.author.toString() !== _req.userId)
    return res.status(403).json({ message: "Unauthorized" });

  // query for update the data
  console.log(req.body);
  console.log(req.files);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }; //declarating of multer types of typescript
  let uploadcoverImage: any;
  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const coverImageFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    try {
      //uploading coverImage
      uploadcoverImage = await cloudinary.uploader.upload(coverImageFilePath, {
        filename_override: filename,
        folder: "book-covers",
        format: coverImageMimeType,
      });
      await fs.promises.unlink(coverImageFilePath);
    } catch (error) {
      return next(createHttpError(500, "Error Occured during the file upload"));
    }
  }
  let pdfBookFilePath: any;
  let uploadPdfFile: any;
  if (files.file) {
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
      await fs.promises.unlink(pdfBookFilePath);
    } catch (error) {
      return next(createHttpError(500, "error while uploading"));
    }
  }

  try {
    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title,
        genre,
        coverImage: files.coverImage
          ? uploadcoverImage.secure_url
          : book.coverImage,
        file: files.file ? uploadPdfFile.secure_url : book.file,
      }
    );
    res.status(201).json({ id: updatedBook });
  } catch (error) {
    return createHttpError(500, "error in updating the data");
  }
};
export { createBook, updateBook };

import { User } from "../users/userTypes";

export interface Book {
  _id: String;

  title: String;

  author: User;

  genre: String;

  coverImage: String;

  file: String;
}

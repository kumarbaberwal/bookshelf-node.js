"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBooksByUser = exports.deleteBook = exports.getAllBooks = exports.bookController = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const book_1 = require("../models/book");
const bookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, caption, rating, image } = req.body;
        if (!title || !caption || !rating || !image) {
            return res.status(400).json({
                message: 'Please provide all fields',
            });
        }
        // upload the image to cloudinary
        const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
        // get the image url from the cloudinary
        const imageUrl = uploadResponse.secure_url;
        // save this to the mongodb
        const newBook = new book_1.Book({
            title: title,
            caption: caption,
            rating: rating,
            image: imageUrl,
            user: req.user.userId,
        });
        yield newBook.save();
        res.status(201).json(newBook);
    }
    catch (error) {
        console.log('Error creating book: ', error);
        res.status(500).json({
            message: "Error creating book",
        });
    }
});
exports.bookController = bookController;
// pagination => infinite scrolling
// first 5 books => then 5 books => then 5 books
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const skip = (page - 1) * limit;
        const books = yield book_1.Book.find()
            .sort({ createdAt: -1 }) // Sort books in descending order by creation date
            .skip(skip) // Skip over a number of documents (for pagination)
            .limit(limit) // Limit the number of documents returned
            .populate('user', 'username profileImage'); // Populate 'user' field with specific user fields ('username', 'profileImage')
        const totalBooks = yield book_1.Book.countDocuments();
        res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });
    }
    catch (error) {
        console.log("Error in Fetching All Books: ", error);
        res.status(500).json({
            message: 'Error in Fetching All Books',
        });
    }
});
exports.getAllBooks = getAllBooks;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const book = yield book_1.Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }
        // check if user is the creator of the book 
        if (book.user.toString() !== req.user.userId.toString()) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
        // delete the image from cloudinary as well
        if (book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = (_a = book.image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (publicId) {
                    yield cloudinary_1.default.uploader.destroy(publicId);
                }
            }
            catch (error) {
                console.log("Error deleting image from the cloudinary: ", error);
            }
        }
        yield book.deleteOne();
        res.status(200).json({
            message: 'Book deleted successfully'
        });
    }
    catch (error) {
        console.log("Error deleting book: ", error);
        res.status(500).json({
            message: 'Error deleting book',
        });
    }
});
exports.deleteBook = deleteBook;
const getAllBooksByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book_1.Book.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(books);
    }
    catch (error) {
        console.log("Get user books error: ", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
exports.getAllBooksByUser = getAllBooksByUser;

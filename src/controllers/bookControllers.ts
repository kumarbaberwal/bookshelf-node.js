import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import { Book } from "../models/book";

export const bookController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({
                message: 'Please provide all fields',
            });
        }

        // upload the image to cloudinary

        const uploadResponse = await cloudinary.uploader.upload(image);

        // get the image url from the cloudinary

        const imageUrl = uploadResponse.secure_url;


        // save this to the mongodb
        const newBook = new Book({
            title: title,
            caption: caption,
            rating: rating,
            image: imageUrl,
            user: req.user.userId,
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.log('Error creating book: ', error);
        res.status(500).json({
            message: "Error creating book",
        })
    }
}

// pagination => infinite scrolling
// first 5 books => then 5 books => then 5 books
export const getAllBooks = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 5;
        const skip = (page - 1) * limit;
        const books = await Book.find()
            .sort({ createdAt: -1 })  // Sort books in descending order by creation date
            .skip(skip)               // Skip over a number of documents (for pagination)
            .limit(limit)             // Limit the number of documents returned
            .populate('user', 'username profileImage');  // Populate 'user' field with specific user fields ('username', 'profileImage')

        const totalBooks = await Book.countDocuments();

        res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        })


    } catch (error) {
        console.log("Error in Fetching All Books: ", error);
        res.status(500).json({
            message: 'Error in Fetching All Books',
        });
    }
}

export const deleteBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const book = await Book.findById(req.params.id);
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
                const publicId = book.image.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (error) {
                console.log("Error deleting image from the cloudinary: ", error);
            }
        }

        await book.deleteOne();
        res.status(200).json({
            message: 'Book deleted successfully'
        })
    } catch (error) {
        console.log("Error deleting book: ", error);
        res.status(500).json({
            message: 'Error deleting book',
        });
    }
}


export const getAllBooksByUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const books = await Book.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.log("Get user books error: ", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}
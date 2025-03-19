import express from 'express';
import { veryfyToken } from '../middlewares/authMiddleware';
import { bookController, deleteBook, getAllBooks, getAllBooksByUser } from '../controllers/bookControllers';

const router = express.Router();

router.post('/', veryfyToken, bookController);
router.get('/', veryfyToken, getAllBooks);
router.delete('/:id', veryfyToken, deleteBook);
router.get('/user', veryfyToken, getAllBooksByUser);

export default router;
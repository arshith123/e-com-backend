import express from 'express';
import { clearCart, getCartItemsByUser, insert, removeCartItem,  } from '../controllers/shoppingCartController.js';
import { authenticateToken } from '../middleware/authentication.js';

const router = express.Router();

router.post('/save',authenticateToken, insert);   
router.get('/getCartItem',authenticateToken, getCartItemsByUser);              
router.delete('/deleteAll',authenticateToken, clearCart);
router.delete('/delete/:id',authenticateToken, removeCartItem);

export default router;
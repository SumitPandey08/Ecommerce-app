import express from 'express';
import { signUp, verifySeller , login ,resendOTP,forgotPassword , resetPassword , updateProduct, addProduct,getProducts, deleteProduct} from '../controllers/seller.control.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify', verifySeller);
router.post('/login', login);
router.post('/resend-otp', protect, resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', protect, resetPassword);
router.post('/add-product', protect, addProduct);
router.get('/products', protect, getProducts);
router.put('/update-product/:id', protect, updateProduct);
router.delete('/delete-product/:id', protect, deleteProduct);


export default router;

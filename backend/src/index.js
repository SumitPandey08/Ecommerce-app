import express from 'express' ;
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import dbConnect from './dbConnect.js/dbConnect.js';
import productRoutes from './routes/product.route.js';
import sellerRoutes from './routes/seller.route.js';
import cors from 'cors';

dotenv.config();




const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);

const PORT = process.env.PORT || 5000;

dbConnect();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
) ;





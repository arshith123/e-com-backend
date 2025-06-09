import express from 'express'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import productRoutes from './routes/productRoute.js';
import shoppingCartRoutes from './routes/shoppingCartRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow all origins (for dev purposes)
app.use(cors());

connectDB();
// ✅ Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users',userRoutes)
app.use('/api/products',productRoutes)
app.use('/api/shoppingcart',shoppingCartRoutes)


app.get('/',(req,res) => {
    res.send('server is running');
})

app.listen(PORT,() => {
    console.log(`Server is listening on a http://localhost:${PORT}`);
})
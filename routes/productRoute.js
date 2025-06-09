import express from 'express';
import { createOrUpdate, deleteProduct, getIntialData } from '../controllers/productController.js';
import upload from '../utils/upload.js';


const router = express.Router();

router.post('/save',upload.any(),createOrUpdate);
router.delete('/delete/:id', deleteProduct)
router.get('/getIntialData', getIntialData)



export default router;
import dotenv from 'dotenv'
import mongoose from 'mongoose'



dotenv.config()


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Mongo Db Connected');
    
    }catch(error){
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
}

export default connectDB;
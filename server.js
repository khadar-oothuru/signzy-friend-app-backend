import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {    
    res.send('Snizy Backend');
}
)


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
    })
    .catch(error => console.log(error));

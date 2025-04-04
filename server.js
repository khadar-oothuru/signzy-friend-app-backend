import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js'; 
import favicon from 'serve-favicon';
import path from 'path';  

dotenv.config();

connectDB();
const app = express();
app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('API is running (Signzy)...');
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

import bodyParser from 'body-parser';
import express from 'express';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import connectDB from './config';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  
 extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.get('/', (_,res) => {
    res.send('Hello, world!');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
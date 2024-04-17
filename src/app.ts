import express from 'express';
import globalErrorHandler from './middlewares/globalErrorhandler';
import userRouter from './users/userRouter';


const app = express();

app.get('/',(req,res) => {
    res.json({message: 'welcome to the ebook library'});
})


//routes
app.use('/api/users',userRouter);




//global error handling 
app.use(globalErrorHandler)

export default app;
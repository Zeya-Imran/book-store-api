import express from 'express';
import globalErrorHandler from './middlewares/globalErrorhandler';


const app = express();

app.get('/',(req,res) => {
    res.json({message: 'welcome to the ebook library'});
})

//global error handling 

app.use(globalErrorHandler)

export default app;
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorhandler';
import userRouter from './users/userRouter';
var bodyParser = require('body-parser')

const app = express();

app.get('/',(req,res) => {
    res.json({message: 'welcome to the ebook library'});
})



//middlewares (receiving form data and parse)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



//routes
app.use('/api/users',userRouter);




//global error handling 
app.use(globalErrorHandler)

export default app;
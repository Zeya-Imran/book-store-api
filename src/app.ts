import express from 'express';
const app = express();

app.get('/',(req,res) => {
    res.json({message: 'welcome to the ebook library'});
})

export default app;
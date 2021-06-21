import express from "express"
import cors from "cors"
import Reviews from "./src/models/reviewsModel.js"
import multer from "./src/core/multer.js"

const app = express();


let corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST','DELETE'],
    credentials: true
};

app.use(express.json());
app.use(cors(corsOptions))
app.use('/uploads',express.static('uploads'))


app.get("/reviews",(req,res) => {
    res.status(200).json(Reviews.getReviews())
})
app.post("/reviews",multer.array('files',3),(req,res) => {
    let data = {...req.body}
    data.images = req.files.map(el => el.path);
    data.id = Math.random() * 1000;
    res.status(200).json(Reviews.addReview(data))
})

app.listen(8888, (err) => {
    if(err) {
        return
    }
    console.log("Server started!!!");
})
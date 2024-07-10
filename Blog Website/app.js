const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://deva:deva1234@cluster0.mnpgtme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

app.get('/newpost', (req, res) => {
    res.render('newpost');
});

app.post('/newpost', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({
        title,
        content
    });
    await post.save();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

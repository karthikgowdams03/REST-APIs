const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get(async (req, res) => {

        const Articles = await Article.find({});
        res.send(Articles);
    })
    .post(async (req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const article = new Article({
            title: title,
            content: content
        });
        await article.save();
        res.send('Added new Record');
    })
    .delete(async (req, res) => {
        await Article.deleteMany({});
        res.send('Deleted all Records');
    });

app.route('/articles/:articleTitle')
    .get(async (req, res) => {
        const article = await Article.findOne({ title: req.params.articleTitle }).exec();

        if (!article) {
            res.send('Article not found');
        }
        else {
            res.send(article);
        }
    })
    .put(async (req, res) => {
        const articleTitle = req.params.articleTitle;

        const article = await Article.findOneAndUpdate({ title: articleTitle }, { title: req.body.title, content: req.body.content },
            { new: true, overwrite: true }).exec();

        if (!article) {
            res.send('Article not found');
        }
        else {
            res.send('Sucessfully Updated the Article');
        }
    })
    .patch(async (req, res) => {
        const article = await Article.findOneAndUpdate({ title: req.params.articleTitle }, { $set: req.body }).exec();
        if (!article) {
            res.send('Article not found');
        }
        else {
            res.send('Sucessfully Updated the Article');
        }
    })
    .delete(async (req, res) => {
        const article = await Article.findOneAndRemove({ title: req.params.articleTitle }).exec();
        if (!article) {
            res.send('Article not found');
        }
        else {
            res.send('Sucessfully Deleted Article');
        }
    })


app.listen(port, () => {
    console.log(`listening at port ${port}`);
});
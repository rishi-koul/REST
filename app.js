// jshint esversion:6

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true})

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)

// Request targeting all articles
app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticle){
        if(!err){
            res.send(foundArticle);
        }
        else{
            res.send(err);
        }
    })
})
.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if(!err){
            res.send("Succesfully Added")
        }
        else{
            res.send(err);
        }
    });
})
.delete(function(req, res){

    Article.deleteMany({}, function(err){
        if(!err){
            res.send("Successfully deleted");
        }
        else{
            res.send(err);
        }
    })
 });

// Request targeting specific articles
app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }
        else{
            res.send("No article found with the title")
        }
    })
})
.put(function(req, res){
    Article.update(
        {
            title: req.params.articleTitle
        },
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite: true},
        function(err, results){
            if(!err){
                res.send("Succesfully updated");
            }
            else{
                res.send(err)
            }
        }
        )
})
.patch(function(req, res){
    Article.update(
        {
            title: req.params.articleTitle
        },
        // {
        //     $set: {content: req.body.content}
        // },
        {
            $set: req.body
        },
        function(err, results){
            if(!err){
                res.send("Succesfully partial-updated");
            }
            else{
                res.send(err)
            }
        }
        )
})
.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(!err){
            res.send("Succesfully deleted")
        }
        else{
            res.send(err)
        }
    })
});
app.listen(3000, function(){
    console.log("Server started at port 3000")
})
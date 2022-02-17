const express = require('express');
const app = express();

const path = require('path');

// handlebars template
const hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}))
app.use(express.static('public'));

const mysql = require('mysql');
const bodyParser = require('body-parser');
const Console = require("console");

app.use(bodyParser.urlencoded({extended: true}));

// DB connection

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "joga_mysql"
});

con.connect(function (err){
    if(err) throw err;
    console.log("Connected to joga_mysql DB");
})

app.get('/',(req, res)=>{
    let query = "SELECT * FROM article";
    let articles = [];
    con.query(query, (err, result)=>{
        if(err) throw err;
        articles = result;
        res.render("index", {articles: articles});
    })
})

app.get('/article/:slug', (req, res) =>{
    let query = `SELECT article.name, article.slug, article.image, article.body, article.published, author.name FROM article INNER JOIN author ON article.author_id=author.id WHERE slug='${req.params.slug}'`;
    let article;
    con.query(query, (err, result) =>{
        if (err) throw err;
        console.log(result);
        article = result;
        res.render('article', {article: article});
    })
})

app.listen(3009, ()=>{
    console.log("App is started at http://localhost:3009");
});
// tets
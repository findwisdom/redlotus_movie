/**
 * Created by Administrator on 2016/11/2.
 */
var express = require('express');
var path = require('path');
var _ = require('underscore');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var bodyParser =require('body-parser');
var app = express();
app.set('port', process.env.PORT || 3000);

//connect mongodb
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://127.0.0.1:3000/test");
db.connection.on("error", function (error) {  console.log("数据库连接失败：" + error); });
db.connection.on("open", function () {  console.log("------数据库连接成功！------"); });



//creat engine
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout:'main',
        partialsDir: 'views/partials',
        layoutsDir:'views/layouts/',
        extname: '.handlebars'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


//app.set('views',__dirname+'views');
app.use(express.static(path.join(__dirname,'/public')));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


//index page
app.get('/', function(req, res) {
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('pages/index',{
            title:'imooc',
            movies:movies
        });

    });
});

//detail page
app.get('/movie/:id', function(req, res) {
    var id = req.body.id;
    Movie.findById(id,function(err,movie){
        res.render('pages/detail',{
            title:'imooc'+movie.title,
            movie:movie
        });
    });
});

//admin post movie
app.post('/admin/movie/new',function(req,res){
    var id = req.body._id;
    var movieObj = {
        title:req.body.title,
        doctor:req.body.doctor,
        country:req.body.country,
        language:req.body.language,
        year:req.body.year,
        poster:req.body.poster,
        summary:req.body.summary,
        flash:req.body.flash
    };
    var _movie;

    /*if(id !== 'undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }
            _movie = _.extend(movie,movieObj);
            console.log(_movie);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/page/movie/'+ movie._id)
            })
        })
    }
    else{*/
        _movie =new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });

        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id)
        });
    //}
});

//admin page
app.get('/admin/movie', function(req, res) {
    res.render('pages/admin',{title:'imooc'});
});

//admin updata movie
app.get('/admin/update/:id',function(err,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id, function (err,movie){
            res.render('page/admin',{
                title:'redlotus 后台更新页',
                movie:movie
            })
        })
    }
})

//list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('pages/list',{
            movies:movies,
            helpers: {
                showtime: function(num, options) {
                    var mouth = num.getMonth();
                    var year = num.getFullYear();
                    var date = num.getDate()
                    var time = year + '-' + mouth + '-' + date;
                    return time;
                }
            }
        });
    });
});

//list delete movie

app.delete('/admin/list',function(err,req,res){
   var id = req.body.id;
    if(id){
        if(err){
            console.log(err)
        }else {
            console.log(id);
            res.json({success:1})
        }
    }
    /*if(id){
        Movie.remove({_id: id}, function(err,movie){
            if(err){
                console.log(err)
            }
            else {
                res.json({success:1})
            }
        })
    }*/
});
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});

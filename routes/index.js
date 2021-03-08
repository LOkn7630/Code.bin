const express = require('express');
const router = express.Router();
var fs = require('fs');
var filesdes = require('../model/filesdes');
const { ensureAuthenticated } = require('../config/auth');
//Welcome
router.get('/', (req, res) => res.render('welcome'));




router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log(req.session);
    var a = req.session.passport.user;
    filesdes.find({ user: a })
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        _id: doc._id,

                        url: "http://localhost:5000/uploads/" + doc.name

                    };
                })
            };
            //     console.log(response);
            //   if (docs.length >= 0) {
            // console.log(response.products)
            res.render("dashboard", { response: response.products, req: req, res: res });
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});



router.get('/showall', ensureAuthenticated, (req, res) => {


    // console.log(req.session);
    //  var a = req.session.passport.user;
    // console.log(a);
    filesdes.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        _id: doc._id,

                        url: "http://localhost:5000/uploads/" + doc.name

                    };
                })
            };
            //     console.log(response);
            //   if (docs.length >= 0) {
            // console.log(response.products)
            res.render("show_files", { response: response.products });
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.get("/delete/:id", (req, res, next) => {
    const id = req.params.id;
    filesdes.remove({ name: id })
        .exec()
        .then()
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    var file_path = "uploads/" + req.params.id;
    fs.unlinkSync(file_path);
    res.redirect('/dashboard');
});


module.exports = router;
var express = require('express');
var router = express.Router();
const { Book } = require('../models');

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      res.status(500).send(err);
    }
  };
}

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books, title: 'Books' });

    // console.log(books);
  })
);

module.exports = router;

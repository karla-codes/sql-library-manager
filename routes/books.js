var express = require('express');
var router = express.Router();
const { Book } = require('../models');

// async/await handler function
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

/* GET books listing */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books, title: 'Books' });
  })
);

// Create a new book form
router.get('/new-book', (req, res) => {
  res.render('new-book');
  // console.log(req.body);
});

// POST new book

// GET individual book info

// POST updated book info

// POST delete

module.exports = router;

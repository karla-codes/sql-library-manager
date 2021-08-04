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
router.get('/new', (req, res) => {
  res.render('new-book');
});

// POST new book
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.redirect('/books/' + book.id);
  })
);

// GET individual book info
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.redirect('/');
  })
);

// POST updated book info

// POST delete

module.exports = router;

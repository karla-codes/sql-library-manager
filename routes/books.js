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
  '/new',
  asyncHandler(async (req, res) => {
    // check if validation error
    try {
      await Book.create(req.body);
      res.redirect('/books');
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        await Book.build(req.body);
        res.render('new-book', { error: true });
      }
    }
  })
);

// GET individual book info
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('show-book', {
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        id: book.id,
      });
    } else {
      res.status(404).render('page-not-found');
    }
  })
);

// GET update book form
router.get(
  '/:id/edit',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book });
  })
);

// POST updated book
router.post(
  '/:id/edit',
  asyncHandler(async (req, res) => {
    let book;

    // check if validation error
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/books');
      } else {
        res.status(404).render('page-not-found');
      }
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', { book, error: true });
      } else {
        throw error;
      }
    }
  })
);

// GET delete book form
router.get(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('delete-book', { book });
  })
);

// POST delete
router.post(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
  })
);

module.exports = router;

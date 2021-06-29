/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();

/* Home */
router.get('/', (req, res, next) => {
  res.clearCookie('token');
  res.render('index', {
    title: 'Chess Game',
    CsrfParam: req.csrfToken(),
  });
});

module.exports = router;

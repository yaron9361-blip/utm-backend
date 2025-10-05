const express = require('express');
const router = express.Router();
const redirectController = require('../controllers/redirectController');

/**
 * @route   GET /s/:slug
 * @desc    Редирект по короткой ссылке
 * @access  Public
 */
router.get('/:slug', redirectController.redirect);

module.exports = router;
const express = require('express');
const router = express.Router();
const utmController = require('../controllers/utmController');

/**
 * @route   POST /api/utm/generate
 * @desc    Создать UTM-метку
 * @access  Public
 */
router.post('/generate', utmController.generateUtm);

/**
 * @route   POST /api/utm/validate
 * @desc    Валидировать URL
 * @access  Public
 */
router.post('/validate', utmController.validateUrl);

module.exports = router;
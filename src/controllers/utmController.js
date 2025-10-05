const utmService = require('../services/utmService');
const { validateUtmParams } = require('../utils/validators');

/**
 * Создание UTM-метки
 * POST /api/utm/generate
 */
async function generateUtm(req, res) {
  try {
    const { 
      original_url, 
      utm_source, 
      utm_medium, 
      utm_campaign, 
      utm_term, 
      utm_content
    } = req.body;

    // Валидация входных данных
    if (!original_url) {
      return res.status(400).json({
        success: false,
        error: 'Требуется original_url'
      });
    }

    // Валидация UTM параметров
    const validation = validateUtmParams({
      utm_source,
      utm_medium,
      utm_campaign
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Ошибка валидации',
        details: validation.errors
      });
    }

    // Генерируем UTM-метку через сервис
    const result = await utmService.generateUTM({
      original_url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    });

    // Отправляем успешный ответ
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in generateUtm:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка создания UTM-метки',
      message: error.message
    });
  }
}

/**
 * Валидация URL
 * POST /api/utm/validate
 */
function validateUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'Требуется параметр url'
      });
    }

    const validators = require('../utils/validators');
    const validation = validators.validateUrl(url);

    if (validation.valid) {
      res.json({
        valid: true,
        message: 'URL корректный'
      });
    } else {
      res.status(400).json({
        valid: false,
        error: validation.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Ошибка валидации',
      message: error.message
    });
  }
}

module.exports = {
  generateUtm,
  validateUrl
};
const { validateUtmParams } = require('../utils/validators');
const { generateUtmUrl } = require('../services/utmService');
const { createShortUrl } = require('../services/shortenerService');
const { generateQRCode } = require('../services/qrService');

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
      utm_content,
      create_short_url = true,
      generate_qr = true
    } = req.body;

    // Валидация входных данных
    if (!original_url) {
      return res.status(400).json({
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
        error: 'Ошибка валидации',
        details: validation.errors
      });
    }

    // Генерируем полную UTM ссылку
    const fullUrl = generateUtmUrl({
      original_url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    });

    // Результат
    const result = {
      original_url,
      full_url: fullUrl,
      utm_params: {
        source: utm_source,
        medium: utm_medium,
        campaign: utm_campaign,
        term: utm_term || null,
        content: utm_content || null
      },
      created_at: new Date().toISOString()
    };

    // Создаём короткую ссылку (если нужно)
    if (create_short_url) {
      const shortUrlData = createShortUrl(fullUrl);
      result.short_url = shortUrlData.short_url;
      result.short_slug = shortUrlData.slug;
    }

    // Генерируем QR-код (если нужно)
    if (generate_qr) {
      const qrCode = await generateQRCode(
        create_short_url ? result.short_url : fullUrl
      );
      result.qr_code = qrCode.data_url;
    }

    // Отправляем успешный ответ
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in generateUtm:', error);
    res.status(500).json({
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
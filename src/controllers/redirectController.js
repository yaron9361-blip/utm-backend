const { getOriginalUrl } = require('../services/shortenerService');

/**
 * Редирект по короткой ссылке
 * GET /s/:slug
 */
function redirect(req, res) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        error: 'Неверный формат ссылки'
      });
    }

    // Получаем оригинальную ссылку
    const originalUrl = getOriginalUrl(slug);

    if (!originalUrl) {
      return res.status(404).json({
        error: 'Ссылка не найдена',
        message: 'Возможно, ссылка устарела или неверна'
      });
    }

    // Делаем редирект
    res.redirect(301, originalUrl);

  } catch (error) {
    console.error('Error in redirect:', error);
    res.status(500).json({
      error: 'Ошибка редиректа',
      message: error.message
    });
  }
}

module.exports = {
  redirect
};
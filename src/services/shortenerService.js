const shortid = require('shortid');

// Временное хранилище (в памяти, для MVP)
// В будущем заменим на базу данных
const urlDatabase = new Map();

/**
 * Создание короткой ссылки
 */
function createShortUrl(originalUrl) {
  // Проверяем, может такая ссылка уже есть
  for (const [slug, data] of urlDatabase.entries()) {
    if (data.original_url === originalUrl) {
      return {
        slug,
        short_url: `${process.env.SHORT_URL_DOMAIN}${process.env.SHORT_URL_BASE_PATH}${slug}`,
        original_url: originalUrl
      };
    }
  }
  
  // Генерируем уникальный slug
  const slug = shortid.generate();
  
  // Сохраняем в "базу"
  urlDatabase.set(slug, {
    original_url: originalUrl,
    clicks: 0,
    created_at: new Date()
  });
  
  return {
    slug,
    short_url: `${process.env.SHORT_URL_DOMAIN}${process.env.SHORT_URL_BASE_PATH}${slug}`,
    original_url: originalUrl
  };
}

/**
 * Получение оригинальной ссылки по slug
 */
function getOriginalUrl(slug) {
  const data = urlDatabase.get(slug);
  
  if (!data) {
    return null;
  }
  
  // Увеличиваем счётчик кликов
  data.clicks++;
  
  return data.original_url;
}

/**
 * Статистика по короткой ссылке
 */
function getShortUrlStats(slug) {
  return urlDatabase.get(slug) || null;
}

module.exports = {
  createShortUrl,
  getOriginalUrl,
  getShortUrlStats
};
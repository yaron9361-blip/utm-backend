const { validateUrl, sanitizeUtmParam } = require('../utils/validators');

/**
 * Генерация UTM-метки
 */
function generateUtmUrl(data) {
  const { original_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = data;
  
  // Валидация URL
  const urlValidation = validateUrl(original_url);
  if (!urlValidation.valid) {
    throw new Error(urlValidation.error);
  }
  
  const url = new URL(original_url);
  
  // Добавляем UTM параметры
  if (utm_source) {
    url.searchParams.set('utm_source', sanitizeUtmParam(utm_source));
  }
  
  if (utm_medium) {
    url.searchParams.set('utm_medium', sanitizeUtmParam(utm_medium));
  }
  
  if (utm_campaign) {
    url.searchParams.set('utm_campaign', sanitizeUtmParam(utm_campaign));
  }
  
  if (utm_term) {
    url.searchParams.set('utm_term', sanitizeUtmParam(utm_term));
  }
  
  if (utm_content) {
    url.searchParams.set('utm_content', sanitizeUtmParam(utm_content));
  }
  
  return url.toString();
}

/**
 * Парсинг UTM параметров из URL
 */
function parseUtmParams(url) {
  try {
    const parsed = new URL(url);
    return {
      utm_source: parsed.searchParams.get('utm_source') || '',
      utm_medium: parsed.searchParams.get('utm_medium') || '',
      utm_campaign: parsed.searchParams.get('utm_campaign') || '',
      utm_term: parsed.searchParams.get('utm_term') || '',
      utm_content: parsed.searchParams.get('utm_content') || ''
    };
  } catch (e) {
    return null;
  }
}

module.exports = {
  generateUtmUrl,
  parseUtmParams
};
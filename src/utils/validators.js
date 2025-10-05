/**
 * Валидация и утилиты для работы с URL и UTM параметрами
 */

// Валидация URL
function validateUrl(url) {
  try {
    const parsed = new URL(url);
    
    // Разрешены только http и https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { 
        valid: false, 
        error: 'Разрешены только HTTP и HTTPS протоколы' 
      };
    }
    
    // Проверка на localhost/private IPs (для безопасности)
    const hostname = parsed.hostname;
    if (hostname === 'localhost' || 
        hostname.match(/^127\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\.|^192\.168\./)) {
      return { 
        valid: false, 
        error: 'Локальные адреса не разрешены' 
      };
    }
    
    return { valid: true, parsed };
  } catch (e) {
    return { 
      valid: false, 
      error: 'Некорректный URL. Пример: https://example.com' 
    };
  }
}

// Санитизация UTM параметров
function sanitizeUtmParam(value) {
  if (!value) return '';
  
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_\-]/gi, '_') // разрешаем буквы, цифры, _, -
    .slice(0, 255); // максимум 255 символов
}

// Валидация обязательных UTM параметров
function validateUtmParams(params) {
  const errors = [];
  
  // Проверяем обязательные поля
  if (!params.utm_source || params.utm_source.trim() === '') {
    errors.push('utm_source обязателен (например: telegram, instagram)');
  }
  
  if (!params.utm_medium || params.utm_medium.trim() === '') {
    errors.push('utm_medium обязателен (например: social, email, cpc)');
  }
  
  if (!params.utm_campaign || params.utm_campaign.trim() === '') {
    errors.push('utm_campaign обязателен (например: spring_sale)');
  }
  
  // Проверяем длину
  if (params.utm_source && params.utm_source.length > 255) {
    errors.push('utm_source слишком длинный (максимум 255 символов)');
  }
  
  if (params.utm_medium && params.utm_medium.length > 255) {
    errors.push('utm_medium слишком длинный (максимум 255 символов)');
  }
  
  if (params.utm_campaign && params.utm_campaign.length > 255) {
    errors.push('utm_campaign слишком длинный (максимум 255 символов)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateUrl,
  sanitizeUtmParam,
  validateUtmParams
};
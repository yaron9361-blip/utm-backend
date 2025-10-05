const crypto = require('crypto');
const fetch = require('node-fetch');

class UTMService {
  constructor() {
    this.links = new Map();
  }

  async shortenUrl(longUrl) {
  try {
    const response = await fetch(`https://clck.ru/--?url=${encodeURIComponent(longUrl)}`);
    const shortUrl = await response.text();
    
    if (shortUrl && shortUrl.startsWith('http')) {
      return shortUrl.trim();
    }
    
    // Если не сработало, возвращаем оригинал
    return longUrl;
  } catch (error) {
    console.error('clck.ru shortening failed:', error);
    return longUrl;
  }
}

  generateQRCode(url) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  }

  async generateUTM(data) {
    const { original_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = data;

    if (!original_url || !utm_source || !utm_medium || !utm_campaign) {
      throw new Error('Обязательные поля: original_url, utm_source, utm_medium, utm_campaign');
    }

    const url = new URL(original_url);
    url.searchParams.set('utm_source', utm_source);
    url.searchParams.set('utm_medium', utm_medium);
    url.searchParams.set('utm_campaign', utm_campaign);
    
    if (utm_term) url.searchParams.set('utm_term', utm_term);
    if (utm_content) url.searchParams.set('utm_content', utm_content);

    const fullUrl = url.toString();
    const shortUrl = await this.shortenUrl(fullUrl);
    const qrCode = this.generateQRCode(shortUrl);

    const result = {
      original_url,
      full_url: fullUrl,
      short_url: shortUrl,
      qr_code: qrCode,
      utm_params: {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
      },
      created_at: new Date().toISOString(),
    };

    return result;
  }
}

module.exports = new UTMService();
const QRCode = require('qrcode');

/**
 * Генерация QR-кода
 */
async function generateQRCode(url, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: options.width || 300,
      color: {
        dark: options.dark || '#000000',
        light: options.light || '#FFFFFF'
      }
    };
    
    // Генерируем QR-код как Data URL (base64)
    const qrDataUrl = await QRCode.toDataURL(url, qrOptions);
    
    return {
      data_url: qrDataUrl,
      url: url
    };
  } catch (error) {
    throw new Error('Ошибка генерации QR-кода: ' + error.message);
  }
}

/**
 * Генерация QR-кода как Buffer (для скачивания файла)
 */
async function generateQRCodeBuffer(url, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'M',
      type: 'png',
      quality: 0.92,
      margin: 1,
      width: options.width || 512
    };
    
    const buffer = await QRCode.toBuffer(url, qrOptions);
    
    return buffer;
  } catch (error) {
    throw new Error('Ошибка генерации QR-кода: ' + error.message);
  }
}

module.exports = {
  generateQRCode,
  generateQRCodeBuffer
};
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Создаём папку если её нет
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Создаём файл если его нет
if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
}

// Функции для работы с данными
const analytics = {
  // Добавить событие
  addEvent(event) {
    const events = this.getEvents();
    events.push({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      ...event,
      timestamp: Date.now(),
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
    return events[events.length - 1];
  },

  // Получить все события
  getEvents() {
    try {
      const data = fs.readFileSync(EVENTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },

  // Получить количество событий
  getCount() {
    return this.getEvents().length;
  },

  // Получить события по типу
  getEventsByType(eventType) {
    const events = this.getEvents();
    return events.filter(e => e.event_type === eventType);
  },

  // Получить события за период
  getEventsByDateRange(startTime, endTime) {
    const events = this.getEvents();
    return events.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
  }
};

console.log('Analytics JSON storage initialized');

module.exports = analytics;
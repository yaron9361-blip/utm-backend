const express = require('express');
const router = express.Router();
const db = require('../db/analytics');

// Эндпоинт для трекинга событий
router.post('/track', (req, res) => {
  try {
    const { event_type, user_id, session_id, properties } = req.body;
    
    // Валидация
    if (!event_type || !session_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'event_type and session_id are required' 
      });
    }
    
    // Вставка события
    const stmt = db.prepare(`
      INSERT INTO events (event_type, user_id, session_id, timestamp, properties)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      event_type,
      user_id || null,
      session_id,
      Date.now(),
      JSON.stringify(properties || {})
    );
    
    res.json({ 
      success: true, 
      event_id: result.lastInsertRowid 
    });
    
  } catch (error) {
    console.error('Analytics track error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track event' 
    });
  }
});

// Эндпоинт для проверки здоровья аналитики
router.get('/health', (req, res) => {
  try {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM events');
    const result = stmt.get();
    
    res.json({
      success: true,
      total_events: result.count,
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
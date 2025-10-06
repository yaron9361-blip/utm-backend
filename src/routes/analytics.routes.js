const express = require('express');
const router = express.Router();
const analytics = require('../db/analytics');

// Эндпоинт для трекинга событий
router.post('/track', (req, res) => {
  try {
    const { event_type, user_id, session_id, properties } = req.body;
    
    if (!event_type || !session_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'event_type and session_id are required' 
      });
    }
    
    const event = analytics.addEvent({
      event_type,
      user_id: user_id || null,
      session_id,
      properties: properties || {}
    });
    
    res.json({ 
      success: true, 
      event_id: event.id 
    });
    
  } catch (error) {
    console.error('Analytics track error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track event' 
    });
  }
});

// Эндпоинт для проверки здоровья
router.get('/health', (req, res) => {
  try {
    const count = analytics.getCount();
    
    res.json({
      success: true,
      total_events: count,
      storage: 'json_file'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
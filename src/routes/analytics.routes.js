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

// Получить статистику по событиям
router.get('/stats', (req, res) => {
  try {
    const events = analytics.getEvents();
    
    // Общая статистика
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;
    const uniqueUsers = new Set(events.filter(e => e.user_id).map(e => e.user_id)).size;
    
    // События по типам
    const eventsByType = {};
    events.forEach(e => {
      eventsByType[e.event_type] = (eventsByType[e.event_type] || 0) + 1;
    });
    
    // События за последние 24 часа
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => e.timestamp >= last24h).length;
    
    res.json({
      success: true,
      stats: {
        total_events: totalEvents,
        unique_sessions: uniqueSessions,
        unique_users: uniqueUsers,
        events_last_24h: recentEvents,
        events_by_type: eventsByType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Получить последние события
router.get('/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = analytics.getEvents()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Получить воронку конверсии
router.get('/funnel', (req, res) => {
  try {
    const groupBy = req.query.group_by || 'sessions'; // sessions или users
    const events = analytics.getEvents();
    
    if (groupBy === 'users') {
      // Группируем по user_id
      const userEvents = {};
      
      events.forEach(e => {
        const userId = e.user_id || 'anonymous';
        if (!userEvents[userId]) {
          userEvents[userId] = new Set();
        }
        userEvents[userId].add(e.event_type);
      });
      
      const totalUsers = Object.keys(userEvents).length;
      const openedUsers = Object.values(userEvents).filter(set => set.has('app_opened')).length;
      const selectedTemplateUsers = Object.values(userEvents).filter(set => set.has('template_selected')).length;
      const generatedUsers = Object.values(userEvents).filter(set => set.has('utm_generated')).length;
      const copiedUsers = Object.values(userEvents).filter(set => set.has('link_copied')).length;
      
      res.json({
        success: true,
        group_by: 'users',
        funnel: {
          opened: openedUsers,
          template_selected: selectedTemplateUsers,
          generated: generatedUsers,
          copied: copiedUsers,
          conversion_to_generated: openedUsers > 0 ? ((generatedUsers / openedUsers) * 100).toFixed(1) : 0,
          conversion_to_copied: generatedUsers > 0 ? ((copiedUsers / generatedUsers) * 100).toFixed(1) : 0
        }
      });
      
    } else {
      // Группируем по session_id
      const sessionEvents = {};
      
      events.forEach(e => {
        if (!sessionEvents[e.session_id]) {
          sessionEvents[e.session_id] = new Set();
        }
        sessionEvents[e.session_id].add(e.event_type);
      });
      
      const totalSessions = Object.keys(sessionEvents).length;
      const openedSessions = Object.values(sessionEvents).filter(set => set.has('app_opened')).length;
      const selectedTemplateSessions = Object.values(sessionEvents).filter(set => set.has('template_selected')).length;
      const generatedSessions = Object.values(sessionEvents).filter(set => set.has('utm_generated')).length;
      const copiedSessions = Object.values(sessionEvents).filter(set => set.has('link_copied')).length;
      
      res.json({
        success: true,
        group_by: 'sessions',
        funnel: {
          opened: openedSessions,
          template_selected: selectedTemplateSessions,
          generated: generatedSessions,
          copied: copiedSessions,
          conversion_to_generated: openedSessions > 0 ? ((generatedSessions / openedSessions) * 100).toFixed(1) : 0,
          conversion_to_copied: generatedSessions > 0 ? ((copiedSessions / generatedSessions) * 100).toFixed(1) : 0
        }
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
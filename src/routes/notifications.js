const express = require('express');
const router = express.Router();
const { 
  sendNotificationToUser, 
  sendNotificationToBranch, 
  sendNotificationToAllUsers,
  sendEventReminder 
} = require('../utils/notifications');

// TODO: Implement notification routes
// GET /api/notifications - Get notifications for user
router.get('/', (req, res) => {
  res.json({ message: 'Get notifications - Not implemented yet' });
});

// POST /api/notifications/send-to-user - Send notification to specific user
router.post('/send-to-user', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    
    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'userId, title, and body are required'
      });
    }

    const result = await sendNotificationToUser(userId, title, body, data);
    res.json({
      success: true,
      message: 'Notification sent successfully',
      result
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// POST /api/notifications/send-to-branch - Send notification to branch
router.post('/send-to-branch', async (req, res) => {
  try {
    const { branchId, title, body, data } = req.body;
    
    if (!branchId || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'branchId, title, and body are required'
      });
    }

    const result = await sendNotificationToBranch(branchId, title, body, data);
    res.json({
      success: true,
      message: 'Notification sent to branch successfully',
      result
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// POST /api/notifications/send-to-all - Send notification to all users
router.post('/send-to-all', async (req, res) => {
  try {
    const { title, body, data } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'title and body are required'
      });
    }

    const result = await sendNotificationToAllUsers(title, body, data);
    res.json({
      success: true,
      message: 'Notification sent to all users successfully',
      result
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// POST /api/notifications/event-reminder - Send event reminder
router.post('/event-reminder', async (req, res) => {
  try {
    const { eventId, reminderType } = req.body;
    
    if (!eventId || !reminderType) {
      return res.status(400).json({
        success: false,
        message: 'eventId and reminderType are required'
      });
    }

    const result = await sendEventReminder(eventId, reminderType);
    res.json({
      success: true,
      message: 'Event reminder sent successfully',
      result
    });
  } catch (error) {
    console.error('Error sending event reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send event reminder',
      error: error.message
    });
  }
});

module.exports = router;

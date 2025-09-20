const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const sendNotification = async (tokens, title, body, data = {}) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.log('No device tokens provided');
      return;
    }

    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    
    console.log('Successfully sent message:', response);
    
    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error('Failed to send to token:', tokens[idx], resp.error);
        }
      });
      
      // You might want to remove invalid tokens from the database
      return { success: true, failedTokens };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const sendNotificationToUser = async (userId, title, body, data = {}) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user || !user.deviceTokens || user.deviceTokens.length === 0) {
      console.log('User not found or no device tokens');
      return;
    }

    const tokens = user.deviceTokens.map(device => device.token);
    return await sendNotification(tokens, title, body, data);
  } catch (error) {
    console.error('Error sending notification to user:', error);
    throw error;
  }
};

const sendNotificationToBranch = async (branchId, title, body, data = {}) => {
  try {
    const User = require('../models/User');
    const users = await User.find({ 
      branch: branchId, 
      isActive: true,
      'deviceTokens.0': { $exists: true }
    });

    if (users.length === 0) {
      console.log('No users found in branch with device tokens');
      return;
    }

    const allTokens = [];
    users.forEach(user => {
      user.deviceTokens.forEach(device => {
        allTokens.push(device.token);
      });
    });

    return await sendNotification(allTokens, title, body, data);
  } catch (error) {
    console.error('Error sending notification to branch:', error);
    throw error;
  }
};

const sendNotificationToAllUsers = async (title, body, data = {}) => {
  try {
    const User = require('../models/User');
    const users = await User.find({ 
      isActive: true,
      'deviceTokens.0': { $exists: true }
    });

    if (users.length === 0) {
      console.log('No users found with device tokens');
      return;
    }

    const allTokens = [];
    users.forEach(user => {
      user.deviceTokens.forEach(device => {
        allTokens.push(device.token);
      });
    });

    return await sendNotification(allTokens, title, body, data);
  } catch (error) {
    console.error('Error sending notification to all users:', error);
    throw error;
  }
};

const sendEventReminder = async (eventId, reminderType) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findById(eventId).populate('attendees.user', 'deviceTokens');

    if (!event) {
      console.log('Event not found');
      return;
    }

    const attendingUsers = event.attendees.filter(attendee => attendee.status === 'attending');
    
    if (attendingUsers.length === 0) {
      console.log('No attending users found for event');
      return;
    }

    const allTokens = [];
    attendingUsers.forEach(attendee => {
      if (attendee.user.deviceTokens) {
        attendee.user.deviceTokens.forEach(device => {
          allTokens.push(device.token);
        });
      }
    });

    let title, body;
    const eventDate = new Date(event.date.start);
    const eventTime = eventDate.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    switch (reminderType) {
      case '1_day':
        title = 'Event Reminder - Tomorrow';
        body = `${event.title} is happening tomorrow at ${eventTime}`;
        break;
      case '1_hour':
        title = 'Event Starting Soon';
        body = `${event.title} starts in 1 hour at ${eventTime}`;
        break;
      case '30_minutes':
        title = 'Event Starting Soon';
        body = `${event.title} starts in 30 minutes`;
        break;
      default:
        title = 'Event Reminder';
        body = `Don't forget about ${event.title}`;
    }

    const data = {
      type: 'event_reminder',
      eventId: event._id.toString(),
      reminderType
    };

    return await sendNotification(allTokens, title, body, data);
  } catch (error) {
    console.error('Error sending event reminder:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendNotificationToUser,
  sendNotificationToBranch,
  sendNotificationToAllUsers,
  sendEventReminder
};

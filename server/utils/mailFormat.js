// utils/mailFormat.js
const workerWelcome = (EMAIL, PASSWORD, NAME, DEPARTMENT) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to StuFix</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: white; margin: 0 auto; padding: 30px; border-radius: 10px; border-top: 4px solid #7C3AED; }
        h2 { color: #7C3AED; }
        .credentials { background: #f5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .button { background: #7C3AED; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome to StuFix! 🎉</h2>
        <p>Dear ${NAME},</p>
        <p>Your worker account has been created for the <strong>${DEPARTMENT}</strong> department.</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${EMAIL}</p>
          <p><strong>Temporary Password:</strong> ${PASSWORD}</p>
        </div>
        <p>Please login and change your password immediately.</p>
        <a href="${process.env.FRONTEND_URL || 'https://stufix.space'}/login" class="button">Login to StuFix</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = { workerWelcome };
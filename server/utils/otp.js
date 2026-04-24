// utils/otp.js
const otpMap = new Map();

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random()  * 900000).toString();
};

// Set OTP with type (signup or reset)
const setOtp = ({email, otp, type}) => {
  if (otpMap.get(email)) otpMap.delete(email);
  try {
    otpMap.set(email, { 
      otp, 
      type, // store type for later verification
      expiresAt: Date.now() + 5 * 60 * 1000 // expires in 5 minutes
    });
    return { status: true, message: 'OTP set successfully' };
  } catch (error) {
    return { status: false, message: 'Error setting OTP' };
  }
};

// Verify OTP with type
const verifyOtp = ({email, otp, type}) => {
  const record = otpMap.get(email);
  if (!record) return { status: false, message: 'Send OTP first' };

  if (Date.now() > record.expiresAt) {
    otpMap.delete(email);
    return { status: false, message: 'OTP expired, try again' };
  }

  if (record.otp !== otp) {
    return { status: false, message: 'Incorrect OTP' };
  }

  if (record.type !== type) {
    return { status: false, message: `OTP type mismatch. Expected ${record.type}` };
  }

  otpMap.delete(email);
  return { status: true, message: 'OTP verified' };
};

// utils/mailFormat.js
const mailFormat = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>StuFix OTP Verification</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 500px; background: white; margin: 0 auto; padding: 30px; border-radius: 10px; border-top: 4px solid #7C3AED; }
        .otp-code { font-size: 32px; font-weight: bold; color: #7C3AED; text-align: center; letter-spacing: 5px; margin: 20px 0; }
        .button { background: #7C3AED; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 style="color: #7C3AED;">StuFix Verification</h2>
        <p>Your OTP for verification is:</p>
        <div class="otp-code">${otp}</div>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
          <p>StuFix - Student Complaint System</p>
          <p>IIIT Allahabad</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Also create worker welcome email format
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
        .credentials { background: #f5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .button { background: #7C3AED; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 style="color: #7C3AED;">Welcome to StuFix! 🎉</h2>
        <p>Dear ${NAME},</p>
        <p>Your worker account has been created for the <strong>${DEPARTMENT}</strong> department.</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${EMAIL}</p>
          <p><strong>Temporary Password:</strong> ${PASSWORD}</p>
        </div>
        <p>Please login and change your password immediately.</p>
        <a href="${process.env.FRONTEND_URL || 'https://stufix.space'}/login" class="button">Login to StuFix</a>
        <div class="footer">
          <p>StuFix - Student Complaint System</p>
          <p>IIIT Allahabad</p>
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  mailFormat, 
  setOtp, 
  verifyOtp, 
  generateOtp,
  workerWelcome
};
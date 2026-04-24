const otpMap = new Map();

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
        <p>This OTP is valid for 10 minutes.</p>
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







module.exports={mailFormat,setOtp,verifyOtp,generateOtp};
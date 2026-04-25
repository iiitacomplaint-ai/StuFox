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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>StuFix OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f0f7; font-family: 'Segoe UI', Arial, sans-serif;">

      <!-- Wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f0f7; padding: 40px 20px;">
        <tr>
          <td align="center">

            <!-- Card -->
            <table width="520" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(124,58,237,0.08);">

              <!-- Header Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%); padding: 36px 40px; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <!-- Logo Icon -->
                        <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px;">
                          <span style="font-size: 28px;">🎓</span>
                        </div>
                        <br/>
                        <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">StuFix</span>
                        <br/>
                        <span style="font-size: 13px; color: rgba(255,255,255,0.75); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; display: block;">Student Complaint System</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 44px 32px;">

                  <!-- Title -->
                  <p style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #1a1a2e;">Verify Your Identity</p>
                  <p style="margin: 0 0 28px; font-size: 15px; color: #6b7280; line-height: 1.6;">
                    We received a request to verify your email address. Use the OTP below to complete your verification.
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                    <tr>
                      <td align="center" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 2px dashed #c4b5fd; border-radius: 14px; padding: 28px 20px;">
                        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #7C3AED; letter-spacing: 3px; text-transform: uppercase;">Your OTP Code</p>
                        <p style="margin: 0; font-size: 48px; font-weight: 800; color: #7C3AED; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Timer Warning -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                    <tr>
                      <td style="background-color: #fff7ed; border-left: 4px solid #f97316; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                        <p style="margin: 0; font-size: 13px; color: #9a3412;">
                          ⏱️ &nbsp;<strong>This OTP expires in 5 minutes.</strong> Please use it right away.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Security Note -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #f8fafc; border-radius: 10px; padding: 16px 18px;">
                        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                          🔒 &nbsp;If you didn't request this OTP, you can safely ignore this email. Your account remains secure.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 44px;">
                  <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;">
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 44px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #374151;">StuFix — IIIT Allahabad</p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply.</p>
                      </td>
                      <td align="right" valign="middle">
                        <span style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #4F46E5); color: white; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; letter-spacing: 1px;">IIITA</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
            <!-- End Card -->

            <!-- Bottom note -->
            <p style="margin: 20px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
              © 2025 StuFix · Indian Institute of Information Technology, Allahabad
            </p>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};
// Also create worker welcome email format
const workerWelcome = (EMAIL, PASSWORD, NAME, DEPARTMENT) => {
  const departmentIcons = {
    'Network': '🌐',
    'Cleaning': '🧹',
    'Carpentry': '🪚',
    'PC Maintenance': '💻',
    'Plumbing': '🔧',
    'Electricity': '⚡'
  };

  const deptIcon = departmentIcons[DEPARTMENT] || '🛠️';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to StuFix</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f0f7; font-family: 'Segoe UI', Arial, sans-serif;">

      <!-- Wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f0f7; padding: 40px 20px;">
        <tr>
          <td align="center">

            <!-- Card -->
            <table width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(124,58,237,0.08);">

              <!-- Header Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%); padding: 36px 40px; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px;">
                          <span style="font-size: 28px;">🎓</span>
                        </div>
                        <br/>
                        <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">StuFix</span>
                        <br/>
                        <span style="font-size: 13px; color: rgba(255,255,255,0.75); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; display: block;">Student Complaint System</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Welcome Badge -->
              <tr>
                <td align="center" style="padding: 28px 44px 0;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-radius: 30px; padding: 10px 24px;">
                        <span style="font-size: 14px; font-weight: 700; color: #7C3AED; letter-spacing: 1px;">🎉 &nbsp;Account Successfully Created</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 24px 44px 32px;">

                  <!-- Greeting -->
                  <p style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #1a1a2e;">Welcome aboard, ${NAME}! 👋</p>
                  <p style="margin: 0 0 28px; font-size: 15px; color: #6b7280; line-height: 1.6;">
                    You've been added to the StuFix team as a worker in the <strong style="color: #7C3AED;">${DEPARTMENT}</strong> department. Below are your account credentials to get started.
                  </p>

                  <!-- Department Badge -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; padding: 18px 22px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td valign="middle">
                              <span style="font-size: 32px;">${deptIcon}</span>
                            </td>
                            <td valign="middle" style="padding-left: 14px;">
                              <p style="margin: 0; font-size: 11px; font-weight: 600; color: #7C3AED; letter-spacing: 2px; text-transform: uppercase;">Assigned Department</p>
                              <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #1a1a2e;">${DEPARTMENT}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Credentials Box -->
                  <p style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #374151; letter-spacing: 1px; text-transform: uppercase;">🔐 &nbsp;Your Login Credentials</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1.5px solid #e5e7eb; border-radius: 12px; overflow: hidden;">

                    <!-- Email Row -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <p style="margin: 0 0 3px; font-size: 11px; font-weight: 600; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase;">Email Address</p>
                              <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1a1a2e;">${EMAIL}</p>
                            </td>
                            <td align="right" valign="middle">
                              <span style="font-size: 20px;">📧</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Password Row -->
                    <tr>
                      <td style="background-color: #ffffff; padding: 16px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <p style="margin: 0 0 3px; font-size: 11px; font-weight: 600; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase;">Temporary Password</p>
                              <p style="margin: 0; font-size: 18px; font-weight: 800; color: #7C3AED; font-family: 'Courier New', monospace; letter-spacing: 3px;">${PASSWORD}</p>
                            </td>
                            <td align="right" valign="middle">
                              <span style="font-size: 20px;">🔑</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Warning -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                    <tr>
                      <td style="background-color: #fff7ed; border-left: 4px solid #f97316; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                        <p style="margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6;">
                          ⚠️ &nbsp;<strong>Important:</strong> This is a temporary password. Please log in and change it immediately to secure your account.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                    <tr>
                      <td align="center">
                        <a href="${process.env.FRONTEND_URL || 'https://stufix.space'}/login"
                           style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 40px; border-radius: 10px; letter-spacing: 0.5px;">
                          Login to StuFix &nbsp;→
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Security Note -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #f8fafc; border-radius: 10px; padding: 16px 18px;">
                        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                          🔒 &nbsp;If you believe this email was sent to you by mistake, please contact your administrator immediately.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 44px;">
                  <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;">
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 44px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #374151;">StuFix — IIIT Allahabad</p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply.</p>
                      </td>
                      <td align="right" valign="middle">
                        <span style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #4F46E5); color: white; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; letter-spacing: 1px;">IIITA</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
            <!-- End Card -->

            <!-- Bottom note -->
            <p style="margin: 20px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
              © 2025 StuFix · Indian Institute of Information Technology, Allahabad
            </p>

          </td>
        </tr>
      </table>

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
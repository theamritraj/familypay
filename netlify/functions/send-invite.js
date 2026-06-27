const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const parsedData = JSON.parse(event.body);
    const {
      email,
      name,
      role,
      inviteCode,
      familyHeadName,
      tempPassword,
      relationship,
      dailyLimit,
      monthlyLimit,
      note,
    } = parsedData;

    if (!email || !inviteCode || !familyHeadName || !tempPassword) {
      return { 
        statusCode: 400, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing required fields' }) 
      };
    }

    const roleText = role === 'PRIMARY' ? 'Circle Owner' : 'Circle Member';
    const productUrl = process.env.APP_URL || process.env.URL || 'http://localhost:5173';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"FamilyPay Invitations" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${familyHeadName} invited you to FamilyPay`,
      html: `
        <div style="margin:0; padding:0; background:#f6f7fb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; color:#111827;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#ffffff; border:1px solid #e5e7eb; border-radius:18px; overflow:hidden;">
                  <tr>
                    <td style="padding:28px 32px; background:#111827;">
                      <div style="color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.01em;">FamilyPay</div>
                      <div style="color:#a5b4fc; font-size:13px; margin-top:4px;">Secure circle invitation</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px;">
                      <p style="margin:0 0 8px; color:#6b7280; font-size:14px;">Welcome ${name || 'there'},</p>
                      <h1 style="margin:0; color:#111827; font-size:26px; line-height:1.25;">Welcome to FamilyPay!</h1>
                      <p style="margin:16px 0 0; color:#374151; font-size:16px; line-height:1.6;">
                        Your secure workspace has been set up by <strong>${familyHeadName}</strong>. You can now log in to manage your spending and track your transactions securely.
                      </p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
                        <tr>
                          <td style="padding:16px; background:#eef2ff; border:1px solid #c7d2fe; border-radius:14px;">
                            <div style="font-size:12px; color:#4338ca; text-transform:uppercase; letter-spacing:0.08em; font-weight:800;">Invite code</div>
                            <div style="margin-top:8px; color:#111827; font-size:26px; font-weight:800; letter-spacing:0.12em;">${inviteCode}</div>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;">
                        <tr>
                          <td style="padding:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:14px;">
                            <div style="font-size:12px; color:#92400e; text-transform:uppercase; letter-spacing:0.08em; font-weight:800;">Temporary sign-in</div>
                            <div style="margin-top:10px; color:#78350f; font-size:14px; line-height:1.7;">
                              <strong>Email:</strong> ${email}<br/>
                              <strong>Temporary password:</strong> ${tempPassword}
                            </div>
                          </td>
                        </tr>
                      </table>
                      <div style="margin-top:28px; background:#f3f4f6; padding:16px; border-radius:10px; border:1px solid #e5e7eb;">
                        <p style="margin:0 0 8px; color:#374151; font-size:14px; font-weight:600;">Login to FamilyPay:</p>
                        <a href="${productUrl}/login" style="color:#4f46e5; text-decoration:none; font-size:15px; word-break:break-all;">${productUrl}/login</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Invite email sent successfully' }) 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to send invite email', error: error.message }),
    };
  }
};

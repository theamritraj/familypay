import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // CORS headers for local testing or cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
  } = req.body;

  if (!email || !inviteCode || !familyHeadName || !tempPassword) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const roleText = role === 'PRIMARY' ? 'Circle Owner' : 'Circle Member';
  const productUrl = process.env.APP_URL || 'https://familypay.vercel.app';

  // Nodemailer Transporter Setup using environment variables
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
        <div style="display:none; max-height:0; overflow:hidden;">
          ${familyHeadName} invited you to join their FamilyPay circle with controlled spending access.
        </div>
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
                    <p style="margin:0 0 8px; color:#6b7280; font-size:14px;">Hi ${name || 'there'},</p>
                    <h1 style="margin:0; color:#111827; font-size:26px; line-height:1.25;">You have been invited to join a FamilyPay circle.</h1>
                    <p style="margin:16px 0 0; color:#374151; font-size:16px; line-height:1.6;">
                      <strong>${familyHeadName}</strong> invited you as a <strong>${roleText}</strong>${relationship ? ` (${relationship})` : ''}. This gives you access to FamilyPay with spending controls and approval workflows managed by the circle owner.
                    </p>

                    ${note ? `
                      <div style="margin-top:20px; padding:16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">
                        <div style="font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; font-weight:700;">Message from ${familyHeadName}</div>
                        <div style="margin-top:8px; color:#111827; font-size:14px; line-height:1.6;">${note}</div>
                      </div>
                    ` : ''}

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
                          <div style="margin-top:8px; color:#92400e; font-size:12px;">For your security, change this password immediately after first sign-in.</div>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;">
                      <tr>
                        <td style="padding:16px; border:1px solid #e5e7eb; border-radius:14px;">
                          <div style="font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; font-weight:800;">Spending policy</div>
                          <div style="margin-top:10px; color:#374151; font-size:14px; line-height:1.8;">
                            Daily limit: <strong>₹${Number(dailyLimit || 0).toLocaleString('en-IN')}</strong><br/>
                            Monthly limit: <strong>₹${Number(monthlyLimit || 0).toLocaleString('en-IN')}</strong>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align:center; margin-top:28px;">
                      <a href="${productUrl}/login" style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:10px; font-weight:700; font-size:15px;">Accept invite</a>
                    </div>

                    <p style="margin:24px 0 0; color:#6b7280; font-size:13px; line-height:1.6;">
                      If you were not expecting this invitation, you can safely ignore this email. FamilyPay will never ask you to share your password or one-time code outside the app.
                    </p>
                  </td>
                </tr>
              </table>
              <div style="max-width:640px; padding:18px 8px 0; color:#9ca3af; font-size:12px; line-height:1.5; text-align:center;">
                © ${new Date().getFullYear()} FamilyPay. This operational email was sent for account access and security.
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `
${familyHeadName} invited you to join FamilyPay.

Role: ${roleText}
Invite code: ${inviteCode}
Email: ${email}
Temporary password: ${tempPassword}
Daily limit: ₹${Number(dailyLimit || 0).toLocaleString('en-IN')}
Monthly limit: ₹${Number(monthlyLimit || 0).toLocaleString('en-IN')}

Accept invite: ${productUrl}/login

Change your temporary password after first sign-in. If you were not expecting this invitation, ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invite email sent successfully to ${email}`);
    res.status(200).json({ success: true, message: 'Invite email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send invite email', error: error.message });
  }
}

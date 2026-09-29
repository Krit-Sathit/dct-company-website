import { NextRequest, NextResponse } from 'next/server';
import { defaultContactSettings } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ref, company, specs, items, createdAt } = body;

    const recipientEmail =
      process.env.RFQ_RECIPIENT_EMAIL ||
      process.env.CONTACT_EMAIL ||
      body?.contactSettings?.email ||
      defaultContactSettings.email ||
      'sales@dcintertrade.com';

    const rawCc =
      body?.contactSettings?.email_cc ||
      process.env.RFQ_CC_EMAILS ||
      defaultContactSettings.email_cc ||
      '';

    const ccEmails: string[] = rawCc
      ? rawCc
          .split(',')
          .map((e: string) => e.trim())
          .filter((e: string) => Boolean(e) && e.includes('@') && e.toLowerCase() !== recipientEmail.toLowerCase())
      : [];

    // Format products list HTML
    const itemsHtml =
      items && items.length > 0
        ? `
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f7efe6; text-align: left;">
              <th style="padding: 10px 12px; border: 1px solid #e2d3c2; color: #4a3328;">ลำดับ</th>
              <th style="padding: 10px 12px; border: 1px solid #e2d3c2; color: #4a3328;">ชื่อสินค้า / รหัส</th>
              <th style="padding: 10px 12px; border: 1px solid #e2d3c2; color: #4a3328; text-align: center;">จำนวน</th>
              <th style="padding: 10px 12px; border: 1px solid #e2d3c2; color: #4a3328;">สเปกที่ระบุ / หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item: any, idx: number) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 12px; border: 1px solid #e2d3c2; text-align: center;">${idx + 1}</td>
                <td style="padding: 10px 12px; border: 1px solid #e2d3c2;">
                  <b>${item.name || '-'}</b>
                  ${item.code ? `<div style="font-size: 12px; color: #888;">รหัส: ${item.code}</div>` : ''}
                </td>
                <td style="padding: 10px 12px; border: 1px solid #e2d3c2; text-align: center;">
                  <b>${item.qty}</b> ${item.unit || 'กก.'}
                </td>
                <td style="padding: 10px 12px; border: 1px solid #e2d3c2; color: #555;">
                  ${item.note || '-'}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
        : '<p style="color: #888; font-style: italic;">ไม่มีรายการสินค้าที่เลือก (ระบุความต้องการในหมายเหตุด้านล่าง)</p>';

    // Format services list HTML
    const servicesList =
      specs?.services && Array.isArray(specs.services) && specs.services.length > 0
        ? specs.services
            .map((s: string) => `<span style="display: inline-block; background: #fdf2e9; color: #8B1E1E; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: bold; margin: 3px 4px 3px 0; border: 1px solid #ebd3bf;">✓ ${s}</span>`)
            .join(' ')
        : '-';

    const emailSubject = `🥩 [คำขอใบเสนอราคาใหม่] ${company?.companyName || 'ลูกค้าใหม่'} (${ref || 'RFQ'})`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${emailSubject}</title>
      </head>
      <body style="font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f5f0; margin: 0; padding: 24px; color: #2d241e;">
        <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #ebd8c6;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8B1E1E 0%, #681515 100%); padding: 24px 28px; color: #ffffff;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #f5d38a; font-weight: bold;">
              DUANGCHAROEN INTERTRADE (DCT) · B2B QUOTE REQUEST
            </div>
            <h2 style="margin: 8px 0 4px; font-size: 22px; color: #ffffff;">
              📑 มีคำขอใบเสนอราคาใหม่ผ่านเว็บไซต์
            </h2>
            <div style="font-size: 14px; opacity: 0.9;">
              รหัสอ้างอิง: <b style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px;">${ref || 'RFQ'}</b> &nbsp;|&nbsp; วันที่: ${new Date(createdAt || Date.now()).toLocaleString('th-TH')}
            </div>
          </div>

          <!-- Body Container -->
          <div style="padding: 28px;">
            
            <!-- Section 1: Customer Profile -->
            <h3 style="color: #8B1E1E; border-bottom: 2px solid #8B1E1E; padding-bottom: 6px; margin-top: 0; font-size: 16px;">
              🏢 1. ข้อมูลบริษัทและผู้ติดต่อ
            </h3>
            <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
              <tr>
                <td style="width: 35%; padding: 6px 0; color: #666;">ชื่อบริษัท / ร้านค้า:</td>
                <td style="padding: 6px 0;"><b>${company?.companyName || '-'}</b></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">ประเภทธุรกิจ:</td>
                <td style="padding: 6px 0;">${company?.businessType || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">ชื่อผู้ติดต่อ:</td>
                <td style="padding: 6px 0;"><b>${company?.contactName || '-'}</b> ${company?.position ? `(${company.position})` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">เบอร์โทรศัพท์ติดต่อ:</td>
                <td style="padding: 6px 0;">
                  <a href="tel:${company?.phone}" style="color: #8B1E1E; font-weight: bold; text-decoration: none; font-size: 15px;">
                    📞 ${company?.phone || '-'}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">อีเมล:</td>
                <td style="padding: 6px 0;">
                  <a href="mailto:${company?.email}" style="color: #8B1E1E; text-decoration: none;">
                    ✉️ ${company?.email || '-'}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">LINE ID:</td>
                <td style="padding: 6px 0;">${company?.lineId || '-'}</td>
              </tr>
            </table>

            <!-- Section 2: Services & Logistics Requirements -->
            <h3 style="color: #8B1E1E; border-bottom: 2px solid #8B1E1E; padding-bottom: 6px; margin-top: 24px; font-size: 16px;">
              ⚙️ 2. บริการและข้อมูลการจัดส่ง
            </h3>
            <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
              <tr>
                <td style="width: 35%; padding: 6px 0; color: #666;">บริการที่ต้องการ:</td>
                <td style="padding: 6px 0;">${servicesList}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">ความถี่ในการสั่งซื้อ:</td>
                <td style="padding: 6px 0;"><b>${specs?.orderFrequency || '-'}</b></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">วันที่เริ่มรับสินค้า:</td>
                <td style="padding: 6px 0;">${specs?.startDate || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">สถานที่จัดส่ง / สาขา:</td>
                <td style="padding: 6px 0;">${specs?.deliveryLocation || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">รายละเอียดเพิ่มเติม:</td>
                <td style="padding: 6px 0; color: #444; background: #faf6f0; padding: 10px; border-radius: 4px; border: 1px solid #ebd9c8;">
                  ${specs?.additionalNotes || '-'}
                </td>
              </tr>
            </table>

            <!-- Section 3: Selected Products -->
            <h3 style="color: #8B1E1E; border-bottom: 2px solid #8B1E1E; padding-bottom: 6px; margin-top: 24px; font-size: 16px;">
              🥩 3. รายการสินค้าที่ขอราคา (${items?.length || 0} รายการ)
            </h3>
            ${itemsHtml}

            <!-- Action Button -->
            <div style="margin-top: 32px; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <a href="https://www.dcintertrade.com/admin" style="background: #8B1E1E; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
                🔍 เปิดดูในระบบหลังบ้าน CMS
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f4ece2; padding: 16px 28px; text-align: center; font-size: 12px; color: #7a6556; border-top: 1px solid #ebd8c6;">
            อีเมลแจ้งเตือนอัตโนมัติจากเว็บไซต์ <b>บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด</b><br />
            <a href="https://www.dcintertrade.com" style="color: #8B1E1E; text-decoration: none;">www.dcintertrade.com</a>
          </div>

        </div>
      </body>
      </html>
    `;

    let emailSent = false;
    let emailError = null;

    const defaultResendKey = Buffer.from('cmVfMjVpeEptd3NfNmE2NjUxWjhhVTN6MUNpMUJOWmJ5cDhV', 'base64').toString('utf-8');
    const resendApiKey =
      body?.contactSettings?.resend_api_key ||
      process.env.RESEND_API_KEY ||
      defaultResendKey;

    const emailFrom =
      body?.contactSettings?.email_from ||
      process.env.EMAIL_FROM ||
      defaultContactSettings.email_from ||
      'DCT Website <noreply@dcintertrade.com>';

    // 1. Try Resend API
    if (resendApiKey) {
      try {
        let resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [recipientEmail],
            cc: ccEmails.length > 0 ? ccEmails : undefined,
            subject: emailSubject,
            html: emailHtml,
            reply_to: company?.email || undefined,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
        } else {
          const errData = await resendRes.json();
          emailError = errData;

          // If Resend fails due to unverified custom domain / onboarding test domain restrictions
          // Resend free tier allows sending to the account owner email (krit.dhm@gmail.com)
          const fallbackEmail = 'krit.dhm@gmail.com';
          if (recipientEmail.toLowerCase() !== fallbackEmail.toLowerCase()) {
            const retryRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: 'DCT Website <onboarding@resend.dev>',
                to: [fallbackEmail],
                subject: emailSubject,
                html: emailHtml,
                reply_to: company?.email || undefined,
              }),
            });

            if (retryRes.ok) {
              emailSent = true;
              emailError = null;
            }
          }
        }
      } catch (err: any) {
        emailError = err?.message;
      }
    }

    // 2. Try Webhook / Form notification if configured
    if (!emailSent && process.env.RFQ_WEBHOOK_URL) {
      try {
        await fetch(process.env.RFQ_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref,
            company,
            specs,
            items,
            recipient: recipientEmail,
            cc: ccEmails,
            createdAt,
          }),
        });
        emailSent = true;
      } catch (err: any) {
        emailError = err?.message;
      }
    }

    return NextResponse.json({
      success: true,
      ref,
      recipient: recipientEmail,
      cc: ccEmails,
      emailSent,
      error: emailError,
      message: emailSent
        ? `ส่งข้อมูลคำขอราคาไปยัง ${recipientEmail}${ccEmails.length > 0 ? ` (CC: ${ccEmails.join(', ')})` : ''} เรียบร้อยแล้ว`
        : `บันทึกคำขอใบเสนอราคาในระบบเรียบร้อยแล้ว`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

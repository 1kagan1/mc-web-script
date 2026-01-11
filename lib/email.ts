import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@yourdomain.com';

export async function sendWelcomeEmail(to: string, username: string) {
  if (!resend) {
    console.log('[Email Mock] Welcome email to:', to);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '🎮 Hoş Geldiniz - Hesabınız Oluşturuldu!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎮 Hoş Geldiniz!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937;">Merhaba ${username}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hesabınız başarıyla oluşturuldu. Artık marketimizden ürün satın alabilir ve sunucumuzda eğlenebilirsiniz!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #1f2937; margin-top: 0;">Sonraki Adımlar:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>✅ Marketi keşfet ve ürünleri incele</li>
                <li>💰 Admin'den kredi yüklemesi talep et</li>
                <li>🎁 VIP paketlerine göz at</li>
                <li>🎮 Minecraft sunucumuza bağlan!</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/market" 
                 style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Marketi Keşfet
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Email Error]', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[Email Error]', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(
  to: string,
  username: string,
  productName: string,
  amount: number,
  orderId: string
) {
  if (!resend) {
    console.log('[Email Mock] Order confirmation to:', to);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `✅ Sipariş Onayı - ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Sipariş Alındı!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937;">Merhaba ${username}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Siparişiniz başarıyla alındı ve Minecraft sunucumuza iletildi.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
              <h3 style="color: #1f2937; margin-top: 0;">📦 Sipariş Detayları</h3>
              <table style="width: 100%; color: #4b5563;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Sipariş No:</strong></td>
                  <td style="padding: 8px 0;">${orderId.slice(0, 8)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Ürün:</strong></td>
                  <td style="padding: 8px 0;">${productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Adet:</strong></td>
                  <td style="padding: 8px 0;">${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Kullanıcı:</strong></td>
                  <td style="padding: 8px 0;">${username}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⏱️ <strong>Teslimat:</strong> Ürününüz en fazla 5 dakika içinde Minecraft sunucusunda otomatik olarak teslim edilecektir. 
                Sunucuda aktif değilseniz, bir sonraki girişinizde otomatik olarak verilecektir.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #4b5563;">İyi oyunlar! 🎮</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Email Error]', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[Email Error]', error);
    return { success: false, error };
  }
}

export async function sendPasswordReset(to: string, username: string, resetToken: string) {
  if (!resend) {
    console.log('[Email Mock] Password reset to:', to, 'Token:', resetToken);
    return { success: true, mock: true };
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '🔐 Şifre Sıfırlama Talebi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">🔐 Şifre Sıfırlama</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937;">Merhaba ${username}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Şifre sıfırlama talebiniz alındı. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Şifremi Sıfırla
              </a>
            </div>

            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #991b1b; margin: 0; font-size: 14px;">
                ⚠️ <strong>Güvenlik:</strong> Bu link 1 saat geçerlidir. Eğer bu talebi siz yapmadıysanız, bu emaili dikkate almayın.
              </p>
            </div>

            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 13px;">
                Link çalışmıyorsa aşağıdaki URL'yi tarayıcınıza kopyalayın:<br>
                <code style="background: #f3f4f6; padding: 5px; display: block; margin-top: 10px; word-break: break-all;">${resetUrl}</code>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Email Error]', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[Email Error]', error);
    return { success: false, error };
  }
}

export async function sendCreditAdded(
  to: string,
  username: string,
  amount: number,
  newBalance: number,
  reason: string
) {
  if (!resend) {
    console.log('[Email Mock] Credit added to:', to);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `💰 ${amount} Kredi Hesabınıza Eklendi!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">💰 Kredi Eklendi!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937;">Merhaba ${username}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hesabınıza yeni kredi eklendi!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b;">
              <div style="text-align: center;">
                <div style="font-size: 48px; color: #f59e0b; margin-bottom: 10px;">+${amount}</div>
                <div style="color: #6b7280; font-size: 14px;">Kredi Eklendi</div>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              
              <table style="width: 100%; color: #4b5563;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Yeni Bakiye:</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #f59e0b; font-weight: bold; font-size: 18px;">${newBalance} ₺</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Sebep:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${reason}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/market" 
                 style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Marketi Keşfet
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Email Error]', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[Email Error]', error);
    return { success: false, error };
  }
}

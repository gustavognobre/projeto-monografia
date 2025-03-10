import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorEmail = async (email: string, token: string) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Autenticação de Dois Fatores</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
            .header { background: #1a1a1a; color: white; text-align: center; padding: 24px; font-size: 20px; font-weight: bold; }
            .content { padding: 30px; text-align: center; color: #333; font-size: 16px; }
            .token { font-size: 24px; font-weight: bold; color: #007bff; background: #f0f8ff; padding: 10px 20px; border-radius: 6px; display: inline-block; margin-top: 10px; }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #777; background: #f9f9f9; border-top: 1px solid #eee; }
            .footer a { color: #007bff; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Código de Verificação</div>
            <div class="content">
                <p>Olá,</p>
                <p>Use o código abaixo para concluir sua autenticação de dois fatores:</p>
                <div class="token">${token}</div>
                <p>Se você não solicitou esse código, ignore este e-mail.</p>
            </div>
            <div class="footer">
                <p>Precisa de ajuda? <a href="mailto:suporte@suaempresa.com">Entre em contato</a>.</p>
                <p>&copy; 2025 Sua Empresa. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Código de Autenticação de Dois Fatores",
        html: htmlContent,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${encodeURIComponent(token)}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
            .header { background: #1a1a1a; color: white; text-align: center; padding: 24px; font-size: 20px; font-weight: bold; }
            .content { padding: 30px; text-align: center; color: #333; font-size: 16px; }
            .reset-button { 
                background: #007bff; 
                color: #fff; /* Fonte branca */
                padding: 14px 28px; 
                text-decoration: none; 
                font-size: 18px; 
                font-weight: bold; 
                border-radius: 8px; 
                display: inline-block; 
                transition: transform 0.2s, background 0.3s ease-in-out;
            }
            .reset-button:hover { 
                background: #0056b3; 
                transform: translateY(-2px); 
            }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #777; background: #f9f9f9; border-top: 1px solid #eee; }
            .footer a { color: #007bff; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Redefinição de Senha</div>
            <div class="content">
                <p>Olá,</p>
                <p>Clique no botão abaixo para redefinir sua senha:</p>
                <a href="${resetLink}" class="reset-button">
                    Redefinir Senha
                </a>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                    Se você não solicitou essa alteração, ignore este e-mail.
                </p>
            </div>
            <div class="footer">
                <p>Precisa de ajuda? <a href="mailto:suporte@suaempresa.com">Entre em contato</a>.</p>
                <p>&copy; 2025 Sua Empresa. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Redefinição de Senha",
        html: htmlContent,
    });
};
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de E-mail</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
            .header { background: #4CAF50; color: white; text-align: center; padding: 24px; font-size: 20px; font-weight: bold; }
            .content { padding: 30px; text-align: center; color: #333; font-size: 16px; }
            .verify-button { 
                background: #4CAF50; 
                color: #fff; /* Fonte branca */
                padding: 14px 28px; 
                text-decoration: none; 
                font-size: 18px; 
                font-weight: bold; 
                border-radius: 8px; 
                display: inline-block; 
                transition: transform 0.2s, background 0.3s ease-in-out;
            }
            .verify-button:hover { 
                background: #45a049; 
                transform: translateY(-2px); 
            }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #777; background: #f9f9f9; border-top: 1px solid #eee; }
            .footer a { color: #4CAF50; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Bem-vindo ao MetabolicHub!</div>
            <div class="content">
                <p>Estamos felizes por você estar aqui! Confirme seu e-mail para começar.</p>
                <a href="${confirmLink}" class="verify-button">
                    Confirmar E-mail
                </a>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                    Se você não se cadastrou no MetabolicHub, ignore este e-mail. 
                    O link expira em 24 horas.
                </p>
            </div>
            <div class="footer">
                <p>Precisa de ajuda? <a href="mailto:hubmetabolic@gmail.com">Entre em contato</a>.</p>
                <p>&copy; 2024 MetabolicHub. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirme seu e-mail no MetabolicHub",
        html: htmlContent,
    });
};

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    const htmlContent = `
    <div style="background-color: #f4f4f4; padding: 40px 0; text-align: center;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
            
            <!-- Cabeçalho -->
            <h2 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;">Bem-vindo ao MetabolicHub! 🚀</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Estamos felizes por você estar aqui! Confirme seu e-mail para começar.</p>

            <!-- Botão de Confirmação -->
            <a href="${confirmLink}" 
                style="background: #4CAF50; color: #fff; padding: 14px 28px; text-decoration: none; 
                font-size: 18px; font-weight: bold; border-radius: 8px; display: inline-block; 
                transition: transform 0.2s, background 0.3s ease-in-out;"
                onmouseover="this.style.background='#45a049'; this.style.transform='translateY(-2px)';"
                onmouseout="this.style.background='#4CAF50'; this.style.transform='translateY(0)';">
                ✅ Confirmar E-mail
            </a>

            <!-- Mensagem de Ajuda -->
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Se você não se cadastrou no MetabolicHub, ignore este e-mail. 
                O link expira em 24 horas.
            </p>

            <!-- Rodapé -->
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
                © 2024 MetabolicHub. Todos os direitos reservados.  
                <br>Se precisar de ajuda, entre em contato conosco:  
                <a href="mailto:support@metabolichub.com" style="color: #4CAF50; text-decoration: none;">hubmetabolic@gmail.com</a>
            </p>
        </div>
    </div>
    `;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "🚀 Confirme seu e-mail no MetabolicHub",
        html: htmlContent,
    });
};

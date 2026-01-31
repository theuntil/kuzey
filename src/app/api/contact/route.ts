import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // TLS (587)
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: body.email,
      subject: `Yeni İletişim Mesajı – ${body.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px">
          <p><strong>Ad Soyad:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Konu:</strong> ${body.topic}</p>
          <hr />
          <p>${body.message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return new NextResponse("Mail error", { status: 500 });
  }
}

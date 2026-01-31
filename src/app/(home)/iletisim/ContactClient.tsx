"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import "@/styles/iletisim.css";

export default function ContactClient() {
  useAutoPageView();
  const pathname = usePathname();
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.topic || !form.message) {
      toast.show(
        isEn ? "Please fill in all fields." : "Tüm alanları doldurun.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.show(
        isEn
          ? "Your message has been sent successfully."
          : "Mesajınız başarıyla gönderildi.",
        "success"
      );

      setForm({ name: "", email: "", topic: "", message: "" });
    } catch {
      toast.show(
        isEn
          ? "An error occurred while sending the message."
          : "Mesaj gönderilirken hata oluştu.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contact-root">
      <div className="contact-container">
        {/* INFO */}
        <div className="contact-info">
          <h1>{isEn ? "Contact" : "İletişim"}</h1>

          <p>
            {isEn
              ? "You can contact us via the form or through the information below."
              : "Form aracılığıyla veya aşağıdaki bilgilerden bize ulaşabilirsiniz."}
          </p>

          <div className="contact-items">
            <div><Mail size={16} /> iletisim@kuzeybatihaber.com.tr</div>
            <div><Mail size={16} /> reklam@kuzeybatihaber.com.tr</div>
            <div><Mail size={16} /> tekzip@kuzeybatihaber.com.tr</div>
            <div><Phone size={16} /> +90 533 443 49 78</div>
            <div><MapPin size={16} /> Karabük, Türkiye</div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="contact-form">
          <input
            name="name"
            placeholder={isEn ? "Full Name" : "Ad Soyad"}
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="topic"
            placeholder={isEn ? "Subject" : "Konu"}
            value={form.topic}
            onChange={handleChange}
          />

          <textarea
            name="message"
            rows={4}
            placeholder={isEn ? "Message" : "Mesaj"}
            value={form.message}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? isEn ? "Sending..." : "Gönderiliyor..."
              : (
                <>
                  {isEn ? "Send Message" : "Mesaj Gönder"}
                  <Send size={16} />
                </>
              )}
          </button>
        </form>
      </div>
    </section>
  );
}

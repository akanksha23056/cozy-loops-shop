import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const FooterSection = () => {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.message.trim()) return;
    setContactStatus('sending');

    const { error } = await supabase.from('contact_messages').insert({
      name: contactForm.name.trim(),
      phone: contactForm.phone.trim(),
      email: contactForm.email.trim(),
      message: contactForm.message.trim(),
    });

    if (error) {
      setContactStatus('error');
    } else {
      setContactStatus('sent');
      setContactForm({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setContactStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-24 px-4 bg-background">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-heading font-bold text-center mb-12 text-foreground"
      >
        come find us 🌸
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="max-w-lg mx-auto space-y-4 text-center font-body text-lg"
      >
        <p>📞 +91 98765 43210</p>
        <p>
          📸{' '}
          <a href="https://instagram.com/yourcrochetshop" target="_blank" rel="noopener noreferrer" className="underline decoration-primary decoration-2 underline-offset-4">
            @yourcrochetshop
          </a>
        </p>
        <p>📧 hello@yourcrochetshop.com</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-md mx-auto mt-12 text-center"
      >
        <p className="font-body text-muted-foreground leading-relaxed">
          want something custom? slide into our DMs or drop us a mail, we love making things just for you 💌
        </p>
      </motion.div>

      {/* Contact form */}
      <motion.form
        onSubmit={handleContactSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="max-w-md mx-auto mt-10 space-y-3"
      >
        <h3 className="font-heading font-bold text-center text-lg">drop us a message 💬</h3>
        <input
          type="text"
          placeholder="Your name"
          value={contactForm.name}
          onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            placeholder="Phone"
            value={contactForm.phone}
            onChange={e => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
          <input
            type="email"
            placeholder="Email"
            value={contactForm.email}
            onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
        </div>
        <textarea
          placeholder="Your message..."
          value={contactForm.message}
          onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none h-24"
          required
        />
        <button
          type="submit"
          disabled={contactStatus === 'sending'}
          className="w-full py-3 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold shadow active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
        >
          {contactStatus === 'sending' ? 'sending...' : contactStatus === 'sent' ? 'sent! 💛' : contactStatus === 'error' ? 'oops, try again 😢' : 'Send Message 💌'}
        </button>
      </motion.form>

      {/* Yarn ball animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.4 }}
        className="flex justify-center mt-12"
      >
        <div className="relative w-24 h-24">
          <div
            className="w-24 h-24 rounded-full animate-yarn-spin"
            style={{
              background: 'conic-gradient(hsl(344 78% 81%), hsl(49 91% 74%), hsl(113 26% 70%), hsl(263 50% 82%), hsl(14 75% 66%), hsl(344 78% 81%))',
            }}
          />
          <div className="absolute inset-2 rounded-full bg-background" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">🧶</span>
        </div>
      </motion.div>

      {/* Thank you */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 text-center relative"
      >
        <h3 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
          <span className="animate-sparkle inline-block" style={{ animationDelay: '0s' }}>✨</span>
          {' '}thank you for coming, come again{' '}
          <span className="animate-sparkle inline-block" style={{ animationDelay: '1s' }}>🌸</span>
        </h3>
      </motion.div>
    </section>
  );
};

export default FooterSection;

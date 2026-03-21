import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

interface Props {
  onBack: () => void;
  onClose: () => void;
}

const CheckoutView = ({ onBack, onClose }: Props) => {
  const { items, totalPrice, clearCart } = useCart();
  const [paid, setPaid] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });

  const handlePaid = () => {
    setPaid(true);
    setTimeout(() => {
      clearCart();
      onClose();
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <button onClick={onBack} className="text-xl cursor-pointer active:scale-90 transition-transform">←</button>
        <h2 className="font-heading text-2xl font-bold">checkout 💌</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {paid ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <span className="text-6xl mb-4">🎉</span>
              <h3 className="font-heading text-2xl font-bold mb-2">yay, thank you!</h3>
              <p className="font-body text-muted-foreground">we'll confirm your order soon 💛</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Order summary */}
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <h3 className="font-heading font-bold text-sm mb-2">Order Summary</h3>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm font-body">
                    <span>{item.emoji} {item.name} × {item.quantity}</span>
                    <span className="font-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span className="font-heading">Total</span>
                  <span className="font-price">₹{totalPrice}</span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-3 mt-6">
                <h3 className="font-heading font-bold">delivery details 📦</h3>
                {(['name', 'phone', 'address'] as const).map(field => (
                  <input
                    key={field}
                    type={field === 'phone' ? 'tel' : 'text'}
                    placeholder={field === 'name' ? 'Your name' : field === 'phone' ? 'Phone number' : 'Delivery address'}
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                ))}
                <textarea
                  placeholder="Note or custom request (optional) 💬"
                  value={form.note}
                  onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none h-20"
                />
              </div>

              {/* UPI payment */}
              <div className="mt-6 space-y-4">
                <h3 className="font-heading font-bold">pay via UPI 💸</h3>
                <div className="flex flex-col items-center bg-muted rounded-xl p-6">
                  {/* Placeholder QR */}
                  <div className="w-40 h-40 bg-foreground/10 rounded-xl flex items-center justify-center text-4xl mb-4">
                    📱
                  </div>
                  <p className="font-price font-bold text-sm">UPI ID: yourname@upi</p>
                  <p className="font-body text-xs text-muted-foreground mt-2 text-center">
                    scan or pay using any UPI app, then screenshot your payment and send it to us!
                  </p>
                </div>

                <button
                  onClick={handlePaid}
                  className="w-full py-3 rounded-full bg-secondary text-secondary-foreground font-heading font-bold text-lg shadow active:scale-95 transition-transform cursor-pointer"
                >
                  I've paid! Notify us ✅
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutView;

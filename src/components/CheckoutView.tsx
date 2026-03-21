import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  onBack: () => void;
  onClose: () => void;
}

const CheckoutView = ({ onBack, onClose }: Props) => {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('please fill in name, phone, and address 🥺');
      return;
    }
    setError('');
    setSubmitting(true);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_address: form.address.trim(),
        custom_note: form.note.trim(),
        total_amount: totalPrice,
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      setError('something went wrong, please try again 😢');
      setSubmitting(false);
      return;
    }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setError('something went wrong saving items 😢');
      setSubmitting(false);
      return;
    }

    setOrderId(order.id);
    setSubmitting(false);
    setStep('payment');
  };

  const handlePaid = async () => {
    if (!upiTxnId.trim()) {
      setError('please enter your UPI transaction ID 💸');
      return;
    }
    setError('');
    setSubmitting(true);

    if (orderId) {
      await supabase
        .from('orders')
        .update({ upi_transaction_id: upiTxnId.trim(), payment_status: 'submitted' })
        .eq('id', orderId);
    }

    setSubmitting(false);
    setStep('success');
    setTimeout(() => {
      clearCart();
      onClose();
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <button onClick={step === 'payment' ? () => setStep('form') : onBack} className="text-xl cursor-pointer active:scale-90 transition-transform">←</button>
        <h2 className="font-heading text-2xl font-bold">checkout 💌</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <span className="text-6xl mb-4">🎉</span>
              <h3 className="font-heading text-2xl font-bold mb-2">yay!! we got your order 🎀</h3>
              <p className="font-body text-muted-foreground">we'll confirm once we verify payment!</p>
            </motion.div>
          ) : step === 'payment' ? (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
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

              {/* UPI payment */}
              <div className="mt-6 space-y-4">
                <h3 className="font-heading font-bold">pay via UPI 💸</h3>
                <div className="flex flex-col items-center bg-muted rounded-xl p-6">
                  <div className="w-40 h-40 bg-foreground/10 rounded-xl flex items-center justify-center text-4xl mb-4">
                    📱
                  </div>
                  <p className="font-price font-bold text-sm">UPI ID: yourname@upi</p>
                  <p className="font-body text-xs text-muted-foreground mt-2 text-center">
                    scan or pay using any UPI app, then enter your transaction ID below!
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="UPI Transaction ID"
                  value={upiTxnId}
                  onChange={e => setUpiTxnId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
                />

                {error && <p className="text-sm text-destructive font-body">{error}</p>}

                <button
                  onClick={handlePaid}
                  disabled={submitting}
                  className="w-full py-3 rounded-full bg-secondary text-secondary-foreground font-heading font-bold text-lg shadow active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'submitting...' : "I've paid! Notify us ✅"}
                </button>
              </div>
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

              {error && <p className="text-sm text-destructive font-body mt-2">{error}</p>}

              <button
                onClick={handleCreateOrder}
                disabled={submitting}
                className="w-full mt-6 py-3 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold text-lg shadow active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'placing order...' : 'Continue to Payment 💳'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutView;

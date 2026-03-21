import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import CheckoutView from './CheckoutView';

const CartDrawer = () => {
  const { items, totalItems, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {/* Sticky cart icon */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed top-4 right-4 z-50 bg-terracotta text-terracotta-foreground w-12 h-12 rounded-full shadow-lg flex items-center justify-center font-heading text-xl active:scale-90 transition-transform cursor-pointer"
      >
        🛒
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-price font-bold w-5 h-5 rounded-full flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </button>

      {/* Drawer overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCartOpen(false); setShowCheckout(false); }}
              className="fixed inset-0 bg-foreground/30 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col overflow-y-auto"
            >
              {showCheckout ? (
                <CheckoutView onBack={() => setShowCheckout(false)} onClose={() => { setIsCartOpen(false); setShowCheckout(false); }} />
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="font-heading text-2xl font-bold">your cart 🧺</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-2xl cursor-pointer active:scale-90 transition-transform">✕</button>
                  </div>

                  <div className="flex-1 p-6">
                    {items.length === 0 ? (
                      <p className="text-center text-muted-foreground font-body mt-12 text-lg">nothing here yet... go add some goodies! 🌸</p>
                    ) : (
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted">
                            <span className="text-3xl">{item.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading font-bold text-sm truncate">{item.name}</p>
                              <p className="font-price text-sm text-muted-foreground">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-primary/30 font-bold text-sm flex items-center justify-center cursor-pointer active:scale-90 transition-transform">−</button>
                              <span className="font-price font-bold text-sm w-5 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary/30 font-bold text-sm flex items-center justify-center cursor-pointer active:scale-90 transition-transform">+</button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-foreground cursor-pointer text-lg">🗑️</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="p-6 border-t border-border">
                      <div className="flex justify-between mb-4">
                        <span className="font-heading text-lg font-bold">Total</span>
                        <span className="font-price text-lg font-bold">₹{totalPrice}</span>
                      </div>
                      <button
                        onClick={() => setShowCheckout(true)}
                        className="w-full py-3 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold text-lg shadow active:scale-95 transition-transform cursor-pointer"
                      >
                        Checkout 💛
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;

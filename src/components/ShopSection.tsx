import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const ShopSection = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at');
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAdd = (product: Tables<'products'>, e: React.MouseEvent) => {
    if (product.stock_quantity <= 0) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#F2A7BB', '#A8C5A0', '#F9E07F', '#C9B8E8', '#E8866A'],
      scalar: 0.8,
    });
    addItem({ id: product.id, name: product.name, price: product.price, emoji: product.emoji || '🧶' });
  };

  return (
    <section id="shop" className="py-24 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-heading font-bold text-center mb-16 text-foreground"
      >
        add to cart, go on 🛒
      </motion.h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.08 }}
              whileHover={{ scale: 1.04, rotate: Math.random() > 0.5 ? 1 : -1 }}
              className="bg-card rounded-2xl shadow-md overflow-hidden flex flex-col"
              style={{ borderTop: `4px solid ${product.border_color || 'hsl(344 78% 81%)'}` }}
            >
              <div className="flex items-center justify-center py-8 sm:py-12 text-5xl sm:text-6xl select-none">
                {product.emoji || '🧶'}
              </div>
              <div className="px-4 pb-5 flex flex-col flex-1">
                <h3 className="font-heading font-bold text-base sm:text-lg leading-snug text-foreground">{product.name}</h3>
                <p className="font-price font-semibold text-lg mt-1 text-foreground/80">₹{product.price}</p>
                {product.stock_quantity <= 0 ? (
                  <button
                    disabled
                    className="mt-auto pt-4 w-full py-2.5 rounded-full bg-muted text-muted-foreground font-heading font-bold text-sm sm:text-base cursor-not-allowed"
                  >
                    out of stock 🥺
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleAdd(product, e)}
                    className="mt-auto pt-4 w-full py-2.5 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold text-sm sm:text-base shadow active:scale-95 transition-transform cursor-pointer"
                  >
                    Add to Cart 🛒
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShopSection;

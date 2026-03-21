import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '@/contexts/CartContext';

const products = [
  { id: 'hairtie-set', name: 'Crochet Hairtie Set', price: 199, emoji: '🎀', borderColor: 'hsl(344 78% 81%)' },
  { id: 'strawberry-keychain', name: 'Strawberry Keychain', price: 149, emoji: '🍓', borderColor: 'hsl(49 91% 74%)' },
  { id: 'airpod-case', name: 'AirPod Case (custom color)', price: 349, emoji: '🎧', borderColor: 'hsl(263 50% 82%)' },
  { id: 'mini-wallet', name: 'Mini Wallet', price: 399, emoji: '👛', borderColor: 'hsl(113 26% 70%)' },
  { id: 'pastel-pouch', name: 'Pastel Pouch', price: 299, emoji: '🛍️', borderColor: 'hsl(14 75% 76%)' },
  { id: 'heart-keychain', name: 'Heart Keychain', price: 149, emoji: '💖', borderColor: 'hsl(344 78% 81%)' },
];

const ShopSection = () => {
  const { addItem } = useCart();

  const handleAdd = (product: typeof products[0], e: React.MouseEvent) => {
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
    addItem({ id: product.id, name: product.name, price: product.price, emoji: product.emoji });
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
            style={{ borderTop: `4px solid ${product.borderColor}` }}
          >
            <div className="flex items-center justify-center py-8 sm:py-12 text-5xl sm:text-6xl select-none">
              {product.emoji}
            </div>
            <div className="px-4 pb-5 flex flex-col flex-1">
              <h3 className="font-heading font-bold text-base sm:text-lg leading-snug text-foreground">{product.name}</h3>
              <p className="font-price font-semibold text-lg mt-1 text-foreground/80">₹{product.price}</p>
              <button
                onClick={(e) => handleAdd(product, e)}
                className="mt-auto pt-4 w-full py-2.5 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold text-sm sm:text-base shadow active:scale-95 transition-transform cursor-pointer"
              >
                Add to Cart 🛒
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ShopSection;

import { motion } from 'framer-motion';

const categories = [
  { emoji: '🎀', name: 'Hairties', color: 'hsl(344 78% 81%)' },
  { emoji: '🔑', name: 'Keychains', color: 'hsl(49 91% 74%)' },
  { emoji: '🎧', name: 'AirPod Cases', color: 'hsl(263 50% 82%)' },
  { emoji: '👛', name: 'Wallets', color: 'hsl(113 26% 70%)' },
  { emoji: '🛍️', name: 'Pouches', color: 'hsl(14 75% 76%)' },
];

const CategoriesSection = () => {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-heading font-bold text-center mb-16 text-foreground"
      >
        what's here 🌈
      </motion.h2>

      <div className="max-w-3xl mx-auto flex flex-col gap-8 items-center">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, x: i % 2 === 0 ? -120 : 120, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 18,
              delay: i * 0.1,
            }}
            className="flex items-center justify-center gap-4 w-52 h-52 sm:w-60 sm:h-60 rounded-full shadow-lg cursor-default select-none"
            style={{ backgroundColor: cat.color }}
          >
            <div className="text-center">
              <span className="text-5xl sm:text-6xl block mb-2">{cat.emoji}</span>
              <span className="font-heading font-bold text-xl sm:text-2xl text-foreground/90">{cat.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

import { motion } from 'framer-motion';

const floatingEmojis = [
  { emoji: '🧶', x: '10%', y: '20%', className: 'animate-float-slow' },
  { emoji: '🌸', x: '80%', y: '15%', className: 'animate-float-medium' },
  { emoji: '✨', x: '70%', y: '70%', className: 'animate-float-fast' },
  { emoji: '🧶', x: '20%', y: '75%', className: 'animate-float-medium' },
  { emoji: '🌸', x: '50%', y: '10%', className: 'animate-float-slow' },
  { emoji: '✨', x: '90%', y: '50%', className: 'animate-float-fast' },
  { emoji: '🎀', x: '5%', y: '50%', className: 'animate-float-slow' },
  { emoji: '💛', x: '40%', y: '80%', className: 'animate-float-medium' },
];

const heroText = "hiiiii 🧶";

const HeroSection = () => {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(30 100% 97%), hsl(344 78% 91%), hsl(113 26% 85%), hsl(49 91% 88%), hsl(263 50% 90%))',
        backgroundSize: '300% 300%',
        animation: 'gradient-shift 8s ease infinite',
      }}
    >
      {/* Floating emojis */}
      {floatingEmojis.map((item, i) => (
        <span
          key={i}
          className={`absolute text-2xl sm:text-4xl select-none pointer-events-none ${item.className}`}
          style={{ left: item.x, top: item.y, animationDelay: `${i * 0.7}s` }}
        >
          {item.emoji}
        </span>
      ))}

      {/* Main text */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-bold text-foreground leading-tight">
          {heroText.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
                delay: i * 0.08,
              }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
          className="mt-6 text-lg sm:text-xl font-body text-foreground/70 max-w-md mx-auto"
        >
          handmade with love, one loop at a time
        </motion.p>

        <motion.a
          href="#shop"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
          className="inline-block mt-10 px-8 py-4 rounded-full bg-terracotta text-terracotta-foreground font-heading text-lg font-bold shadow-lg animate-bounce-gentle cursor-pointer active:scale-95 transition-transform"
        >
          shop now 🛒
        </motion.a>
      </div>
    </motion.section>
  );
};

export default HeroSection;

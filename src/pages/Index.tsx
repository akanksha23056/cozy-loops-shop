import { CartProvider } from '@/contexts/CartContext';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import ShopSection from '@/components/ShopSection';
import CartDrawer from '@/components/CartDrawer';
import FooterSection from '@/components/FooterSection';

const Index = () => {
  return (
    <CartProvider>
      <CartDrawer />
      <main className="overflow-x-hidden">
        <HeroSection />
        <CategoriesSection />
        <ShopSection />
        <FooterSection />
      </main>
    </CartProvider>
  );
};

export default Index;

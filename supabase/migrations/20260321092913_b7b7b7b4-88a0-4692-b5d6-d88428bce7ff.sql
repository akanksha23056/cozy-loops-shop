
-- Allow reading orders (for admin page, no auth in this project)
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);

-- Allow reading order items
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);

-- Allow reading contact messages
CREATE POLICY "Anyone can view contact messages" ON public.contact_messages FOR SELECT USING (true);

-- Allow updating products (for admin)
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);

-- Allow inserting products (for admin)
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);

-- Allow deleting products (for admin)
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

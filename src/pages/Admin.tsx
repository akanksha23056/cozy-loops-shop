import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const ADMIN_PASSWORD = 'crochetadmin123';

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'orders' | 'messages' | 'products'>('orders');

  const [orders, setOrders] = useState<(Tables<'orders'> & { order_items: Tables<'order_items'>[] })[]>([]);
  const [messages, setMessages] = useState<Tables<'contact_messages'>[]>([]);
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [loading, setLoading] = useState(false);

  // Product form
  const [editProduct, setEditProduct] = useState<Partial<Tables<'products'>> | null>(null);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as any);
  }, []);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at');
    if (data) setProducts(data);
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([fetchOrders(), fetchMessages(), fetchProducts()]).finally(() => setLoading(false));
  }, [authed, fetchOrders, fetchMessages, fetchProducts]);

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ payment_status: status }).eq('id', id);
    fetchOrders();
  };

  const saveProduct = async () => {
    if (!editProduct || !editProduct.name || !editProduct.price || !editProduct.category) return;
    if (editProduct.id) {
      await supabase.from('products').update({
        name: editProduct.name,
        price: editProduct.price,
        category: editProduct.category,
        description: editProduct.description || '',
        image_url: editProduct.image_url || '',
        emoji: editProduct.emoji || '🧶',
        stock_quantity: editProduct.stock_quantity ?? 10,
        border_color: editProduct.border_color || 'hsl(344 78% 81%)',
      }).eq('id', editProduct.id);
    } else {
      await supabase.from('products').insert({
        name: editProduct.name,
        price: editProduct.price,
        category: editProduct.category,
        description: editProduct.description || '',
        image_url: editProduct.image_url || '',
        emoji: editProduct.emoji || '🧶',
        stock_quantity: editProduct.stock_quantity ?? 10,
        border_color: editProduct.border_color || 'hsl(344 78% 81%)',
      });
    }
    setEditProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <h1 className="font-heading text-2xl font-bold text-center">admin 🔐</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuthed(true)}
            className="w-full px-4 py-3 rounded-xl bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => password === ADMIN_PASSWORD ? setAuthed(true) : alert('Wrong password')}
            className="w-full py-3 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold shadow active:scale-95 transition-transform cursor-pointer"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-6">admin dashboard 🧶</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['orders', 'messages', 'products'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full font-heading font-bold text-sm transition-colors cursor-pointer ${
                tab === t ? 'bg-terracotta text-terracotta-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {t === 'orders' ? '📦 Orders' : t === 'messages' ? '💬 Messages' : '🛍️ Products'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : tab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-muted-foreground font-body">No orders yet</p>}
            {orders.map(order => (
              <div key={order.id} className="bg-card rounded-xl shadow p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-heading font-bold">{order.customer_name}</p>
                    <p className="font-body text-sm text-muted-foreground">{order.customer_phone} • {order.customer_address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-heading ${
                    order.payment_status === 'confirmed' ? 'bg-secondary text-secondary-foreground' :
                    order.payment_status === 'shipped' ? 'bg-accent text-accent-foreground' :
                    order.payment_status === 'submitted' ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
                {order.custom_note && <p className="font-body text-sm italic">Note: {order.custom_note}</p>}
                {order.upi_transaction_id && <p className="font-price text-sm">UPI Txn: {order.upi_transaction_id}</p>}
                <div className="text-sm font-body space-y-1 bg-muted rounded-lg p-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>Product {item.product_id.slice(0, 8)}... × {item.quantity}</span>
                      <span className="font-price">₹{item.price_at_purchase * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-1 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="font-price">₹{order.total_amount}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                <div className="flex gap-2">
                  {order.payment_status !== 'confirmed' && (
                    <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-heading font-bold cursor-pointer active:scale-95 transition-transform">
                      ✅ Confirm
                    </button>
                  )}
                  {order.payment_status !== 'shipped' && (
                    <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-heading font-bold cursor-pointer active:scale-95 transition-transform">
                      📦 Ship
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : tab === 'messages' ? (
          <div className="space-y-4">
            {messages.length === 0 && <p className="text-muted-foreground font-body">No messages yet</p>}
            {messages.map(msg => (
              <div key={msg.id} className="bg-card rounded-xl shadow p-4">
                <p className="font-heading font-bold">{msg.name}</p>
                <p className="font-body text-sm text-muted-foreground">{msg.phone} • {msg.email}</p>
                <p className="font-body mt-2">{msg.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setEditProduct({ name: '', price: 0, category: '', emoji: '🧶', stock_quantity: 10, border_color: 'hsl(344 78% 81%)' })}
              className="px-4 py-2 rounded-full bg-terracotta text-terracotta-foreground font-heading font-bold text-sm cursor-pointer active:scale-95 transition-transform"
            >
              + Add Product
            </button>

            {editProduct && (
              <div className="bg-card rounded-xl shadow p-4 space-y-3 border-2 border-primary">
                <h3 className="font-heading font-bold">{editProduct.id ? 'Edit Product' : 'New Product'}</h3>
                <input placeholder="Name" value={editProduct.name || ''} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Price" type="number" value={editProduct.price || ''} onChange={e => setEditProduct(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                  <input placeholder="Category" value={editProduct.category || ''} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="Emoji" value={editProduct.emoji || ''} onChange={e => setEditProduct(p => ({ ...p, emoji: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                  <input placeholder="Stock" type="number" value={editProduct.stock_quantity ?? ''} onChange={e => setEditProduct(p => ({ ...p, stock_quantity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                  <input placeholder="Border color" value={editProduct.border_color || ''} onChange={e => setEditProduct(p => ({ ...p, border_color: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <input placeholder="Image URL" value={editProduct.image_url || ''} onChange={e => setEditProduct(p => ({ ...p, image_url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary" />
                <textarea placeholder="Description" value={editProduct.description || ''} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-muted font-body text-sm outline-none focus:ring-2 focus:ring-primary resize-none h-16" />
                <div className="flex gap-2">
                  <button onClick={saveProduct} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-heading font-bold text-sm cursor-pointer active:scale-95 transition-transform">
                    Save
                  </button>
                  <button onClick={() => setEditProduct(null)} className="px-4 py-2 rounded-full bg-muted text-foreground font-heading font-bold text-sm cursor-pointer active:scale-95 transition-transform">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {products.map(product => (
              <div key={product.id} className="bg-card rounded-xl shadow p-4 flex items-center gap-4">
                <span className="text-3xl">{product.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold truncate">{product.name}</p>
                  <p className="font-price text-sm">₹{product.price} • {product.category} • Stock: {product.stock_quantity}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditProduct(product)} className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-heading font-bold cursor-pointer active:scale-95 transition-transform">
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-heading font-bold cursor-pointer active:scale-95 transition-transform">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

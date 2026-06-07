import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('steam_accounts').select('*');
      setProducts(data || []);
    }
    loadProducts();
  }, []);

  return (
    <div style={{ background: '#0b0e14', color: '#fff', padding: '50px', fontFamily: 'system-ui' }}>
      <h1>ARCYN MARKET</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #333', padding: '20px', borderRadius: '15px' }}>
            <h3>{p.game_name}</h3>
            <p>Cena: {p.price} PLN</p>
            <a href="https://discord.gg/eBfXSsRks" target="_blank" style={{ background: '#5865F2', padding: '10px', display: 'block', textAlign: 'center', borderRadius: '8px', color: '#fff', textDecoration: 'none' }}>
              KUP TERAZ
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

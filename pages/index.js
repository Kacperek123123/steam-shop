import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);

      const { data } = await supabase.from('steam_accounts').select('*').eq('status', 'available');
      setProducts(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const login = async () => await supabase.auth.signInWithOAuth({ provider: 'discord' });

  const startPurchase = async (product, method) => {
    const { data, error } = await supabase.from('orders').insert([{
      discord_id: user.id,
      product_id: product.id,
      payment_method: method,
      status: 'pending',
      amount: product.price
    }]).select().single();

    if (error) return alert("Błąd startu płatności");
    
    if (method === 'crypto') {
      alert(`Wpłać ${product.price} LTC na adres: LM3eUhktfk69fRLXncjrRA4qEyULJmbbPc\nID zamówienia (wpisz w tytule): ${data.id}`);
    } else if (method === 'psc') {
      const code = prompt("Wklej kod PSC:");
      if (code) {
        await supabase.from('orders').update({ psc_code: code, status: 'waiting_for_admin' }).eq('id', data.id);
        alert("Kod wysłany do sprawdzenia!");
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>ARCYN<span style={{color: '#5865F2'}}> MARKET</span></h1>
        {user ? <button onClick={() => window.location.href='/panel'} style={styles.userBadge}>Moje Zakupy</button> : null}
      </header>

      <main style={styles.main}>
        {loading ? <p>Ładowanie...</p> : !user ? (
          <div style={styles.hero}>
            <h2>Witaj w ARCYN</h2>
            <button onClick={login} style={styles.loginBtn}>Zaloguj przez Discord</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p.id} style={styles.card}>
                <h3>{p.login}</h3>
                <p>Cena: {p.price} LTC</p>
                <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                  <button onClick={() => startPurchase(p, 'crypto')} style={styles.btn}>Kup (Krypto)</button>
                  <button onClick={() => startPurchase(p, 'psc')} style={styles.btn}>Kup (PSC)</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0b0e14', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '20px 0' },
  logo: { fontSize: '28px', fontWeight: '800' },
  userBadge: { background: '#5865F2', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
  main: { maxWidth: '1000px', margin: '40px auto' },
  hero: { textAlign: 'center', padding: '60px', background: '#151921', borderRadius: '20px' },
  loginBtn: { background: '#5865F2', border: 'none', color: '#fff', padding: '15px 30px', borderRadius: '10px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#151921', padding: '25px', borderRadius: '16px', border: '1px solid #222' },
  btn: { flex: 1, padding: '10px', background: '#1a1f29', border: '1px solid #333', color: '#fff', borderRadius: '8px', cursor: 'pointer' }
};

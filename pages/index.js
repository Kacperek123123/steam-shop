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

      // Pobieramy wszystko z tabeli steam_accounts
      const { data, error } = await supabase.from('steam_accounts').select('*');
      if (error) console.error("Błąd:", error);
      
      setProducts(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const login = async () => await supabase.auth.signInWithOAuth({ provider: 'discord' });

  const startPurchase = async (product, method) => {
    if (!user) return alert("Musisz się zalogować przez Discord!");

    const { data, error } = await supabase.from('orders').insert([{
      discord_id: user.id,
      product_id: product.id,
      payment_method: method,
      status: method === 'crypto' ? 'pending' : 'waiting_for_admin',
      amount: product.price || 0
    }]).select().single();

    if (error) return alert("Błąd płatności. Upewnij się, że masz uprawnienia w Supabase (Policies).");
    
    if (method === 'crypto') {
      alert(`Wpłać ${product.price} LTC na adres: LM3eUhktfk69fRLXncjrRA4qEyULJmbbPc\nID zamówienia: ${data.id}`);
    } else if (method === 'psc') {
      const code = prompt("Wklej kod PSC:");
      if (code) {
        await supabase.from('orders').update({ psc_code: code }).eq('id', data.id);
        alert("Kod wysłany do weryfikacji!");
      }
    } else if (method === 'paypal') {
      alert(`Wpłać ${product.price} PLN na PayPal: twojemail@adres.pl\nOPCJA: FRIENDS & FAMILY\nID zamówienia: ${data.id}`);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>ARCYN<span style={{color: '#5865F2'}}> MARKET</span></h1>
        {user ? <button onClick={() => window.location.href='/dashboard'} style={styles.userBadge}>Panel Klienta</button> : null}
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
                <img src={p.image_url || 'https://via.placeholder.com/300x150'} alt="game" style={{width: '100%', borderRadius: '10px', marginBottom: '10px'}} />
                <h3>{p.game_name || p.login}</h3>
                <p>{p.description || "Konto Steam"}</p>
                <p><strong>Cena: {p.price} PLN/LTC</strong></p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px'}}>
                  <button onClick={() => startPurchase(p, 'crypto')} style={styles.btn}>Kup przez Crypto</button>
                  <button onClick={() => startPurchase(p, 'psc')} style={styles.btn}>Kup przez PSC</button>
                  <button onClick={() => startPurchase(p, 'paypal')} style={styles.btn}>Kup przez PayPal (F&F)</button>
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
  btn: { padding: '10px', background: '#1a1f29', border: '1px solid #333', color: '#fff', borderRadius: '8px', cursor: 'pointer' }
};

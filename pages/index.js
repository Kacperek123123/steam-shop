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

      const { data, error } = await supabase.from('steam_accounts').select('*');
      if (error) console.error("Błąd:", error);
      
      setProducts(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'discord',
      options: { redirectTo: 'https://steam-shop-hsur.vercel.app/' }
    });
  };

  // Uproszczona funkcja - przekierowuje na Discord
  const startPurchase = (product) => {
    window.open('https://discord.gg/TWÓJ_LINK_ZAPROSZENIA', '_blank');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>ARCYN<span style={{color: '#5865F2'}}> MARKET</span></h1>
        {user ? <button onClick={() => window.location.href='/dashboard'} style={styles.userBadge}>Moje Zamówienia</button> : null}
      </header>

      <main style={styles.main}>
        {loading ? <p>Ładowanie...</p> : !user ? (
          <div style={styles.hero}>
            <h2>Witaj w ARCYN</h2>
            <p>Zaloguj się przez Discord, aby przeglądać ofertę.</p>
            <button onClick={login} style={styles.loginBtn}>Zaloguj przez Discord</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p.id} style={styles.card}>
                <img src={p.image_url || 'https://via.placeholder.com/300x150'} alt="game" style={{width: '100%', borderRadius: '10px', marginBottom: '10px'}} />
                <h3>{p.game_name || p.login}</h3>
                <p>{p.description || "Konto Steam"}</p>
                <p><strong>Cena: {p.price} PLN</strong></p>
                <button onClick={() => startPurchase(p)} style={styles.btn}>KUP NA DISCORDZIE</button>
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
  card: { background: '#151921', padding: '25px', borderRadius: '16px', border: '1px solid #222', textAlign: 'center' },
  btn: { width: '100%', padding: '12px', background: '#5865F2', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

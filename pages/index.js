import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
      
      supabase.from('steam_accounts').select('*').eq('status', 'available')
        .then(({ data: prodData }) => {
          if (prodData) setProducts(prodData);
          setLoading(false);
        });
    });
  }, []);

  const login = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await supabase.auth.signInWithOAuth({ provider: 'discord' });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>SteamMarket<span style={{color: '#5865F2'}}>.pl</span></h1>
        {user && <p>Zalogowany: <strong>{user.user_metadata?.full_name}</strong></p>}
      </header>

      <main style={styles.main}>
        {loading ? (
          <p>Wczytywanie ofert...</p>
        ) : !user ? (
          <div style={styles.hero}>
            <h2>Witaj w najlepszym sklepie z kontami Steam</h2>
            <p>Bezpieczne transakcje i natychmiastowa dostawa.</p>
            <button onClick={login} style={styles.loginButton}>Zaloguj przez Discord</button>
          </div>
        ) : (
          <div>
            <h2 style={{marginBottom: '20px'}}>Dostępne Konta</h2>
            <div style={styles.grid}>
              {products.map((p) => (
                <div key={p.id} style={styles.card}>
                  <h3 style={{margin: '0 0 10px 0'}}>{p.login}</h3>
                  <p style={{color: '#aaa'}}>Status: Dostępne</p>
                  <button style={styles.buyButton}>Kup teraz</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0f0f12', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #333' },
  logo: { fontSize: '24px', fontWeight: 'bold' },
  main: { maxWidth: '1000px', margin: '40px auto', textAlign: 'center' },
  hero: { padding: '60px', background: '#1a1a1f', borderRadius: '15px' },
  loginButton: { padding: '15px 40px', fontSize: '16px', background: '#5865F2', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { background: '#1a1a1f', padding: '20px', borderRadius: '12px', border: '1px solid #333', transition: '0.3s' },
  buyButton: { background: 'transparent', border: '1px solid #5865F2', color: '#5865F2', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', width: '100%', marginTop: '10px' }
};

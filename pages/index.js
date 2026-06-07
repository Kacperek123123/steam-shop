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
      
      // Pobieramy dane z tabeli
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
        <h1 style={styles.logo}>ARCYN<span style={{color: '#5865F2'}}> MARKET</span></h1>
        {user ? <div style={styles.userBadge}>{user.user_metadata?.full_name}</div> : null}
      </header>

      <main style={styles.main}>
        {loading ? <p>Ładowanie zasobów...</p> : !user ? (
          <div style={styles.hero}>
            <h2>Witaj w ARCYN</h2>
            <p>Najlepsze konta współdzielone w zasięgu ręki.</p>
            <button onClick={login} style={styles.loginBtn}>Zaloguj przez Discord</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p.id} style={styles.card}>
                <h3 style={styles.title}>{p.login}</h3>
                <p style={styles.desc}>{p.description || "Konto współdzielone"}</p>
                
                <div style={styles.dataBox}>
                  <p><strong>Login:</strong> {p.login}</p>
                  <p><strong>Hasło:</strong> {p.password}</p>
                  <p style={{color: '#5865F2'}}><strong>Kod Guard:</strong> {p.guard_code}</p>
                </div>
                
                <button style={styles.btn}>Pobierz dane</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0b0e14', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #222' },
  logo: { fontSize: '28px', fontWeight: '800', margin: 0 },
  userBadge: { background: '#222', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' },
  main: { maxWidth: '1000px', margin: '40px auto' },
  hero: { textAlign: 'center', padding: '60px', background: '#151921', borderRadius: '20px' },
  loginBtn: { background: '#5865F2', border: 'none', color: '#fff', padding: '15px 30px', borderRadius: '10px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#151921', padding: '25px', borderRadius: '16px', border: '1px solid #222', transition: '0.3s' },
  title: { fontSize: '20px', margin: '0 0 10px 0' },
  desc: { fontSize: '13px', color: '#888', marginBottom: '15px' },
  dataBox: { background: '#0b0e14', padding: '15px', borderRadius: '10px', marginBottom: '15px', fontSize: '14px', border: '1px solid #222' },
  btn: { width: '100%', padding: '12px', background: '#1a1f29', border: '1px solid #333', color: '#fff', borderRadius: '8px', cursor: 'pointer' }
};

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Sprawdź zalogowanego użytkownika
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });

    // Pobierz konta
    supabase.from('steam_accounts').select('*').eq('status', 'available')
      .then(({ data }) => { 
        if (data) setProducts(data); 
      });
  }, []);

  const login = () => supabase.auth.signInWithOAuth({ provider: 'discord' });

  return (
    <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1>Sklep Steam</h1>
      {!user ? (
        <button onClick={login} style={{ padding: '15px 30px', cursor: 'pointer', background: '#5865F2', border: 'none', color: '#fff', borderRadius: '5px' }}>
          Zaloguj przez Discord
        </button>
      ) : (
        <div>
          <h2>Witaj, {user.user_metadata.full_name || 'Użytkowniku'}</h2>
          <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px' }}>
                <p>Produkt: {p.login}</p>
                <button>Kup teraz</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

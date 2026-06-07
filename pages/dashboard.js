import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Dashboard() {
  const [purchasedAccounts, setPurchasedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }

      // Pobieramy konta przypisane do tego konkretnego discord_id
      const { data, error } = await supabase
        .from('user_access') // Zmień na nazwę tabeli, gdzie trzymasz dostęp do kont
        .select('*')
        .eq('discord_id', user.id);

      if (error) console.error("Błąd:", error);
      setPurchasedAccounts(data || []);
      setLoading(false);
    };
    fetchPurchases();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>TWOJE <span style={{color: '#5865F2'}}>KONTA</span></h1>
        <button onClick={() => window.location.href='/'} style={styles.backBtn}>Wróć do sklepu</button>
      </header>

      <main style={styles.main}>
        {loading ? <p>Ładowanie...</p> : (
          <div style={styles.grid}>
            {purchasedAccounts.length > 0 ? purchasedAccounts.map((acc) => (
              <div key={acc.id} style={styles.card}>
                <h3>{acc.game_name || "Konto Steam"}</h3>
                <p><strong>Login:</strong> {acc.login}</p>
                <p><strong>Hasło:</strong> {acc.password}</p>
                <p style={{fontSize: '12px', color: '#888'}}>ID Transakcji: {acc.id}</p>
              </div>
            )) : <p>Nie masz jeszcze żadnych zakupionych kont.</p>}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0b0e14', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '20px 0', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: '800' },
  backBtn: { background: '#333', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
  main: { maxWidth: '800px', margin: '20px auto' },
  grid: { display: 'grid', gap: '20px' },
  card: { background: '#151921', padding: '20px', borderRadius: '16px', border: '1px solid #333' }
};

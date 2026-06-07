import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Dashboard() {
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data } = await supabase
        .from('user_access')
        .select('*, steam_accounts(*)')
        .eq('discord_id', user.id);
      
      setAccess(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{padding: '40px', color: '#fff', fontFamily: 'system-ui', backgroundColor: '#0b0e14', minHeight: '100vh'}}>
      <h1 style={{marginBottom: '30px'}}>Twoje zakupione produkty</h1>
      
      {loading ? <p>Ładowanie...</p> : access.length === 0 ? (
        <p>Nie masz jeszcze żadnych aktywnych zakupów.</p>
      ) : (
        <div style={{display: 'grid', gap: '20px'}}>
          {access.map(item => (
            <div key={item.id} style={{background: '#151921', padding: '25px', borderRadius: '16px', border: '1px solid #333'}}>
              <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                {item.steam_accounts.image_url && (
                  <img src={item.steam_accounts.image_url} style={{width: '120px', borderRadius: '10px'}} />
                )}
                <div>
                  <h2 style={{margin: '0'}}>{item.steam_accounts.game_name || item.steam_accounts.login}</h2>
                  <p style={{color: '#aaa'}}>Dostęp przyznany: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div style={{background: '#0a0d13', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '1px solid #222'}}>
                <p><strong>Login:</strong> {item.steam_accounts.login}</p>
                <p><strong>Hasło:</strong> {item.steam_accounts.password}</p>
                <p><strong>Kod Guard:</strong> {item.steam_accounts.guard_code || 'Brak'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Panel() {
  const [access, setAccess] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Sprawdzamy tabelę user_access
      const { data } = await supabase
        .from('user_access')
        .select('*, steam_accounts(*)')
        .eq('discord_id', user.id);
      
      setAccess(data || []);
    }
    load();
  }, []);

  return (
    <div style={{color: '#fff', padding: '40px'}}>
      <h1>Moje Konta</h1>
      {access.length === 0 ? <p>Nie masz jeszcze żadnych zakupów.</p> : (
        access.map(item => (
          <div key={item.id} style={{background: '#151921', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
            <h2>Gratulacje! Zakupiono: {item.steam_accounts.login}</h2>
            <div style={{background: '#000', padding: '15px', marginTop: '10px'}}>
              <p>Login: {item.steam_accounts.login}</p>
              <p>Hasło: {item.steam_accounts.password}</p>
              <p>Guard: {item.steam_accounts.guard_code}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

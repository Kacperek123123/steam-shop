import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inicjalizacja Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    // Sprawdź zalogowanego użytkownika
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })

    // Pobierz konta
    supabase.from('steam_accounts').select('*').eq('status', 'available')
      .then(({ data }) => {
        if (data) setProducts(data)
      })
  }, [])

  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'discord' })
  }

  if (!user) return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#111', minHeight: '100vh', color: '#fff' }}>
      <h1>Witaj w sklepie</h1>
      <button onClick={login} style={{ padding: '15px', cursor: 'pointer' }}>
        Zaloguj przez Discord
      </button>
    </div>
  )

  return (
    <div style={{ padding: '50px', background: '#111', minHeight: '100vh', color: '#fff' }}>
      <h1>Witaj, {user.user_metadata.full_name || 'Graczu'}</h1>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ border: '1px solid #333', padding: '15px' }}>
            <p>Produkt: {p.login}</p>
            <button>Kup teraz</button>
          </div>
        ))}
      </div>
    </div>
  )
}
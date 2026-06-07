import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Tutaj sprawdzamy w bazie, czy użytkownik ma status 'paid' dla danego produktu
    // Jeśli tak -> pokazujemy p.login, p.password, p.guard_code
  }, []);

  return (
    <div>
      <h1>Twój Panel</h1>
      {!order ? <p>Brak opłaconych zamówień.</p> : (
        <div>
           {/* Tutaj wyświetlisz dane produktu po potwierdzeniu płatności */}
        </div>
      )}
    </div>
  );
}

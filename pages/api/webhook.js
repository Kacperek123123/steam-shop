import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Sprawdzamy czy to POST (bo tak wysyłają bramki płatności)
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 2. Tworzymy klienta z kluczem SERVICE (ma dostęp do edycji bazy)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
  );

  // 3. Odbieramy dane z płatności (zależnie od tego co wyśle bramka)
  const { discord_id, product_id, status } = req.body;

  // 4. Jeśli płatność się powiodła, dodajemy dostęp
  if (status === 'paid') {
    const { error } = await supabase.from('user_access').insert([{
      discord_id: discord_id,
      product_id: product_id
    }]);

    if (error) return res.status(500).json({ error: error.message });
    
    return res.status(200).json({ message: 'Dostęp przyznany' });
  }

  res.status(400).json({ error: 'Płatność nie została opłacona' });
}

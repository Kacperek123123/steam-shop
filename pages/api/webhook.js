import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { discord_id, product_id, status } = req.body;

  if (status === 'paid') {
    // Automatyczne dodanie dostępu do bazy
    const { error } = await supabase.from('user_access').insert([{
      discord_id: discord_id,
      product_id: product_id
    }]);

    if (!error) return res.status(200).send('Dostęp przyznany');
  }
  
  res.status(400).send('Błąd płatności');
}

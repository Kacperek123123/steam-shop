import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Twój adres portfela LTC
  const MY_LTC_ADDRESS = 'LM3eUhktfk69fRLXncjrRA4qEyULJmbbPc';
  
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    // 1. Pobierz transakcje z Twojego portfela przez Blockchair API
    const response = await fetch(`https://api.blockchair.com/litecoin/dashboards/address/${MY_LTC_ADDRESS}`);
    const data = await response.json();
    
    // 2. Wyciągnij najnowszą transakcję (przykładowo)
    const transactions = data.data[MY_LTC_ADDRESS].transactions;
    const latestTx = transactions[0]; 

    // 3. Sprawdź czy transakcja jest nowa i czy kwota się zgadza
    // Tu musisz dodać logikę porównującą z tabelą 'orders'
    
    res.status(200).json({ status: 'checked', lastTransaction: latestTx.hash });
  } catch (error) {
    res.status(500).json({ error: 'Błąd sprawdzania portfela' });
  }
}

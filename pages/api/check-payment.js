// Kod, który sprawdza blockchain (zamiast zewnętrznej bramki)
export default async function handler(req, res) {
  const { order_id, address } = req.body;
  
  // Używamy darmowego API Blockchair (brak KYC!)
  const response = await fetch(`https://blockchair.com/litecoin/address/LM3eUhktfk69fRLXncjrRA4qEyULJmbbPc`);
  const data = await response.json();
  
  // Sprawdzamy czy transakcja z odpowiednią kwotą/id istnieje
  // Jeśli tak -> wywołujemy kod przyznający dostęp do bazy (jak w poprzednim pliku)
}

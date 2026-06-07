export default function Test() {
  const sendTest = async () => {
    await fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        discord_id: '123456789', 
        product_id: 1, 
        status: 'paid' 
      })
    });
    alert('Wysłano test!');
  };
  return <button onClick={sendTest}>Wyślij Testowy Webhook</button>;
}

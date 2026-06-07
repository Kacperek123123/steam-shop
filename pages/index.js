import { useState } from 'react';

export default function Home() {
  // Lista produktów - możesz to potem pobierać z bazy, 
  // ale na razie wpiszmy je tutaj ręcznie, żeby działało:
  const products = [
    { id: 1, name: "Konto Steam CS2", price: "50 PLN" },
    { id: 2, name: "Konto Steam RUST", price: "70 PLN" }
  ];

  return (
    <div style={{ backgroundColor: '#0b0e14', color: '#fff', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>ARCYN MARKET</h1>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ padding: '20px', border: '1px solid #333', borderRadius: '10px' }}>
            <h3>{p.name}</h3>
            <p>Cena: {p.price}</p>
            <a href="https://discord.gg/TWÓJ_LINK_ZAPROSZENIA" target="_blank" 
               style={{ background: '#5865F2', padding: '10px 20px', textDecoration: 'none', color: '#fff', borderRadius: '5px' }}>
               KUP NA DISCORDZIE
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

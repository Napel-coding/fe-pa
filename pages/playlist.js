'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StokJajanPage() {
  const router = useRouter();

  const [snacks, setSnacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/showbarang', {
          method: 'GET',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const formattedData = (Array.isArray(data) ? data : data.data).map((item) => ({
          id: item.id,
          name: item.nama,
          description: item.deskripsi,
          image: item.foto,
          stock: item.stok,
          price: item.harga,
        }));

        setSnacks(formattedData);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
        setError('Gagal mengambil data dari server.');
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, []);

  const filteredSnacks = snacks.filter((snack) => {
    const query = searchQuery.toLowerCase();
    return snack.name?.toLowerCase().includes(query);
  });

  const handleGoToDetail = (id) => {
    router.push(`/detail?id=${id}`);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🛒 Stok Jajanan</h1>

      <Link href="/transaksi">
        <button
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '16px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          📄 Lihat Transaksi
        </button>
      </Link>

      <input
        type="text"
        placeholder="Cari nama jajan..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '30px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />

      {loading && <p style={{ textAlign: 'center' }}>Memuat data...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      {!loading && filteredSnacks.length === 0 && <p style={{ textAlign: 'center' }}>Tidak ada jajan ditemukan.</p>}

      {filteredSnacks.map((snack) => (
        <div
          key={snack.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: '#fdfdfd',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ marginRight: '20px' }}>
            <img
              src={snack.image ? `http://localhost:8000/${snack.image}` : 'https://via.placeholder.com/80'}
              alt={snack.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{snack.name}</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>{snack.description}</p>
            <p style={{ fontWeight: 'bold', color: '#0070f3' }}>Stok: {snack.stock}</p>
            <button
              onClick={() => handleGoToDetail(snack.id)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Lihat Detail
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TransaksiPage() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/transaksi');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setTransaksi(Array.isArray(data) ? data : data.data);
      } catch (err) {
        console.error('Gagal mengambil data transaksi:', err);
        setError('Gagal mengambil data dari server.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaksi();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📄 Daftar Transaksi</h1>

      <button
        onClick={() => router.push('/playlist')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        🔙 Kembali ke Stok Jajanan
      </button>

      {loading && <p style={{ textAlign: 'center' }}>Memuat data transaksi...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      {!loading && transaksi.length === 0 && <p style={{ textAlign: 'center' }}>Belum ada transaksi.</p>}

      {transaksi.map((trx, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '15px',
          }}
        >
          <p><strong>Nama:</strong> {trx.nama}</p>
          <p><strong>Barang:</strong> {trx.nama_barang}</p>
          <p><strong>Jumlah:</strong> {trx.jumlah}</p>
          <p><strong>Total Harga:</strong> Rp {Number(trx.total_harga || 0).toLocaleString()}</p>
          <p><strong>Tanggal:</strong> {trx.tanggal}</p>
        </div>
      ))}
    </div>
  );
}

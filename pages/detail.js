'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BarangDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [barang, setBarang] = useState(null);
  const [editable, setEditable] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/showbarang/${id}`)
        .then((res) => {
          setBarang(res.data);
          setEditedData({
            name: res.data.nama,
            description: res.data.deskripsi,
            price: res.data.harga,
            stock: res.data.stok,
            image: res.data.foto,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const payload = {
      nama: editedData.name,
      deskripsi: editedData.description,
      harga: editedData.price,
      stok: editedData.stock,
    };

    axios
      .put(`http://localhost:8000/api/editbarang/${id}`, payload)
      .then((res) => {
        alert('Perubahan berhasil disimpan!');
        setBarang(res.data);
        setEditable(false);
      })
      .catch((err) => {
        console.error(err);
        alert('Gagal menyimpan perubahan.');
      });
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 100 }}>Memuat data barang...</p>;
  }

  if (!barang) {
    return (
      <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center', fontFamily: 'Arial' }}>
        <h2>Barang tidak ditemukan</h2>
        <p>Maaf, barang dengan ID tersebut tidak tersedia.</p>
        <button
          onClick={() => router.push('/playlist')}
          style={{
            padding: '10px 20px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Kembali ke Daftar Barang
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '80px auto', fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 30, textAlign: 'center' }}>{barang.nama}</h1>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 30 }}>
        <img
          src={`http://localhost:8000/${barang.foto}`}
          alt={barang.nama}
          style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 10 }}
        />
        <div style={{ flex: 1 }}>
          <label>
            <strong>Deskripsi:</strong><br />
            {editable ? (
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleChange}
                rows={4}
                style={{ width: '100%', marginTop: 5 }}
              />
            ) : (
              <p>{barang.deskripsi}</p>
            )}
          </label>

          <label>
            <strong>Harga:</strong><br />
            {editable ? (
              <input
                type="number"
                name="price"
                value={editedData.price}
                onChange={handleChange}
                style={{ width: '100%', marginTop: 5 }}
              />
            ) : (
              <p>Rp {(barang.harga || 0).toLocaleString()}</p>
            )}
          </label>

          <label>
            <strong>Stok:</strong><br />
            {editable ? (
              <input
                type="number"
                name="stock"
                value={editedData.stock}
                onChange={handleChange}
                style={{ width: '100%', marginTop: 5 }}
              />
            ) : (
              <p>{barang.stok} pcs</p>
            )}
          </label>
        </div>
      </div>

      {editable ? (
        <button
          onClick={handleSave}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontSize: 16,
            marginRight: 10,
            cursor: 'pointer',
          }}
        >
          Simpan Perubahan
        </button>
      ) : (
        <button
          onClick={() => setEditable(true)}
          style={{
            background: '#ffc107',
            color: '#000',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontSize: 16,
            marginRight: 10,
            cursor: 'pointer',
          }}
        >
          Edit Barang
        </button>
      )}

      <button
        onClick={() => router.push('/playlist')}
        style={{
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '10px 20px',
          fontSize: 16,
          marginLeft: 10,
          cursor: 'pointer',
        }}
      >
        Kembali ke Daftar Barang
      </button>
    </div>
  );
}

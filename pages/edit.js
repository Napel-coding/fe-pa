import React, { useEffect, useState } from 'react';

const EditTransaksi = ({ transaksiId }) => {
  const [formData, setFormData] = useState({
    id_barang: '',
    jumlah_barang: '',
    harga_total: '',
    status: '',
    tgl_transaksi: '',
    barang_nama: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Ambil data transaksi by ID
    fetch(`http://localhost:8000/api/showtransaksi/${transaksiId}`)
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data transaksi');
        return res.json();
      })
      .then(data => {
        if (data.status && data.data) {
          const trx = data.data;
          setFormData({
            id_barang: trx.id_barang || '',
            jumlah_barang: trx.jumlah_barang || '',
            harga_total: trx.harga_total || '',
            status: trx.status || '',
            tgl_transaksi: trx.tgl_transaksi || '',
            barang_nama: trx.barang?.nama || '',
          });
        } else {
          setError('Data transaksi tidak ditemukan.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [transaksiId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validasi sederhana
    if (!formData.id_barang || !formData.jumlah_barang || !formData.harga_total || !formData.status || !formData.tgl_transaksi) {
      setError('Semua field wajib diisi.');
      return;
    }

    fetch(`http://localhost:8000/api/edittransaksi/${transaksiId}`, {
      method: 'PUT', // atau 'POST' tergantung API kamu
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_barang: formData.id_barang,
        jumlah_barang: formData.jumlah_barang,
        harga_total: formData.harga_total,
        status: formData.status,
        tgl_transaksi: formData.tgl_transaksi,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal menyimpan data transaksi');
        return res.json();
      })
      .then(data => {
        if (data.status) {
          setSuccessMsg('Transaksi berhasil diperbarui.');
          // Optionally redirect or refresh
        } else {
          setError(data.message || 'Terjadi kesalahan saat memperbarui transaksi.');
        }
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <p className="text-center mt-10">Memuat data transaksi...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-3">Edit Transaksi ID: {transaksiId}</h1>

      {successMsg && <p className="mb-4 text-green-600 font-semibold">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="id_barang" className="block mb-1 font-semibold text-gray-700">ID Barang</label>
          <input
            type="text"
            id="id_barang"
            name="id_barang"
            value={formData.id_barang}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="jumlah_barang" className="block mb-1 font-semibold text-gray-700">Jumlah Barang</label>
          <input
            type="number"
            id="jumlah_barang"
            name="jumlah_barang"
            value={formData.jumlah_barang}
            onChange={handleChange}
            min={1}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="harga_total" className="block mb-1 font-semibold text-gray-700">Total Harga</label>
          <input
            type="number"
            id="harga_total"
            name="harga_total"
            value={formData.harga_total}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block mb-1 font-semibold text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Status --</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="tgl_transaksi" className="block mb-1 font-semibold text-gray-700">Tanggal Transaksi</label>
          <input
            type="date"
            id="tgl_transaksi"
            name="tgl_transaksi"
            value={formData.tgl_transaksi}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nama Barang</label>
          <input
            type="text"
            value={formData.barang_nama}
            disabled
            className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransaksi;

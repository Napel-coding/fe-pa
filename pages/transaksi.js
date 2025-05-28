import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const TransaksiList = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    jumlah_barang: '',
    harga_total: '',
    status: '',
    tgl_transaksi: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const statusMapToBackend = {
    pending: 'belum bayar',
    completed: 'lunas',
    canceled: 'belum bayar',
  };

  const statusMapToFrontend = {
    'belum bayar': 'pending',
    lunas: 'completed',
  };

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/showtransaksi');
        if (response.data.status && Array.isArray(response.data.data)) {
          const mappedTransaksi = response.data.data.map(trx => ({
            ...trx,
            status: statusMapToFrontend[trx.status] || trx.status,
          }));
          setTransaksi(mappedTransaksi);
        } else {
          setTransaksi([]);
        }
      } catch (error) {
        console.error('Gagal memuat data transaksi:', error);
        setTransaksi([]);
      }
    };

    fetchTransaksi();
  }, []);

  const goToDetail = (id) => {
    router.push(`/transaksi/detail/${id}`);
  };

  const openEditModal = (trx) => {
    setSelectedTransaksi(trx);
    const dateOnly = trx.tgl_transaksi.split(' ')[0];
    setFormData({
      jumlah_barang: String(trx.jumlah_barang),
      harga_total: String(trx.harga_total),
      status: statusMapToFrontend[trx.status] || trx.status,
      tgl_transaksi: dateOnly,
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaksi(null);
    setFormData({
      jumlah_barang: '',
      harga_total: '',
      status: '',
      tgl_transaksi: '',
    });
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const formattedDate = `${formData.tgl_transaksi} 00:00:00`;
      const updatedFormData = {
        id_barang: selectedTransaksi.id_barang, // Use the original id_barang
        jumlah_barang: parseInt(formData.jumlah_barang, 10),
        harga_total: parseFloat(formData.harga_total),
        status: statusMapToBackend[formData.status] || formData.status,
        tgl_transaksi: formattedDate,
      };

      console.log('Sending data to backend:', updatedFormData);

      const response = await axios.put(
        `http://localhost:8000/api/edittransaksi/${selectedTransaksi.id}`,
        updatedFormData
      );

      if (response.data.status) {
        const updatedTransaksi = {
          ...response.data.data,
          status: statusMapToFrontend[response.data.data.status] || response.data.data.status,
        };
        setTransaksi((prev) =>
          prev.map((trx) =>
            trx.id === selectedTransaksi.id ? updatedTransaksi : trx
          )
        );
        closeModal();
      } else {
        setErrorMessage(response.data.message || 'Gagal mengupdate transaksi');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data;
          setErrorMessage(Object.values(errors).flat().join(', '));
        } else if (error.response.status === 400) {
          setErrorMessage(error.response.data.message || 'Stok tidak mencukupi');
        } else if (error.response.status === 404) {
          setErrorMessage(error.response.data.message || 'Transaksi atau barang tidak ditemukan');
        } else {
          setErrorMessage('Terjadi kesalahan pada server');
        }
      } else {
        setErrorMessage('Gagal terhubung ke server');
      }
      console.error('Gagal mengupdate transaksi:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-3">Daftar Transaksi</h1>

      {transaksi.length === 0 ? (
        <div className="text-center py-20 border-4 border-dashed border-gray-300 rounded-xl text-gray-400">
          <p className="text-xl font-semibold mb-2">Belum ada transaksi</p>
          <p>Data transaksi tidak ditemukan atau kosong.</p>
        </div>
      ) : (
        transaksi.map((trx) => (
          <div
            key={trx.id}
            className="mb-6 p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div>
                  <p><span className="font-semibold text-gray-700">ID Transaksi:</span> {trx.id}</p>
                  <p><span className="font-semibold text-gray-700">ID Barang:</span> {trx.id_barang}</p>
                  <p><span className="font-semibold text-gray-700">Jumlah:</span> {trx.jumlah_barang}</p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold text-gray-700">Total Harga:</span> Rp{' '}
                    {Number(trx.harga_total).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Status:</span>{' '}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        trx.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : trx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                    </span>
                  </p>
                  <p><span className="font-semibold text-gray-700">Tanggal:</span> {trx.tgl_transaksi}</p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex gap-4">
                <button
                  onClick={() => goToDetail(trx.id)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  aria-label={`Lihat detail transaksi ${trx.id}`}
                >
                  Detail
                </button>
                <button
                  onClick={() => openEditModal(trx)}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  aria-label={`Edit transaksi ${trx.id}`}
                >
                  Edit
                </button>
              </div>
            </div>

            <p className="mt-4 text-gray-600">
              <span className="font-semibold">Barang:</span>{' '}
              {trx.barang ? (
                `${trx.barang.nama} (ID: ${trx.id_barang})`
              ) : (
                <span className="text-red-600">Barang tidak ditemukan (ID: {trx.id_barang})</span>
              )}
            </p>
          </div>
        ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Transaksi #{selectedTransaksi?.id}</h2>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Jumlah Barang</label>
                <input
                  type="number"
                  name="jumlah_barang"
                  value={formData.jumlah_barang}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Total Harga</label>
                <input
                  type="number"
                  name="harga_total"
                  value={formData.harga_total}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Tanggal Transaksi</label>
                <input
                  type="date"
                  name="tgl_transaksi"
                  value={formData.tgl_transaksi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransaksiList;
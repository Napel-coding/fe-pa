'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DisplayPage() {
  const router = useRouter();
  const { id } = router.query;

  const songData = {
    1: [
      {
        title: 'Secukupnya',
        artist: 'Hindia',
        description: 'Lagu mellow yang menyentuh hati dengan lirik puitis.',
        videoUrl: 'https://www.youtube.com/embed/wnAKxtEi78c',
      },
      {
        title: 'Evaluasi',
        artist: 'Hindia',
        description: 'Lagu reflektif tentang perjalanan hidup dan emosi.',
        videoUrl: 'https://www.youtube.com/embed/cWrSjCZ5AeE',
      },
    ],
    2: [
      {
        title: 'Welcome to the Black Parade',
        artist: 'My Chemical Romance',
        description: 'Anthem emosional penuh semangat dan nostalgia.',
        videoUrl: 'https://www.youtube.com/embed/RRKJiM9Njr8',
      },
      {
        title: 'I’m Not Okay (I Promise)',
        artist: 'My Chemical Romance',
        description: 'Lagu ikonik dengan gaya emosional yang kuat.',
        videoUrl: 'https://www.youtube.com/embed/lIqBXPtolcw',
      },
    ],
    3: [
      {
        title: 'Sorai',
        artist: 'Nadin Amizah',
        description: 'Balada yang menggugah tentang kehilangan dan perpisahan.',
        videoUrl: 'https://www.youtube.com/embed/PF_VokiUndk',
      },
      {
        title: 'Bertaut',
        artist: 'Nadin Amizah',
        description: 'Lagu penuh cinta antara anak dan ibunya.',
        videoUrl: 'https://www.youtube.com/embed/HyhLsy6b0XI',
      },
    ],
  };

  const [songs, setSongs] = useState([]);
  // comments structure: { songIndex: [ {user, text} ] }
  const [comments, setComments] = useState({});
  // newComment: { songIndex: { user: '', text: '' } }
  const [newComment, setNewComment] = useState({});
  // state for new song inputs
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    description: '',
    videoUrl: '',
  });
  // optional error message
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id && songData[id]) {
      setSongs(songData[id]);
    } else {
      setSongs([]);
    }
  }, [id]);

  const handleInputChange = (songIndex, field, value) => {
    setNewComment(prev => ({
      ...prev,
      [songIndex]: {
        ...prev[songIndex],
        [field]: value,
      }
    }));
  };

  const handleAddComment = (songIndex) => {
    const commentObj = newComment[songIndex];
    if (!commentObj || !commentObj.user?.trim() || !commentObj.text?.trim()) return;

    const updatedComments = { ...comments };
    if (!updatedComments[songIndex]) updatedComments[songIndex] = [];
    updatedComments[songIndex].push({ user: commentObj.user.trim(), text: commentObj.text.trim() });

    setComments(updatedComments);
    setNewComment({ ...newComment, [songIndex]: { user: '', text: '' } });
  };

  const handleDeleteComment = (songIndex, commentIndex) => {
    const updatedComments = { ...comments };
    if (!updatedComments[songIndex]) return;

    updatedComments[songIndex] = updatedComments[songIndex].filter((_, i) => i !== commentIndex);
    setComments(updatedComments);
  };

  // Handle input change for new song form
  const handleNewSongChange = (field, value) => {
    setNewSong(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate YouTube embed URL (simple)
  const isValidYouTubeEmbedUrl = (url) => {
    // Accept URLs starting with https://www.youtube.com/embed/
    return /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/.test(url);
  };

  const handleAddNewSong = () => {
    const { title, artist, description, videoUrl } = newSong;

    if (!title.trim() || !artist.trim() || !description.trim() || !videoUrl.trim()) {
      setErrorMsg('Semua kolom harus diisi!');
      return;
    }
    if (!isValidYouTubeEmbedUrl(videoUrl.trim())) {
      setErrorMsg('URL video harus berupa embed YouTube, contoh: https://www.youtube.com/embed/a4Xw2Kr79w');
      return;
    }

    setSongs(prev => [...prev, {
      title: title.trim(),
      artist: artist.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
    }]);

    // Clear form and error message
    setNewSong({ title: '', artist: '', description: '', videoUrl: '' });
    setErrorMsg('');
  };

  if (songs.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
        <h2>🎵 Lagu tidak ditemukan</h2>
        <button
          onClick={() => router.push('/playlist')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🔙 Kembali ke Playlist
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🎬 Video Lagu</h1>

      {/* Form Tambah Lagu Baru */}
      <div style={{ marginBottom: '50px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h2>➕ Tambah Lagu Baru</h2>

        <input
          type="text"
          placeholder="Judul Lagu"
          value={newSong.title}
          onChange={(e) => handleNewSongChange('title', e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <input
          type="text"
          placeholder="Nama Artis"
          value={newSong.artist}
          onChange={(e) => handleNewSongChange('artist', e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <textarea
          placeholder="Deskripsi Lagu"
          value={newSong.description}
          onChange={(e) => handleNewSongChange('description', e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
        />

        <input
          type="text"
          placeholder="URL Video YouTube (embed link, contoh: https://www.youtube.com/embed/VIDEO_ID)"
          value={newSong.videoUrl}
          onChange={(e) => handleNewSongChange('videoUrl', e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        {errorMsg && (
          <p style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</p>
        )}

        <button
          onClick={handleAddNewSong}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Tambah Lagu
        </button>
      </div>

      {songs.map((song, index) => (
        <div key={index} style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{song.title}</h2>
          <h4 style={{ color: '#555' }}>{song.artist}</h4>
          <p style={{ color: '#666', fontSize: '15px' }}>{song.description}</p>

          <div style={{ marginTop: '20px' }}>
            <iframe
              width="100%"
              height="400"
              src={song.videoUrl}
              title={song.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '10px' }}
            ></iframe>
          </div>

          {/* Komentar Section */}
          <div style={{ marginTop: '20px' }}>
            <h4>Komentar</h4>

            <input
              type="text"
              placeholder="Nama kamu"
              value={newComment[index]?.user || ''}
              onChange={(e) => handleInputChange(index, 'user', e.target.value)}
              style={{
                padding: '8px',
                width: '30%',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginRight: '10px',
                marginBottom: '10px',
              }}
            />

            <input
              type="text"
              placeholder="Tulis komentar kamu..."
              value={newComment[index]?.text || ''}
              onChange={(e) => handleInputChange(index, 'text', e.target.value)}
              style={{
                padding: '8px',
                width: '60%',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginRight: '10px',
                marginBottom: '10px',
              }}
            />

            <button
              onClick={() => handleAddComment(index)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Kirim
            </button>

            <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
              {(comments[index] || []).map((cmt, cmtIdx) => (
                <li
                  key={cmtIdx}
                  style={{
                    background: '#f1f1f1',
                    marginBottom: '6px',
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span><b>{cmt.user}:</b> {cmt.text}</span>
                  <button
                    onClick={() => handleDeleteComment(index, cmtIdx)}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                    aria-label="Hapus komentar"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => router.push('/playlist')}
          style={{
            marginTop: '40px',
            padding: '10px 25px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🔙 Kembali ke Playlist
        </button>
      </div>
    </div>
  );
}

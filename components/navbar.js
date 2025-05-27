// components/navbar.js
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top border-0 shadow-sm">
        <div className="container">
          <Link className="navbar-brand" href="/">Next & Laravel CRUD</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link className="nav-link" href="/siswa">SISWA</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/Crud">CRUD</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/buku">BUKU</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/crudbuku">CRUDBUKU</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/peminjaman">Peminjaman</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/pengembalian">Pengembalian</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="Login">Logout</Link>
              </li>
            </ul>
            <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav> 
      <div style={{ marginTop: '70px' }}></div>
    </header>
  );
}

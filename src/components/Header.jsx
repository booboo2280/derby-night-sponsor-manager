// src/components/Header.jsx

function Header({ title }) {
  return (
    <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #ddd" }}>
      <h1>{title}</h1>
    </header>
  );
}

export default Header;

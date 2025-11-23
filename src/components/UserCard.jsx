// src/components/UserCard.jsx

function UserCard({ name, role, isOnline, Fatality }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "0.75rem",
      }}
    >
      <h2 style={{ margin: 0 }}>{name}</h2>
      <p style={{ margin: "0.25rem 0" }}>{role}</p>
      <p style={{ margin: 0 }}>
        Status:{" "}
        <strong style={{ color: isOnline ? "green" : "gray" }}>
          {isOnline ? "Online" : "Offline"}
        </strong>
      </p>
      <p style={{ margin: "0.25rem 0" }}>{Fatality}</p>
    </div>
  );
}

export default UserCard;

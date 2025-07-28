export default function WasteTable({ setIsLoggedIn }) {
  return (
    <div>
      {/* Your table and content here */}
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
    </div>
  );
}

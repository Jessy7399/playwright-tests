export default function WasteTable({ setIsLoggedIn }) {
  // Example logout button
  return (
    <div>
      {/* Your table and content here */}
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
    </div>
  );
}

import React, { useState } from 'react';
import './WasteTable.css';

const initialData = [
  { id: 1, location: 'Berlin', weight: 12, type: 'Plastic', collected: 'Yes' },
  { id: 2, location: 'Munich', weight: 25, type: 'Organic', collected: 'No' },
  { id: 3, location: 'Hamburg', weight: 18, type: 'Metal', collected: 'Yes' },
  { id: 4, location: 'Cologne', weight: 10, type: 'Paper', collected: 'No' },
  { id: 5, location: 'Frankfurt', weight: 20, type: 'Glass', collected: 'Yes' },
  { id: 6, location: 'Stuttgart', weight: 30, type: 'Plastic', collected: 'Yes' },
  { id: 7, location: 'Leipzig', weight: 8, type: 'Organic', collected: 'No' },
  { id: 8, location: 'Dresden', weight: 14, type: 'Metal', collected: 'Yes' },
  { id: 9, location: 'Bonn', weight: 16, type: 'Paper', collected: 'No' },
  { id: 10, location: 'Nuremberg', weight: 22, type: 'Glass', collected: 'Yes' },
];

export default function WasteTable({ setIsLoggedIn }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newEntry, setNewEntry] = useState({
    location: '',
    weight: '',
    type: '',
    collected: 'Yes',
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry?');
    if (confirmed) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    const { location, weight, type, collected } = editForm;

    if (!location.trim() || !weight || !type.trim() || !collected) {
      alert('Please fill in all fields.');
      return;
    }

    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Please enter a valid positive number for weight.');
      return;
    }

    setData(data.map(item => item.id === editingId ? { ...editForm, weight: weightNum } : item));
    setEditingId(null);
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    const { location, weight, type, collected } = newEntry;

    if (!location.trim() || !weight || !type.trim() || !collected) {
      alert('Please fill in all fields for the new entry.');
      return;
    }

    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Please enter a valid positive number for weight.');
      return;
    }

    const newItem = {
      id: data.length ? Math.max(...data.map(item => item.id)) + 1 : 1,
      location: location.trim(),
      weight: weightNum,
      type: type.trim(),
      collected,
    };

    setData([...data, newItem]);
    setNewEntry({ location: '', weight: '', type: '', collected: 'Yes' });
  };

  const filteredData = data.filter(item =>
    item.location.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.collected.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="waste-container">
      <div className="top-bar">
        <h2>Waste Collection Management</h2>
        <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Logout</button>
      </div>

      <div className="header-search">
        <input
          type="text"
          placeholder="Search by location, type or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="new-entry-form">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEntry.location}
          onChange={handleNewEntryChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={newEntry.weight}
          onChange={handleNewEntryChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newEntry.type}
          onChange={handleNewEntryChange}
        />
        <select
          name="collected"
          value={newEntry.collected}
          onChange={handleNewEntryChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <button onClick={handleAddNew}>Add New</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Weight (kg)</th>
            <th>Type</th>
            <th>Collected</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
                No data found
              </td>
            </tr>
          ) : (
            filteredData.map((item) =>
              editingId === item.id ? (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="weight"
                      value={editForm.weight}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <select
                      name="collected"
                      value={editForm.collected}
                      onChange={handleEditChange}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleEditSave}>Save</button>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.location}</td>
                  <td>{item.weight}</td>
                  <td>{item.type}</td>
                  <td>{item.collected}</td>
                  <td>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

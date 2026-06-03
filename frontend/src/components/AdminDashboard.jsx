import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{padding: '20px'}}>
      <h1>Admin Panel - Welcome {localStorage.getItem('name')}</h1>
      <button onClick={handleLogout}>Logout</button>
      
      <h2>All Users</h2>
      <table border="1" cellPadding="10" style={{marginTop: '20px'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>College</th>
            <th>Books Issued</th>
            <th>Dues</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.college}</td>
              <td>{u.booksIssued}</td>
              <td>₹{u.dues}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
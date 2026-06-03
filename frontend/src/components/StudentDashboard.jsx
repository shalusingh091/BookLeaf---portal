import { useState, useEffect } from 'react';

function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:5000/api/dashboard/student', {
      headers: { 'x-auth-token': token }
    })
    .then(res => res.json()) 
    .then(setData);
  }, []);

  if (!data) return <h2 style={{textAlign: 'center'}}>Loading...</h2>;

  return (
    <div style={{padding: '20px'}}>
      <h1>Welcome {data.name}</h1>
      <h3>{data.university} | CGPA: {data.cgpa}</h3>
      <p><b>Books Issued:</b> {data.booksIssued}</p>
      <p><b>Dues:</b> ₹{data.dues}</p>
    </div>
  );
}

export default StudentDashboard;
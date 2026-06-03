import React from 'react';

function Dashboard() {
  const role = localStorage.getItem('role') || 'guest';
  const email = localStorage.getItem('email') || 'user@test.com';

  const books = [
    { id: 1, title: 'React Complete Guide', author: 'Max', price: 299, category: 'Frontend' },
    { id: 2, title: 'Node.js from Zero', author: 'John', price: 399, category: 'Backend' },
    { id: 3, title: 'MongoDB Basics', author: 'Sarah', price: 199, category: 'Database' },
    { id: 4, title: 'JavaScript ES6+', author: 'Admin', price: 249, category: 'Programming' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>BookLeaf Portal - {role.toUpperCase()}</h2>
        <div>
          <span>Welcome: {email}</span>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', marginLeft: '20px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <hr />

      <h3>All Books</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
        {books.map(book => (
          <div key={book.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h4>{book.title}</h4>
            <p><b>Author:</b> {book.author}</p>
            <p><b>Category:</b> {book.category}</p>
            <p><b>Price:</b> ₹{book.price}</p>
            {role === 'admin' && (
              <button style={{ padding: '5px 10px', marginTop: '5px' }}>Delete Book</button>
            )}
            {role === 'author' && (
              <button style={{ padding: '5px 10px', marginTop: '5px' }}>Edit Book</button>
            )}
          </div>
        ))}
      </div>

      {role === 'author' && (
        <div style={{ marginTop: '30px' }}>
          <button style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
            + Add New Book
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
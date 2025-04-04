import { useState } from 'react'
import './App.css'

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const baseUrl = 'https://8015b5dbc0724d38882ac90397c27649.weavy.io';
    const apiKey = "wys_hMWpXdekxcn9Gc8Ioah3azOllzUZ7l3HN9yB";

    const getUsers = async () => {
        try {
            const response = await fetch(`${baseUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setUsers(data.data || []);
            setMessage('Users loaded!');
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();

        try {
            const userData = {
                username: username,
                email: email,
                name: name,
                directory: 'default'
            };

            const response = await fetch(`${baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            setUsers([...users, data]);
            setMessage('User created!');

            // Clear form
            clearForm();
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const clearForm = () => {
        setName('');
        setEmail('');
        setUsername('');
        setSelectedUser(null);
    };

  return (
      <>
          <div className="app">
              <h1>Weavy User Management</h1>

              <div className="api-setup">
                  <button onClick={getUsers}>Load Users</button>
              </div>
          </div>

          {message && <p className="message">{message}</p>}

          <div className="create-user">
              <h2>{selectedUser ? 'Update User' : 'Create User'}</h2>
              <form onSubmit={selectedUser ? updateUser : createUser}>
                  <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />
                  <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                  <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
                  <div>
                      <button type="submit">
                          {selectedUser ? 'Update User' : 'Create User'}
                      </button>
                      {selectedUser && (
                          <button type="button" onClick={clearForm}>Cancel</button>
                      )}
                  </div>
              </form>
          </div>
      </>
  )
}

export default App

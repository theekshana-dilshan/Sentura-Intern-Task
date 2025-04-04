import {useEffect, useState} from 'react'
import './App.css'

interface User {
    id: number | string;
    username: string;
    email: string;
    name?: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const baseUrl = 'https://8015b5dbc0724d38882ac90397c27649.weavy.io';
    const apiKey = "wys_hMWpXdekxcn9Gc8Ioah3azOllzUZ7l3HN9yB";

    /*useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/users`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`
                    }
                });
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setMessage('Error fetching users: ' + (error as Error).message);
            }
        };

        fetchUsers();
    }, []);*/

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
            console.log("Created user data:", data);

            setUsers([...users, data]);
            setMessage('User created!');
            clearForm();
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();

        if (!selectedUser) return;

        try {
            const userData = {
                username: username,
                email: email,
                name: name
            };

            const response = await fetch(`${baseUrl}/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            setUsers(users.map(user =>
                user.id === selectedUser.id ? data : user
            ));

            setMessage('User updated!');

            clearForm();
            setSelectedUser(null);
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const deleteUser = async (userId: number | string) => {
        try {
            await fetch(`${baseUrl}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            setUsers(users.filter(user => user.id !== userId));

            if (selectedUser && selectedUser.id === userId) {
                clearForm();
                setSelectedUser(null);
            }

            setMessage('User deleted!');
        } catch (error) {
            setMessage('Error: ' + (error as Error).message);
        }
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setUsername(user.username);
        setEmail(user.email);
        setName(user.name || '');
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

              <div className="user-list">
                  <h2>Users</h2>
                  {users.length === 0 ? (
                      <p>No users found</p>
                  ) : (
                      <ul>
                          {users.map(user => (
                              <li key={user.id}>
                                  <span>{user.name || user.username} ({user.email})</span>
                                  <div className="user-actions">
                                      <button onClick={() => selectUser(user)}>Edit</button>
                                      <button onClick={() => deleteUser(user.id)}>Delete</button>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  )}
              </div>
          </div>
      </>
  )
}

export default App

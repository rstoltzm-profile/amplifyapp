import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listTodos });
    setNotes(apiData.data.listTodos.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>Ticket Management App</h1>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2></h2>
              <p>Priority {note.priority}: {note.name} {note.description}  
              <button onClick={() => deleteNote(note)}>Delete</button>
              </p>
            </div>
          ))
        }
      </div>
      <input
        onChange={e => setFormData({ ...formData, 'priority': e.target.value})}
        placeholder="Ticket Priority"
        value={formData.priority}
      />
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Ticket Title"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Ticket description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
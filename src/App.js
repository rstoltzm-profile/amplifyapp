import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: ''}

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
<<<<<<< HEAD
      <h1>Ticket Management App</h1>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <p>Priority {note.priority}: {note.name} - {note.description} 
              {} - {note.owner} {note.status} 
              {} <button onClick={() => deleteNote(note)}>Delete</button>
              </p>
            </div>
          ))
        }
      </div>
      <input
        onChange={e => setFormData({ ...formData, 'priority': e.target.value})}
        placeholder="Priority"
        value={formData.priority}
      />
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Ticket#"
=======
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
>>>>>>> parent of b988482... adding boolean to schema
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
<<<<<<< HEAD
        placeholder="Description"
        value={formData.description}
      />
      <input
        onChange={e => setFormData({ ...formData, 'owner': e.target.value})}
        placeholder="Owner"
        value={formData.owner}
=======
        placeholder="Note description"
        value={formData.description}
      />
      <input
        onChange={e => setFormData({ ...formData, 'priority': e.target.value})}
        placeholder="Priority"
        value={formData.priority}
>>>>>>> parent of b988482... adding boolean to schema
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description} {note.priority}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
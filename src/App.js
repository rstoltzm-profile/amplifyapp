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
      <>
      <h1>My Notes App</h1>
        <table id="tickets">
          <thead>
            <tr>
              <th>name</th>
              <th>description</th>
              <th>priority</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
                  <tr>
                    <td>{note.name}</td>
                    <td>{note.description} </td>
                    <td>{note.priority}</td>
                    <td><button onClick={() => deleteNote(note)}>Delete note</button></td>
                  </tr>
              ))
            }
          </tbody>
        </table>
        <br></br>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <input
        onChange={e => setFormData({ ...formData, 'priority': e.target.value})}
        placeholder="Priority"
        value={formData.priority}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>

      </div>
      <AmplifySignOut />
      </>
    </div>
  );
}

export default withAuthenticator(App);
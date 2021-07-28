let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}/notes`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  for (const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
  return `
    <div class="column is-one-quarter">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">${note.title}</p>
        </header>
        <div class="card-content">
          <div class="content">${note.text}</div>
        </div>
        <footer class="card-footer">
            <a href="#" class="card-footer-item" onclick="editNote('${noteId}')">
                Edit 
            </a>
            <a href="#" class="card-footer-item" onclick="deleteNote('${noteId}')">
                Delete
            </a>
        </footer>
      </div>
    </div>
  `;
}


const deleteNote = (noteId) => {
    console.log(noteId)
    firebase.database().ref(`users/${googleUserId}/notes/${noteId}`).remove()
}



const editNote = (noteId) => {
    const editNoteModal = document.querySelector('#editNoteModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}/notes`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const noteDetails = data[noteId];
        document.querySelector('#editTitleInput').value = noteDetails.title;
        document.querySelector('#editTextInput').value = noteDetails.text;
        document.querySelector('#editNoteId').value = noteId;        
    });
    editNoteModal.classList.toggle('is-active');
}

const closeEditModal = () => {
    const editNoteModal = document.querySelector('#editNoteModal');
    editNoteModal.classList.toggle('is-active');
}

const saveEditedNote = () => {
    const noteTitle = document.querySelector('#editTitleInput').value
    const noteText = document.querySelector('#editTextInput').value
    const noteId = document.querySelector('#editNoteId').value

    const noteEdits = {
        title: noteTitle,
        text: noteText
    }

    firebase.database().ref(`users/${googleUserId}/notes/${noteId}`).update(noteEdits)

    const editNoteModal = document.querySelector('#editNoteModal');
    editNoteModal.classList.toggle('is-active');
}



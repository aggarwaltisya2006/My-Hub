document.addEventListener("DOMContentLoaded", renderNotes);

function getNotes() {
    const rawData = localStorage.getItem("myNotes");
    return rawData ? JSON.parse(rawData) : [];
}

function saveNotes(notesArray) {
    localStorage.setItem("myNotes", JSON.stringify(notesArray));
}

function addNote() {
    const textArea = document.getElementById("noteText");
    const text = textArea.value.trim();

    if (!text) {
        alert("Please write something before adding.");
        return;
    }

    const notes = getNotes();
    notes.push({ text: text });
    saveNotes(notes);
    textArea.value = "";
    renderNotes();
}

function deleteNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    renderNotes();
}

function renderNotes() {
    const notesList = document.getElementById("notesList");
    const notes = getNotes();

    notesList.innerHTML = "";

    if (notes.length === 0) {
        notesList.innerHTML = '<p class="empty-state">No notes yet. Start writing above!</p>';
        return;
    }

    notes.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note-item";
        noteDiv.style.cssText = `
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.1);
            border-left: 3px solid rgba(161,140,209,0.6);
            border-radius: 16px;
            padding: 20px 22px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            word-break: break-word;
            animation: fadeInUp 0.4s ease-out;
        `;

        noteDiv.innerHTML = `
            <p style="margin:0 0 10px 0; font-size:15px; font-weight:400; color:rgba(255,255,255,0.9); line-height:1.6;">${note.text}</p>
            <div style="display:flex; justify-content:flex-end; align-items:center;">
                <button onclick="deleteNote(${index})" style="
                    background: rgba(255,71,87,0.15);
                    color: rgba(255,100,112,0.9);
                    border: 1px solid rgba(255,71,87,0.25);
                    border-radius: 8px;
                    padding: 5px 14px;
                    font-size: 12px;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    letter-spacing: 0.5px;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='rgba(255,71,87,0.35)'; this.style.borderColor='rgba(255,71,87,0.5)';"
                   onmouseout="this.style.background='rgba(255,71,87,0.15)'; this.style.borderColor='rgba(255,71,87,0.25)';">
                    <i class="fa-solid fa-trash" style="margin-right:4px;"></i>Delete
                </button>
            </div>
        `;

        notesList.appendChild(noteDiv);
    });
}

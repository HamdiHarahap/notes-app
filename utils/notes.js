const fs = require('fs')

const dirPath = './data'
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath)
}

const dataPath = './data/notes.json'
if (!fs.existsSync(dataPath)) {
	fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadNotes = () => {
	const fileBuffer = fs.readFileSync('data/notes.json', 'utf-8')
	const notes = JSON.parse(fileBuffer)
	return notes
}

const findNote = (id) => {
	const notes = loadNotes()
	const note = notes.find((note) => note.id == id)
	return note
}

const findNoteByCategory = (category) => {
	const notes = loadNotes()
	const note = notes.filter((note) => note.category == category)
	return note
}

const saveNotes = (notes) => {
	fs.writeFileSync('data/notes.json', JSON.stringify(notes), 'utf-8')
}

const addNote = (note) => {
	const notes = loadNotes()

	const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id || 0)) : 0
	const newNote = {
		id: maxId + 1,
		...note,
		date: new Date().toISOString().slice(0, 10),
	}

	notes.push(newNote)
	saveNotes(notes)
}

const deleteNote = (id) => {
	const notes = loadNotes()
	const filteredNotes = notes.filter((note) => note.id != id)
	saveNotes(filteredNotes)
}

const updateNote = (newNote) => {
	const notes = loadNotes()
	const index = notes.findIndex((note) => note.id == newNote.id)

	if (index !== -1) {
		notes[index] = {
			...notes[index],
			...newNote,
			date: new Date().toISOString().slice(0, 10),
		}

		saveNotes(notes)
		return true
	}
}

module.exports = {
	loadNotes,
	addNote,
	findNote,
	deleteNote,
	findNoteByCategory,
	updateNote,
}

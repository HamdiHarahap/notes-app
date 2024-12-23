const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {
	loadNotes,
	addNote,
	findNote,
	deleteNote,
	findNoteByCategory,
	updateNote,
} = require('../utils/notes')
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(expressLayouts)
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	const notes = loadNotes()
	res.render('index', {
		title: 'Home',
		layout: 'layouts/main-layout',
		activePage: 'all',
		notes,
	})
})

app.get('/note', (req, res) => {
	res.render('add-note', {
		title: 'Add Note',
		layout: 'layouts/main-layout',
		msg: '',
		activePage: '',
	})
})

app.post('/note', (req, res) => {
	const category = req.body.category
	if (!category) {
		res.render('add-note', {
			title: 'Add Note',
			layout: 'layouts/main-layout',
			msg: 'Please select a category',
			activePage: '',
		})
	} else {
		addNote(req.body)
		res.redirect('/')
	}
})

app.delete('/note/:id', (req, res) => {
	const note = findNote(req.params.id)
	if (!note) {
		res.status(400)
		res.send('<h1>404</h1>')
	} else {
		deleteNote(req.params.id)
		res.redirect('/')
	}
})

app.get('/note/:id', (req, res) => {
	const note = findNote(req.params.id)
	console.log(note)
	res.render('update-note', {
		title: 'Update Note',
		layout: 'layouts/main-layout',
		activePage: '',
		msg: '',
		note,
	})
})

app.put('/note/:id', (req, res) => {
	const note = findNote(req.params.id)

	if (!note) {
		return res.status(404).send('<h1>404 - Note Not Found</h1>')
	}

	const category = req.body.category
	if (!category) {
		res.render('update-note', {
			title: 'Update Note',
			layout: 'layouts/main-layout',
			msg: 'Please select a category',
			activePage: '',
			note,
		})
	}

	const newNote = {
		id: note.id,
		title: req.body.title,
		body: req.body.body,
		category: req.body.category,
	}

	const isUpdated = updateNote(newNote)

	if (!isUpdated) {
		return res.status(500).send('<h1>Failed to update</h1>')
	}

	res.redirect('/')
})

app.get('/:category', (req, res) => {
	const category = req.params.category
	const categoryUpper = category.charAt(0).toUpperCase() + category.slice(1)
	const notes = findNoteByCategory(categoryUpper)
	res.render(`${category}-note`, {
		title: `${category} Notes`,
		layout: 'layouts/main-layout',
		activePage: category.toLowerCase(),
		notes,
	})
})

app.use((req, res) => {
	res.status(404)
	res.send('<h1>404 Not Found</h1>')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

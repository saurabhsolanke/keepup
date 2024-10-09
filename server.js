const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/notes', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(() => {
   console.log('MongoDB connected');
}).catch(err => {
   console.error('Connection error', err);
});

// Define Note Schema and Model
const noteSchema = new mongoose.Schema({
   title: { type: String, required: true },
   content: { type: String, required: true },
});

const Note = mongoose.model('Note', noteSchema);

// Routes
// Create Note
app.post('/api/notes', (req, res) => {
   const newNote = new Note({
      title: req.body.title,
      content: req.body.content
   });

   newNote.save().then(note => res.json(note)).catch(err => res.status(400).json('Error: ' + err));
});

// Get All Notes
app.get('/api/notes', (req, res) => {
   Note.find().then(notes => res.json(notes)).catch(err => res.status(400).json('Error: ' + err));
});

// Get Note by ID
app.get('/api/notes/:id', (req, res) => {
   Note.findById(req.params.id)
      .then(note => res.json(note))
      .catch(err => res.status(400).json('Error: ' + err));
});

// Update Note
app.put('/api/notes/:id', (req, res) => {
   Note.findById(req.params.id)
      .then(note => {
         note.title = req.body.title;
         note.content = req.body.content;

         note.save().then(() => res.json('Note updated')).catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

// Delete Note
app.delete('/api/notes/:id', (req, res) => {
   Note.findByIdAndDelete(req.params.id)
      .then(() => res.json('Note deleted'))
      .catch(err => res.status(400).json('Error: ' + err));
});

// Start Server
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

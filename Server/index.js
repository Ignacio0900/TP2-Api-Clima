const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/weatherdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const searchSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now },
});

const Search = mongoose.model('Search', searchSchema);

app.post('/api/search', async (req, res) => {
  const { city } = req.body;
  const newSearch = new Search({ city });

  try {
    const savedSearch = await newSearch.save();
    res.status(201).json(savedSearch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await Search.find().sort({ date: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

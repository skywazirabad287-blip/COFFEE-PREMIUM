const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('client'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

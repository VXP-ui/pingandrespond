const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/contacts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Contact model
const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  phone: String,
});

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());

// IP Blocker Middleware
const blockedIPs = ['192.168.1.1', '10.0.0.1', '172.16.0.1'];

const blockIPMiddleware = (req, res, next) => {
  const clientIP = req.connection.remoteAddress || req.socket.remoteAddress;
  if (blockedIPs.includes(clientIP)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.use(blockIPMiddleware);

// Access Control Middleware
const whitelist = ['korehlay7@gmail.comm', 'vxpscripts@gmail.com', 'example3@example.com'];
const blacklist = ['blocked1@example.com', 'blocked2@example.com', 'blocked3@example.com'];

const checkAccessControl = (req, res, next) => {
  const { email } = req.body;

  if (blacklist.includes(email)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (whitelist.length > 0 && !whitelist.includes(email)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

app.use(checkAccessControl);

// API Endpoints
app.get('/api/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.get('/api/contacts/:id', async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = new Contact({ name, email, phone });
  await contact.save();
  res.status(201).json(contact);
});

app.put('/api/contacts/:id', async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { name, email, phone },
    { new: true }
  );
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

app.delete('/api/contacts/:id', async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json({ message: 'Contact deleted' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

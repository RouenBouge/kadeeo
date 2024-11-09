const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { establishment: true }
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, establishmentId: user.establishmentId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      establishmentId: user.establishmentId
    }});
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes des établissements
app.get('/api/establishments', authenticateToken, async (req, res) => {
  try {
    const establishments = await prisma.establishment.findMany({
      include: {
        prizes: true
      }
    });
    res.json(establishments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/establishments', authenticateToken, async (req, res) => {
  try {
    const establishment = await prisma.establishment.create({
      data: req.body
    });
    res.json(establishment);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes des participants
app.post('/api/participants', async (req, res) => {
  try {
    const participant = await prisma.participant.create({
      data: req.body
    });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/establishments/:id/participants', authenticateToken, async (req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      where: {
        establishmentId: req.params.id
      },
      include: {
        prize: true
      }
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
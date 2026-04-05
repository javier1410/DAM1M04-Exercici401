const express = require('express');
const router = express.Router();
const db = require('../mysqlutils');

// CREATE
router.post('/create', async (req, res) => {
  const { taula, ...dades } = req.body;
  try {
    if (taula === 'productes') {
      await db.query(
        'INSERT INTO products (name, category, price, stock, active) VALUES (?,?,?,?,?)',
        [dades.name, dades.category, dades.price, dades.stock, dades.active === 'on' ? 1 : 0]
      );
      res.redirect('/productes');
    } else if (taula === 'clients') {
      await db.query(
        'INSERT INTO customers (name, email, phone) VALUES (?,?,?)',
        [dades.name, dades.email, dades.phone]
      );
      res.redirect('/clients');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creant: ' + e.message);
  }
});

// UPDATE
router.post('/Update', async (req, res) => {
  const { taula, id, ...dades } = req.body;
  try {
    if (taula === 'productes') {
      await db.query(
        'UPDATE products SET name=?, category=?, price=?, stock=?, active=? WHERE id=?',
        [dades.name, dades.category, dades.price, dades.stock, dades.active === 'on' ? 1 : 0, id]
      );
      res.redirect('/productes');
    } else if (taula === 'clients') {
      await db.query(
        'UPDATE customers SET name=?, email=?, phone=? WHERE id=?',
        [dades.name, dades.email, dades.phone, id]
      );
      res.redirect('/clients');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Error actualitzant: ' + e.message);
  }
});

// DELETE
router.post('/Delete', async (req, res) => {
  const { taula, id } = req.body;
  try {
    if (taula === 'productes') {
      await db.query('DELETE FROM products WHERE id=?', [id]);
      res.redirect('/productes');
    } else if (taula === 'clients') {
      await db.query('DELETE FROM customers WHERE id=?', [id]);
      res.redirect('/clients');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Error esborrant: ' + e.message);
  }
});

module.exports = router;

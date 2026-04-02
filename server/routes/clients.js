const express = require('express');
const router = express.Router();
const db = require('../db');

// LISTADO
router.get('/clients', (req, res) => {
  db.query("SELECT * FROM customers", (err, resultats) => {
    res.render('clients/llistat', { clients: resultats });
  });
});

// AFEGIR
router.get('/clientAfegir', (req, res) => {
  res.render('clients/afegir');
});

// EDITAR (igual que productes)
router.get('/clientEditar', (req, res) => {
  const { id } = req.query;

  db.query('SELECT * FROM customers WHERE id = ?', [id], (err, resultats) => {
    if (err) return res.send(err);
    if (resultats.length === 0) return res.send('Client no trobat');

    res.render('clients/editar', { client: resultats[0] });
  });
});

// FITXA CLIENT (extra importante)
router.get('/clientFitxa', (req, res) => {
  const { id } = req.query;

  db.query('SELECT * FROM customers WHERE id = ?', [id], (err, client) => {
    if (err) return res.send(err);

    db.query(`
      SELECT sale_date, total
      FROM sales
      WHERE customer_id = ?
      ORDER BY sale_date DESC
      LIMIT 10
    `, [id], (err2, vendes) => {

      res.render('clients/fitxa', {
        client: client[0],
        vendes
      });

    });
  });
});

module.exports = router;
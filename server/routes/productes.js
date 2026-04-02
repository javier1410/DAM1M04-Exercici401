const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/productes', (req, res) => {
  const pagina = parseInt(req.query.pagina) || 0;
  const cerca = req.query.cerca || '';
  const limit = 10;
  const offset = pagina * limit;

  const sql = `
    SELECT * FROM products
    WHERE name LIKE ? OR category LIKE ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [`%${cerca}%`, `%${cerca}%`, limit, offset], (err, resultats) => {
    if (err) return res.send(err);

    res.render('productes/llistat', {
      productes: resultats,
      pagina,
      paginaAnterior: pagina > 0 ? pagina - 1 : null,
      paginaSeguent: resultats.length === 10 ? pagina + 1 : null,
      cerca
    });
  });
});

router.get('/producteAfegir', (req, res) => {
  res.render('productes/afegir');
});

const express = require('express');
const router = express.Router();
const db = require('../db');

// LISTADO
router.get('/productes', (req, res) => {
  db.query("SELECT * FROM products", (err, resultats) => {
    res.render('productes/llistat', { productes: resultats });
  });
});

// AFEGIR
router.get('/producteAfegir', (req, res) => {
  res.render('productes/afegir');
});

// 👉 EDITAR (TU CÓDIGO VA AQUÍ)
router.get('/producteEditar', (req, res) => {
  const { id } = req.query;

  db.query('SELECT * FROM products WHERE id = ?', [id], (err, resultats) => {
    if (err) return res.send(err);
    if (resultats.length === 0) return res.send('Producte no trobat');

    res.render('productes/editar', { producte: resultats[0] });
  });
});

module.exports = router;
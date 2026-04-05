const express = require('express');
const router = express.Router();
const db = require('../mysqlutils');

const PER_PAGE = 10;

router.get('/productes', async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 0;
    const cerca = req.query.cerca || '';
    const offset = pagina * PER_PAGE;

    let where = '1=1';
    const params = [];
    if (cerca) {
      where += ' AND (name LIKE ? OR category LIKE ?)';
      params.push(`%${cerca}%`, `%${cerca}%`);
    }

    const [{ total }] = await db.query(
      `SELECT COUNT(*) as total FROM products WHERE ${where}`, params
    );
    const totalPagines = Math.ceil(total / PER_PAGE) || 1;

    const productes = await db.query(
      `SELECT * FROM products WHERE ${where} ORDER BY id DESC LIMIT ${PER_PAGE} OFFSET ${offset}`,
      params
    );

    res.render('productes', {
      layout: 'main',
      title: 'Productes',
      productes,
      cerca,
      pagina,
      totalPagines,
      paginaAnterior: pagina > 0 ? pagina - 1 : null,
      paginaSeguent: pagina < totalPagines - 1 ? pagina + 1 : null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: ' + e.message);
  }
});

router.get('/producteAfegir', (req, res) => {
  res.render('producteForm', { layout: 'main', title: 'Afegir Producte', accio: 'create' });
});

router.get('/producteEditar', async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    if (!id || isNaN(id)) return res.redirect('/productes');

    const [prod] = await db.query('SELECT * FROM products WHERE id=?', [id]);
    if (!prod) return res.redirect('/productes');

    res.render('producteForm', {
      layout: 'main',
      title: 'Editar Producte',
      accio: 'Update',
      producte: prod,
    });
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

module.exports = router;

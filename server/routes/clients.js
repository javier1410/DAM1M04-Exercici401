const express = require('express');
const router = express.Router();
const db = require('../mysqlutils');

const PER_PAGE = 10;

router.get('/clients', async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 0;
    const cerca = req.query.cerca || '';
    const vip = req.query.vip === '1';
    const offset = pagina * PER_PAGE;

    let where = '1=1';
    const params = [];
    if (cerca) {
      where += ' AND (c.name LIKE ? OR c.email LIKE ?)';
      params.push(`%${cerca}%`, `%${cerca}%`);
    }

    const clients = await db.query(
      `SELECT c.*, COUNT(s.id) as compres, COALESCE(SUM(s.total),0) as gastat
       FROM customers c LEFT JOIN sales s ON s.customer_id=c.id
       WHERE ${where}
       GROUP BY c.id
       ${vip ? 'HAVING compres>=3' : ''}
       ORDER BY c.id DESC LIMIT ${PER_PAGE} OFFSET ${offset}`,
      params
    );

    const [{ total }] = await db.query(
      `SELECT COUNT(*) as total FROM customers c WHERE ${where}`, params
    );
    const totalPagines = Math.ceil(total / PER_PAGE) || 1;

    res.render('clients', {
      layout: 'main',
      title: 'Clients',
      clients,
      cerca,
      vip,
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

router.get('/clientFitxa', async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    if (!id || isNaN(id)) return res.redirect('/clients');

    const [client] = await db.query('SELECT * FROM customers WHERE id=?', [id]);
    if (!client) return res.redirect('/clients');

    const vendes = await db.query(
      `SELECT s.id, s.sale_date, s.total, s.payment_method
       FROM sales s WHERE s.customer_id=? ORDER BY s.sale_date DESC LIMIT 10`,
      [id]
    );
    const [stats] = await db.query(
      `SELECT COUNT(*) as compres, COALESCE(SUM(total),0) as gastat FROM sales WHERE customer_id=?`,
      [id]
    );
    const ticketMitja = stats.compres > 0 ? (stats.gastat / stats.compres).toFixed(2) : '0.00';

    res.render('clientFitxa', {
      layout: 'main',
      title: client.name,
      client,
      vendes,
      gastat: Number(stats.gastat).toFixed(2),
      ticketMitja,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: ' + e.message);
  }
});

router.get('/clientAfegir', (req, res) => {
  res.render('clientForm', { layout: 'main', title: 'Afegir Client', accio: 'create' });
});

router.get('/clientEditar', async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    if (!id || isNaN(id)) return res.redirect('/clients');

    const [client] = await db.query('SELECT * FROM customers WHERE id=?', [id]);
    if (!client) return res.redirect('/clients');

    res.render('clientForm', {
      layout: 'main',
      title: 'Editar Client',
      accio: 'Update',
      client,
    });
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

module.exports = router;

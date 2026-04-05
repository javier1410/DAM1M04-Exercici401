const express = require('express');
const router = express.Router();
const db = require('../mysqlutils');

const PER_PAGE = 10;

router.get('/vendes', async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 0;
    const cerca = req.query.cerca || '';
    const offset = pagina * PER_PAGE;

    let where = '1=1';
    const params = [];
    if (cerca) {
      where += ' AND c.name LIKE ?';
      params.push(`%${cerca}%`);
    }

    const [{ total }] = await db.query(
      `SELECT COUNT(*) as total FROM sales s JOIN customers c ON s.customer_id=c.id WHERE ${where}`,
      params
    );
    const totalPagines = Math.ceil(total / PER_PAGE) || 1;

    const vendes = await db.query(
      `SELECT s.id, s.sale_date, s.total, s.payment_method, c.name as client
       FROM sales s JOIN customers c ON s.customer_id=c.id
       WHERE ${where}
       ORDER BY s.sale_date DESC LIMIT ${PER_PAGE} OFFSET ${offset}`,
      params
    );

    res.render('vendes', {
      layout: 'main',
      title: 'Vendes',
      vendes,
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

router.get('/vendaDetall', async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    if (!id || isNaN(id)) return res.redirect('/vendes');

    const [venda] = await db.query(
      `SELECT s.*, c.name as client, c.email FROM sales s
       JOIN customers c ON s.customer_id=c.id WHERE s.id=?`,
      [id]
    );
    if (!venda) return res.redirect('/vendes');

    const linies = await db.query(
      `SELECT si.*, p.name as producte FROM sale_items si
       JOIN products p ON si.product_id=p.id WHERE si.sale_id=?`,
      [id]
    );

    res.render('vendaDetall', {
      layout: 'main',
      title: `Venda #${venda.id}`,
      venda,
      linies,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: ' + e.message);
  }
});

module.exports = router;

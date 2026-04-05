const express = require('express');
const router = express.Router();
const db = require('../mysqlutils');

router.get('/', async (req, res) => {
  try {
    const avui = new Date().toISOString().slice(0, 10);
    const mesInici = avui.slice(0, 7) + '-01';

    const [vendesToday] = await db.query(
      'SELECT COALESCE(SUM(total),0) as total FROM sales WHERE DATE(sale_date)=?', [avui]
    );
    const [vendesMonth] = await db.query(
      'SELECT COALESCE(SUM(total),0) as total FROM sales WHERE sale_date>=?', [mesInici]
    );
    const [comandesToday] = await db.query(
      'SELECT COUNT(*) as total FROM sales WHERE DATE(sale_date)=?', [avui]
    );
    const [comandesMonth] = await db.query(
      'SELECT COUNT(*) as total FROM sales WHERE sale_date>=?', [mesInici]
    );
    const lowStock = await db.query(
      'SELECT name, stock FROM products WHERE stock < 5 AND active=1 ORDER BY stock ASC'
    );
    const lastSales = await db.query(
      `SELECT s.id, s.sale_date, c.name as client, s.total
       FROM sales s JOIN customers c ON s.customer_id=c.id
       ORDER BY s.sale_date DESC LIMIT 5`
    );
    const topProducts = await db.query(
      `SELECT p.name, SUM(si.qty) as vendes
       FROM sale_items si JOIN products p ON si.product_id=p.id
       GROUP BY p.id ORDER BY vendes DESC LIMIT 5`
    );

    res.render('dashboard', {
      layout: 'main',
      title: 'Dashboard',
      vendesToday: Number(vendesToday.total).toFixed(2),
      vendesMonth: Number(vendesMonth.total).toFixed(2),
      comandesToday: comandesToday.total,
      comandesMonth: comandesMonth.total,
      lowStock,
      lastSales,
      topProducts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al servidor: ' + e.message);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const dades = {};

  db.query(
    `SELECT COUNT(*) AS comandesAvui, COALESCE(SUM(total),0) AS vendesAvui
     FROM sales
     WHERE DATE(sale_date) = CURDATE()`,
    (err, avui) => {
      if (err) return res.send(err);

      dades.comandesAvui = avui[0].comandesAvui;
      dades.vendesAvui = avui[0].vendesAvui;

      db.query(
        `SELECT COUNT(*) AS comandesMes, COALESCE(SUM(total),0) AS vendesMes
         FROM sales
         WHERE YEAR(sale_date) = YEAR(CURDATE()) AND MONTH(sale_date) = MONTH(CURDATE())`,
        (err2, mes) => {
          if (err2) return res.send(err2);

          dades.comandesMes = mes[0].comandesMes;
          dades.vendesMes = mes[0].vendesMes;

          db.query(
            `SELECT COUNT(*) AS stockBaix
             FROM products
             WHERE stock <= 5`,
            (err3, stock) => {
              if (err3) return res.send(err3);

              dades.stockBaix = stock[0].stockBaix;

              db.query(
                `SELECT s.sale_date, c.name AS client, s.total
                 FROM sales s
                 JOIN customers c ON s.customer_id = c.id
                 ORDER BY s.sale_date DESC
                 LIMIT 5`,
                (err4, ultimesVendes) => {
                  if (err4) return res.send(err4);

                  dades.ultimesVendes = ultimesVendes;

                  db.query(
                    `SELECT p.name, SUM(si.qty) AS unitats
                     FROM sale_items si
                     JOIN products p ON si.product_id = p.id
                     GROUP BY p.id
                     ORDER BY unitats DESC
                     LIMIT 5`,
                    (err5, topProductes) => {
                      if (err5) return res.send(err5);

                      dades.topProductes = topProductes;
                      res.render('dashboard', dades);
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;

router.post('/create', (req, res) => {
  const { taula } = req.body;

  if (taula === 'productes') {
    const { name, category, price, stock, active } = req.body;

    const sql = `
      INSERT INTO products (name, category, price, stock, active)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, category, price, stock, active], (err) => {
      if (err) return res.send(err);
      res.redirect('/productes');
    });
  }

  else if (taula === 'clients') {
    const { name, email, phone } = req.body;

    const sql = `
      INSERT INTO customers (name, email, phone)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, phone], (err) => {
      if (err) return res.send(err);
      res.redirect('/clients');
    });
  }

  else {
    res.send('Taula no vàlida');
  }
});
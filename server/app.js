const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const MySQL = require('./utilsMySQL');

const app = express();
const port = 3000;

// Detectar Proxmox
const isProxmox = !!process.env.PM2_HOME;

// DB
const db = new MySQL();

if (!isProxmox) {
  db.init({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'minierp'
  });
} else {
  db.init({
    host: '127.0.0.1',
    port: 3306,
    user: 'super',
    password: '1234',
    database: 'minierp'
  });
}

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// =========================
//  DASHBOARD
// =========================

app.get('/', async (req, res) => {
  try {

    const avui = await db.query(`
      SELECT COUNT(*) as comandes, COALESCE(SUM(total),0) as vendes
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
    `);

    const mes = await db.query(`
      SELECT COUNT(*) as comandes, COALESCE(SUM(total),0) as vendes
      FROM sales
      WHERE MONTH(sale_date) = MONTH(CURDATE())
    `);

    const stock = await db.query(`
      SELECT COUNT(*) as baixos FROM products WHERE stock <= 5
    `);

    const ultimes = await db.query(`
      SELECT s.sale_date, c.name as client, s.total
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      ORDER BY s.sale_date DESC
      LIMIT 5
    `);

    const data = {
      vendesAvui: avui[0].vendes,
      comandesAvui: avui[0].comandes,
      vendesMes: mes[0].vendes,
      comandesMes: mes[0].comandes,
      stockBaix: stock[0].baixos,
      ultimesVendes: ultimes
    };

    res.render('dashboard', data);

  } catch (err) {
    res.send("Error dashboard");
  }
});

// =========================
//  PRODUCTES
// =========================

app.get('/productes', async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 0;
  const cerca = req.query.cerca || '';
  const limit = 10;
  const offset = pagina * limit;

  const rows = await db.query(`
    SELECT * FROM products
    WHERE name LIKE '%${cerca}%' OR category LIKE '%${cerca}%'
    LIMIT ${limit} OFFSET ${offset}
  `);

  rows.forEach(p => {
    if (p.stock <= 2) p.classe = 'stock-critic';
    else if (p.stock <= 5) p.classe = 'stock-baix';
    else p.classe = 'stock-ok';
  });

  res.render('productes/llistat', {
    productes: rows,
    pagina,
    cerca
  });
});

// Afegir producte
app.get('/producteAfegir', (req, res) => {
  res.render('productes/afegir');
});

app.post('/create', async (req, res) => {
  const { taula } = req.body;

  if (taula === 'productes') {
    const { name, category, price, stock, active } = req.body;

    await db.query(`
      INSERT INTO products (name, category, price, stock, active)
      VALUES ("${name}", "${category}", ${price}, ${stock}, ${active})
    `);

    res.redirect('/productes');
  }

  if (taula === 'clients') {
    const { name, email, phone } = req.body;

    await db.query(`
      INSERT INTO customers (name, email, phone)
      VALUES ("${name}", "${email}", "${phone}")
    `);

    res.redirect('/clients');
  }
});

// Editar producte
app.get('/producteEditar', async (req, res) => {
  const id = req.query.id;

  const rows = await db.query(`
    SELECT * FROM products WHERE id = ${id}
  `);

  res.render('productes/editar', { producte: rows[0] });
});

// Update + Delete
app.post('/update', async (req, res) => {
  const { taula, id } = req.body;

  if (taula === 'productes') {
    const { name, category, price, stock, active } = req.body;

    await db.query(`
      UPDATE products
      SET name="${name}", category="${category}", price=${price}, stock=${stock}, active=${active}
      WHERE id=${id}
    `);

    res.redirect('/productes');
  }

  if (taula === 'clients') {
    const { name, email, phone } = req.body;

    await db.query(`
      UPDATE customers
      SET name="${name}", email="${email}", phone="${phone}"
      WHERE id=${id}
    `);

    res.redirect('/clients');
  }
});

app.post('/delete', async (req, res) => {
  const { taula, id } = req.body;

  if (taula === 'productes') {
    await db.query(`DELETE FROM products WHERE id=${id}`);
    res.redirect('/productes');
  }

  if (taula === 'clients') {
    await db.query(`DELETE FROM customers WHERE id=${id}`);
    res.redirect('/clients');
  }
});

// ========================
//  CLIENTS
// =========================

app.get('/clients', async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 0;
  const cerca = req.query.cerca || '';
  const limit = 10;
  const offset = pagina * limit;

  const rows = await db.query(`
    SELECT * FROM customers
    WHERE name LIKE '%${cerca}%' OR email LIKE '%${cerca}%'
    LIMIT ${limit} OFFSET ${offset}
  `);

  res.render('clients/llistat', {
    clients: rows,
    pagina,
    cerca
  });
});

app.get('/clientAfegir', (req, res) => {
  res.render('clients/afegir');
});

app.get('/clientEditar', async (req, res) => {
  const id = req.query.id;

  const rows = await db.query(`
    SELECT * FROM customers WHERE id = ${id}
  `);

  res.render('clients/editar', { client: rows[0] });
});

// =========================
//  VENDES
// =========================

app.get('/vendes', async (req, res) => {
  const rows = await db.query(`
    SELECT s.id, s.sale_date, s.total, c.name as client
    FROM sales s
    JOIN customers c ON s.customer_id = c.id
    LIMIT 10
  `);

  res.render('vendes/llistat', { vendes: rows });
});

// =========================
//  SERVER
// =========================

const httpServer = app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});


process.on('SIGINT', async () => {
  await db.end();
  httpServer.close();
  process.exit(0);
});
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const MySQL = require('./utilsMySQL')

const app = express()
const port = 3000

// Detectar si estem al Proxmox (si és pm2)
const isProxmox = !!process.env.PM2_HOME

// Iniciar connexió MySQL
const db = new MySQL()
if (!isProxmox) {
  db.init({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'escola'
  })
} else {
  db.init({
    host: '127.0.0.1',
    port: 3306,
    user: 'super',
    password: '1234',
    database: 'escola'
  })
}

// Fitxers estàtics
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// Deshabilitar caché
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Surrogate-Control', 'no-store')
  next()
})

// Handlebars
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// Helpers
hbs.registerHelper('lt', (a, b) => a < b)
hbs.registerHelper('lte', (a, b) => a <= b)

// Partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
app.set('view options', { layout: 'layouts/main' })

const PER_PAGE = 10

// ─── DASHBOARD ───────────────────────────────────────────────

app.get('/', async (req, res) => {
  try {
    const vendesAvuiRows = await db.query(`SELECT COUNT(*) AS total FROM sales WHERE DATE(sale_date) = CURDATE()`)
    const vendesMesRows  = await db.query(`SELECT COUNT(*) AS total FROM sales WHERE MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE())`)
    const stockBaixRows  = await db.query(`SELECT * FROM products WHERE stock < 5 AND active = 1`)
    const ultVendesRows  = await db.query(`SELECT s.id, s.sale_date, s.total, c.name AS client FROM sales s JOIN customers c ON s.customer_id = c.id ORDER BY s.sale_date DESC LIMIT 5`)
    const topProdRows    = await db.query(`SELECT p.name, SUM(s.qty) AS total FROM sales s JOIN products p ON s.product_id = p.id GROUP BY p.id ORDER BY total DESC LIMIT 5`)

    const vendesAvui = db.table_to_json(vendesAvuiRows, { total: 'number' })
    const vendesMes  = db.table_to_json(vendesMesRows,  { total: 'number' })
    const stockBaix  = db.table_to_json(stockBaixRows,  { id: 'number', price: 'number', stock: 'number', active: 'boolean' })
    const ultVendes  = db.table_to_json(ultVendesRows,  { id: 'number', total: 'number', sale_date: 'date', client: 'string' })
    const topProd    = db.table_to_json(topProdRows,    { name: 'string', total: 'number' })

    res.render('dashboard', {
      vendesAvui: vendesAvui[0].total,
      vendesMes:  vendesMes[0].total,
      stockBaix,
      ultVendes,
      topProd
    })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

// ─── PRODUCTES ───────────────────────────────────────────────

app.get('/productes', async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina, 10) || 0
    const cerca  = req.query.cerca || ''
    const offset = pagina * PER_PAGE
    const filtre = `%${cerca}%`

    const productesRows = await db.query(
      `SELECT * FROM products WHERE name LIKE '${filtre}' OR category LIKE '${filtre}' LIMIT ${PER_PAGE} OFFSET ${offset}`
    )
    const totalRows = await db.query(
      `SELECT COUNT(*) AS total FROM products WHERE name LIKE '${filtre}' OR category LIKE '${filtre}'`
    )

    const productes = db.table_to_json(productesRows, { id: 'number', price: 'number', stock: 'number', active: 'boolean' })
    const total     = db.table_to_json(totalRows, { total: 'number' })

    res.render('productes', {
      productes,
      pagina,
      cerca,
      hiHaPrev: pagina > 0,
      hiHaNext: offset + PER_PAGE < total[0].total,
      paginaSeg: pagina + 1,
      paginaAnt: pagina - 1
    })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

app.get('/producteAfegir', (req, res) => {
  res.render('producteAfegir')
})

app.get('/producteEditar', async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10)
    if (!id) return res.status(400).send('Paràmetre id invàlid')

    const rows = await db.query(`SELECT * FROM products WHERE id = ${id}`)
    if (!rows.length) return res.status(404).send('Producte no trobat')

    const producte = db.table_to_json(rows, { id: 'number', price: 'number', stock: 'number', active: 'boolean' })

    res.render('producteEditar', { producte: producte[0] })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

// ─── CLIENTS ─────────────────────────────────────────────────

app.get('/clients', async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina, 10) || 0
    const cerca  = req.query.cerca || ''
    const offset = pagina * PER_PAGE
    const filtre = `%${cerca}%`

    const clientsRows = await db.query(
      `SELECT c.*, COUNT(s.id) AS numCompres FROM customers c LEFT JOIN sales s ON s.customer_id = c.id WHERE c.name LIKE '${filtre}' OR c.email LIKE '${filtre}' GROUP BY c.id LIMIT ${PER_PAGE} OFFSET ${offset}`
    )
    const totalRows = await db.query(
      `SELECT COUNT(*) AS total FROM customers WHERE name LIKE '${filtre}' OR email LIKE '${filtre}'`
    )

    const clients = db.table_to_json(clientsRows, { id: 'number', numCompres: 'number' })
    const total   = db.table_to_json(totalRows, { total: 'number' })

    res.render('clients', {
      clients,
      pagina,
      cerca,
      hiHaPrev: pagina > 0,
      hiHaNext: offset + PER_PAGE < total[0].total,
      paginaSeg: pagina + 1,
      paginaAnt: pagina - 1
    })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

app.get('/clientAfegir', (req, res) => {
  res.render('clientAfegir')
})

app.get('/clientEditar', async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10)
    if (!id) return res.status(400).send('Paràmetre id invàlid')

    const rows = await db.query(`SELECT * FROM customers WHERE id = ${id}`)
    if (!rows.length) return res.status(404).send('Client no trobat')

    const client = db.table_to_json(rows, { id: 'number' })

    res.render('clientEditar', { client: client[0] })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

app.get('/clientFitxa', async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10)
    if (!id) return res.status(400).send('Paràmetre id invàlid')

    const rows = await db.query(`SELECT * FROM customers WHERE id = ${id}`)
    if (!rows.length) return res.status(404).send('Client no trobat')

    const vendesRows = await db.query(
      `SELECT s.*, p.name AS producte FROM sales s JOIN products p ON s.product_id = p.id WHERE s.customer_id = ${id} ORDER BY s.sale_date DESC LIMIT 10`
    )

    const client = db.table_to_json(rows, { id: 'number' })
    const vendes = db.table_to_json(vendesRows, { id: 'number', total: 'number', qty: 'number', sale_date: 'date' })

    res.render('clientFitxa', { client: client[0], vendes })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

// ─── VENDES ──────────────────────────────────────────────────

app.get('/vendes', async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina, 10) || 0
    const offset = pagina * PER_PAGE

    const vendesRows = await db.query(
      `SELECT s.id, s.sale_date, s.total, s.qty, c.name AS client, p.name AS producte FROM sales s JOIN customers c ON s.customer_id = c.id JOIN products p ON s.product_id = p.id ORDER BY s.sale_date DESC LIMIT ${PER_PAGE} OFFSET ${offset}`
    )
    const totalRows = await db.query(`SELECT COUNT(*) AS total FROM sales`)

    const vendes = db.table_to_json(vendesRows, { id: 'number', total: 'number', qty: 'number', sale_date: 'date' })
    const total  = db.table_to_json(totalRows, { total: 'number' })

    res.render('vendes', {
      vendes,
      pagina,
      hiHaPrev: pagina > 0,
      hiHaNext: offset + PER_PAGE < total[0].total,
      paginaSeg: pagina + 1,
      paginaAnt: pagina - 1
    })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

app.get('/vendaAfegir', async (req, res) => {
  try {
    const clientsRows   = await db.query(`SELECT id, name FROM customers ORDER BY name`)
    const productesRows = await db.query(`SELECT id, name, price FROM products WHERE active = 1 ORDER BY name`)

    const clients   = db.table_to_json(clientsRows,   { id: 'number' })
    const productes = db.table_to_json(productesRows,  { id: 'number', price: 'number' })

    res.render('vendaAfegir', { clients, productes })
  } catch (e) {
    console.error(e)
    res.status(500).send('Error consultant la base de dades')
  }
})

// ─── CRUD POST ────────────────────────────────────────────────

app.post('/create', async (req, res) => {
  try {
    const table = req.body.table

    if (table === 'products') {
      const { name, category, price, stock, active } = req.body
      await db.query(
        `INSERT INTO products (name, category, price, stock, active) VALUES ("${name}", "${category}", ${parseFloat(price)}, ${parseInt(stock, 10)}, ${active ? 1 : 0})`
      )
      res.redirect('/productes')

    } else if (table === 'customers') {
      const { name, email, phone } = req.body
      await db.query(
        `INSERT INTO customers (name, email, phone) VALUES ("${name}", "${email}", "${phone}")`
      )
      res.redirect('/clients')

    } else if (table === 'sales') {
      const { customer_id, product_id, qty, sale_date } = req.body
      const prodRows = await db.query(`SELECT price FROM products WHERE id = ${product_id}`)
      const prod     = db.table_to_json(prodRows, { price: 'number' })
      const total    = prod[0].price * parseInt(qty, 10)
      await db.query(
        `INSERT INTO sales (customer_id, product_id, qty, total, sale_date) VALUES (${customer_id}, ${product_id}, ${qty}, ${total}, "${sale_date}")`
      )
      res.redirect('/vendes')
    }
  } catch (e) {
    console.error(e)
    res.status(500).send('Error creant el registre')
  }
})

app.post('/update', async (req, res) => {
  try {
    const table = req.body.table
    const id    = parseInt(req.body.id, 10)

    if (table === 'products') {
      const { name, category, price, stock, active } = req.body
      await db.query(
        `UPDATE products SET name="${name}", category="${category}", price=${parseFloat(price)}, stock=${parseInt(stock, 10)}, active=${active ? 1 : 0} WHERE id=${id}`
      )
      res.redirect('/productes')

    } else if (table === 'customers') {
      const { name, email, phone } = req.body
      await db.query(
        `UPDATE customers SET name="${name}", email="${email}", phone="${phone}" WHERE id=${id}`
      )
      res.redirect('/clients')
    }
  } catch (e) {
    console.error(e)
    res.status(500).send('Error actualitzant el registre')
  }
})

app.post('/delete', async (req, res) => {
  try {
    const table    = req.body.table
    const id       = parseInt(req.body.id, 10)
    const redirect = req.body.redirect || '/'

    await db.query(`DELETE FROM ${table} WHERE id = ${id}`)
    res.redirect(redirect)
  } catch (e) {
    console.error(e)
    res.status(500).send('Error esborrant el registre')
  }
})

// ─── START ────────────────────────────────────────────────────

const httpServer = app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.end()
  httpServer.close()
  process.exit(0)
})

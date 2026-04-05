const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar HBS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Parsear formularios POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helpers HBS
hbs.registerHelper('eq', (a, b) => a == b);
hbs.registerHelper('add', (a, b) => Number(a) + Number(b));
hbs.registerHelper('sub', (a, b) => Number(a) - Number(b));
hbs.registerHelper('gt', (a, b) => Number(a) > Number(b));
hbs.registerHelper('lt', (a, b) => Number(a) < Number(b));
hbs.registerHelper('multiply', (a, b) => (Number(a) * Number(b)).toFixed(2));
hbs.registerHelper('toFixed2', (n) => Number(n).toFixed(2));
hbs.registerHelper('formatDate', (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('ca-ES');
});
hbs.registerHelper('range', function (from, to) {
  const arr = [];
  for (let i = from; i <= to; i++) arr.push(i);
  return arr;
});
hbs.registerHelper('json', (ctx) => JSON.stringify(ctx));

// Rutas
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/productes'));
app.use('/', require('./routes/clients'));
app.use('/', require('./routes/vendes'));
app.use('/', require('./routes/crud'));

app.listen(PORT, () => console.log(`Servidor a http://localhost:${PORT}`));

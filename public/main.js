// ── Tema ──────────────────────────────────────────────────────
(function () {
  const tema = localStorage.getItem('tema') || 'tema-clar'
  document.body.className = tema
  const sel = document.getElementById('selectTema')
  if (sel) sel.value = tema
})()

function canviaTema(tema) {
  document.body.className = tema
  localStorage.setItem('tema', tema)
}



// ── Tabs del dashboard ────────────────────────────────────────
function canviaTab(nomTab) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('visible'))
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('actiu'))
  document.getElementById('tab-' + nomTab).classList.add('visible')
  document.querySelector('[data-tab="' + nomTab + '"]').classList.add('actiu')
}



// ── Validació formulari producte ─────────────────────────────
function validaProducte(e) {
  let valid = true

  const nom    = document.getElementById('name')
  const preu   = document.getElementById('price')
  const stock  = document.getElementById('stock')
  const categ  = document.getElementById('category')

  netejaError(nom)
  netejaError(preu)
  netejaError(stock)
  netejaError(categ)

  if (!nom.value || nom.value.trim().length < 2) {
    mostraError(nom, 'El nom és obligatori i ha de tenir mínim 2 caràcters')
    valid = false
  }

  if (!categ.value || categ.value.trim() === '') {
    mostraError(categ, 'La categoria és obligatòria')
    valid = false
  }

  if (!preu.value || parseFloat(preu.value) <= 0) {
    mostraError(preu, 'El preu ha de ser un nombre major que 0')
    valid = false
  }

  if (stock.value === '' || parseInt(stock.value, 10) < 0 || !Number.isInteger(Number(stock.value))) {
    mostraError(stock, 'El stock ha de ser un nombre enter igual o major que 0')
    valid = false
  }

  if (!valid) e.preventDefault()
}

// ── Validació formulari client ───────────────────────────────
function validaClient(e) {
  let valid = true

  const nom    = document.getElementById('name')
  const email  = document.getElementById('email')
  const phone  = document.getElementById('phone')

  netejaError(nom)
  netejaError(email)
  netejaError(phone)

  if (!nom.value || nom.value.trim() === '') {
    mostraError(nom, 'El nom és obligatori')
    valid = false
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value || !regexEmail.test(email.value)) {
    mostraError(email, 'Introdueix un email vàlid (exemple@domini.com)')
    valid = false
  }

  if (!phone.value || phone.value.trim().length < 9) {
    mostraError(phone, 'El telèfon ha de tenir mínim 9 caràcters')
    valid = false
  }

  if (!valid) e.preventDefault()
}

// ── Validació formulari venda ─────────────────────────────────
function validaVenda(e) {
  let valid = true

  const client  = document.getElementById('customer_id')
  const prod    = document.getElementById('product_id')
  const qty     = document.getElementById('qty')
  const data    = document.getElementById('sale_date')

  netejaError(client)
  netejaError(prod)
  netejaError(qty)
  netejaError(data)

  if (!client.value) {
    mostraError(client, 'Selecciona un client')
    valid = false
  }

  if (!prod.value) {
    mostraError(prod, 'Selecciona un producte')
    valid = false
  }

  if (!qty.value || parseInt(qty.value, 10) < 1) {
    mostraError(qty, 'La quantitat ha de ser mínim 1')
    valid = false
  }

  if (!data.value) {
    mostraError(data, 'La data és obligatòria')
    valid = false
  }

  if (!valid) e.preventDefault()
}

// ── Helpers d'error ───────────────────────────────────────────
function mostraError(input, missatge) {
  input.classList.add('error')
  const err = input.parentElement.querySelector('.missatge-error')
  if (err) {
    err.textContent = missatge
    err.classList.add('visible')
  }
}

function netejaError(input) {
  input.classList.remove('error')
  const err = input.parentElement.querySelector('.missatge-error')
  if (err) err.classList.remove('visible')
}

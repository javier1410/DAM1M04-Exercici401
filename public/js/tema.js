// Aplica el tema desat al carregar la pàgina
(function () {
  const tema = localStorage.getItem('tema') || 'tema-clar';
  document.body.className = tema;
  const sel = document.getElementById('selectTema');
  if (sel) sel.value = tema;
})();

function canviaTema(tema) {
  document.body.className = tema;
  localStorage.setItem('tema', tema);
}

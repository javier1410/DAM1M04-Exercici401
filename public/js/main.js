// Ressalta l'enllaç actiu del menú
document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    if (a.getAttribute('href') === path) {
      a.style.background = 'rgba(255,255,255,0.25)';
      a.style.fontWeight = '700';
    }
  });
});

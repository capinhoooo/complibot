(function () {
  var theme = null;
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    }
  } catch (e) {}
  document.documentElement.classList.add(theme || 'dark');
})();

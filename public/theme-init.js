// Səhifə çəkilməzdən əvvəl rejimi təyin edir (ağ/tünd "çaxnaşma" olmasın deyə)
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();

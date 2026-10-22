// MemoPic site — tiny progressive enhancement. No storage, no cookies, no network requests.
(() => {
  const menus = () => [...document.querySelectorAll('details.dd[open]')];
  document.addEventListener('click', (e) => {
    menus().forEach((d) => { if (!d.contains(e.target)) d.open = false; });
    const a = e.target.closest('details.dd a');
    if (a) a.closest('details').open = false;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    menus().forEach((d) => { d.open = false; d.querySelector('summary')?.focus(); });
  });
})();

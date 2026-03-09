const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

themeToggle?.addEventListener('click', () => {
    html.classList.add('theme-transitioning');
    const newTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    const label = newTheme === 'dark'
        ? themeToggle.dataset.labelLight
        : themeToggle.dataset.labelDark;
    if (label) themeToggle.setAttribute('aria-label', label);
    setTimeout(() => html.classList.remove('theme-transitioning'), 350);
});

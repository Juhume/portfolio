const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    html.dataset.theme = savedTheme;
} else if (systemPrefersDark) {
    html.dataset.theme = 'dark';
}

themeToggle?.addEventListener('click', () => {
    html.classList.add('theme-transitioning');
    const newTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    themeToggle.setAttribute('aria-label',
        newTheme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
    );
    setTimeout(() => html.classList.remove('theme-transitioning'), 350);
});

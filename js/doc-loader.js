// doc-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('doc-content');
    if (!container) return;
    
    const lang = localStorage.getItem('cubeos-lang') || 'ru';
    loadDocumentation(lang);
    
    // При смене языка перезагружаем документацию
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const originalClick = langToggle.onclick;
        langToggle.addEventListener('click', function() {
            setTimeout(() => {
                const newLang = localStorage.getItem('cubeos-lang') || 'ru';
                loadDocumentation(newLang);
            }, 100);
        });
    }
    
    function loadDocumentation(lang) {
        container.className = 'doc-loading';
        container.innerHTML = 'Загрузка документации...';
        
        const file = lang === 'ru' ? 'DOCUMENTATION.ru.md' : 'DOCUMENTATION.en.md';
        
        fetch(file)
            .then(response => {
                if (!response.ok) throw new Error('Файл не найден');
                return response.text();
            })
            .then(md => {
                const html = MarkdownParser.parse(md);
                container.className = 'doc-content';
                container.innerHTML = html;
            })
            .catch(err => {
                container.className = 'doc-error';
                container.innerHTML = `
                    <strong>Ошибка загрузки документации</strong><br>
                    ${err.message}<br><br>
                    <small>Проверьте, что файл ${file} существует в папке docs/</small>
                `;
            });
    }
});

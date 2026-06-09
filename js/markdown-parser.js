// markdown-parser.js
// Простой конвертер Markdown → HTML (без зависимостей)

const MarkdownParser = {
    parse(md) {
        let html = md;
        
        // Экранируем HTML
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Кодовые блоки (``` ... ```)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        
        // Инлайн-код (`...`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Жирный (**...**)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Курсив (*...*)
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Заголовки (# ## ###)
        html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Горизонтальная линия (---)
        html = html.replace(/^---+$/gm, '<hr>');
        
        // Цитаты (> ...)
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
        // Склеиваем соседние blockquote
        html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');
        
        // Таблицы
        html = html.replace(/^\|(.+)\|$/gm, (line) => {
            const cells = line.split('|').filter(c => c.trim() !== '');
            const isHeader = line.includes('---');
            if (isHeader) return ''; // Пропускаем строку-разделитель
            const tag = line.match(/^\|[-:\s|]+\|$/) ? '' : 'td';
            const cellTag = 'td';
            return '<tr>' + cells.map(c => `<${cellTag}>${c.trim()}</${cellTag}>`).join('') + '</tr>';
        });
        // Оборачиваем таблицы
        html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
        // Первую строку таблицы делаем заголовком
        html = html.replace(/<table><tr>(.*?)<\/tr>/s, '<table><thead><tr>$1</tr></thead><tbody>');
        html = html.replace(/<\/table>/g, '</tbody></table>');
        html = html.replace(/<td>/g, (match, offset) => {
            // Первая строка после <thead> — th
            return match;
        });
        
        // Ссылки [текст](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Списки (- или *)
        html = html.replace(/^[\-*] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        
        // Нумерованные списки (1. )
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        
        // Параграфы (пустые строки)
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // Убираем пустые параграфы
        html = html.replace(/<p>\s*<\/p>/g, '');
        html = html.replace(/<p>(<h[1-4]>)/g, '$1');
        html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<table>)/g, '$1');
        html = html.replace(/(<\/table>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
        
        return html.trim();
    }
};

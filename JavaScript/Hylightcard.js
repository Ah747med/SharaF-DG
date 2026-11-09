// كود بحث وهايلايت ديناميكي لكل سكشن كروت
document.addEventListener('DOMContentLoaded', function () {
    // يبحث عن كل input id ينتهي بـ -search
    document.querySelectorAll('input[id$="-search"]').forEach(function (searchInput) {
        // يستخرج id السكشن من اسم input (مثلاً sandwich-search => opt5)
        var section = searchInput.closest('section');
        if (!section) return;
        var cards = Array.from(section.querySelectorAll('.card'));
        // اسم كلاس الهايلايت حسب نوع البحث
        var highlightClass = searchInput.id.replace('-search', '-highlight');

        // إضافة ستايل للهايلايت إذا لم يكن موجوداً
        if (!document.querySelector('style[data-hl="' + highlightClass + '"]')) {
            var style = document.createElement('style');
            style.setAttribute('data-hl', highlightClass);
            style.innerHTML = `.${highlightClass} { background: #F9A01B; color: #0A0F1D !important; font-weight: 700; border-radius: 4px; padding: 0 2px; }`;
            document.head.appendChild(style);
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
        }

        function highlightText(element, text) {
            if (!text || !element) return;
            var inner = element.innerHTML;
            var regex = new RegExp('(' + escapeRegExp(text) + ')', 'gi');
            element.innerHTML = inner.replace(new RegExp('<span class="' + highlightClass + '">(.*?)<\/span>', 'g'), '$1'); // مسح الهايلايت القديم
            element.innerHTML = element.innerHTML.replace(regex, '<span class="' + highlightClass + '">$1</span>');
        }

        function removeHighlight(element) {
            if (!element) return;
            element.innerHTML = element.innerHTML.replace(new RegExp('<span class="' + highlightClass + '">(.*?)<\/span>', 'g'), '$1');
        }

        searchInput.addEventListener('input', function () {
            var val = searchInput.value.trim();
            if (!val) {
                cards.forEach(function (card) {
                    card.style.display = '';
                    card.querySelectorAll('.card-title, .card-ingredients-list li').forEach(removeHighlight);
                });
                return;
            }
            cards.forEach(function (card) {
                var title = card.querySelector('.card-title');
                var ingredients = Array.from(card.querySelectorAll('.card-ingredients-list li'));
                var found = false;
                removeHighlight(title);
                ingredients.forEach(removeHighlight);
                if (title && title.textContent.toLowerCase().includes(val.toLowerCase())) {
                    found = true;
                    highlightText(title, val);
                }
                ingredients.forEach(function (li) {
                    if (li.textContent.toLowerCase().includes(val.toLowerCase())) {
                        found = true;
                        highlightText(li, val);
                    }
                });
                card.style.display = found ? '' : 'none';
            });
        });
    });
});
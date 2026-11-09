document.addEventListener('DOMContentLoaded', function () {
    function initTableSearch(sectionSelector) {
        var section = document.querySelector(sectionSelector + '.section');
        if (!section) return;
        var searchInput = section.querySelector('input#table-search');
        var tables = section.querySelectorAll('table');
        if (!searchInput || !tables.length) return;

        if (!document.getElementById('table-highlight-style')) {
            var style = document.createElement('style');
            style.id = 'table-highlight-style';
            style.innerHTML = '.table-highlight { background: #F9A01B; color: #0A0F1D !important; font-weight: 700; border-radius: 3px; padding: 0 2px; }';
            document.head.appendChild(style);
        }

        var bodyRows = [];
        tables.forEach(function (tbl) {
            var tbody = tbl.querySelector('tbody') || tbl;
            Array.from(tbody.querySelectorAll('tr')).forEach(function (row) {
                if (!row.classList.contains('empty-placeholder-row')) {
                    bodyRows.push(row);
                }
            });
        });
        if (!bodyRows.length) return;

        // Cache original HTML once for every cell so it can never be corrupted
        bodyRows.forEach(function (row) {
            row.querySelectorAll('td').forEach(function (cell) {
                if (!cell.dataset.originalHtml) {
                    cell.dataset.originalHtml = cell.innerHTML;
                }
            });
        });

        function escapeRegExp(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function restoreRowHtml(row) {
            row.querySelectorAll('td').forEach(function (cell) {
                if (cell.dataset.originalHtml) {
                    cell.innerHTML = cell.dataset.originalHtml;
                }
            });
        }

        // Safely highlight ONLY text nodes, never touching HTML attributes or tags
        function highlightTextInCell(cell, query) {
            if (!query) return;
            var walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false);
            var textNodes = [];
            var node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue && node.nodeValue.trim().length > 0) {
                    textNodes.push(node);
                }
            }

            var regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');

            textNodes.forEach(function (textNode) {
                var text = textNode.nodeValue;
                if (regex.test(text)) {
                    var frag = document.createDocumentFragment();
                    var lastIndex = 0;
                    regex.lastIndex = 0;
                    var match;
                    while ((match = regex.exec(text)) !== null) {
                        if (match.index > lastIndex) {
                            frag.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                        }
                        var span = document.createElement('span');
                        span.className = 'table-highlight';
                        span.textContent = match[0];
                        frag.appendChild(span);
                        lastIndex = regex.lastIndex;
                    }
                    if (lastIndex < text.length) {
                        frag.appendChild(document.createTextNode(text.substring(lastIndex)));
                    }
                    if (textNode.parentNode) {
                        textNode.parentNode.replaceChild(frag, textNode);
                    }
                }
            });
        }

        function applyHighlights(row, query) {
            row.querySelectorAll('td').forEach(function (cell) {
                highlightTextInCell(cell, query);
            });
        }

        if (searchInput._tableSearchHandler) {
            searchInput.removeEventListener('input', searchInput._tableSearchHandler);
        }

        var onInput = function () {
            var q = searchInput.value.trim();

            if (!q) {
                bodyRows.forEach(function (row) {
                    row.style.display = '';
                    restoreRowHtml(row);
                });
                return;
            }

            var lowerQ = q.toLowerCase();

            bodyRows.forEach(function (row) {
                restoreRowHtml(row);
                var rowText = (row.textContent || '').toLowerCase();
                if (rowText.includes(lowerQ)) {
                    row.style.display = '';
                    applyHighlights(row, q);
                } else {
                    row.style.display = 'none';
                }
            });
        };

        searchInput._tableSearchHandler = onInput;
        searchInput.addEventListener('input', onInput);
    }

    window.initTableSearch = initTableSearch;

    initTableSearch('#opt1');
    initTableSearch('#opt2');
    initTableSearch('#opt3');
    initTableSearch('#opt4');
    initTableSearch('#opt5');
    initTableSearch('#opt6');
    initTableSearch('#opt7');
    initTableSearch('#opt8');
    initTableSearch('#opt9');
    initTableSearch('#opt10');
    initTableSearch('#opt11');
    initTableSearch('#opt12');
    initTableSearch('#opt13');
    initTableSearch('#opt14');
    initTableSearch('#opt15');
    initTableSearch('#opt16');
    initTableSearch('#opt17');
    initTableSearch('#opt18');
    initTableSearch('#opt19');
    initTableSearch('#opt20');
    initTableSearch('#opt22');
    initTableSearch('#t1');
    initTableSearch('#t2');
    initTableSearch('#t3');
});

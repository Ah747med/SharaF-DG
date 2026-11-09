  // منطق البحث المستقل لسكشن opt6
        document.addEventListener('DOMContentLoaded', function() {
            var input = document.getElementById('opt6-search');
            var hiddenTable = document.getElementById('hidden-data-table');
            var resultsWrap = document.getElementById('opt6-results');
            var resultsBody = document.getElementById('opt6-results-body');
            if (!input || !hiddenTable || !resultsWrap || !resultsBody) return;

            function escapeRegExp(str){ return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
            function renderMatches(query){
                var q = (query || '').trim();
                resultsBody.innerHTML = '';
                resultsWrap.style.display = 'none';
                if (!q) return;
                var qLower = q.toLowerCase();
                var rows = Array.from(hiddenTable.querySelectorAll('tbody tr'));
                var safe = escapeRegExp(q);
                var rx = new RegExp(safe, 'ig');
                var count = 0;
                rows.forEach(function(tr){
                    var cells = Array.from(tr.querySelectorAll('td'));
                    var rowText = cells.map(function(td){ return (td.textContent || '').toLowerCase(); }).join(' | ');
                    if (rowText.includes(qLower)){
                        var rowHtml = '<tr>' + cells.map(function(td){
                            var text = td.textContent || '';
                            var highlighted = text.replace(rx, function(m){ return '<mark>'+m+'</mark>'; });
                            return '<td style="border:1px solid #ccc; padding:8px; text-align:center;">'+ highlighted +'</td>';
                        }).join('') + '</tr>';
                        resultsBody.insertAdjacentHTML('beforeend', rowHtml);
                        count++;
                    }
                });
                if (count > 0) {
                    resultsWrap.style.display = 'block';
                }
            }

            input.addEventListener('input', function(){ renderMatches(input.value); });
        });
//  section
const sideItems = document.querySelectorAll('.side-item');
const sections = document.querySelectorAll('.section');
const content = document.querySelector('.content');


const scrollPositions = {};

sideItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const sectionName = item.textContent.trim();


        const currentActiveSection = document.querySelector('.section.active');
        if (currentActiveSection) {
            scrollPositions[currentActiveSection.id] = window.scrollY;
        }

        sideItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        sections.forEach(sec => sec.classList.toggle('active', sec.id === targetId));
        content.classList.add('has-active-section');


        const sectionTitle = document.getElementById('section-title');
        const sectionTitleText = document.getElementById('section-title-text');

        if (sectionTitle && sectionTitleText) {
            if (targetId === 'opt1') {

                if (sectionTitle.style.display === 'block') {
                    sectionTitle.style.animation = 'centerDisappear 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    setTimeout(() => {
                        sectionTitle.style.display = 'none';
                    }, 400);
                }
            } else {

                sectionTitleText.textContent = sectionName;
                sectionTitle.style.display = 'block';


                sectionTitle.style.animation = 'none';
                setTimeout(() => {
                    sectionTitle.style.animation = 'centerAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 10);
            }
        }


        setTimeout(() => {
            const savedPosition = scrollPositions[targetId] || 0;
            window.scrollTo({
                top: savedPosition,
                behavior: 'instant'
            });
        }, 50);
    });
});

// ========== البحث =============
function removeHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        el.outerHTML = el.innerHTML;
    });
}

function showElementAndParents(el) {

    let node = el;
    while (node && node !== document.body) {
        if (node.style && (node.style.display === 'none' || node.hidden)) {
            node.style.display = '';
            node.hidden = false;
        }
        node = node.parentElement;
    }
}

function highlightFirstMatchWithin(scopeElement, query) {
    if (!scopeElement || !query) return null;
    const walker = document.createTreeWalker(scopeElement, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const lower = query.toLowerCase();
    while (node = walker.nextNode()) {
        const text = node.textContent;
        const idx = text.toLowerCase().indexOf(lower);
        if (idx !== -1) {
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.style.background = '#F9A01B';
            span.style.color = '#0A0F1D';
            span.style.fontWeight = '700';
            span.style.borderRadius = '3px';
            span.style.padding = '0 2px';
            const before = text.substring(0, idx);
            const match = text.substring(idx, idx + query.length);
            const after = text.substring(idx + query.length);
            const frag = document.createDocumentFragment();
            if (before) frag.appendChild(document.createTextNode(before));
            span.textContent = match;
            frag.appendChild(span);
            if (after) frag.appendChild(document.createTextNode(after));
            node.parentNode.replaceChild(frag, node);
            return span;
        }
    }
    return null;
}

// دالة البحث
function performSearch() {
    const input = document.getElementById('search-input');
    const query = input ? input.value.trim() : '';
    const resultsDiv = document.getElementById('search-results');
    const heroLogo = document.getElementById('search-fiat-logo');
    const clearBtn = document.getElementById('search-clear-btn');

    if (clearBtn && input) {
        if (input.value.length > 0) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
    }

    removeHighlights();
    resultsDiv.innerHTML = '';

    // لا يبدأ البحث إلا بعد كتابة الحرف الثالث في الكلمة (3 أحرف أو أكثر)
    if (!query || query.length < 3) {
        if (heroLogo) heroLogo.classList.remove('hidden');
        return;
    }
    if (heroLogo) heroLogo.classList.add('hidden');
    let results = [];
    // ابحث في جميع الأقسام النشطة
    ['opt2', 'opt22', 'opt3', 'opt44', 'opt5'].forEach(secId => {
        const sec = document.getElementById(secId);
        if (!sec) return;

        const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent || '';
            const qLower = query.toLowerCase();
            const tLower = text.toLowerCase();
            let from = 0;
            while (true) {
                const idx = tLower.indexOf(qLower, from);
                if (idx === -1) break;

                const sideItem = Array.from(document.querySelectorAll('.side-item')).find(item => item.getAttribute('data-target') === secId);
                const navName = sideItem ? sideItem.textContent : secId;

                let isFaqAnswer = false;
                let faqItem = null;
                if (secId === 'opt3') {
                    let parent = node.parentElement;
                    while (parent) {
                        if (parent.classList && parent.classList.contains('faq-answer')) {
                            isFaqAnswer = true;
                            faqItem = parent.closest('.faq-item');
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }

                let container = node.parentElement;

                const cell = container && container.closest ? container.closest('td,th') : null;
                if (cell) {
                    container = cell;
                } else {
                    const closer = container && container.closest ? container.closest('p,div,li,dt,dd,blockquote,section,article') : null;
                    if (closer) container = closer;
                }

                let tabPanelEl = null;
                let tabPanelId = null;
                if (node.parentElement && node.parentElement.closest) {
                    tabPanelEl = node.parentElement.closest('.tab-panel');
                    if (tabPanelEl && tabPanelEl.id) {
                        tabPanelId = tabPanelEl.id;
                    }
                }

                let absoluteIndex = 0;
                if (container) {
                    const tw = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
                    let n;
                    while (n = tw.nextNode()) {
                        if (n === node) {
                            absoluteIndex += idx;
                            break;
                        }
                        absoluteIndex += (n.textContent || '').length;
                    }
                }
                results.push({
                    section: secId,
                    node: node,
                    idx: idx,
                    text: text,
                    navName: navName,
                    isFaqAnswer: isFaqAnswer,
                    faqItem: faqItem,
                    container: container,
                    absIdx: absoluteIndex,
                    tabPanelId: tabPanelId
                });
                from = idx + qLower.length;
            }
        }
    });
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="color:red;">لا توجد نتائج</div>';
        return;
    }

    const breakers = ['\n', '\r', '.', '!', '?', '؟', '،', ',', '؛'];
    function getLinePreview(text, matchIndex) {
        if (!text || matchIndex == null || matchIndex < 0) return text || '';
        const findLast = (str, until) => {
            let last = 0;
            breakers.forEach(b => {
                const idx = str.lastIndexOf(b, until);
                if (idx > last) last = idx + 1;
            });
            return last;
        };
        const findNext = (str, from) => {
            let next = str.length;
            breakers.forEach(b => {
                const idx = str.indexOf(b, from);
                if (idx !== -1 && idx < next) next = idx;
            });
            return next;
        };
        const start = findLast(text, matchIndex);
        const end = findNext(text, matchIndex);
        return text.substring(start, end).replace(/\s+/g, ' ').trim();
    }


    results.forEach((res, i) => {
        const btnId = 'go-result-' + i;
        const line = getLinePreview(res.text, res.idx);
        const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const highlighted = line.replace(new RegExp(safe, 'ig'), m => `<mark>${m}</mark>`);
        const secLabel = `<span class=\"search-sec-label\">${res.navName}</span>`;
        const resultHtml = `<div style=\"margin:8px 0;\">${secLabel} <span class=\"search-result-text\">${highlighted}</span> <button id=\"${btnId}\">Go</button></div>`;
        resultsDiv.insertAdjacentHTML('beforeend', resultHtml);

        res.preview = line;
    });

    results.forEach((res, i) => {
        document.getElementById('go-result-' + i).addEventListener('click', function () {

            const currentActiveSection = document.querySelector('.section.active');
            if (currentActiveSection) {
                scrollPositions[currentActiveSection.id] = window.scrollY;
            }


            sideItems.forEach(item => {
                if (item.getAttribute('data-target') === res.section) {
                    item.click();
                }
            });

            if (res.isFaqAnswer && res.faqItem) {
                res.faqItem.classList.add('active');
            }

            if (res.tabPanelId) {
                const targetBtn = document.querySelector('.tab-btn[data-tab="' + res.tabPanelId + '"]');
                if (targetBtn) {
                    targetBtn.click();
                }
            }

            let scope = res.container || (res.isFaqAnswer && res.faqItem ? res.faqItem.querySelector('.faq-answer') : document.getElementById(res.section));

            if (res.tabPanelId) {
                const specificPanel = document.getElementById(res.tabPanelId);
                if (specificPanel) scope = specificPanel;
            }
            const cellScope = res.node && res.node.parentElement && res.node.parentElement.closest ? res.node.parentElement.closest('td,th') : null;
            if (cellScope) scope = cellScope;
            showElementAndParents(scope);

            const delay = 200;
            setTimeout(() => {
                removeHighlights();

                const q = document.getElementById('search-input').value.trim();
                const tw = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null, false);
                let n;
                let targetNode = null;
                let localIdx = -1;

                if (res.preview) {
                    while (n = tw.nextNode()) {
                        const text = n.textContent || '';
                        const idxInNode = text.toLowerCase().indexOf(q.toLowerCase());
                        if (idxInNode !== -1) {
                            const candidatePreview = getLinePreview(text, idxInNode).replace(/\s+/g, ' ').trim();
                            const storedPreview = res.preview.replace(/\s+/g, ' ').trim();
                            if (candidatePreview.toLowerCase() === storedPreview.toLowerCase()) {
                                targetNode = n;
                                localIdx = idxInNode;
                                break;
                            }
                        }
                    }
                }

                if (!targetNode) {
                    let remaining = res.absIdx;
                    const tw2 = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null, false);
                    let n2;
                    while (n2 = tw2.nextNode()) {
                        const len = (n2.textContent || '').length;
                        if (remaining <= len) {
                            targetNode = n2;
                            localIdx = remaining;
                            break;
                        }
                        remaining -= len;
                    }
                }
                let span = null;
                if (targetNode) {
                    const text = targetNode.textContent || '';
                    const searchFrom = Math.max(0, localIdx);
                    const idx = text.toLowerCase().indexOf(q.toLowerCase(), searchFrom);
                    const start = idx !== -1 ? idx : -1;
                    if (start !== -1) {
                        const before = text.substring(0, start);
                        const match = text.substring(start, start + q.length);
                        const after = text.substring(start + q.length);
                        span = document.createElement('span');
                        span.className = 'search-highlight';
                        span.style.background = '#EAA023';
                        span.style.color = '#fff';
                        span.style.borderRadius = '3px';
                        span.style.padding = '0 2px';
                        span.textContent = match;
                        const frag = document.createDocumentFragment();
                        if (before) frag.appendChild(document.createTextNode(before));
                        frag.appendChild(span);
                        if (after) frag.appendChild(document.createTextNode(after));
                        targetNode.parentNode.replaceChild(frag, targetNode);
                    }
                }

                if (!span) {
                    span = highlightFirstMatchWithin(scope, q);
                }
                if (span) {

                    const newScrollPosition = span.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
                    scrollPositions[res.section] = newScrollPosition;
                    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, delay);
        });
    });
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


const debouncedSearch = debounce(performSearch, 300);
const searchInputEl = document.getElementById('search-input');
const searchClearBtnEl = document.getElementById('search-clear-btn');

function updateSearchClearBtn() {
    if (!searchClearBtnEl || !searchInputEl) return;
    if (searchInputEl.value.length > 0) {
        searchClearBtnEl.classList.add('visible');
    } else {
        searchClearBtnEl.classList.remove('visible');
    }
}

if (searchInputEl) {
    searchInputEl.addEventListener('input', function () {
        updateSearchClearBtn();
        debouncedSearch();
    });
}

if (searchClearBtnEl && searchInputEl) {
    searchClearBtnEl.addEventListener('click', function (e) {
        e.preventDefault();
        searchInputEl.value = '';
        updateSearchClearBtn();
        searchInputEl.focus();
        performSearch();
    });
}


document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
        const item = btn.parentElement;
        item.classList.toggle('active');
    });
});



(function () {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;
    function toggleBackBtn() {
        if (window.scrollY > 300) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', toggleBackBtn, { passive: true });
    toggleBackBtn();
    backBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();




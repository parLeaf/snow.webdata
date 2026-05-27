let currentFilter = 'all';

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    let filtered = eventsData.filter(ev => currentFilter === 'all' || ev.type === currentFilter);
    filtered.sort((a,b)=> new Date(a.start) - new Date(b.start));
    container.innerHTML = filtered.map(ev => {
        const year = ev.start ? ev.start.slice(0,4) : '';
        return `
        <div class="timeline-item" data-location="${ev.location}">
            <div class="timeline-date">${year} <span class="importance">${ev.importance}</span></div>
            <div class="timeline-title">${ev.name}</div>
            <div class="timeline-desc">${ev.desc}</div>
            <div style="font-size:0.8rem; margin-top:6px;">📍 ${ev.location} &nbsp;| 类型: ${ev.type}</div>
            <button class="timeline-btn" data-loc="${ev.location}">🗺️ 查看地图</button>
        </div>`;
    }).join('');
    
    document.querySelectorAll('.timeline-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const loc = btn.getAttribute('data-loc');
            window.location.href = `map.html?highlight=${encodeURIComponent(loc)}`;
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const targetLoc = urlParams.get('location');
    if (targetLoc) {
        setTimeout(() => {
            const items = document.querySelectorAll('.timeline-item');
            for (let item of items) {
                if (item.getAttribute('data-location') === targetLoc) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    item.style.boxShadow = '0 0 0 3px #e0b354';
                    setTimeout(() => item.style.boxShadow = '', 2000);
                    break;
                }
            }
        }, 300);
    }
}

function bindFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            currentFilter = btn.getAttribute('data-filter');
            renderTimeline();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindFilters();
    renderTimeline();
});
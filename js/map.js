let mapInstance = null;
let markers = [];

function initMap() {
    if (mapInstance) mapInstance.remove();
    // 使用 OpenStreetMap 标准瓦片（稳定）
    mapInstance = L.map('map').setView([35.0, 110.0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
        maxZoom: 19,
        minZoom: 4
    }).addTo(mapInstance);

    // 使用标准 Leaflet 图标（避免 CDN 失效）
    const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // 红色图标（使用不同 CDN 备用）
    const redIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const greenIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    locations.forEach(loc => {
        let icon = defaultIcon;
        if (loc.type === "重大事件") icon = redIcon;
        else if (loc.type === "途经") icon = greenIcon;
        // 长期居住使用默认蓝色

        const marker = L.marker([loc.lat, loc.lng], { icon: icon }).addTo(mapInstance);
        
        const relatedEvents = eventsData.filter(ev => ev.location === loc.name);
        let popupContent = `<b>${loc.name}</b><br/>${loc.desc}<br/><br/><b>📅 相关事件:</b><ul>`;
        if (relatedEvents.length === 0) {
            popupContent += `<li>无直接关联事件</li>`;
        } else {
            relatedEvents.forEach(ev => {
                const year = ev.start ? ev.start.slice(0,4) : '';
                popupContent += `<li><strong>${ev.name}</strong> (${year})<br/>${ev.desc.substring(0,60)}...</li>`;
            });
        }
        popupContent += `</ul><button class="loc-jump" data-loc="${loc.name}" style="margin-top:8px; padding:4px 10px; background:#e0b354; border:none; border-radius:20px; cursor:pointer;">🔍 查看时间轴</button>`;
        marker.bindPopup(popupContent);
        
        let tooltipText = `${loc.name}\n`;
        if (relatedEvents.length > 0) {
            tooltipText += relatedEvents.map(ev => ev.name).join(' · ');
        } else {
            tooltipText += '重要途经地';
        }
        marker.bindTooltip(tooltipText, { sticky: true, direction: 'top' });
        
        marker.on('popupopen', () => {
            document.querySelectorAll('.loc-jump').forEach(btn => {
                btn.onclick = () => {
                    window.location.href = `timeline.html?location=${encodeURIComponent(btn.getAttribute('data-loc'))}`;
                };
            });
        });
        markers.push(marker);
    });

    // 侧边栏事件列表
    const container = document.getElementById('dynamicEventsList');
    if (container) {
        container.innerHTML = eventsData.map(ev => {
            const year = ev.start ? ev.start.slice(0,4) : '';
            return `
            <div class="loc-event-item" data-location="${ev.location}">
                <div class="loc-event-name">📌 ${ev.name} · ${year}</div>
                <div class="loc-event-desc">${ev.desc.substring(0,80)}...</div>
                <div style="font-size:0.7rem; color:#946b3a;">📍 ${ev.location}</div>
            </div>`;
        }).join('');
        document.querySelectorAll('.loc-event-item').forEach(el => {
            el.addEventListener('click', () => {
                const loc = el.getAttribute('data-location');
                window.location.href = `timeline.html?location=${encodeURIComponent(loc)}`;
            });
        });
    }

    // 处理 URL 参数高亮
    const urlParams = new URLSearchParams(window.location.search);
    const highlightLoc = urlParams.get('highlight');
    if (highlightLoc) {
        setTimeout(() => {
            const target = locations.find(l => l.name === highlightLoc);
            if (target) {
                mapInstance.setView([target.lat, target.lng], 7);
                const marker = markers.find((m, idx) => locations[idx].name === highlightLoc);
                if (marker) marker.openPopup();
            } else {
                console.warn(`地点 "${highlightLoc}" 未找到，无法高亮`);
            }
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', initMap);
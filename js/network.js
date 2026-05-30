function initNetwork() {
    const chartDom = document.getElementById('relationChart');
    if (!chartDom) return;
    if (typeof echarts === 'undefined') {
        chartDom.innerHTML = '<div style="color:red; text-align:center;">ECharts 加载失败，请检查网络。</div>';
        return;
    }
    const myChart = echarts.init(chartDom);
    const colorMap = {
        center: '#6b8c6b',
        china_friend: '#b32d2d',
        foreign_friend: '#5a7d9a',
        opponent: '#b55b2c',
        other: '#c0a375'
    };
    
    // 全量数据
    let allNodes = persons.map(p => ({
        name: p.name,
        symbolSize: p.name === '埃德加·斯诺' ? 46 : 28,
        itemStyle: { color: colorMap[p.colorGroup] || '#999' },
        bio: p.bio,
        original_text: p.original_text || '（暂无原文摘录）',
        colorGroup: p.colorGroup
    }));
    const allLinks = relations.map(r => ({ source: r.source, target: r.target, label: r.relation }));
    
    function renderNetwork(filterGroup = 'all') {
        let filteredNodes = allNodes;
        if (filterGroup !== 'all') {
            filteredNodes = allNodes.filter(node => node.colorGroup === filterGroup || node.name === '埃德加·斯诺'); // 始终保留中心人物
        }
        // 同时过滤 links，只保留两端节点都在 filteredNodes 中的边
        const filteredNodeNames = new Set(filteredNodes.map(n => n.name));
        const filteredLinks = allLinks.filter(link => filteredNodeNames.has(link.source) && filteredNodeNames.has(link.target));
        
        myChart.setOption({
            title: { text: '斯诺与中国友人·关系图谱', left: 'center', textStyle: { color: '#1e1e1e' } },
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    if (params.data.label) {
                        return `${params.data.source} → ${params.data.target}<br/>关系：${params.data.label}`;
                    }
                    return `${params.name}<br/>${params.data.bio || ''}<br/><span style="color:#b32d2d;">点击查看原文</span>`;
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                force: { repulsion: 500, edgeLength: 150, gravity: 0.05, friction: 0.1 }, // 降低物理运动，更静态
                roam: true,
                label: { show: true, position: 'right', fontSize: 11, color: '#1e1e1e' },
                edgeLabel: { show: true, formatter: (p) => p.data.label, fontSize: 9, offset: [0, -10] },
                data: filteredNodes,
                links: filteredLinks,
                lineStyle: { color: '#aaa', curveness: 0.2, width: 1.5 },
                emphasis: { scale: true }
            }]
        });
        
        // 绑定点击事件
        myChart.off('click'); // 移除旧监听
        myChart.on('click', (params) => {
            if (params.dataType === 'node') {
                const nodeData = params.data;
                const originalText = nodeData.original_text || '（该书未收录该人物的直接原文）';
                showOriginalTextModal(originalText);
            }
        });
    }
    
    // 添加筛选下拉框
    const legendDiv = document.querySelector('.legend');
    if (legendDiv) {
        const selectHtml = `
            <div style="margin-left: auto;">
                <label for="group-filter">筛选角色：</label>
                <select id="group-filter" style="padding: 4px 8px; border-radius: 20px; border: 1px solid #ccc;">
                    <option value="all">全部</option>
                    <option value="center">中心人物</option>
                    <option value="china_friend">中共友人</option>
                    <option value="foreign_friend">外国友人</option>
                    <option value="opponent">政治对手</option>
                    <option value="other">其他</option>
                </select>
            </div>
        `;
        legendDiv.insertAdjacentHTML('beforeend', selectHtml);
        document.getElementById('group-filter').addEventListener('change', (e) => {
            renderNetwork(e.target.value);
        });
    }
    
    renderNetwork('all');
    window.addEventListener('resize', () => myChart.resize());
}

// 复用之前的模态框函数（已在 timeline.js 中定义，为避免重复，可以放到全局）
// 如果当前没有 showOriginalTextModal，则定义一次（在 network.js 中也定义，或者单独提取到公共 js）
if (typeof window.showOriginalTextModal !== 'function') {
    window.showOriginalTextModal = function(text) {
        let existingModal = document.getElementById('original-modal');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.id = 'original-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:10000;';
        modal.innerHTML = `
            <div style="background:#fff; max-width:600px; width:90%; border-radius:16px; padding:20px; box-shadow:0 8px 24px rgba(0,0,0,0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <h3 style="color:#b32d2d; margin:0;">📖 原文摘录</h3>
                    <button id="close-modal-btn" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                </div>
                <div style="max-height:60vh; overflow-y:auto; margin-top:16px; font-family:Georgia, serif; line-height:1.5; white-space:pre-wrap;">${text}</div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-modal-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    };
}

document.addEventListener('DOMContentLoaded', initNetwork);
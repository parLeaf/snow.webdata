
function initNetwork() {
    const chartDom = document.getElementById('relationChart');
    if (!chartDom) return;
    if (typeof echarts === 'undefined') {
        chartDom.innerHTML = '<div style="color:red; text-align:center;">ECharts 加载失败，请检查网络。</div>';
        return;
    }
    const myChart = echarts.init(chartDom);
    const colorMap = {
        center: '#b32d2d',
        china_friend: '#6b8c6b',
        foreign_friend: '#5a7d9a',
        opponent: '#b55b2c'
    };
    const nodes = persons.map(p => ({
        name: p.name,
        symbolSize: p.name === '埃德加·斯诺' ? 46 : 28,
        itemStyle: { color: colorMap[p.colorGroup] || '#999' },
        bio: p.bio
    }));
    const links = relations.map(r => ({ source: r.source, target: r.target, label: r.relation }));

    myChart.setOption({
        title: { text: '斯诺与中国友人·关系图谱', left: 'center', textStyle: { color: '#1e1e1e' } },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.data.label) {
                    return `${params.data.source} → ${params.data.target}<br/>关系：${params.data.label}`;
                }
                return `${params.name}<br/>${params.data.bio || ''}`;
            }
        },
        series: [{
            type: 'graph', layout: 'force', force: { repulsion: 500, edgeLength: 150, gravity: 0.1 },
            roam: true, label: { show: true, position: 'right', fontSize: 11, color: '#1e1e1e' },
            edgeLabel: { show: true, formatter: (p) => p.data.label, fontSize: 9, offset: [0, -10] },
            data: nodes, links: links, lineStyle: { color: '#aaa', curveness: 0.2, width: 1.5 },
            emphasis: { scale: true }
        }]
    });
    window.addEventListener('resize', () => myChart.resize());
}

document.addEventListener('DOMContentLoaded', initNetwork);
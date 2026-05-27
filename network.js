function initNetwork() {
    const chartDom = document.getElementById('relationChart');
    if (!chartDom) return;
    const myChart = echarts.init(chartDom);
    const colorMap = {
        center: '#b14732',
        china_friend: '#2c7a47',
        foreign_friend: '#2c7aa0',
        opponent: '#b55b2c'
    };
    const nodes = persons.map(p => ({
        name: p.name,
        symbolSize: p.name === '埃德加·斯诺' ? 46 : 28,
        itemStyle: { color: colorMap[p.colorGroup] || '#c0a375' },
        bio: p.bio  // 存储简介
    }));
    const links = relations.map(r => ({ source: r.source, target: r.target, label: r.relation }));

    myChart.setOption({
        title: { text: '斯诺与中国友人·关系图谱', left: 'center' },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.data.label) {
                    return `${params.data.source} → ${params.data.target}<br/>关系：${params.data.label}`;
                }
                // 人物节点：显示姓名和简介
                return `${params.name}<br/>${params.data.bio || ''}`;
            }
        },
        series: [{
            type: 'graph', layout: 'force', force: { repulsion: 350, edgeLength: 130, gravity: 0.1 },
            roam: true, label: { show: true, position: 'right', fontSize: 11 },
            edgeLabel: { show: true, formatter: (p) => p.data.label, fontSize: 9, offset: [0, -10] },
            data: nodes, links: links, lineStyle: { color: '#b0a07c', curveness: 0.2, width: 1.5 },
            emphasis: { scale: true }
        }]
    });
    window.addEventListener('resize', () => myChart.resize());
}

document.addEventListener('DOMContentLoaded', initNetwork);
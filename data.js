// 地点数据（含经纬度、类型、描述）
const locations = [
    { id: "L001", name: "上海", lat: 31.2304, lng: 121.4737, type: "长期居住", desc: "斯诺1928年抵华首站，记者生涯起点。" },
    { id: "L002", name: "北京", lat: 39.9042, lng: 116.4074, type: "长期居住", desc: "燕京大学任教，参与一二·九运动。" },
    { id: "L004", name: "萨拉齐", lat: 40.7273, lng: 111.0959, type: "重大事件", desc: "觉醒点，目睹大饥荒，改变人生观。" },
    { id: "L075", name: "西安", lat: 34.3416, lng: 108.9398, type: "重大事件", desc: "西安事变发生地，斯诺进入红区的咽喉。" },
    { id: "L076", name: "保安", lat: 36.8236, lng: 108.772, type: "重大事件", desc: "1936年采访毛泽东的窑洞。" },
    { id: "L078", name: "延安", lat: 36.5853, lng: 109.4898, type: "重大事件", desc: "红色首都，斯诺重访与毛泽东长谈。" },
    { id: "L007", name: "南京", lat: 32.0603, lng: 118.7969, type: "途经", desc: "国民政府首都，斯诺采访蒋介石。" },
    { id: "L009", name: "沈阳", lat: 41.8057, lng: 123.4315, type: "重大事件", desc: "九一八事变爆发地。" },
    { id: "L042", name: "昆明", lat: 25.0389, lng: 102.7183, type: "途经", desc: "云南之旅，见识军阀割据。" },
    { id: "L071", name: "汉口", lat: 30.5963, lng: 114.3015, type: "途经", desc: "抗战初期工合总部，斯诺推动合作社。" },
    { id: "L094", name: "重庆", lat: 29.563, lng: 106.5516, type: "途经", desc: "战时陪都，报道国民党腐败。" },
    { id: "L038", name: "香港", lat: 22.3193, lng: 114.1694, type: "途经", desc: "离开中国的最后一站。" },
    // 新增地点以匹配事件
    { id: "L113", name: "泾县", lat: 30.688, lng: 118.419, type: "重大事件", desc: "皖南事变发生地，新四军被伏击。" }
];

// 事件数据（修正 location 以匹配地点）
const eventsData = [
    { name: "西安事变", type: "政治事件", start: "1936-12-12", importance: "极高", desc: "张学良扣押蒋介石，逼其抗日，促成国共第二次合作。", location: "西安" },
    { name: "皖南事变", type: "政治事件", start: "1941-01-01", importance: "高", desc: "国民党伏击新四军，抗日统一战线濒临破裂。", location: "泾县" },
    { name: "一·二八事变", type: "战争", start: "1932-01-28", importance: "高", desc: "日军进攻上海，十九路军英勇抵抗，斯诺亲历报道。", location: "上海" },
    { name: "九一八事变", type: "战争", start: "1931-09-18", importance: "高", desc: "日本关东军炸毁南满铁路，侵占东北。", location: "沈阳" },
    { name: "一二·九学生运动", type: "社会运动", start: "1935-12-09", importance: "极高", desc: "北平学生抗日示威，斯诺夫妇参与支持，拉开全国抗日救亡序幕。", location: "北京" },
    { name: "红军长征", type: "军事行动", start: "1934-10-16", importance: "极高", desc: "战略转移，保存革命火种，斯诺在《西行漫记》中详述。", location: "保安" },
    { name: "斯诺红区之行", type: "历史事件", start: "1936-06-01", importance: "极高", desc: "斯诺突破封锁到达保安，采访毛泽东等领导人。", location: "保安" },
    { name: "西北大饥荒", type: "自然灾害", start: "1929-06-01", importance: "高", desc: "萨拉齐饥荒，斯诺觉醒点，写下《拯救二十五万生灵》。", location: "萨拉齐" },
    { name: "抗日战争全面爆发", type: "战争", start: "1937-07-07", importance: "极高", desc: "卢沟桥事变，斯诺投身报道，坚信中国必胜。", location: "北京" },
    { name: "工合运动兴起", type: "社会运动", start: "1938-04-01", importance: "高", desc: "斯诺与艾黎创办工业合作社，支援抗战。", location: "上海" },
    { name: "淞沪会战", type: "战争", start: "1937-08-13", importance: "高", desc: "斯诺目睹租界外惨烈战况，向世界发出报道。", location: "上海" },
    { name: "卡尔逊访问延安", type: "历史事件", start: "1937-12-01", importance: "中", desc: "美国军官卡尔逊经斯诺协助赴延安考察。", location: "延安" }
];

// 人物关系数据（不变）
const persons = [
    { name: "埃德加·斯诺", type: "center", bio: "首位深入红区的美国记者", colorGroup: "center" },
    { name: "毛泽东", type: "china_friend", bio: "中共领袖，接受斯诺专访", colorGroup: "china_friend" },
    { name: "周恩来", type: "china_friend", bio: "东线红军指挥，统一战线关键", colorGroup: "china_friend" },
    { name: "宋庆龄", type: "china_friend", bio: "孙中山夫人，保卫同盟领袖", colorGroup: "china_friend" },
    { name: "蒋介石", type: "opponent", bio: "国民政府领导人", colorGroup: "opponent" },
    { name: "张学良", type: "china_friend", bio: "东北军少帅，西安事变发动者", colorGroup: "china_friend" },
    { name: "路易·艾黎", type: "foreign_friend", bio: "工合运动创始人", colorGroup: "foreign_friend" },
    { name: "约翰·本杰明·鲍威尔", type: "foreign_friend", bio: "密勒氏评论报主编", colorGroup: "foreign_friend" },
    { name: "伊万斯·卡尔逊", type: "foreign_friend", bio: "美军上校，访延安", colorGroup: "foreign_friend" },
    { name: "鲁迅", type: "china_friend", bio: "文学巨匠，左翼导师", colorGroup: "china_friend" },
    { name: "朱德", type: "china_friend", bio: "红军总司令", colorGroup: "china_friend" },
    { name: "叶挺", type: "china_friend", bio: "新四军军长", colorGroup: "china_friend" },
    { name: "邓颖超", type: "china_friend", bio: "周恩来夫人，妇女领袖", colorGroup: "china_friend" },
    { name: "司徒雷登", type: "foreign_friend", bio: "燕京大学校长", colorGroup: "foreign_friend" },
    { name: "宋美龄", type: "opponent", bio: "蒋介石夫人", colorGroup: "opponent" }
];

const relations = [
    { source: "埃德加·斯诺", target: "毛泽东", relation: "深度采访 / 传记撰写" },
    { source: "埃德加·斯诺", target: "周恩来", relation: "友谊 / 长期联络" },
    { source: "埃德加·斯诺", target: "宋庆龄", relation: "挚友 / 革命引路人" },
    { source: "埃德加·斯诺", target: "路易·艾黎", relation: "工合合作 / 终生战友" },
    { source: "埃德加·斯诺", target: "鲁迅", relation: "文坛知音 / 编译《活的中国》" },
    { source: "埃德加·斯诺", target: "张学良", relation: "采访 / 西安事变报道" },
    { source: "埃德加·斯诺", target: "蒋介石", relation: "政治对立 / 批评" },
    { source: "埃德加·斯诺", target: "约翰·本杰明·鲍威尔", relation: "恩师 / 编辑领路人" },
    { source: "埃德加·斯诺", target: "伊万斯·卡尔逊", relation: "挚友 / 工合支持" },
    { source: "毛泽东", target: "朱德", relation: "革命战友" },
    { source: "周恩来", target: "邓颖超", relation: "夫妻 / 革命伴侣" },
    { source: "周恩来", target: "叶挺", relation: "军事协作" },
    { source: "宋庆龄", target: "宋美龄", relation: "姐妹 / 政见分歧" },
    { source: "张学良", target: "蒋介石", relation: "兵谏 / 西安事变" }
];
"""
八字命理分析命令接口模块
提供命令行和函数接口
"""

import re
from datetime import datetime
from typing import Dict, Optional, Tuple
from bazi_core import calculate_bazi, analyze_geju
from bazi_analyzer import generate_report
from bazi_storage import save_bazi_record, query_bazi_record, list_bazi_records

class BaziCommandHandler:
    """八字命令处理器"""
    
    def __init__(self):
        self.current_bazi = None  # 当前排盘结果
    
    def parse_datetime(self, text: str) -> Optional[Tuple[int, int, int, int, int]]:
        """
        解析日期时间字符串
        支持格式：
        - 1997年11月4日18:30
        - 1997-11-04 18:30
        - 1997/11/04 18:30
        - 农历1997年11月4日18:30
        """
        # 移除"农历"前缀以便解析
        text_clean = text.replace('农历', '').replace('公历', '')
        
        patterns = [
            r'(\d{4})年(\d{1,2})月(\d{1,2})日(\d{1,2}):(\d{2})',
            r'(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})',
            r'(\d{4})/(\d{1,2})/(\d{1,2})\s+(\d{1,2}):(\d{2})',
            r'(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text_clean)
            if match:
                year, month, day, hour, minute = map(int, match.groups())
                return year, month, day, hour, minute
        return None
    
    def parse_city(self, text: str) -> str:
        """从文本中解析城市"""
        # 常见城市列表
        cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '重庆', 
                  '武汉', '西安', '天津', '苏州', '郑州', '长沙', '沈阳', '青岛',
                  '宁波', '东莞', '无锡', '佛山', '济南', '哈尔滨', '长春', '石家庄',
                  '南宁', '昆明', '南昌', '贵阳', '福州', '厦门', '乌鲁木齐', '兰州',
                  '海口', '聊城', '太原', '合肥']
        
        for city in cities:
            if city in text:
                return city
        return '北京'  # 默认北京
    
    def parse_gender(self, text: str) -> str:
        """解析性别"""
        if '女' in text:
            return '女'
        return '男'  # 默认男
    
    def cmd_paipan(self, args: str) -> str:
        """
        排盘命令
        格式：排盘 1997年11月4日18:30 山东聊城 [男/女]
        """
        # 解析日期时间
        dt = self.parse_datetime(args)
        if not dt:
            return "❌ 无法解析日期时间，请使用格式：1997年11月4日18:30"
        
        year, month, day, hour, minute = dt
        city = self.parse_city(args)
        gender = self.parse_gender(args)
        
        # 判断公历/农历
        calendar = '农历' if '农历' in args else '公历'
        
        try:
            # 计算八字
            self.current_bazi = calculate_bazi(year, month, day, hour, minute, city, gender, calendar)
            
            # 生成简要输出
            bazi = self.current_bazi['bazi']
            result = f"""## 🎯 八字排盘结果

**出生信息**：{year}年{month}月{day}日 {hour:02d}:{minute:02d}（{calendar}）
**出生地**：{city}
**性别**：{gender}
**真太阳时**：{self.current_bazi['input']['true_solar_time']}

### 四柱八字

| 柱位 | 年柱 | 月柱 | 日柱 | 时柱 |
|------|------|------|------|------|
| **天干** | {bazi['year']['gan']} | {bazi['month']['gan']} | **{bazi['day']['gan']}** | {bazi['hour']['gan']} |
| **地支** | {bazi['year']['zhi']} | {bazi['month']['zhi']} | {bazi['day']['zhi']} | {bazi['hour']['zhi']} |

### 日主信息

- **日主**：{self.current_bazi['day_master']['gan']}（{self.current_bazi['day_master']['wuxing']}，{self.current_bazi['day_master']['yinyang']}）
- **强弱**：{self.current_bazi['day_master_analysis']['strength']}
- **喜用神**：{'、'.join(self.current_bazi['xiyongshen']['xiyongshen'])}

### 五行分布

"""
            for wx, count in sorted(self.current_bazi['wuxing_count'].items(), key=lambda x: x[1], reverse=True):
                bar = '█' * int(count)
                result += f"- {wx}：{bar} ({count:.1f})\n"
            
            result += """
💡 提示：使用以下命令获取详细分析
- `分析事业财运` - 事业财运分析
- `查看大运` - 大运流年分析
- `完整分析` - 生成完整报告
- `保存八字档案 姓名` - 保存当前八字
"""
            return result
            
        except Exception as e:
            return f"❌ 排盘失败：{str(e)}"
    
    def cmd_analyze_career(self, args: str) -> str:
        """分析事业财运"""
        if not self.current_bazi:
            return "❌ 请先进行排盘，使用命令：`排盘 出生时间 出生地`"
        
        bazi = self.current_bazi['bazi']
        xiyongshen = self.current_bazi['xiyongshen']['xiyongshen']
        day_master = self.current_bazi['day_master']['wuxing']
        
        from bazi_core import WUXING_KE, WUXING_SHENG
        
        # 分析官杀（事业）
        guansha_wuxing = None
        for wx, ke in WUXING_KE.items():
            if ke == day_master:
                guansha_wuxing = wx
                break
        
        has_guansha = any(guansha_wuxing == bazi[zhu]['gan'] for zhu in ['year', 'month', 'hour'])
        
        # 分析财星
        cai_wuxing = WUXING_SHENG.get(day_master)
        has_cai = any(cai_wuxing == bazi[zhu]['gan'] for zhu in ['year', 'month', 'hour'])
        
        result = f"""## 💼 事业财运分析

### 事业格局

"""
        if guansha_wuxing in xiyongshen:
            result += """✅ **官杀为喜用** - 事业运势佳
- 有管理才能，适合担任领导职务
- 贵人运好，易得提携
- **建议**：把握机会，勇于承担责任，可向管理层发展
"""
        else:
            result += """⚠️ **官杀不为喜用** - 事业压力较大
- 管理事务易有压力，与上司关系需注意
- **建议**：以技术或专业路线为主，深耕专业领域
"""
        
        result += "\n### 财运分析\n\n"
        if cai_wuxing in xiyongshen:
            result += """✅ **财星为喜用** - 财运较佳
- 有偏财运，适合投资理财
- 财源广进，收入稳定
- **建议**：把握财运年份，适度投资，注意风险分散
"""
        else:
            result += """⚠️ **财星不为喜用** - 求财较辛苦
- 财运起伏较大，需稳健理财
- **建议**：避免高风险投资，以储蓄为主，量入为出
"""
        
        result += "\n### 最佳行业方向\n\n"
        for wx in xiyongshen[:2]:
            if wx == '金':
                result += "- 🏦 **金**：金融、科技、机械、汽车、五金、珠宝\n"
            elif wx == '木':
                result += "- 📚 **木**：教育、文化、出版、服装、林业、医药\n"
            elif wx == '水':
                result += "- 🚢 **水**：物流、贸易、旅游、水利、饮料、传媒\n"
            elif wx == '火':
                result += "- ⚡ **火**：能源、餐饮、电子、传媒、美容、照明\n"
            elif wx == '土':
                result += "- 🏠 **土**：房地产、建筑、农业、矿产、仓储、陶瓷\n"
        
        # 大运分析
        dayun_info = self.current_bazi['dayun']
        result += f"""
### 大运提示

- **起运方向**：{dayun_info['direction']}排
- **起运年龄**：{dayun_info['qiyun_age']:.1f}岁

**当前/即将进入的大运**：
"""
        for dy in dayun_info['dayun'][:3]:
            dayun_wuxing = dy['wuxing'][0]
            status = "✅ 吉运" if dayun_wuxing in xiyongshen else "⚠️ 平运"
            result += f"- {dy['step']}. {dy['ganzhi']}（{dy['wuxing']}）{dy['start_age']:.0f}-{dy['end_age']:.0f}岁 {status}\n"
        
        return result
    
    def cmd_dayun(self, args: str) -> str:
        """查看大运"""
        if not self.current_bazi:
            return "❌ 请先进行排盘，使用命令：`排盘 出生时间 出生地`"
        
        dayun_info = self.current_bazi['dayun']
        xiyongshen = self.current_bazi['xiyongshen']['xiyongshen']
        
        result = f"""## 🎋 大运分析

### 大运基本信息

- **起运方向**：{dayun_info['direction']}排
- **起运年龄**：{dayun_info['qiyun_age']:.1f}岁

### 大运列表

| 步数 | 干支 | 五行 | 年龄 | 吉凶 | 简评 |
|------|------|------|------|------|------|
"""
        for dy in dayun_info['dayun']:
            dayun_wuxing = dy['wuxing'][0]
            if dayun_wuxing in xiyongshen:
                jixiong = "✅ 吉"
                pingjia = "利事业财运"
            else:
                jixiong = "⚠️ 平"
                pingjia = "宜守成"
            result += f"| {dy['step']} | {dy['ganzhi']} | {dy['wuxing']} | {dy['start_age']:.0f}-{dy['end_age']:.0f}岁 | {jixiong} | {pingjia} |\n"
        
        result += """
### 大运要点

1. **大运重地支** - 地支代表内在环境变化
2. **天干表像** - 天干代表外在表现
3. **用神大运** - 喜用神大运宜进取
4. **忌神大运** - 忌神大运宜守成
"""
        return result
    
    def cmd_full_analysis(self, args: str) -> str:
        """完整分析"""
        if not self.current_bazi:
            return "❌ 请先进行排盘，使用命令：`排盘 出生时间 出生地`"
        
        return generate_report(self.current_bazi)
    
    def cmd_save(self, args: str) -> str:
        """保存八字档案"""
        if not self.current_bazi:
            return "❌ 请先进行排盘，使用命令：`排盘 出生时间 出生地`"
        
        name = args.strip()
        if not name:
            return "❌ 请提供姓名，格式：`保存八字档案 姓名`"
        
        if save_bazi_record(name, self.current_bazi):
            return f"✅ 八字档案「{name}」已保存成功！"
        else:
            return f"❌ 保存失败，请重试"
    
    def cmd_query(self, args: str) -> str:
        """查询档案"""
        name = args.strip()
        if not name:
            # 列出所有档案
            records = list_bazi_records(10)
            if not records:
                return "📂 暂无八字档案"
            
            result = "## 📂 八字档案列表\n\n"
            result += "| ID | 姓名 | 出生时间 | 性别 | 日主 |\n"
            result += "|------|------|----------|------|------|\n"
            for r in records:
                bazi = r['bazi_data']
                input_info = bazi['input']
                day_master = bazi['day_master']['gan']
                result += f"| {r['id']} | {r['name']} | {input_info['birth_time']} | {input_info['gender']} | {day_master} |\n"
            result += "\n💡 使用 `查询档案 姓名` 查看详细内容"
            return result
        
        # 查询具体档案
        record = query_bazi_record(name)
        if not record:
            return f"❌ 未找到「{name}」的八字档案"
        
        self.current_bazi = record['bazi_data']
        bazi = self.current_bazi['bazi']
        
        result = f"""## 📋 八字档案：{record['name']}

**出生时间**：{self.current_bazi['input']['birth_time']}
**出生地**：{self.current_bazi['input']['city']}
**性别**：{self.current_bazi['input']['gender']}
**创建时间**：{record['created_at'][:10]}

### 四柱八字

| 柱位 | 年柱 | 月柱 | 日柱 | 时柱 |
|------|------|------|------|------|
| **天干** | {bazi['year']['gan']} | {bazi['month']['gan']} | **{bazi['day']['gan']}** | {bazi['hour']['gan']} |
| **地支** | {bazi['year']['zhi']} | {bazi['month']['zhi']} | {bazi['day']['zhi']} | {bazi['hour']['zhi']} |

### 命局要点

- **日主**：{self.current_bazi['day_master']['gan']}（{self.current_bazi['day_master']['wuxing']}）
- **强弱**：{self.current_bazi['day_master_analysis']['strength']}
- **喜用神**：{'、'.join(self.current_bazi['xiyongshen']['xiyongshen'])}
- **忌神**：{'、'.join(self.current_bazi['xiyongshen']['jishen'])}
"""
        if record.get('notes'):
            result += f"\n### 备注\n\n{record['notes']}\n"
        
        result += """
💡 提示：
- `分析事业财运` - 查看事业财运分析
- `查看大运` - 查看大运流年
- `完整分析` - 生成完整报告
"""
        return result
    
    def cmd_hehun(self, args: str) -> str:
        """
        合婚分析
        格式：合婚 男方八字 女方八字
        """
        # 简化版合婚分析
        return """## 💕 合婚分析

⚠️ 合婚功能需要两个完整的八字数据。

请按以下步骤操作：
1. `排盘 男方出生时间 出生地 男` - 排出男方八字
2. `保存八字档案 男方姓名` - 保存男方八字
3. `排盘 女方出生时间 出生地 女` - 排出女方八字
4. `保存八字档案 女方姓名` - 保存女方八字
5. `合婚 男方姓名 女方姓名` - 进行合婚分析

（当前版本为简化版，完整合婚分析将在后续版本更新）
"""
    
    def handle(self, command: str) -> str:
        """处理命令"""
        command = command.strip()
        
        # 解析命令和参数
        parts = command.split(maxsplit=1)
        if not parts:
            return "请输入命令"
        
        cmd = parts[0]
        args = parts[1] if len(parts) > 1 else ""
        
        # 命令映射
        handlers = {
            '排盘': self.cmd_paipan,
            '分析事业财运': self.cmd_analyze_career,
            '查看大运': self.cmd_dayun,
            '完整分析': self.cmd_full_analysis,
            '保存八字档案': self.cmd_save,
            '查询档案': self.cmd_query,
            '合婚': self.cmd_hehun,
        }
        
        handler = handlers.get(cmd)
        if handler:
            return handler(args)
        else:
            return f"❌ 未知命令：{cmd}\n可用命令：{', '.join(handlers.keys())}"

# 全局处理器
_handler = None

def get_handler() -> BaziCommandHandler:
    """获取处理器实例"""
    global _handler
    if _handler is None:
        _handler = BaziCommandHandler()
    return _handler

def handle_command(command: str) -> str:
    """处理八字命令"""
    return get_handler().handle(command)

# 便捷函数
def paipan(datetime_str: str, city: str = '北京', gender: str = '男') -> str:
    """排盘便捷函数"""
    cmd = f"排盘 {datetime_str} {city} {gender}"
    return handle_command(cmd)

def analyze(datetime_str: str, city: str = '北京', gender: str = '男') -> str:
    """完整分析便捷函数"""
    paipan(datetime_str, city, gender)
    return handle_command("完整分析")

if __name__ == '__main__':
    # 测试
    print("=== 测试排盘 ===")
    print(handle_command("排盘 1997年11月4日18:30 山东聊城 男"))
    print("\n=== 测试事业财运分析 ===")
    print(handle_command("分析事业财运"))
    print("\n=== 测试查看大运 ===")
    print(handle_command("查看大运"))

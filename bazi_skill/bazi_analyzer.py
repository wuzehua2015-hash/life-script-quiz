"""
八字命理分析报告生成模块
生成标准化的Markdown格式分析报告
"""

from typing import Dict, List
from datetime import datetime
from bazi_core import calculate_bazi, analyze_geju, TIANGAN_WUXING, DIZHI_WUXING

class BaziAnalyzer:
    """八字分析器"""
    
    def __init__(self, bazi_data: Dict):
        self.data = bazi_data
        self.bazi = bazi_data['bazi']
        self.day_master = bazi_data['day_master']
    
    def generate_basic_info(self) -> str:
        """生成基础信息部分"""
        input_info = self.data['input']
        
        md = f"""## 一、基础信息

| 项目 | 内容 |
|------|------|
| 出生时间 | {input_info['birth_time']} |
| 出生地 | {input_info['city']} |
| 性别 | {input_info['gender']} |
| 真太阳时 | {input_info['true_solar_time']} |
| 日主 | {self.day_master['gan']}（{self.day_master['wuxing']}，{self.day_master['yinyang']}） |

### 四柱八字

| 柱位 | 天干 | 地支 | 藏干 | 十神（天干） |
|------|------|------|------|-------------|
"""
        for zhu_name, zhu_key in [('年柱', 'year'), ('月柱', 'month'), ('日柱', 'day'), ('时柱', 'hour')]:
            zhu = self.bazi[zhu_key]
            canggan_str = ', '.join([f"{cg['gan']}({cg['shishen']})" for cg in zhu['canggan']])
            shishen = zhu.get('shishen_gan', '')
            md += f"| {zhu_name} | {zhu['gan']} | {zhu['zhi']} | {canggan_str} | {shishen} |\n"
        
        return md
    
    def generate_wuxing_analysis(self) -> str:
        """生成五行分析部分"""
        wuxing_count = self.data['wuxing_count']
        
        # 排序
        sorted_wuxing = sorted(wuxing_count.items(), key=lambda x: x[1], reverse=True)
        
        md = f"""## 二、五行分析

### 五行分布

| 五行 | 数量 | 状态 |
|------|------|------|
"""
        for wx, count in sorted_wuxing:
            status = "旺" if count >= 3 else "平" if count >= 1.5 else "弱"
            md += f"| {wx} | {count:.1f} | {status} |\n"
        
        md += f"""
### 五行强弱

- **最强五行**：{sorted_wuxing[0][0]}（{sorted_wuxing[0][1]:.1f}）
- **最弱五行**：{sorted_wuxing[-1][0]}（{sorted_wuxing[-1][1]:.1f}）
"""
        return md
    
    def generate_day_master_analysis(self) -> str:
        """生成日主强弱分析"""
        analysis = self.data['day_master_analysis']
        
        md = f"""## 三、日主强弱分析

### 强弱评估

- **日主**：{self.day_master['gan']}（{self.day_master['wuxing']}）
- **强弱评分**：{analysis['score']}/100
- **强弱状态**：{analysis['strength']}
"""
        if analysis['congge']:
            md += f"- **特殊格局**：{analysis['congge']}\n"
        
        md += "\n### 评分详情\n\n"
        for detail in analysis['details']:
            md += f"- {detail}\n"
        
        return md
    
    def generate_xiyongshen(self) -> str:
        """生成喜用神分析"""
        xiyongshen = self.data['xiyongshen']
        
        md = f"""## 四、喜用神分析

### 喜用神（有利）

"""
        for wx in xiyongshen['xiyongshen']:
            md += f"- **{wx}**："
            if wx == self.day_master['wuxing']:
                md += "比劫，代表自身能量、合伙人、朋友助力\n"
            elif wx == self._get_sheng_wuxing(self.day_master['wuxing']):
                md += "印绶，代表贵人、学历、靠山、文书\n"
            elif wx == self._get_ke_wuxing(self.day_master['wuxing']):
                md += "官杀，代表事业、地位、管理能力\n"
            elif wx == self._get_sheng_by_wuxing(self.day_master['wuxing']):
                md += "食伤，代表才华、创意、财源\n"
            else:
                md += "财星，代表财富、资源\n"
        
        md += "\n### 忌神（不利）\n\n"
        for wx in xiyongshen['jishen']:
            md += f"- **{wx}**\n"
        
        return md
    
    def generate_geju(self) -> str:
        """生成格局分析"""
        geju_info = analyze_geju(self.data)
        
        md = f"""## 五、格局分析

### 格局类型

"""
        for gj in geju_info['geju']:
            md += f"- {gj}\n"
        
        md += f"""
### 格局层次

- **层次**：{geju_info['level']}
- **原局用神**：{'有' if geju_info['has_xiyongshen_in_bazi'] else '无'}

"""
        return md
    
    def generate_dayun(self) -> str:
        """生成大运分析"""
        dayun_info = self.data['dayun']
        
        md = f"""## 六、大运分析

### 大运基本信息

- **起运方向**：{dayun_info['direction']}排
- **起运年龄**：{dayun_info['qiyun_age']}岁

### 大运列表

| 步数 | 干支 | 五行 | 起运年龄 | 结束年龄 |
|------|------|------|----------|----------|
"""
        for dy in dayun_info['dayun'][:8]:  # 显示前8步
            md += f"| {dy['step']} | {dy['ganzhi']} | {dy['wuxing']} | {dy['start_age']:.1f}岁 | {dy['end_age']:.1f}岁 |\n"
        
        return md
    
    def generate_career_wealth(self) -> str:
        """生成事业财运分析"""
        xiyongshen = self.data['xiyongshen']['xiyongshen']
        day_master = self.day_master['wuxing']
        bazi = self.bazi
        
        # 分析官杀（事业）
        guansha_wuxing = self._get_ke_wuxing(day_master)
        has_guansha = any(TIANGAN_WUXING[bazi[zhu]['gan']] == guansha_wuxing for zhu in ['year', 'month', 'day', 'hour'])
        
        # 分析财星
        cai_wuxing = self._get_sheng_by_wuxing(day_master)
        has_cai = any(TIANGAN_WUXING[bazi[zhu]['gan']] == cai_wuxing for zhu in ['year', 'month', 'day', 'hour'])
        
        md = f"""## 七、事业财运分析（老板视角）

### 事业格局

"""
        if guansha_wuxing in xiyongshen:
            md += """- **事业运势**：★★★★☆
  - 官杀为喜用，事业心强，有管理才能
  - 适合担任领导职务，有贵人提携
  - 建议：把握机会，勇于承担责任
"""
        else:
            md += """- **事业运势**：★★★☆☆
  - 官杀不为喜用，事业压力较大
  - 建议：以技术或专业路线为主，避免过多管理事务
"""
        
        md += "\n### 财运分析\n\n"
        if cai_wuxing in xiyongshen:
            md += """- **财运评级**：★★★★☆
  - 财星为喜用，财运较佳
  - 适合投资理财，有偏财运
  - 建议：把握财运年份，适度投资
"""
        else:
            md += """- **财运评级**：★★☆☆☆
  - 财星不为喜用，求财较辛苦
  - 建议：稳健理财，避免高风险投资
"""
        
        # 最佳行业
        md += "\n### 最佳行业方向\n\n"
        for wx in xiyongshen[:2]:
            if wx == '金':
                md += "- **金**：金融、科技、机械、汽车、五金\n"
            elif wx == '木':
                md += "- **木**：教育、文化、出版、服装、林业\n"
            elif wx == '水':
                md += "- **水**：物流、贸易、旅游、水利、饮料\n"
            elif wx == '火':
                md += "- **火**：能源、餐饮、电子、传媒、美容\n"
            elif wx == '土':
                md += "- **土**：房地产、建筑、农业、矿产、仓储\n"
        
        return md
    
    def generate_marriage(self) -> str:
        """生成婚姻感情分析"""
        gender = self.data['input']['gender']
        day_master = self.day_master['gan']
        bazi = self.bazi
        
        md = f"""## 八、婚姻感情分析

### 配偶特征

"""
        if gender == '男':
            # 男命看财星
            cai_wuxing = self._get_sheng_by_wuxing(self.day_master['wuxing'])
            md += f"- **配偶星**：财星（{cai_wuxing}）\n"
            md += "- **配偶特征**：财星代表妻子，温柔贤惠，善于理财\n"
        else:
            # 女命看官杀
            guansha_wuxing = self._get_ke_wuxing(self.day_master['wuxing'])
            md += f"- **配偶星**：官杀（{guansha_wuxing}）\n"
            md += "- **配偶特征**：官杀代表丈夫，事业有成，有责任感\n"
        
        # 日支分析
        day_zhi = bazi['day']['zhi']
        md += f"\n### 婚姻宫（日支）\n\n"
        md += f"- **日支**：{day_zhi}（{DIZHI_WUXING[day_zhi]}）\n"
        
        if DIZHI_WUXING[day_zhi] in self.data['xiyongshen']['xiyongshen']:
            md += "- **婚姻质量**：婚姻宫为喜用，婚姻较美满\n"
        else:
            md += "- **婚姻质量**：婚姻宫不为喜用，需注意沟通\n"
        
        return md
    
    def generate_health(self) -> str:
        """生成健康分析"""
        wuxing_count = self.data['wuxing_count']
        
        md = """## 九、健康分析

### 五行与健康

"""
        # 最强五行对应的疾病
        strongest = max(wuxing_count.items(), key=lambda x: x[1])
        weakest = min(wuxing_count.items(), key=lambda x: x[1])
        
        wuxing_health = {
            '金': '肺、大肠、呼吸系统、皮肤',
            '木': '肝、胆、筋骨、神经系统',
            '水': '肾、膀胱、生殖系统、耳朵',
            '火': '心、小肠、血液循环、眼睛',
            '土': '脾、胃、消化系统、肌肉'
        }
        
        md += f"- **{strongest[0]}偏旺**：注意{wuxing_health[strongest[0]]}相关疾病\n"
        md += f"- **{weakest[0]}偏弱**：注意{wuxing_health[weakest[0]]}保健\n"
        
        md += "\n### 养生建议\n\n"
        md += f"- 多补充{weakest[0]}行相关食物和颜色\n"
        md += f"- 避免{strongest[0]}行过旺的环境和活动\n"
        
        return md
    
    def generate_timeline(self) -> str:
        """生成流年大运分析"""
        dayun_info = self.data['dayun']
        xiyongshen = self.data['xiyongshen']['xiyongshen']
        
        md = """## 十、流年大运分析

### 近期运势

"""
        current_year = datetime.now().year
        
        # 找出当前大运
        current_age = current_year - int(self.data['input']['birth_time'][:4])
        current_dayun = None
        for dy in dayun_info['dayun']:
            if dy['start_age'] <= current_age <= dy['end_age']:
                current_dayun = dy
                break
        
        if current_dayun:
            md += f"""### 当前大运（{current_dayun['start_age']:.0f}-{current_dayun['end_age']:.0f}岁）

- **大运干支**：{current_dayun['ganzhi']}
- **大运五行**：{current_dayun['wuxing']}
"""
            # 判断大运吉凶
            dayun_wuxing = current_dayun['wuxing'][0]  # 取天干五行
            if dayun_wuxing in xiyongshen:
                md += "- **大运评级**：★★★★☆ 吉运，宜进取\n"
            else:
                md += "- **大运评级**：★★☆☆☆ 平运，宜守成\n"
        
        md += f"""
### 未来三年流年

| 年份 | 干支 | 运势简评 |
|------|------|----------|
"""
        for year in range(current_year, current_year + 3):
            year_ganzhi = self._get_year_ganzhi(year)
            year_gan_wuxing = TIANGAN_WUXING[year_ganzhi[0]]
            if year_gan_wuxing in xiyongshen:
                pingjia = "吉年，把握机会"
            else:
                pingjia = "平年，谨慎行事"
            md += f"| {year} | {year_ganzhi} | {pingjia} |\n"
        
        return md
    
    def generate_suggestions(self) -> str:
        """生成建议"""
        xiyongshen = self.data['xiyongshen']['xiyongshen']
        
        md = """## 十一、综合建议

### 发展方向

"""
        md += "1. **事业**：" + ("适合创业或担任管理职务" if self._get_ke_wuxing(self.day_master['wuxing']) in xiyongshen else "适合技术或专业路线") + "\n"
        md += "2. **财运**：" + ("可适度投资理财" if self._get_sheng_by_wuxing(self.day_master['wuxing']) in xiyongshen else "宜稳健理财") + "\n"
        md += "3. **人际**：多接触" + "、".join(xiyongshen[:2]) + "五行旺的人\n"
        
        md += "\n### 风险提示\n\n"
        md += "- 忌神年份注意健康和人际关系\n"
        md += "- 重大决策前建议咨询专业人士\n"
        md += "- 命理分析仅供参考，人生掌握在自己手中\n"
        
        return md
    
    def generate_full_report(self) -> str:
        """生成完整报告"""
        md = f"""# 八字命理分析报告

> 生成时间：{datetime.now().strftime('%Y年%m月%d日 %H:%M')}

"""
        md += self.generate_basic_info() + "\n\n"
        md += self.generate_wuxing_analysis() + "\n\n"
        md += self.generate_day_master_analysis() + "\n\n"
        md += self.generate_xiyongshen() + "\n\n"
        md += self.generate_geju() + "\n\n"
        md += self.generate_dayun() + "\n\n"
        md += self.generate_career_wealth() + "\n\n"
        md += self.generate_marriage() + "\n\n"
        md += self.generate_health() + "\n\n"
        md += self.generate_timeline() + "\n\n"
        md += self.generate_suggestions()
        
        return md
    
    # 辅助方法
    def _get_sheng_wuxing(self, wuxing: str) -> str:
        """获取生我的五行"""
        from bazi_core import WUXING_SHENG
        for wx, sheng in WUXING_SHENG.items():
            if sheng == wuxing:
                return wx
        return ''
    
    def _get_ke_wuxing(self, wuxing: str) -> str:
        """获取克我的五行"""
        from bazi_core import WUXING_KE
        for wx, ke in WUXING_KE.items():
            if ke == wuxing:
                return wx
        return ''
    
    def _get_sheng_by_wuxing(self, wuxing: str) -> str:
        """获取我生的五行"""
        from bazi_core import WUXING_SHENG
        return WUXING_SHENG.get(wuxing, '')
    
    def _get_year_ganzhi(self, year: int) -> str:
        """获取年干支"""
        from bazi_core import get_ganzhi_year
        return get_ganzhi_year(year)

def generate_report(bazi_data: Dict) -> str:
    """生成八字分析报告"""
    analyzer = BaziAnalyzer(bazi_data)
    return analyzer.generate_full_report()

if __name__ == '__main__':
    # 测试
    from bazi_core import calculate_bazi
    result = calculate_bazi(1997, 11, 4, 18, 30, '聊城', '男')
    report = generate_report(result)
    print(report)

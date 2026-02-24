"""
八字命理分析核心模块
包含：万年历转换、四柱排盘、十神计算、大运排法、命局分析
"""

from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any
import json
import math

# ============ 基础数据定义 ============

# 天干
TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

# 地支
DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

# 天干五行
TIANGAN_WUXING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
}

# 天干阴阳
TIANGAN_YINYANG = {
    '甲': '阳', '乙': '阴',
    '丙': '阳', '丁': '阴',
    '戊': '阳', '己': '阴',
    '庚': '阳', '辛': '阴',
    '壬': '阳', '癸': '阴'
}

# 地支五行
DIZHI_WUXING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
}

# 地支阴阳
DIZHI_YINYANG = {
    '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
    '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
    '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
}

# 地支藏干
DIZHI_CANGGAN = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
}

# 五行生克关系
WUXING_SHENG = {'木': '火', '火': '土', '土': '金', '金': '水', '水': '木'}
WUXING_KE = {'木': '土', '土': '水', '水': '火', '火': '金', '金': '木'}

# 十神定义（以日干为基准）
SHISHEN_MAP = {
    # 日干为甲（阳木）
    '甲': {'甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', 
          '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印'},
    # 日干为乙（阴木）
    '乙': {'甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', 
          '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印'},
    # 日干为丙（阳火）
    '丙': {'甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', 
          '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官'},
    # 日干为丁（阴火）
    '丁': {'甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', 
          '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀'},
    # 日干为戊（阳土）
    '戊': {'甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', 
          '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财'},
    # 日干为己（阴土）
    '己': {'甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', 
          '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财'},
    # 日干为庚（阳金）
    '庚': {'甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', 
          '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官'},
    # 日干为辛（阴金）
    '辛': {'甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', 
          '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神'},
    # 日干为壬（阳水）
    '壬': {'甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', 
          '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财'},
    # 日干为癸（阴水）
    '癸': {'甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', 
          '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩'}
}

# 节气数据（简化版，1900-2100年）
# 实际应用中需要更精确的节气计算
JIEQI_MONTH = {
    1: ('寅', '立春'), 2: ('卯', '惊蛰'), 3: ('辰', '清明'),
    4: ('巳', '立夏'), 5: ('午', '芒种'), 6: ('未', '小暑'),
    7: ('申', '立秋'), 8: ('酉', '白露'), 9: ('戌', '寒露'),
    10: ('亥', '立冬'), 11: ('子', '大雪'), 12: ('丑', '小寒')
}

# 时辰对应表
SHICHEN_MAP = {
    (0, 1): '子', (1, 3): '丑', (3, 5): '寅', (5, 7): '卯',
    (7, 9): '辰', (9, 11): '巳', (11, 13): '午', (13, 15): '未',
    (15, 17): '申', (17, 19): '酉', (19, 21): '戌', (21, 23): '亥',
    (23, 24): '子'
}

# 中国主要城市经度（用于真太阳时计算）
CITY_LONGITUDE = {
    '北京': 116.4, '上海': 121.5, '广州': 113.3, '深圳': 114.1,
    '杭州': 120.2, '南京': 118.8, '成都': 104.1, '重庆': 106.5,
    '武汉': 114.3, '西安': 108.9, '天津': 117.2, '苏州': 120.6,
    '郑州': 113.7, '长沙': 113.0, '沈阳': 123.4, '青岛': 120.4,
    '宁波': 121.6, '东莞': 113.8, '无锡': 120.3, '佛山': 113.1,
    '济南': 117.0, '哈尔滨': 126.6, '长春': 125.3, '石家庄': 114.5,
    '南宁': 108.3, '昆明': 102.7, '南昌': 115.9, '贵阳': 106.7,
    '福州': 119.3, '厦门': 118.1, '乌鲁木齐': 87.6, '兰州': 103.8,
    '海口': 110.3, '聊城': 115.9, '太原': 112.5, '合肥': 117.3
}

# ============ 万年历转换 ============

def is_leap_year(year: int) -> bool:
    """判断是否为闰年"""
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

def lunar_to_solar(lunar_year: int, lunar_month: int, lunar_day: int, is_leap: bool = False) -> Tuple[int, int, int]:
    """
    农历转公历（简化版，基于1900-2100年的数据）
    实际应用中需要完整的农历数据表
    """
    # 这里使用简化的算法，实际应该使用完整的农历数据
    # 1900年春节是1月31日
    base_date = datetime(1900, 1, 31)
    
    # 简化的农历天数计算（需要完整的农历数据）
    # 这里返回一个近似值，实际应用需要更精确的计算
    days = (lunar_year - 1900) * 365 + (lunar_year - 1900) // 4
    days += (lunar_month - 1) * 29 + lunar_day
    
    result_date = base_date + timedelta(days=days)
    return result_date.year, result_date.month, result_date.day

def get_ganzhi_year(year: int) -> str:
    """根据公历年份计算年干支"""
    # 以1984年（甲子年）为基准
    offset = (year - 1984) % 60
    gan_idx = offset % 10
    zhi_idx = offset % 12
    return TIANGAN[gan_idx] + DIZHI[zhi_idx]

def get_ganzhi_month(year_gan: str, month: int) -> str:
    """
    计算月干支
    年干决定月干起始，正月为寅月
    """
    # 年干对应的月干起始
    year_gan_idx = TIANGAN.index(year_gan)
    # 甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚起，丁壬壬位顺行流，戊癸何方发，甲寅之上好追求
    month_gan_start = {0: 2, 1: 4, 2: 6, 3: 8, 4: 0, 5: 2, 6: 4, 7: 6, 8: 8, 9: 0}
    
    # 正月是寅月，地支索引为2
    zhi_idx = (month + 1) % 12  # 正月寅月
    gan_idx = (month_gan_start[year_gan_idx] + month - 1) % 10
    
    return TIANGAN[gan_idx] + DIZHI[zhi_idx]

def get_ganzhi_day(year: int, month: int, day: int) -> str:
    """
    计算日干支
    使用蔡勒公式或已知基准日推算
    """
    # 以1900年1月31日为基准（甲子日）
    base_date = datetime(1900, 1, 31)
    target_date = datetime(year, month, day)
    days_diff = (target_date - base_date).days
    
    offset = days_diff % 60
    gan_idx = offset % 10
    zhi_idx = offset % 12
    return TIANGAN[gan_idx] + DIZHI[zhi_idx]

def get_shizhi(hour: int) -> str:
    """根据小时获取时支"""
    for (start, end), zhi in SHICHEN_MAP.items():
        if start <= hour < end:
            return zhi
    return '子'

def get_ganzhi_hour(day_gan: str, hour: int) -> str:
    """
    计算时干支
    日干决定时干起始
    """
    day_gan_idx = TIANGAN.index(day_gan)
    # 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
    hour_gan_start = {0: 0, 1: 2, 2: 4, 3: 6, 4: 8, 5: 0, 6: 2, 7: 4, 8: 6, 9: 8}
    
    # 计算时辰索引（0-11）
    if hour == 23 or hour == 0:
        shichen_idx = 0  # 子时
    else:
        shichen_idx = ((hour + 1) // 2) % 12
    
    gan_idx = (hour_gan_start[day_gan_idx] + shichen_idx) % 10
    return TIANGAN[gan_idx] + DIZHI[shichen_idx]

# ============ 真太阳时计算 ============

def get_longitude(city: str) -> float:
    """获取城市经度"""
    return CITY_LONGITUDE.get(city, 120.0)  # 默认使用东经120度（北京时间基准）

def solar_time_adjustment(city: str, date: datetime) -> timedelta:
    """
    计算真太阳时调整
    真太阳时 = 平太阳时 + 经度差调整 + 均时差
    """
    longitude = get_longitude(city)
    # 经度差调整（每度4分钟）
    longitude_adjustment = (longitude - 120.0) * 4  # 分钟
    
    # 简化的均时差计算（实际应该使用更精确的公式）
    # 均时差在一年中变化，范围约-14到+16分钟
    day_of_year = date.timetuple().tm_yday
    # 简化的均时差公式
    equation_of_time = 9.87 * math.sin(2 * math.pi * (day_of_year - 81) / 365) - \
                       7.53 * math.cos(2 * math.pi * (day_of_year - 81) / 365) - \
                       1.5 * math.sin(2 * math.pi * (day_of_year - 81) / 365)
    
    total_minutes = longitude_adjustment + equation_of_time
    return timedelta(minutes=total_minutes)

def to_true_solar_time(year: int, month: int, day: int, hour: int, minute: int, city: str) -> Tuple[int, int, int, int, int]:
    """
    转换为真太阳时
    返回：(年, 月, 日, 时, 分)
    """
    dt = datetime(year, month, day, hour, minute)
    adjustment = solar_time_adjustment(city, dt)
    true_dt = dt + adjustment
    return (true_dt.year, true_dt.month, true_dt.day, true_dt.hour, true_dt.minute)

# ============ 十神计算 ============

def get_shishen(day_gan: str, target_gan: str) -> str:
    """获取十神"""
    return SHISHEN_MAP[day_gan].get(target_gan, '未知')

def get_shishen_for_dizhi(day_gan: str, dizhi: str) -> List[Dict]:
    """获取地支藏干对应的十神"""
    canggan_list = DIZHI_CANGGAN.get(dizhi, [])
    result = []
    for cg in canggan_list:
        result.append({
            'gan': cg,
            'wuxing': TIANGAN_WUXING[cg],
            'shishen': get_shishen(day_gan, cg)
        })
    return result

# ============ 五行统计 ============

def count_wuxing(bazi: Dict) -> Dict[str, int]:
    """统计八字中各五行的数量"""
    counts = {'金': 0, '木': 0, '水': 0, '火': 0, '土': 0}
    
    # 统计天干五行
    for zhu in ['year', 'month', 'day', 'hour']:
        gan = bazi[zhu]['gan']
        counts[TIANGAN_WUXING[gan]] += 1
        # 统计地支五行
        zhi = bazi[zhu]['zhi']
        counts[DIZHI_WUXING[zhi]] += 1
        # 统计藏干五行（权重0.5）
        for cg_info in bazi[zhu]['canggan']:
            counts[cg_info['wuxing']] += 0.5
    
    return counts

def get_strongest_wuxing(wuxing_count: Dict) -> Tuple[str, float]:
    """获取最强的五行"""
    sorted_wuxing = sorted(wuxing_count.items(), key=lambda x: x[1], reverse=True)
    return sorted_wuxing[0]

def get_weakest_wuxing(wuxing_count: Dict) -> Tuple[str, float]:
    """获取最弱的五行"""
    sorted_wuxing = sorted(wuxing_count.items(), key=lambda x: x[1])
    return sorted_wuxing[0]

# ============ 日主强弱分析 ============

def analyze_day_master_strength(bazi: Dict) -> Dict:
    """
    分析日主强弱
    考虑因素：月令、通根、透干、生扶
    """
    day_gan = bazi['day']['gan']
    day_wuxing = TIANGAN_WUXING[day_gan]
    month_zhi = bazi['month']['zhi']
    month_wuxing = DIZHI_WUXING[month_zhi]
    
    score = 0
    details = []
    
    # 1. 月令（最重要，占40%）
    if WUXING_SHENG.get(month_wuxing) == day_wuxing:  # 月令生我
        score += 40
        details.append(f"月令{month_zhi}（{month_wuxing}）生日主，得令+40")
    elif month_wuxing == day_wuxing:  # 月令同我
        score += 35
        details.append(f"月令{month_zhi}（{month_wuxing}）与日主同五行，得令+35")
    elif WUXING_KE.get(month_wuxing) == day_wuxing:  # 月令克我
        score += 10
        details.append(f"月令{month_zhi}（{month_wuxing}）克日主，失令+10")
    else:  # 我克月令
        score += 15
        details.append(f"日主克月令{month_zhi}（{month_wuxing}），+15")
    
    # 2. 通根（地支有同五行或生我五行）
    tonggen_score = 0
    for zhu in ['year', 'month', 'day', 'hour']:
        zhi = bazi[zhu]['zhi']
        zhi_wuxing = DIZHI_WUXING[zhi]
        if zhi_wuxing == day_wuxing:  # 同五行
            if zhu == 'day':  # 日支最强
                tonggen_score += 15
            else:
                tonggen_score += 10
        elif WUXING_SHENG.get(zhi_wuxing) == day_wuxing:  # 生我
            tonggen_score += 8
    
    score += min(tonggen_score, 30)
    details.append(f"通根得分：{min(tonggen_score, 30)}")
    
    # 3. 透干（天干有同五行或生我五行）
    tougans = []
    for zhu in ['year', 'month', 'hour']:
        gan = bazi[zhu]['gan']
        gan_wuxing = TIANGAN_WUXING[gan]
        if gan_wuxing == day_wuxing:  # 同五行（比肩劫财）
            tougans.append(f"{zhu}干{gan}（比肩/劫财）")
            score += 10
        elif WUXING_SHENG.get(gan_wuxing) == day_wuxing:  # 生我（印）
            tougans.append(f"{zhu}干{gan}（印）")
            score += 12
    
    if tougans:
        details.append(f"透干：{', '.join(tougans)}")
    
    # 4. 判断强弱
    if score >= 60:
        strength = "偏旺"
    elif score >= 40:
        strength = "中和偏旺"
    elif score >= 30:
        strength = "中和偏弱"
    else:
        strength = "偏弱"
    
    # 5. 判断是否从格
    congge = None
    if score <= 15:
        # 检查是否有强旺的克泄耗
        wuxing_count = count_wuxing(bazi)
        ke_wuxing = WUXING_KE[day_wuxing]  # 克我的五行
        xie_wuxing = WUXING_SHENG.get(day_wuxing)  # 我生的五行
        hao_wuxing = WUXING_KE.get(day_wuxing)  # 我克的五行
        
        if wuxing_count.get(ke_wuxing, 0) >= 4 or wuxing_count.get(xie_wuxing, 0) >= 4:
            congge = "从弱"
            strength = "从弱格"
    elif score >= 85:
        # 检查是否极旺无制
        congge = "从强"
        strength = "从强格"
    
    return {
        'score': score,
        'strength': strength,
        'congge': congge,
        'details': details
    }

# ============ 喜用神分析 ============

def analyze_xiyongshen(bazi: Dict, day_master_analysis: Dict) -> Dict:
    """
    分析喜用神和忌神
    """
    day_gan = bazi['day']['gan']
    day_wuxing = TIANGAN_WUXING[day_gan]
    
    xiyongshen = []
    jishen = []
    
    if day_master_analysis['congge'] == '从强':
        # 从强格：顺势而行，喜印比
        xiyongshen = [day_wuxing, WUXING_SHENG.get(day_wuxing)]
        jishen = [WUXING_KE[day_wuxing], WUXING_KE.get(WUXING_SHENG.get(day_wuxing))]
    elif day_master_analysis['congge'] == '从弱':
        # 从弱格：顺势而行，喜克泄耗
        xiyongshen = [WUXING_KE[day_wuxing], WUXING_SHENG.get(day_wuxing), WUXING_KE.get(day_wuxing)]
        jishen = [day_wuxing, WUXING_SHENG.get(day_wuxing)]
    elif day_master_analysis['strength'] in ['偏旺', '中和偏旺']:
        # 身旺喜克泄耗
        xiyongshen = [WUXING_KE[day_wuxing], WUXING_SHENG.get(day_wuxing)]
        # 我克的五行（财）根据情况
        cai_wuxing = None
        for wx, sheng in WUXING_SHENG.items():
            if sheng == day_wuxing:
                cai_wuxing = wx
                break
        if cai_wuxing:
            xiyongshen.append(cai_wuxing)
        jishen = [day_wuxing, WUXING_SHENG.get(day_wuxing)]
    else:
        # 身弱喜印比
        xiyongshen = [day_wuxing, WUXING_SHENG.get(day_wuxing)]
        jishen = [WUXING_KE[day_wuxing], WUXING_SHENG.get(day_wuxing)]
    
    # 去重
    xiyongshen = list(dict.fromkeys([x for x in xiyongshen if x]))
    jishen = list(dict.fromkeys([x for x in jishen if x]))
    
    return {
        'xiyongshen': xiyongshen,
        'jishen': jishen
    }

# ============ 大运排法 ============

def is_yang_year(year_gan: str) -> bool:
    """判断是否为阳年"""
    return TIANGAN_YINYANG[year_gan] == '阳'

def calculate_dayun_direction(year_gan: str, gender: str) -> str:
    """
    计算大运方向
    阳年男命顺排，阴年男命逆排
    阳年女命逆排，阴年女命顺排
    """
    is_yang = is_yang_year(year_gan)
    if gender == '男':
        return '顺' if is_yang else '逆'
    else:
        return '逆' if is_yang else '顺'

def calculate_qiyun_age(birth_date: datetime, direction: str, year_gan: str, month_zhi: str) -> float:
    """
    计算起运岁数
    出生到最近节气的天数 ÷ 3
    
    顺排：从出生日到下一个节气的天数 ÷ 3
    逆排：从出生日到上一个节气的天数 ÷ 3
    """
    # 节气月份映射（地支对应的节气月份）
    # 寅月(立春2月)、卯月(惊蛰3月)、辰月(清明4月)、巳月(立夏5月)、午月(芒种6月)、未月(小暑7月)
    # 申月(立秋8月)、酉月(白露9月)、戌月(寒露10月)、亥月(立冬11月)、子月(大雪12月)、丑月(小寒1月)
    jieqi_month_map = {
        '寅': 2, '卯': 3, '辰': 4, '巳': 5, '午': 6, '未': 7,
        '申': 8, '酉': 9, '戌': 10, '亥': 11, '子': 12, '丑': 1
    }
    
    # 节气日期（近似值，每月节气大约在5日或21日）
    month_zhi_idx = DIZHI.index(month_zhi)
    
    if direction == '顺':
        # 顺排：找出生后的下一个节气（通常是下一个地支对应的节气）
        next_zhi_idx = (month_zhi_idx + 1) % 12
        next_zhi = DIZHI[next_zhi_idx]
        next_jieqi_month = jieqi_month_map[next_zhi]
        next_jieqi_day = 5  # 节气大约在每月5日左右
        
        # 构建下一个节气的日期
        try:
            next_jieqi_date = datetime(birth_date.year, next_jieqi_month, next_jieqi_day)
        except ValueError:
            # 处理2月29日等特殊情况
            next_jieqi_date = datetime(birth_date.year, next_jieqi_month, 28)
        
        # 如果下一个节气已经过了（比如出生在节气之后），则找下下个节气
        if next_jieqi_date <= birth_date:
            next_zhi_idx2 = (next_zhi_idx + 1) % 12
            next_zhi2 = DIZHI[next_zhi_idx2]
            next_jieqi_month2 = jieqi_month_map[next_zhi2]
            try:
                next_jieqi_date = datetime(birth_date.year, next_jieqi_month2, 5)
            except ValueError:
                next_jieqi_date = datetime(birth_date.year, next_jieqi_month2, 28)
            
            # 如果还是过了，说明是年底，要跨到下一年
            if next_jieqi_date <= birth_date:
                next_zhi_idx3 = (next_zhi_idx2 + 1) % 12
                next_zhi3 = DIZHI[next_zhi_idx3]
                next_jieqi_month3 = jieqi_month_map[next_zhi3]
                try:
                    next_jieqi_date = datetime(birth_date.year + 1, next_jieqi_month3, 5)
                except ValueError:
                    next_jieqi_date = datetime(birth_date.year + 1, next_jieqi_month3, 28)
    else:
        # 逆排：找出生前的上一个节气
        prev_zhi_idx = (month_zhi_idx - 1) % 12
        prev_zhi = DIZHI[prev_zhi_idx]
        prev_jieqi_month = jieqi_month_map[prev_zhi]
        
        try:
            prev_jieqi_date = datetime(birth_date.year, prev_jieqi_month, 5)
        except ValueError:
            prev_jieqi_date = datetime(birth_date.year, prev_jieqi_month, 28)
        
        # 如果上一个节气还没到（比如出生在节气之前），则找上上个节气
        if prev_jieqi_date >= birth_date:
            prev_zhi_idx2 = (prev_zhi_idx - 1) % 12
            prev_zhi2 = DIZHI[prev_zhi_idx2]
            prev_jieqi_month2 = jieqi_month_map[prev_zhi2]
            try:
                prev_jieqi_date = datetime(birth_date.year, prev_jieqi_month2, 5)
            except ValueError:
                prev_jieqi_date = datetime(birth_date.year, prev_jieqi_month2, 28)
            
            # 如果还是还没到，说明是年初，要跨到上一年
            if prev_jieqi_date >= birth_date:
                prev_zhi_idx3 = (prev_zhi_idx2 - 1) % 12
                prev_zhi3 = DIZHI[prev_zhi_idx3]
                prev_jieqi_month3 = jieqi_month_map[prev_zhi3]
                try:
                    prev_jieqi_date = datetime(birth_date.year - 1, prev_jieqi_month3, 5)
                except ValueError:
                    prev_jieqi_date = datetime(birth_date.year - 1, prev_jieqi_month3, 28)
        
        next_jieqi_date = prev_jieqi_date
    
    days_diff = abs((next_jieqi_date - birth_date).days)
    qiyun_age = days_diff / 3.0
    
    # 限制在合理范围内（通常0-10岁）
    if qiyun_age > 10:
        qiyun_age = qiyun_age % 10
    
    return round(qiyun_age, 1)

def generate_dayun(bazi: Dict, gender: str, birth_date: datetime) -> List[Dict]:
    """
    生成大运
    """
    year_gan = bazi['year']['gan']
    month_gan = bazi['month']['gan']
    month_zhi = bazi['month']['zhi']
    
    direction = calculate_dayun_direction(year_gan, gender)
    qiyun_age = calculate_qiyun_age(birth_date, direction, year_gan, month_zhi)
    
    dayun_list = []
    month_gan_idx = TIANGAN.index(month_gan)
    month_zhi_idx = DIZHI.index(month_zhi)
    
    for i in range(12):  # 生成12步大运
        if direction == '顺':
            gan_idx = (month_gan_idx + i + 1) % 10
            zhi_idx = (month_zhi_idx + i + 1) % 12
        else:
            gan_idx = (month_gan_idx - i - 1) % 10
            zhi_idx = (month_zhi_idx - i - 1) % 12
        
        gan = TIANGAN[gan_idx]
        zhi = DIZHI[zhi_idx]
        start_age = qiyun_age + i * 10
        
        dayun_list.append({
            'step': i + 1,
            'ganzhi': gan + zhi,
            'gan': gan,
            'zhi': zhi,
            'start_age': start_age,
            'end_age': start_age + 9,
            'wuxing': TIANGAN_WUXING[gan] + DIZHI_WUXING[zhi]
        })
    
    return {
        'direction': direction,
        'qiyun_age': qiyun_age,
        'dayun': dayun_list
    }

# ============ 主排盘函数 ============

def calculate_bazi(year: int, month: int, day: int, hour: int, minute: int, 
                   city: str = '北京', gender: str = '男', calendar: str = '公历') -> Dict:
    """
    计算八字命盘
    
    Args:
        year: 年
        month: 月
        day: 日
        hour: 时
        minute: 分
        city: 出生地
        gender: 性别
        calendar: '公历' 或 '农历'
    
    Returns:
        完整的八字命盘信息
    """
    # 1. 农历转公历（如果需要）
    if calendar == '农历':
        year, month, day = lunar_to_solar(year, month, day)
    
    # 2. 转换为真太阳时
    true_year, true_month, true_day, true_hour, true_minute = \
        to_true_solar_time(year, month, day, hour, minute, city)
    
    # 3. 计算四柱
    year_ganzhi = get_ganzhi_year(true_year)
    month_ganzhi = get_ganzhi_month(year_ganzhi[0], true_month)
    day_ganzhi = get_ganzhi_day(true_year, true_month, true_day)
    hour_ganzhi = get_ganzhi_hour(day_ganzhi[0], true_hour)
    
    # 4. 构建八字结构
    bazi = {
        'year': {
            'gan': year_ganzhi[0],
            'zhi': year_ganzhi[1],
            'canggan': get_shishen_for_dizhi(day_ganzhi[0], year_ganzhi[1])
        },
        'month': {
            'gan': month_ganzhi[0],
            'zhi': month_ganzhi[1],
            'canggan': get_shishen_for_dizhi(day_ganzhi[0], month_ganzhi[1])
        },
        'day': {
            'gan': day_ganzhi[0],
            'zhi': day_ganzhi[1],
            'canggan': get_shishen_for_dizhi(day_ganzhi[0], day_ganzhi[1])
        },
        'hour': {
            'gan': hour_ganzhi[0],
            'zhi': hour_ganzhi[1],
            'canggan': get_shishen_for_dizhi(day_ganzhi[0], hour_ganzhi[1])
        }
    }
    
    # 5. 计算十神
    day_gan = day_ganzhi[0]
    for zhu in ['year', 'month', 'day', 'hour']:
        bazi[zhu]['shishen_gan'] = get_shishen(day_gan, bazi[zhu]['gan'])
        bazi[zhu]['shishen_zhi'] = get_shishen_for_dizhi(day_gan, bazi[zhu]['zhi'])
    
    # 6. 五行统计
    wuxing_count = count_wuxing(bazi)
    
    # 7. 日主强弱分析
    day_master_analysis = analyze_day_master_strength(bazi)
    
    # 8. 喜用神分析
    xiyongshen_analysis = analyze_xiyongshen(bazi, day_master_analysis)
    
    # 9. 大运
    birth_date = datetime(true_year, true_month, true_day, true_hour, true_minute)
    dayun_info = generate_dayun(bazi, gender, birth_date)
    
    # 10. 组装结果
    result = {
        'input': {
            'calendar': calendar,
            'birth_time': f"{year}年{month}月{day}日 {hour:02d}:{minute:02d}",
            'true_solar_time': f"{true_year}年{true_month}月{true_day}日 {true_hour:02d}:{true_minute:02d}",
            'city': city,
            'gender': gender
        },
        'bazi': bazi,
        'day_master': {
            'gan': day_gan,
            'wuxing': TIANGAN_WUXING[day_gan],
            'yinyang': TIANGAN_YINYANG[day_gan]
        },
        'wuxing_count': wuxing_count,
        'day_master_analysis': day_master_analysis,
        'xiyongshen': xiyongshen_analysis,
        'dayun': dayun_info
    }
    
    return result

# ============ 格局判断 ============

def analyze_geju(bazi_data: Dict) -> Dict:
    """
    分析八字格局
    """
    bazi = bazi_data['bazi']
    day_gan = bazi_data['day_master']['gan']
    month_zhi = bazi['month']['zhi']
    month_gan = bazi['month']['gan']
    
    geju_list = []
    level = "普通"
    
    # 1. 月令格局
    month_shishen = get_shishen(day_gan, month_gan)
    if month_shishen in ['正官', '七杀']:
        geju_list.append(f"{month_shishen}格")
        level = "中上"
    elif month_shishen in ['正印', '偏印']:
        geju_list.append(f"{month_shishen}格")
        level = "中上"
    elif month_shishen in ['食神', '伤官']:
        geju_list.append(f"{month_shishen}格")
        level = "中等"
    elif month_shishen in ['正财', '偏财']:
        geju_list.append(f"{month_shishen}格")
        level = "中等"
    
    # 2. 特殊格局判断
    wuxing_count = bazi_data['wuxing_count']
    
    # 从格
    if bazi_data['day_master_analysis']['congge']:
        geju_list.append(bazi_data['day_master_analysis']['congge'])
        level = "特殊"
    
    # 专旺格
    day_wuxing = bazi_data['day_master']['wuxing']
    if wuxing_count[day_wuxing] >= 5:
        geju_list.append(f"{day_wuxing}专旺格")
        level = "特殊"
    
    # 3. 格局层次判断
    xiyongshen = bazi_data['xiyongshen']['xiyongshen']
    jishen = bazi_data['xiyongshen']['jishen']
    
    # 检查原局是否有用神
    has_xiyongshen = False
    for zhu in ['year', 'month', 'day', 'hour']:
        gan_wuxing = TIANGAN_WUXING[bazi[zhu]['gan']]
        if gan_wuxing in xiyongshen:
            has_xiyongshen = True
            break
    
    if has_xiyongshen and bazi_data['day_master_analysis']['score'] >= 40:
        level = "中上"
    if has_xiyongshen and bazi_data['day_master_analysis']['score'] >= 60:
        level = "上等"
    
    return {
        'geju': geju_list,
        'level': level,
        'has_xiyongshen_in_bazi': has_xiyongshen
    }

if __name__ == '__main__':
    # 测试
    result = calculate_bazi(1997, 11, 4, 18, 30, '聊城', '男')
    print(json.dumps(result, ensure_ascii=False, indent=2))

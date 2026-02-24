"""
时间检测模块 - 智能识别中文时间表达
支持多种时间格式：今天下午3点、明天上午、本周五、3月15日前等
"""

import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class TimeDetector:
    """智能时间检测器"""
    
    # 数字映射
    NUMBER_MAP = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
        '两': 2, '几': 0, '半': 30,
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
        '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        '11': 11, '12': 12, '13': 13, '14': 14, '15': 15,
        '16': 16, '17': 17, '18': 18, '19': 19, '20': 20,
        '21': 21, '22': 22, '23': 23, '24': 24
    }
    
    # 星期映射
    WEEKDAY_MAP = {
        '周一': 0, '周一': 0, '星期一': 0,
        '周二': 1, '周二': 1, '星期二': 1,
        '周三': 2, '周三': 2, '星期三': 2,
        '周四': 3, '周四': 3, '星期四': 3,
        '周五': 4, '周五': 4, '星期五': 4,
        '周六': 5, '周六': 5, '星期六': 5,
        '周日': 6, '周日': 6, '星期天': 6, '星期日': 6,
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '0': 6
    }
    
    # 时段映射
    TIME_PERIOD = {
        '早上': 8, '早晨': 8, '上午': 9, '中午': 12, '午后': 14,
        '下午': 15, '傍晚': 18, '晚上': 20, '夜间': 21, '深夜': 23,
        '凌晨': 5
    }
    
    def __init__(self, reference_time: Optional[datetime] = None):
        """
        初始化时间检测器
        
        Args:
            reference_time: 参考时间，默认为当前时间
        """
        self.reference_time = reference_time or datetime.now()
        self.today = self.reference_time.replace(hour=0, minute=0, second=0, microsecond=0)
    
    def detect(self, text: str) -> List[Dict]:
        """
        检测文本中的所有时间表达
        
        Args:
            text: 待检测文本
            
        Returns:
            List[Dict]: 时间信息列表
        """
        results = []
        
        # 今天
        results.extend(self._detect_today(text))
        
        # 明天
        results.extend(self._detect_tomorrow(text))
        
        # 后天
        results.extend(self._detect_day_after_tomorrow(text))
        
        # 星期
        results.extend(self._detect_weekday(text))
        
        # 具体日期
        results.extend(self._detect_month_day(text))
        
        # X天后
        results.extend(self._detect_days_later(text))
        
        # X周后
        results.extend(self._detect_weeks_later(text))
        
        # X月X日前
        results.extend(self._detect_before_date(text))
        
        # 月底/月初
        results.extend(self._detect_month_period(text))
        
        # 周末
        results.extend(self._detect_weekend(text))
        
        # 去重并排序
        results = self._deduplicate_and_sort(results)
        
        return results
    
    def _detect_today(self, text: str) -> List[Dict]:
        """检测今天的时间"""
        results = []
        pattern = re.compile(r'(今天|今日|今)\s*(早上|早晨|上午|中午|下午|傍晚|晚上|夜间|深夜|凌晨)?\s*(\d{1,2})?\s*[:点]?\s*(\d{1,2}|半)?\s*(分)?')
        
        for match in pattern.finditer(text):
            period = match.group(2)
            hour = match.group(3)
            minute = match.group(4)
            
            target_time = self.today
            
            if hour:
                h = int(hour)
                if period in ['下午', '傍晚', '晚上'] and h < 12:
                    h += 12
                m = 30 if minute == '半' else (int(minute) if minute else 0)
                target_time = target_time.replace(hour=h, minute=m)
            elif period:
                target_time = target_time.replace(hour=self.TIME_PERIOD.get(period, 9), minute=0)
            else:
                target_time = target_time.replace(hour=17, minute=0)  # 默认今天下班
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'today',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_tomorrow(self, text: str) -> List[Dict]:
        """检测明天的时间"""
        results = []
        pattern = re.compile(r'(明天|明日|明)\s*(早上|早晨|上午|中午|下午|傍晚|晚上|夜间|深夜|凌晨)?\s*(\d{1,2})?\s*[:点]?\s*(\d{1,2}|半)?\s*(分)?')
        
        for match in pattern.finditer(text):
            period = match.group(2)
            hour = match.group(3)
            minute = match.group(4)
            
            target_time = self.today + timedelta(days=1)
            
            if hour:
                h = int(hour)
                if period in ['下午', '傍晚', '晚上'] and h < 12:
                    h += 12
                m = 30 if minute == '半' else (int(minute) if minute else 0)
                target_time = target_time.replace(hour=h, minute=m)
            elif period:
                target_time = target_time.replace(hour=self.TIME_PERIOD.get(period, 9), minute=0)
            else:
                target_time = target_time.replace(hour=9, minute=0)  # 默认明天上午
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'tomorrow',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_day_after_tomorrow(self, text: str) -> List[Dict]:
        """检测后天的时间"""
        results = []
        pattern = re.compile(r'(后天)\s*(早上|早晨|上午|中午|下午|傍晚|晚上|夜间|深夜|凌晨)?\s*(\d{1,2})?\s*[:点]?\s*(\d{1,2}|半)?\s*(分)?')
        
        for match in pattern.finditer(text):
            period = match.group(2)
            hour = match.group(3)
            minute = match.group(4)
            
            target_time = self.today + timedelta(days=2)
            
            if hour:
                h = int(hour)
                if period in ['下午', '傍晚', '晚上'] and h < 12:
                    h += 12
                m = 30 if minute == '半' else (int(minute) if minute else 0)
                target_time = target_time.replace(hour=h, minute=m)
            elif period:
                target_time = target_time.replace(hour=self.TIME_PERIOD.get(period, 9), minute=0)
            else:
                target_time = target_time.replace(hour=9, minute=0)
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'day_after_tomorrow',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_weekday(self, text: str) -> List[Dict]:
        """检测星期几"""
        results = []
        pattern = re.compile(r'(本|这|下|下下)?\s*(?:周|星期|礼拜)\s*([一二三四五六日天1234567])\s*(早上|早晨|上午|中午|下午|傍晚|晚上|夜间|深夜|凌晨)?\s*(\d{1,2})?\s*[:点]?\s*(\d{1,2}|半)?\s*(分)?')
        
        for match in pattern.finditer(text):
            week_modifier = match.group(1) or '本'
            weekday_str = match.group(2)
            period = match.group(3)
            hour = match.group(4)
            minute = match.group(5)
            
            # 获取目标星期
            target_weekday = self.WEEKDAY_MAP.get(weekday_str, 0)
            current_weekday = self.today.weekday()
            
            # 计算偏移天数
            if week_modifier in ['本', '这']:
                days_offset = target_weekday - current_weekday
                if days_offset < 0:
                    days_offset += 7  # 如果已过，取下周
            elif week_modifier == '下':
                days_offset = target_weekday - current_weekday + 7
            elif week_modifier == '下下':
                days_offset = target_weekday - current_weekday + 14
            else:
                days_offset = target_weekday - current_weekday
                if days_offset <= 0:
                    days_offset += 7
            
            target_time = self.today + timedelta(days=days_offset)
            
            if hour:
                h = int(hour)
                if period in ['下午', '傍晚', '晚上'] and h < 12:
                    h += 12
                m = 30 if minute == '半' else (int(minute) if minute else 0)
                target_time = target_time.replace(hour=h, minute=m)
            elif period:
                target_time = target_time.replace(hour=self.TIME_PERIOD.get(period, 9), minute=0)
            else:
                target_time = target_time.replace(hour=9, minute=0)
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'weekday',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_month_day(self, text: str) -> List[Dict]:
        """检测具体月日"""
        results = []
        pattern = re.compile(r'(\d{1,2})\s*月\s*(\d{1,2})\s*日?\s*(早上|早晨|上午|中午|下午|傍晚|晚上|夜间|深夜|凌晨)?\s*(\d{1,2})?\s*[:点]?\s*(\d{1,2}|半)?\s*(分)?')
        
        for match in pattern.finditer(text):
            month = int(match.group(1))
            day = int(match.group(2))
            period = match.group(3)
            hour = match.group(4)
            minute = match.group(5)
            
            # 构建目标日期
            year = self.today.year
            try:
                target_time = datetime(year, month, day)
                
                # 如果日期已过，假设是明年
                if target_time < self.today:
                    target_time = datetime(year + 1, month, day)
                
                if hour:
                    h = int(hour)
                    if period in ['下午', '傍晚', '晚上'] and h < 12:
                        h += 12
                    m = 30 if minute == '半' else (int(minute) if minute else 0)
                    target_time = target_time.replace(hour=h, minute=m)
                elif period:
                    target_time = target_time.replace(hour=self.TIME_PERIOD.get(period, 9), minute=0)
                else:
                    target_time = target_time.replace(hour=9, minute=0)
                
                results.append({
                    'original': match.group(0),
                    'datetime': target_time,
                    'type': 'month_day',
                    'reminder_time': self._calculate_reminder(target_time)
                })
            except ValueError:
                continue
        
        return results
    
    def _detect_days_later(self, text: str) -> List[Dict]:
        """检测X天后"""
        results = []
        pattern = re.compile(r'(\d{1,2}|几|两|三|四|五|六|七|八|九|十)\s*天\s*后')
        
        for match in pattern.finditer(text):
            num_str = match.group(1)
            days = self.NUMBER_MAP.get(num_str, 3) if num_str in self.NUMBER_MAP else int(num_str)
            
            target_time = self.today + timedelta(days=days)
            target_time = target_time.replace(hour=9, minute=0)
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'days_later',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_weeks_later(self, text: str) -> List[Dict]:
        """检测X周后"""
        results = []
        pattern = re.compile(r'(\d{1,2}|几|两|三|四|五|六|七|八|九|十)\s*周\s*后')
        
        for match in pattern.finditer(text):
            num_str = match.group(1)
            weeks = self.NUMBER_MAP.get(num_str, 1) if num_str in self.NUMBER_MAP else int(num_str)
            
            target_time = self.today + timedelta(weeks=weeks)
            target_time = target_time.replace(hour=9, minute=0)
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'weeks_later',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_before_date(self, text: str) -> List[Dict]:
        """检测X月X日前（提前一天提醒）"""
        results = []
        pattern = re.compile(r'(\d{1,2})\s*月\s*(\d{1,2})\s*日?\s*(前|之前|以前)')
        
        for match in pattern.finditer(text):
            month = int(match.group(1))
            day = int(match.group(2))
            
            year = self.today.year
            try:
                # 截止日期
                deadline = datetime(year, month, day, 23, 59)
                if deadline < self.today:
                    deadline = datetime(year + 1, month, day, 23, 59)
                
                # 提醒时间：提前一天上午9点
                reminder_time = deadline - timedelta(days=1)
                reminder_time = reminder_time.replace(hour=9, minute=0)
                
                results.append({
                    'original': match.group(0),
                    'datetime': deadline,
                    'type': 'before_date',
                    'reminder_time': reminder_time,
                    'is_deadline': True
                })
            except ValueError:
                continue
        
        return results
    
    def _detect_month_period(self, text: str) -> List[Dict]:
        """检测月底/月初/月中"""
        results = []
        pattern = re.compile(r'(月底|月初|月中|月末|月尾)')
        
        for match in pattern.finditer(text):
            period = match.group(1)
            
            current_month = self.today.month
            current_year = self.today.year
            
            if period in ['月底', '月末', '月尾']:
                # 月末最后一天
                if current_month == 12:
                    target_time = datetime(current_year + 1, 1, 1) - timedelta(days=1)
                else:
                    target_time = datetime(current_year, current_month + 1, 1) - timedelta(days=1)
                target_time = target_time.replace(hour=17, minute=0)
            elif period == '月初':
                target_time = datetime(current_year, current_month, 5, 9, 0)
                if target_time < self.today:
                    if current_month == 12:
                        target_time = datetime(current_year + 1, 1, 5, 9, 0)
                    else:
                        target_time = datetime(current_year, current_month + 1, 5, 9, 0)
            else:  # 月中
                target_time = datetime(current_year, current_month, 15, 9, 0)
                if target_time < self.today:
                    if current_month == 12:
                        target_time = datetime(current_year + 1, 1, 15, 9, 0)
                    else:
                        target_time = datetime(current_year, current_month + 1, 15, 9, 0)
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'month_period',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _detect_weekend(self, text: str) -> List[Dict]:
        """检测周末"""
        results = []
        pattern = re.compile(r'(本|这|下)?\s*周末\s*(早上|早晨|上午|中午|下午|傍晚|晚上|夜间|深夜|凌晨)?')
        
        for match in pattern.finditer(text):
            modifier = match.group(1) or '本'
            period = match.group(2)
            
            current_weekday = self.today.weekday()
            
            if modifier in ['本', '这']:
                # 本周六
                days_to_saturday = 5 - current_weekday
                if days_to_saturday < 0:
                    days_to_saturday += 7
            else:  # 下周
                days_to_saturday = 5 - current_weekday + 7
            
            target_time = self.today + timedelta(days=days_to_saturday)
            
            if period:
                target_time = target_time.replace(hour=self.TIME_PERIOD.get(period, 9), minute=0)
            else:
                target_time = target_time.replace(hour=9, minute=0)
            
            results.append({
                'original': match.group(0),
                'datetime': target_time,
                'type': 'weekend',
                'reminder_time': self._calculate_reminder(target_time)
            })
        
        return results
    
    def _calculate_reminder(self, target_time: datetime) -> datetime:
        """
        计算提醒时间
        - 当天任务：提前30分钟
        - 非当天任务：提前1小时
        """
        if target_time.date() == self.today.date():
            return target_time - timedelta(minutes=30)
        else:
            return target_time - timedelta(hours=1)
    
    def _deduplicate_and_sort(self, results: List[Dict]) -> List[Dict]:
        """去重并按时间排序"""
        # 使用datetime作为去重键
        seen = set()
        unique_results = []
        
        for r in results:
            key = r['datetime'].strftime('%Y-%m-%d %H:%M')
            if key not in seen:
                seen.add(key)
                unique_results.append(r)
        
        # 按时间排序
        unique_results.sort(key=lambda x: x['datetime'])
        
        return unique_results
    
    def format_time(self, dt: datetime) -> str:
        """格式化时间输出"""
        return dt.strftime('%Y年%m月%d日 %H:%M')
    
    def is_overdue(self, dt: datetime) -> bool:
        """检查是否已逾期"""
        return dt < self.reference_time


# 测试代码
if __name__ == '__main__':
    detector = TimeDetector()
    
    test_texts = [
        "我们今天下午3点开会",
        "明天上午9点之前要完成",
        "本周五下班前给我",
        "3月15日前提交报告",
        "下周二下午2点见客户",
        "后天早上8点出发"
    ]
    
    for text in test_texts:
        print(f"\n文本: {text}")
        times = detector.detect(text)
        for t in times:
            print(f"  检测到: {t['original']} -> {detector.format_time(t['datetime'])}")

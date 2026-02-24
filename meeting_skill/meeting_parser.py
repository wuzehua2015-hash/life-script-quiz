"""
会议解析模块 - 解析会议内容，提取关键信息
"""

import re
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


@dataclass
class MeetingInfo:
    """会议信息数据结构"""
    date: str                           # 会议日期
    participants: List[str] = field(default_factory=list)  # 参与人
    topic: str = ""                     # 主题
    duration: str = ""                  # 时长
    content: str = ""                   # 原始内容
    tasks: List[Dict] = field(default_factory=list)        # 任务列表
    key_points: List[str] = field(default_factory=list)    # 关键要点
    decisions: List[str] = field(default_factory=list)     # 决策事项
    next_meeting: Optional[str] = None  # 下次会议


class MeetingParser:
    """会议内容解析器"""
    
    def __init__(self):
        self.content = ""
        self.info = MeetingInfo(date=datetime.now().strftime('%Y-%m-%d'))
    
    def parse(self, content: str) -> MeetingInfo:
        """
        解析会议内容
        
        Args:
            content: 会议原始内容（语音转文字或文字）
            
        Returns:
            MeetingInfo: 解析后的会议信息
        """
        self.content = content
        self.info.content = content
        
        # 提取日期
        self.info.date = self._extract_date(content)
        
        # 提取参与人
        self.info.participants = self._extract_participants(content)
        
        # 提取主题
        self.info.topic = self._extract_topic(content)
        
        # 提取时长
        self.info.duration = self._extract_duration(content)
        
        # 提取关键要点
        self.info.key_points = self._extract_key_points(content)
        
        # 提取决策事项
        self.info.decisions = self._extract_decisions(content)
        
        # 提取下次会议
        self.info.next_meeting = self._extract_next_meeting(content)
        
        return self.info
    
    def _extract_date(self, content: str) -> str:
        """提取会议日期"""
        # 尝试匹配各种日期格式
        patterns = [
            r'(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})[日]?',
            r'(\d{4})(\d{2})(\d{2})',
            r'(\d{1,2})[月](\d{1,2})[日]',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                groups = match.groups()
                if len(groups) == 3:
                    return f"{groups[0]}-{int(groups[1]):02d}-{int(groups[2]):02d}"
                elif len(groups) == 2:
                    year = datetime.now().year
                    return f"{year}-{int(groups[0]):02d}-{int(groups[1]):02d}"
        
        # 如果没有找到日期，使用今天
        return datetime.now().strftime('%Y-%m-%d')
    
    def _extract_participants(self, content: str) -> List[str]:
        """提取参与人"""
        participants = []
        
        # 常见模式
        patterns = [
            r'参与人[：:]\s*([^\n]+)',
            r'参会人[：:]\s*([^\n]+)',
            r'与会人[：:]\s*([^\n]+)',
            r'出席[：:]\s*([^\n]+)',
            r'([\u4e00-\u9fa5]{2,4})[、,，和与]+([\u4e00-\u9fa5]{2,4}).*?一起',
            r'([\u4e00-\u9fa5]{2,4})[、,，和与]+([\u4e00-\u9fa5]{2,4}).*?会议',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                if isinstance(match, tuple):
                    for name in match:
                        if len(name) >= 2 and name not in ['我们', '大家', '一起', '会议']:
                            participants.append(name)
                else:
                    # 分割多个名字
                    names = re.split(r'[、,，/\\s]+', match)
                    for name in names:
                        name = name.strip()
                        if len(name) >= 2 and name not in ['我们', '大家', '一起', '会议']:
                            participants.append(name)
        
        # 去重
        return list(set(participants))
    
    def _extract_topic(self, content: str) -> str:
        """提取会议主题"""
        patterns = [
            r'主题[：:]\s*([^\n]+)',
            r'议题[：:]\s*([^\n]+)',
            r'关于\s*([^\n]{3,30})\s*的会议',
            r'讨论\s*([^\n]{3,30})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()
        
        # 如果没有明确主题，取前30字作为主题
        first_line = content.strip().split('\n')[0]
        if len(first_line) > 30:
            return first_line[:30] + '...'
        return first_line
    
    def _extract_duration(self, content: str) -> str:
        """提取会议时长"""
        patterns = [
            r'时长[：:]\s*([^\n]+)',
            r'大约?\s*(\d+)\s*分钟',
            r'约\s*(\d+)\s*分钟',
            r'(\d+)\s*分钟?\s*左右',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                if '时长' in pattern:
                    return match.group(1).strip()
                else:
                    return f"约{match.group(1)}分钟"
        
        return ""
    
    def _extract_key_points(self, content: str) -> List[str]:
        """提取关键要点"""
        key_points = []
        
        # 寻找列表项
        list_patterns = [
            r'[\n\r][\s]*[•·\-\*\d]+[\.、)）\s]+([^\n]+)',
            r'[\n\r][\s]*([一二三四五六七八九十]+[、.)）\s]+[^\n]+)',
            r'[\n\r][\s]*(\d+[、.)）\s]+[^\n]+)',
        ]
        
        for pattern in list_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                point = match.strip()
                if len(point) > 5 and len(point) < 200:
                    key_points.append(point)
        
        # 去重并限制数量
        key_points = list(set(key_points))[:10]
        
        return key_points
    
    def _extract_decisions(self, content: str) -> List[str]:
        """提取决策事项"""
        decisions = []
        
        # 决策关键词
        decision_keywords = ['决定', '确定', '同意', '通过', '选定', '定下来']
        
        sentences = re.split(r'[。！？\n]', content)
        for sentence in sentences:
            for keyword in decision_keywords:
                if keyword in sentence:
                    # 提取包含决策词的句子
                    if len(sentence) > 10 and len(sentence) < 150:
                        decisions.append(sentence.strip())
                        break
        
        # 去重
        return list(set(decisions))[:5]
    
    def _extract_next_meeting(self, content: str) -> Optional[str]:
        """提取下次会议安排"""
        patterns = [
            r'下次会议[：:]\s*([^\n]+)',
            r'下次[在定于]\s*([^\n]+)',
            r'下回\s*([^\n]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()
        
        return None
    
    def to_markdown(self, info: MeetingInfo = None) -> str:
        """
        将会议信息转换为Markdown格式
        
        Args:
            info: 会议信息，默认使用self.info
            
        Returns:
            str: Markdown格式的会议纪要
        """
        if info is None:
            info = self.info
        
        md = f"""# 会议纪要

## 基本信息

| 项目 | 内容 |
|------|------|
| 日期 | {info.date} |
| 参与人 | {', '.join(info.participants) if info.participants else '待定'} |
| 主题 | {info.topic} |
"""
        
        if info.duration:
            md += f"| 时长 | {info.duration} |\n"
        
        if info.key_points:
            md += "\n## 关键要点\n\n"
            for i, point in enumerate(info.key_points, 1):
                md += f"{i}. {point}\n"
        
        if info.decisions:
            md += "\n## 决策事项\n\n"
            for i, decision in enumerate(info.decisions, 1):
                md += f"{i}. {decision}\n"
        
        if info.next_meeting:
            md += f"\n## 下次会议\n\n{info.next_meeting}\n"
        
        md += "\n---\n*由智能会议纪要Skill自动生成*\n"
        
        return md


# 测试代码
if __name__ == '__main__':
    parser = MeetingParser()
    
    test_content = """
    2026年2月23日会议
    参与人：PTK、梁羽萱
    主题：年后工作重点梳理
    
    今天讨论了几个重要事项：
    1. 联系娜姐确认外贸人才培训时间
    2. 拉群处理租房事宜
    3. 确定三月讲座时间
    
    我们决定下周开始执行新方案。
    """
    
    info = parser.parse(test_content)
    print(parser.to_markdown(info))

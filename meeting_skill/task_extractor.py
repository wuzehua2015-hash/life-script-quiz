"""
任务提取模块 - 从会议内容中提取待办事项
识别任务描述、负责人、时间节点
"""

import re
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass


@dataclass
class Task:
    """任务数据结构"""
    description: str          # 任务描述
    assignee: Optional[str]   # 负责人
    deadline: Optional[str]   # 截止时间（原始文本）
    deadline_datetime: Optional[str] = None  # 解析后的时间
    has_time: bool = False    # 是否有明确时间
    priority: str = "normal"  # 优先级: urgent, important, normal, low
    status: str = "pending"   # 状态: pending, in_progress, completed, overdue
    source_text: str = ""     # 原始文本


class TaskExtractor:
    """任务提取器"""
    
    # 任务关键词
    TASK_KEYWORDS = [
        '要', '需要', '必须', '得', '应该', '务必',
        '完成', '做好', '处理', '跟进', '联系', '确认',
        '准备', '整理', '提交', '发送', '安排', '落实',
        '催', '盯', '推动', '协调', '组织', '负责'
    ]
    
    # 负责人关键词
    ASSIGNEE_PATTERNS = [
        r'由\s*([^负负]+?)\s*负责',
        r'([^负负]+?)\s*负责',
        r'([^负负]+?)\s*跟进',
        r'([^负负]+?)\s*处理',
        r'([^负负]+?)\s*去',
        r'([^负负]+?)\s*来',
        r'交给\s*([^负负]+?)',
        r'让\s*([^负负]+?)\s*',
    ]
    
    # 优先级关键词
    PRIORITY_KEYWORDS = {
        'urgent': ['紧急', '马上', '立即', '今天', '今晚', '立刻', 'urgent', 'asap'],
        'important': ['重要', '优先', '尽快', '这两天', '本周', 'important'],
        'low': ['不急', '有空', '顺便', 'low']
    }
    
    def __init__(self):
        self.tasks: List[Task] = []
    
    def extract(self, text: str, time_detector=None) -> List[Task]:
        """
        从文本中提取任务
        
        Args:
            text: 会议内容文本
            time_detector: 时间检测器实例（可选）
            
        Returns:
            List[Task]: 提取的任务列表
        """
        self.tasks = []
        
        # 按句子分割
        sentences = self._split_sentences(text)
        
        for sentence in sentences:
            # 检查是否包含任务关键词
            if self._is_task_sentence(sentence):
                task = self._parse_task(sentence, time_detector)
                if task:
                    self.tasks.append(task)
        
        return self.tasks
    
    def _split_sentences(self, text: str) -> List[str]:
        """将文本分割成句子"""
        # 使用多种分隔符
        separators = r'[。！？\n；;]'
        sentences = re.split(separators, text)
        # 清理并过滤空句子
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences
    
    def _is_task_sentence(self, sentence: str) -> bool:
        """判断句子是否包含任务"""
        # 检查任务关键词
        for keyword in self.TASK_KEYWORDS:
            if keyword in sentence:
                return True
        
        # 检查是否是待办句式
        todo_patterns = [
            r'.*要.*',
            r'.*得.*',
            r'.*把.*',
            r'.*给.*',
            r'.*让.*',
        ]
        for pattern in todo_patterns:
            if re.match(pattern, sentence):
                return True
        
        return False
    
    def _parse_task(self, sentence: str, time_detector=None) -> Optional[Task]:
        """解析单个任务"""
        # 提取任务描述
        description = self._extract_description(sentence)
        
        # 提取负责人
        assignee = self._extract_assignee(sentence)
        
        # 提取时间
        deadline, deadline_dt, has_time = self._extract_deadline(sentence, time_detector)
        
        # 判断优先级
        priority = self._determine_priority(sentence)
        
        return Task(
            description=description,
            assignee=assignee,
            deadline=deadline,
            deadline_datetime=deadline_dt,
            has_time=has_time,
            priority=priority,
            source_text=sentence
        )
    
    def _extract_description(self, sentence: str) -> str:
        """提取任务描述"""
        # 去除常见的非任务部分
        description = sentence
        
        # 去除时间部分
        time_patterns = [
            r'今天.*?[点分]',
            r'明天.*?[点分]',
            r'后天.*?[点分]',
            r'本周.*?[日前]',
            r'下周.*?[日前]',
            r'\d{1,2}月\d{1,2}日?.*?[前日前]',
        ]
        for pattern in time_patterns:
            description = re.sub(pattern, '', description)
        
        # 清理
        description = description.strip('，,。. ')
        
        # 如果太长，截取核心部分
        if len(description) > 50:
            # 尝试找到动词
            verbs = ['完成', '做好', '处理', '跟进', '联系', '确认', '准备', '整理', '提交', '发送', '安排', '落实']
            for verb in verbs:
                if verb in description:
                    idx = description.find(verb)
                    description = description[idx:]
                    break
        
        return description[:100]  # 限制长度
    
    def _extract_assignee(self, sentence: str) -> Optional[str]:
        """提取负责人"""
        # 常见人名模式
        name_patterns = [
            r'([\u4e00-\u9fa5]{2,4})\s*(?:负责|跟进|处理|去|来|做)',
            r'(?:由|让|叫|给)\s*([\u4e00-\u9fa5]{2,4})',
            r'([\u4e00-\u9fa5]{2,4})\s*(?:你|我|他|她)',
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, sentence)
            if match:
                name = match.group(1).strip()
                # 过滤掉常见非人名词
                exclude_words = ['我们', '你们', '他们', '大家', '公司', '部门', '团队', '这个', '那个']
                if name not in exclude_words and len(name) >= 2:
                    return name
        
        return None
    
    def _extract_deadline(self, sentence: str, time_detector=None) -> Tuple[Optional[str], Optional[str], bool]:
        """
        提取截止时间
        
        Returns:
            (原始时间文本, 解析后的时间, 是否有明确时间)
        """
        # 时间关键词模式
        time_patterns = [
            (r'(今天.*?[点分前])', True),
            (r'(明天.*?[点分前])', True),
            (r'(后天.*?[点分前])', True),
            (r'(本周[一二三四五六日天].*?[前日])', True),
            (r'(下周[一二三四五六日天].*?[前日])', True),
            (r'(\d{1,2}月\d{1,2}日?.*?[前日前])', True),
            (r'(月底|月初|月中|月末)', True),
            (r'(本周|这周|下周).*?完成', True),
            (r'(尽快|这两天|近期|马上|立即)', False),
        ]
        
        for pattern, has_time in time_patterns:
            match = re.search(pattern, sentence)
            if match:
                time_text = match.group(1)
                
                # 如果有时间检测器，解析具体时间
                parsed_time = None
                if time_detector and has_time:
                    times = time_detector.detect(time_text)
                    if times:
                        parsed_time = times[0]['datetime'].strftime('%Y-%m-%d %H:%M')
                
                return time_text, parsed_time, has_time
        
        return None, None, False
    
    def _determine_priority(self, sentence: str) -> str:
        """判断任务优先级"""
        sentence_lower = sentence.lower()
        
        for priority, keywords in self.PRIORITY_KEYWORDS.items():
            for keyword in keywords:
                if keyword in sentence_lower:
                    return priority
        
        return 'normal'
    
    def get_tasks_by_priority(self) -> Dict[str, List[Task]]:
        """按优先级分组获取任务"""
        result = {'urgent': [], 'important': [], 'normal': [], 'low': []}
        for task in self.tasks:
            result[task.priority].append(task)
        return result
    
    def get_tasks_by_assignee(self) -> Dict[str, List[Task]]:
        """按负责人分组获取任务"""
        result = {}
        for task in self.tasks:
            assignee = task.assignee or '未分配'
            if assignee not in result:
                result[assignee] = []
            result[assignee].append(task)
        return result
    
    def get_tasks_with_deadline(self) -> List[Task]:
        """获取有明确截止时间的任务"""
        return [t for t in self.tasks if t.has_time and t.deadline_datetime]
    
    def get_tasks_without_deadline(self) -> List[Task]:
        """获取无明确截止时间的任务"""
        return [t for t in self.tasks if not t.has_time or not t.deadline_datetime]


# 测试代码
if __name__ == '__main__':
    extractor = TaskExtractor()
    
    test_text = """
    今天会议确定了几件事：
    1. PTK负责联系客户，今天下午3点前要完成
    2. 梁羽萱需要整理报告，明天上午提交
    3. 我们要尽快确定方案
    4. 由王经理跟进这个项目，本周五前给反馈
    """
    
    tasks = extractor.extract(test_text)
    print(f"提取到 {len(tasks)} 个任务：")
    for task in tasks:
        print(f"- {task.description}")
        print(f"  负责人: {task.assignee or '未分配'}")
        print(f"  截止时间: {task.deadline or '未指定'}")
        print(f"  优先级: {task.priority}")
        print()

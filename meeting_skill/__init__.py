"""
智能会议纪要 Skill
自动解析会议内容，提取任务、时间节点，生成结构化纪要
"""

from .meeting_parser import MeetingParser
from .task_extractor import TaskExtractor
from .time_detector import TimeDetector
from .reminder_scheduler import ReminderScheduler
from .meeting_commands import MeetingCommands

__version__ = "1.0.0"
__all__ = [
    "MeetingParser",
    "TaskExtractor", 
    "TimeDetector",
    "ReminderScheduler",
    "MeetingCommands"
]

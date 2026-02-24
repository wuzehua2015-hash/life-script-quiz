# 八字命理分析 Skill 初始化文件

from .bazi_core import calculate_bazi, analyze_geju
from .bazi_analyzer import generate_report, BaziAnalyzer
from .bazi_storage import (
    save_bazi_record, 
    query_bazi_record, 
    list_bazi_records,
    delete_bazi_record
)
from .bazi_commands import handle_command, paipan, analyze

__version__ = '1.0.0'
__all__ = [
    'calculate_bazi',
    'analyze_geju', 
    'generate_report',
    'BaziAnalyzer',
    'save_bazi_record',
    'query_bazi_record',
    'list_bazi_records',
    'delete_bazi_record',
    'handle_command',
    'paipan',
    'analyze'
]

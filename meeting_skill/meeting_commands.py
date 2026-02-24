"""
命令接口模块 - 提供会议纪要的命令行接口
"""

import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Tuple

from .meeting_parser import MeetingParser, MeetingInfo
from .task_extractor import TaskExtractor, Task
from .time_detector import TimeDetector
from .reminder_scheduler import ReminderScheduler


class MeetingCommands:
    """会议纪要命令接口"""
    
    MEETINGS_DIR = "/root/.openclaw/workspace/meetings"
    PTK_TRACKING_FILE = "/root/.openclaw/workspace/PTK创业追踪.md"
    
    def __init__(self):
        self.parser = MeetingParser()
        self.task_extractor = TaskExtractor()
        self.time_detector = TimeDetector()
        self.scheduler = ReminderScheduler()
        
        # 确保目录存在
        os.makedirs(self.MEETINGS_DIR, exist_ok=True)
    
    def process_meeting(self, content: str, date: Optional[str] = None) -> Dict:
        """
        处理会议内容，生成纪要
        
        Args:
            content: 会议内容
            date: 会议日期，默认为今天
            
        Returns:
            Dict: 处理结果
        """
        # 解析会议信息
        meeting_info = self.parser.parse(content)
        
        if date:
            meeting_info.date = date
        
        # 提取任务
        tasks = self.task_extractor.extract(content, self.time_detector)
        meeting_info.tasks = [self._task_to_dict(t) for t in tasks]
        
        # 生成Markdown
        markdown = self._generate_full_markdown(meeting_info, tasks)
        
        # 保存文件
        filename = f"{meeting_info.date}.md"
        filepath = os.path.join(self.MEETINGS_DIR, filename)
        
        # 检查文件是否存在，如果存在则追加
        if os.path.exists(filepath):
            with open(filepath, 'a', encoding='utf-8') as f:
                f.write(f"\n\n---\n\n{markdown}")
        else:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(markdown)
        
        # 创建提醒
        reminders = self.scheduler.add_reminders_from_tasks(
            meeting_info.tasks,
            filepath,
            self.time_detector
        )
        
        # 同步到PTK追踪系统
        self._sync_to_ptk_tracking(meeting_info, tasks)
        
        return {
            'success': True,
            'filepath': filepath,
            'meeting_info': meeting_info,
            'tasks_count': len(tasks),
            'reminders_count': len(reminders),
            'markdown': markdown
        }
    
    def _generate_full_markdown(self, info: MeetingInfo, tasks: List[Task]) -> str:
        """生成完整的会议纪要Markdown"""
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
        
        # 待办事项
        if tasks:
            md += "\n## 待办事项\n\n"
            
            # 按优先级分组
            urgent = [t for t in tasks if t.priority == 'urgent']
            important = [t for t in tasks if t.priority == 'important']
            normal = [t for t in tasks if t.priority == 'normal']
            low = [t for t in tasks if t.priority == 'low']
            
            if urgent:
                md += "### 🔴 紧急\n\n"
                md += self._format_task_table(urgent)
            
            if important:
                md += "\n### 🟡 重要\n\n"
                md += self._format_task_table(important)
            
            if normal:
                md += "\n### 🟢 普通\n\n"
                md += self._format_task_table(normal)
            
            if low:
                md += "\n### ⚪ 低优先级\n\n"
                md += self._format_task_table(low)
        
        # 关键要点
        if info.key_points:
            md += "\n## 关键要点\n\n"
            for i, point in enumerate(info.key_points, 1):
                md += f"{i}. {point}\n"
        
        # 决策事项
        if info.decisions:
            md += "\n## 决策事项\n\n"
            for i, decision in enumerate(info.decisions, 1):
                md += f"{i}. {decision}\n"
        
        # 原始内容
        md += f"\n## 原始记录\n\n```\n{info.content}\n```\n"
        
        md += f"\n---\n*生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}*\n"
        
        return md
    
    def _format_task_table(self, tasks: List[Task]) -> str:
        """格式化任务表格"""
        md = "| 序号 | 事项 | 负责人 | 截止时间 | 状态 |\n"
        md += "|------|------|--------|----------|------|\n"
        
        for i, task in enumerate(tasks, 1):
            assignee = task.assignee or '待定'
            deadline = task.deadline or '未指定'
            status = '⏳' if task.status == 'pending' else '✅'
            md += f"| {i} | {task.description} | {assignee} | {deadline} | {status} |\n"
        
        return md
    
    def _task_to_dict(self, task: Task) -> Dict:
        """将Task对象转换为字典"""
        return {
            'description': task.description,
            'assignee': task.assignee,
            'deadline': task.deadline,
            'deadline_datetime': task.deadline_datetime,
            'has_time': task.has_time,
            'priority': task.priority,
            'status': task.status
        }
    
    def _sync_to_ptk_tracking(self, meeting_info: MeetingInfo, tasks: List[Task]):
        """同步到PTK创业追踪.md"""
        if not os.path.exists(self.PTK_TRACKING_FILE):
            return
        
        try:
            with open(self.PTK_TRACKING_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 找到待办事项追踪部分
            todo_section = "## 待办事项追踪"
            if todo_section in content:
                # 在紧急部分添加新任务
                urgent_section = "### 🔴 紧急（今天完成）"
                if urgent_section in content:
                    urgent_tasks = [t for t in tasks if t.priority == 'urgent']
                    if urgent_tasks:
                        # 找到表格末尾
                        insert_pos = content.find(urgent_section)
                        table_end = content.find("### 🟡", insert_pos)
                        if table_end == -1:
                            table_end = len(content)
                        
                        # 这里简化处理，实际可以更精细
                        # TODO: 实现更精细的同步逻辑
                        pass
            
            # 更新客户跟进状态
            self._update_customer_tracking(content, tasks)
            
        except Exception as e:
            print(f"同步到PTK追踪失败: {e}")
    
    def _update_customer_tracking(self, content: str, tasks: List[Task]):
        """更新客户跟进状态"""
        # 从任务中提取客户名
        customer_keywords = ['客户', '联系', '跟进']
        # 简化实现
        pass
    
    def get_today_todos(self) -> str:
        """
        获取今日待办
        
        Returns:
            str: 格式化的今日待办列表
        """
        summary = self.scheduler.get_daily_summary()
        
        result = "📋 今日待办\n\n"
        
        # 从提醒中获取今日任务
        today_reminders = self.scheduler.get_today_reminders()
        
        if today_reminders:
            for i, reminder in enumerate(today_reminders, 1):
                result += f"{i}. {reminder.task_description}\n"
                if reminder.assignee:
                    result += f"   👤 {reminder.assignee}\n"
                if reminder.deadline:
                    deadline = datetime.fromisoformat(reminder.deadline)
                    result += f"   ⏰ {deadline.strftime('%H:%M')}\n"
                result += "\n"
        else:
            result += "今日暂无待办任务 🎉\n"
        
        # 统计信息
        result += f"\n---\n"
        result += f"总计: {summary['total']} | 待完成: {summary['pending']} | 已完成: {summary['completed']} | 逾期: {summary['overdue']}\n"
        
        return result
    
    def get_week_meetings(self) -> str:
        """
        获取本周会议列表
        
        Returns:
            str: 格式化的本周会议列表
        """
        today = datetime.now()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=7)
        
        result = "📅 本周会议\n\n"
        
        # 获取本周的会议文件
        meetings = []
        for i in range(7):
            date = week_start + timedelta(days=i)
            filename = date.strftime('%Y-%m-%d') + '.md'
            filepath = os.path.join(self.MEETINGS_DIR, filename)
            
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # 提取主题
                    topic_match = re.search(r'主题\s*\|\s*([^\|]+)', content)
                    topic = topic_match.group(1).strip() if topic_match else '未命名'
                    meetings.append((date.strftime('%m月%d日'), topic, filepath))
        
        if meetings:
            for date, topic, filepath in meetings:
                result += f"• **{date}** - {topic}\n"
        else:
            result += "本周暂无会议记录\n"
        
        return result
    
    def postpone_task(self, task_name: str, new_time: str) -> Dict:
        """
        延期任务
        
        Args:
            task_name: 任务名称/关键词
            new_time: 新时间
            
        Returns:
            Dict: 操作结果
        """
        # 解析新时间
        times = self.time_detector.detect(new_time)
        if not times:
            return {'success': False, 'error': '无法解析新时间'}
        
        new_datetime = times[0]['datetime']
        
        # 查找匹配的任务
        updated = []
        for reminder in self.scheduler.reminders:
            if task_name in reminder.task_description:
                # 更新提醒时间
                reminder.remind_at = (new_datetime - timedelta(hours=1)).isoformat()
                if reminder.deadline:
                    reminder.deadline = new_datetime.isoformat()
                updated.append(reminder)
        
        if updated:
            self.scheduler._save_reminders()
            return {
                'success': True,
                'updated_count': len(updated),
                'new_time': new_datetime.strftime('%Y-%m-%d %H:%M')
            }
        else:
            return {'success': False, 'error': '未找到匹配的任务'}
    
    def get_daily_prompt(self) -> str:
        """
        获取每日索要会议纪要的提示
        
        Returns:
            str: 提示消息
        """
        today = datetime.now()
        weekday_names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        weekday = weekday_names[today.weekday()]
        
        return f"老板，今天是{today.month}月{today.day}日{weekday}，今天有会议纪要吗？有的话发给我，我帮你整理。"
    
    def should_ask_for_meeting(self) -> bool:
        """
        判断是否应该索要会议纪要
        工作日（周一到周五）晚上18:00后
        
        Returns:
            bool: 是否应该索要
        """
        now = datetime.now()
        
        # 检查是否是工作日
        if now.weekday() >= 5:  # 周六、周日
            return False
        
        # 检查时间是否是18:00后
        if now.hour < 18:
            return False
        
        # 检查今天是否已经有会议纪要
        today_file = os.path.join(self.MEETINGS_DIR, now.strftime('%Y-%m-%d') + '.md')
        if os.path.exists(today_file):
            return False
        
        return True


# 测试代码
if __name__ == '__main__':
    commands = MeetingCommands()
    
    # 测试处理会议
    test_content = """
    今天和梁羽萱讨论了年后工作重点。
    1. PTK要联系深圳商会张立新，今天拉群
    2. 梁羽萱负责催星汉打款，明天上午完成
    3. 我们要确定三月讲座时间，本周五前决定
    """
    
    result = commands.process_meeting(test_content)
    print(f"处理结果: {result['success']}")
    print(f"任务数: {result['tasks_count']}")
    print(f"提醒数: {result['reminders_count']}")

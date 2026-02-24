"""
提醒调度模块 - 管理提醒任务的创建、更新和执行
"""

import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Callable
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class Reminder:
    """提醒任务数据结构"""
    id: str                     # 唯一ID
    task_description: str       # 任务描述
    remind_at: str             # 提醒时间 (ISO格式)
    deadline: Optional[str]    # 截止时间
    assignee: Optional[str]    # 负责人
    source_meeting: str        # 来源会议文件
    status: str = "pending"    # 状态: pending, reminded, completed, snoozed
    created_at: str = ""       # 创建时间
    reminded_at: Optional[str] = None  # 实际提醒时间
    
    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()


class ReminderScheduler:
    """提醒调度器"""
    
    REMINDERS_FILE = "/root/.openclaw/workspace/meeting_reminders.json"
    
    def __init__(self):
        self.reminders: List[Reminder] = []
        self._load_reminders()
    
    def _load_reminders(self):
        """从文件加载提醒任务"""
        if os.path.exists(self.REMINDERS_FILE):
            try:
                with open(self.REMINDERS_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for item in data:
                        self.reminders.append(Reminder(**item))
            except Exception as e:
                print(f"加载提醒任务失败: {e}")
    
    def _save_reminders(self):
        """保存提醒任务到文件"""
        try:
            data = [asdict(r) for r in self.reminders]
            with open(self.REMINDERS_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"保存提醒任务失败: {e}")
    
    def add_reminder(
        self,
        task_description: str,
        remind_at: datetime,
        deadline: Optional[datetime] = None,
        assignee: Optional[str] = None,
        source_meeting: str = ""
    ) -> Reminder:
        """
        添加提醒任务
        
        Args:
            task_description: 任务描述
            remind_at: 提醒时间
            deadline: 截止时间
            assignee: 负责人
            source_meeting: 来源会议文件路径
            
        Returns:
            Reminder: 创建的提醒任务
        """
        reminder_id = f"rem_{datetime.now().strftime('%Y%m%d%H%M%S')}_{len(self.reminders)}"
        
        reminder = Reminder(
            id=reminder_id,
            task_description=task_description,
            remind_at=remind_at.isoformat(),
            deadline=deadline.isoformat() if deadline else None,
            assignee=assignee,
            source_meeting=source_meeting
        )
        
        self.reminders.append(reminder)
        self._save_reminders()
        
        return reminder
    
    def add_reminders_from_tasks(
        self,
        tasks: List[Dict],
        source_meeting: str,
        time_detector=None
    ) -> List[Reminder]:
        """
        从任务列表批量创建提醒
        
        Args:
            tasks: 任务列表，每项包含description, assignee, deadline等
            source_meeting: 来源会议文件
            time_detector: 时间检测器
            
        Returns:
            List[Reminder]: 创建的提醒任务列表
        """
        created = []
        
        for task in tasks:
            has_time = task.get('has_time', False)
            deadline_str = task.get('deadline_datetime')
            
            if has_time and deadline_str:
                # 有明确时间：创建定时提醒
                try:
                    deadline = datetime.fromisoformat(deadline_str)
                    # 提前1小时提醒
                    remind_at = deadline - timedelta(hours=1)
                    
                    # 如果提醒时间已过，立即提醒
                    if remind_at < datetime.now():
                        remind_at = datetime.now() + timedelta(minutes=5)
                    
                    reminder = self.add_reminder(
                        task_description=task.get('description', ''),
                        remind_at=remind_at,
                        deadline=deadline,
                        assignee=task.get('assignee'),
                        source_meeting=source_meeting
                    )
                    created.append(reminder)
                except Exception as e:
                    print(f"创建提醒失败: {e}")
            else:
                # 无明确时间：纳入每日三问跟进（不创建定时提醒）
                pass
        
        return created
    
    def get_pending_reminders(self, before: Optional[datetime] = None) -> List[Reminder]:
        """
        获取待执行的提醒任务
        
        Args:
            before: 获取此时间之前的提醒，默认为当前时间
            
        Returns:
            List[Reminder]: 待执行的提醒列表
        """
        if before is None:
            before = datetime.now()
        
        pending = []
        for reminder in self.reminders:
            if reminder.status == "pending":
                remind_at = datetime.fromisoformat(reminder.remind_at)
                if remind_at <= before:
                    pending.append(reminder)
        
        # 按提醒时间排序
        pending.sort(key=lambda r: r.remind_at)
        
        return pending
    
    def get_today_reminders(self) -> List[Reminder]:
        """获取今天的提醒任务"""
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        
        today_reminders = []
        for reminder in self.reminders:
            remind_at = datetime.fromisoformat(reminder.remind_at)
            if today <= remind_at < tomorrow:
                today_reminders.append(reminder)
        
        return today_reminders
    
    def get_overdue_reminders(self) -> List[Reminder]:
        """获取逾期的提醒任务"""
        now = datetime.now()
        overdue = []
        
        for reminder in self.reminders:
            if reminder.status == "pending":
                remind_at = datetime.fromisoformat(reminder.remind_at)
                if remind_at < now:
                    overdue.append(reminder)
        
        return overdue
    
    def mark_reminded(self, reminder_id: str):
        """标记提醒已发送"""
        for reminder in self.reminders:
            if reminder.id == reminder_id:
                reminder.status = "reminded"
                reminder.reminded_at = datetime.now().isoformat()
                self._save_reminders()
                break
    
    def mark_completed(self, reminder_id: str):
        """标记任务已完成"""
        for reminder in self.reminders:
            if reminder.id == reminder_id:
                reminder.status = "completed"
                self._save_reminders()
                break
    
    def snooze_reminder(self, reminder_id: str, minutes: int = 30):
        """延后提醒"""
        for reminder in self.reminders:
            if reminder.id == reminder_id:
                current = datetime.fromisoformat(reminder.remind_at)
                new_time = current + timedelta(minutes=minutes)
                reminder.remind_at = new_time.isoformat()
                reminder.status = "pending"
                self._save_reminders()
                break
    
    def delete_reminder(self, reminder_id: str):
        """删除提醒任务"""
        self.reminders = [r for r in self.reminders if r.id != reminder_id]
        self._save_reminders()
    
    def get_daily_summary(self) -> Dict:
        """获取每日任务摘要"""
        now = datetime.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        # 统计
        total = len(self.reminders)
        pending = len([r for r in self.reminders if r.status == "pending"])
        completed = len([r for r in self.reminders if r.status == "completed"])
        overdue = len(self.get_overdue_reminders())
        
        # 今日任务
        today_tasks = []
        for reminder in self.reminders:
            if reminder.status in ["pending", "reminded"]:
                deadline = reminder.deadline
                if deadline:
                    deadline_dt = datetime.fromisoformat(deadline)
                    if today_start <= deadline_dt < today_end:
                        today_tasks.append(reminder)
        
        return {
            'total': total,
            'pending': pending,
            'completed': completed,
            'overdue': overdue,
            'today_count': len(today_tasks),
            'today_tasks': today_tasks
        }
    
    def check_and_notify(self, notify_callback: Optional[Callable] = None) -> List[Dict]:
        """
        检查并触发提醒
        
        Args:
            notify_callback: 提醒回调函数，接收提醒信息
            
        Returns:
            List[Dict]: 触发的提醒列表
        """
        pending = self.get_pending_reminders()
        triggered = []
        
        for reminder in pending:
            # 构建提醒消息
            message = self._format_reminder_message(reminder)
            
            if notify_callback:
                notify_callback(message)
            
            self.mark_reminded(reminder.id)
            
            triggered.append({
                'id': reminder.id,
                'message': message,
                'task': reminder.task_description
            })
        
        return triggered
    
    def _format_reminder_message(self, reminder: Reminder) -> str:
        """格式化提醒消息"""
        msg = f"⏰ 任务提醒\n\n"
        msg += f"📋 {reminder.task_description}\n"
        
        if reminder.assignee:
            msg += f"👤 负责人: {reminder.assignee}\n"
        
        if reminder.deadline:
            deadline = datetime.fromisoformat(reminder.deadline)
            msg += f"⏰ 截止时间: {deadline.strftime('%Y-%m-%d %H:%M')}\n"
        
        # 检查是否逾期
        if reminder.deadline:
            deadline = datetime.fromisoformat(reminder.deadline)
            if deadline < datetime.now():
                msg += "⚠️ 该任务已逾期！\n"
        
        return msg
    
    def cleanup_old_reminders(self, days: int = 30):
        """清理旧的已完成提醒"""
        cutoff = datetime.now() - timedelta(days=days)
        
        self.reminders = [
            r for r in self.reminders 
            if r.status != "completed" or datetime.fromisoformat(r.created_at) > cutoff
        ]
        self._save_reminders()


# 测试代码
if __name__ == '__main__':
    scheduler = ReminderScheduler()
    
    # 添加测试提醒
    test_time = datetime.now() + timedelta(minutes=5)
    reminder = scheduler.add_reminder(
        task_description="测试任务",
        remind_at=test_time,
        deadline=test_time + timedelta(hours=1),
        assignee="PTK",
        source_meeting="2026-02-23.md"
    )
    
    print(f"创建提醒: {reminder.id}")
    print(f"今日提醒数: {len(scheduler.get_today_reminders())}")
    print(f"摘要: {scheduler.get_daily_summary()}")

#!/usr/bin/env python3
"""
会议纪要 Skill - 命令行入口
"""

import sys
import argparse
from datetime import datetime

# 添加模块路径
sys.path.insert(0, '/root/.openclaw/workspace')

from meeting_skill.meeting_commands import MeetingCommands
from meeting_skill.reminder_scheduler import ReminderScheduler


def cmd_process(args):
    """处理会议纪要"""
    commands = MeetingCommands()
    
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            content = f.read()
    elif args.content:
        content = args.content
    else:
        print("错误: 请提供会议内容 (-c) 或文件路径 (-f)")
        return
    
    result = commands.process_meeting(content, args.date)
    
    if result['success']:
        print(f"✅ 会议纪要已生成")
        print(f"📁 文件: {result['filepath']}")
        print(f"📋 提取任务: {result['tasks_count']} 个")
        print(f"⏰ 创建提醒: {result['reminders_count']} 个")
    else:
        print(f"❌ 处理失败: {result.get('error', '未知错误')}")


def cmd_today(args):
    """查看今日待办"""
    commands = MeetingCommands()
    print(commands.get_today_todos())


def cmd_week(args):
    """查看本周会议"""
    commands = MeetingCommands()
    print(commands.get_week_meetings())


def cmd_postpone(args):
    """延期任务"""
    commands = MeetingCommands()
    result = commands.postpone_task(args.task, args.time)
    
    if result['success']:
        print(f"✅ 已延期 {result['updated_count']} 个任务")
        print(f"📅 新时间: {result['new_time']}")
    else:
        print(f"❌ {result['error']}")


def cmd_prompt(args):
    """获取每日提示"""
    commands = MeetingCommands()
    print(commands.get_daily_prompt())


def cmd_check(args):
    """检查并触发提醒"""
    scheduler = ReminderScheduler()
    triggered = scheduler.check_and_notify(
        notify_callback=lambda msg: print(f"\n{msg}")
    )
    
    if triggered:
        print(f"\n触发了 {len(triggered)} 个提醒")
    else:
        print("暂无待触发的提醒")


def cmd_daily_check(args):
    """每日检查（用于cron）"""
    commands = MeetingCommands()
    
    # 检查是否应该索要会议纪要
    if commands.should_ask_for_meeting():
        print(commands.get_daily_prompt())
    
    # 检查并触发提醒
    scheduler = ReminderScheduler()
    scheduler.check_and_notify(
        notify_callback=lambda msg: print(f"\n{msg}")
    )


def main():
    parser = argparse.ArgumentParser(
        description='智能会议纪要 Skill',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  %(prog)s process -c "今天会议内容..."
  %(prog)s process -f meeting.txt
  %(prog)s today
  %(prog)s week
  %(prog)s postpone "联系客户" "明天下午"
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='可用命令')
    
    # process 命令
    process_parser = subparsers.add_parser('process', help='处理会议纪要')
    process_parser.add_argument('-c', '--content', help='会议内容')
    process_parser.add_argument('-f', '--file', help='会议内容文件')
    process_parser.add_argument('-d', '--date', help='会议日期 (YYYY-MM-DD)')
    
    # today 命令
    subparsers.add_parser('today', help='查看今日待办')
    
    # week 命令
    subparsers.add_parser('week', help='查看本周会议')
    
    # postpone 命令
    postpone_parser = subparsers.add_parser('postpone', help='延期任务')
    postpone_parser.add_argument('task', help='任务名称/关键词')
    postpone_parser.add_argument('time', help='新时间')
    
    # prompt 命令
    subparsers.add_parser('prompt', help='获取每日提示')
    
    # check 命令
    subparsers.add_parser('check', help='检查并触发提醒')
    
    # daily-check 命令
    subparsers.add_parser('daily-check', help='每日检查（用于cron）')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    command_map = {
        'process': cmd_process,
        'today': cmd_today,
        'week': cmd_week,
        'postpone': cmd_postpone,
        'prompt': cmd_prompt,
        'check': cmd_check,
        'daily-check': cmd_daily_check,
    }
    
    if args.command in command_map:
        command_map[args.command](args)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()

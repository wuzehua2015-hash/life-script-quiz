#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
股票盯盘Skill - 持仓管理与异动监控
"""

import json
import sys
import os
import re
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path

# 数据文件路径
DATA_FILE = Path("/root/.openclaw/workspace/stock_portfolio.json")


@dataclass
class StockPosition:
    """股票持仓"""
    code: str           # 股票代码
    name: str           # 股票名称
    quantity: int       # 持仓数量
    cost_price: float   # 成本价
    current_price: float = 0.0  # 当前价
    last_update: str = ""       # 最后更新时间
    
    @property
    def market_value(self) -> float:
        """市值"""
        return self.quantity * self.current_price if self.current_price else 0
    
    @property
    def cost_value(self) -> float:
        """成本"""
        return self.quantity * self.cost_price
    
    @property
    def profit_loss(self) -> float:
        """盈亏金额"""
        if self.current_price:
            return (self.current_price - self.cost_price) * self.quantity
        return 0
    
    @property
    def profit_loss_percent(self) -> float:
        """盈亏比例"""
        if self.cost_price:
            return (self.current_price - self.cost_price) / self.cost_price * 100 if self.current_price else 0
        return 0


@dataclass
class Alert:
    """异动提醒"""
    timestamp: str
    stock_code: str
    stock_name: str
    current_price: float
    price_change: float
    price_change_percent: float
    alert_type: str
    alert_reason: str
    volume: int = 0


class StockDataManager:
    """股票数据管理器"""
    
    def __init__(self, data_file: Path = DATA_FILE):
        self.data_file = data_file
        self.data = self._load_data()
    
    def _load_data(self) -> dict:
        """加载数据"""
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self._create_default_data()
    
    def _create_default_data(self) -> dict:
        """创建默认数据结构"""
        return {
            "version": "1.0.0",
            "lastUpdated": datetime.now().isoformat(),
            "portfolio": [],
            "monitoring": {
                "enabled": True,
                "checkInterval": 30,
                "tradingHours": {"start": "09:35", "end": "15:00"},
                "alertThresholds": {
                    "priceChangePercent": 5.0,
                    "volumeMultiplier": 3.0,
                    "enableLimitUpAlert": True,
                    "enableLimitDownAlert": True
                }
            },
            "alerts": []
        }
    
    def save(self):
        """保存数据"""
        self.data["lastUpdated"] = datetime.now().isoformat()
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
    
    def get_positions(self) -> List[StockPosition]:
        """获取所有持仓"""
        positions = []
        for p in self.data.get("portfolio", []):
            positions.append(StockPosition(**p))
        return positions
    
    def get_position(self, code: str) -> Optional[StockPosition]:
        """获取单只股票持仓"""
        for p in self.data.get("portfolio", []):
            if p["code"] == code:
                return StockPosition(**p)
        return None
    
    def add_position(self, position: StockPosition):
        """添加持仓"""
        existing = self.get_position(position.code)
        if existing:
            # 更新现有持仓（加仓）
            total_cost = existing.cost_price * existing.quantity + position.cost_price * position.quantity
            total_quantity = existing.quantity + position.quantity
            existing.quantity = total_quantity
            existing.cost_price = total_cost / total_quantity
            existing.name = position.name or existing.name
            self._update_position(existing)
        else:
            self.data["portfolio"].append(asdict(position))
        self.save()
    
    def update_position(self, code: str, quantity: int = None, cost_price: float = None, 
                       current_price: float = None, name: str = None):
        """更新持仓"""
        for p in self.data.get("portfolio", []):
            if p["code"] == code:
                if quantity is not None:
                    p["quantity"] = quantity
                if cost_price is not None:
                    p["cost_price"] = cost_price
                if current_price is not None:
                    p["current_price"] = current_price
                    p["last_update"] = datetime.now().isoformat()
                if name is not None:
                    p["name"] = name
                self.save()
                return True
        return False
    
    def _update_position(self, position: StockPosition):
        """内部更新持仓"""
        for i, p in enumerate(self.data.get("portfolio", [])):
            if p["code"] == position.code:
                self.data["portfolio"][i] = asdict(position)
                return
    
    def remove_position(self, code: str) -> bool:
        """删除持仓"""
        for i, p in enumerate(self.data.get("portfolio", [])):
            if p["code"] == code:
                del self.data["portfolio"][i]
                self.save()
                return True
        return False
    
    def add_alert(self, alert: Alert):
        """添加提醒"""
        self.data["alerts"].append(asdict(alert))
        # 只保留最近100条提醒
        if len(self.data["alerts"]) > 100:
            self.data["alerts"] = self.data["alerts"][-100:]
        self.save()
    
    def get_alerts(self, limit: int = 20) -> List[Alert]:
        """获取提醒历史"""
        alerts = self.data.get("alerts", [])
        return [Alert(**a) for a in alerts[-limit:]]


class TradingCalendar:
    """交易日历工具"""
    
    # 2026年A股节假日（需要定期更新）
    HOLIDAYS_2026 = [
        # 春节
        '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20',
        '2026-02-23', '2026-02-24', '2026-02-25', '2026-02-26', '2026-02-27',
        # 清明节
        '2026-04-04', '2026-04-05', '2026-04-06',
        # 劳动节
        '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
        # 端午节
        '2026-06-19', '2026-06-20', '2026-06-21',
        # 中秋节
        '2026-09-25', '2026-09-26', '2026-09-27',
        # 国庆节
        '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05',
        '2026-10-06', '2026-10-07', '2026-10-08',
    ]
    
    @classmethod
    def is_trading_day(cls, date: datetime = None) -> bool:
        """判断是否为交易日"""
        if date is None:
            date = datetime.now()
        
        # 周末不是交易日
        if date.weekday() >= 5:  # 5=周六, 6=周日
            return False
        
        # 节假日不是交易日
        date_str = date.strftime('%Y-%m-%d')
        if date_str in cls.HOLIDAYS_2026:
            return False
        
        return True
    
    @classmethod
    def get_last_trading_day(cls, date: datetime = None) -> datetime:
        """获取最近一个交易日"""
        if date is None:
            date = datetime.now()
        
        # 往前找，直到找到交易日
        check_date = date
        while not cls.is_trading_day(check_date):
            check_date = check_date - timedelta(days=1)
        
        return check_date
    
    @classmethod
    def get_trading_day_info(cls) -> dict:
        """获取交易日信息"""
        today = datetime.now()
        is_trading = cls.is_trading_day(today)
        last_trading = cls.get_last_trading_day(today)
        
        return {
            'today': today.strftime('%Y-%m-%d'),
            'is_trading_day': is_trading,
            'last_trading_day': last_trading.strftime('%Y-%m-%d'),
            'weekday': today.strftime('%A')
        }


class StockPriceFetcher:
    """股票价格获取器 - 新浪财经接口"""
    
    # 新浪财经行情接口
    SINA_API_URL = "http://hq.sinajs.cn/list={}"
    
    # 请求头配置
    DEFAULT_HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.0',
        'Referer': 'http://finance.sina.com.cn'
    }
    
    @staticmethod
    def normalize_code(code: str) -> str:
        """标准化股票代码，添加市场前缀
        
        上海股票：sh+代码（如sh600000）
        深圳股票：sz+代码（如sz002196）
        """
        code = code.upper().strip()
        # 移除后缀
        if code.endswith('.SH') or code.endswith('.SZ'):
            code = code[:-3]
        
        # 判断市场并添加前缀
        if code.startswith('6') or code.startswith('5') or code.startswith('9'):
            return f"sh{code}"  # 上海
        else:
            return f"sz{code}"  # 深圳
    
    @staticmethod
    def get_market(code: str) -> str:
        """获取市场"""
        code = code.strip()
        if code.startswith('6') or code.startswith('5') or code.startswith('9'):
            return "SH"
        return "SZ"
    
    @classmethod
    def fetch_sina(cls, codes: List[str]) -> Dict[str, dict]:
        """从新浪财经获取行情
        
        返回格式：var hq_str_sz002196="方正电机,5.36,5.36,5.36,5.36,5.36,..."
        字段说明：
            0: 股票名称
            1: 今日开盘价
            2: 昨日收盘价
            3: 当前价
            4: 今日最高价
            5: 今日最低价
            8: 成交量（股）
            9: 成交额（元）
        """
        if not codes:
            return {}
        
        # 标准化所有代码
        normalized_codes = [cls.normalize_code(c) for c in codes]
        url = cls.SINA_API_URL.format(','.join(normalized_codes))
        
        try:
            req = urllib.request.Request(url, headers=cls.DEFAULT_HEADERS)
            with urllib.request.urlopen(req, timeout=10) as response:
                # 新浪返回的是GB2312编码
                data = response.read().decode('gb2312', errors='ignore')
        except Exception as e:
            print(f"获取行情失败: {e}")
            return {}
        
        results = {}
        for line in data.split('\n'):
            if not line.strip():
                continue
            
            # 解析JavaScript变量格式: var hq_str_sz002196="..."
            match = re.search(r'var hq_str_(\w+)="([^"]*)"', line)
            if match:
                code_key = match.group(1)  # 如: sz002196
                raw_data = match.group(2)   # 逗号分隔的数据
                
                if raw_data and len(raw_data) > 10:
                    parts = raw_data.split(',')
                    
                    # 确保有足够的数据字段
                    if len(parts) >= 10:
                        # 提取纯数字代码（去掉sh/sz前缀）
                        stock_code = code_key[2:]
                        
                        try:
                            results[stock_code] = {
                                'name': parts[0],                           # 股票名称
                                'open': float(parts[1]) if parts[1] else 0.0,           # 今日开盘价
                                'close_yesterday': float(parts[2]) if parts[2] else 0.0, # 昨日收盘价
                                'current': float(parts[3]) if parts[3] else 0.0,        # 当前价
                                'high': float(parts[4]) if parts[4] else 0.0,           # 今日最高价
                                'low': float(parts[5]) if parts[5] else 0.0,            # 今日最低价
                                'volume': int(float(parts[8])) if parts[8] else 0,      # 成交量（股）
                                'amount': float(parts[9]) if parts[9] else 0.0,         # 成交额（元）
                                'code': stock_code,
                                'full_code': code_key
                            }
                        except (ValueError, IndexError) as e:
                            print(f"解析股票 {code_key} 数据失败: {e}")
                            continue
        
        return results
    
    @classmethod
    def fetch_single(cls, code: str) -> Optional[dict]:
        """获取单只股票行情"""
        results = cls.fetch_sina([code])
        code_clean = code.upper().replace('.SH', '').replace('.SZ', '')
        return results.get(code_clean)
    
    @classmethod
    def test_fetch(cls, codes: List[str]) -> None:
        """测试行情获取（打印详细信息）"""
        print(f"\n测试获取 {len(codes)} 只股票行情...")
        print("-" * 60)
        
        results = cls.fetch_sina(codes)
        
        if not results:
            print("❌ 未能获取任何行情数据")
            return
        
        for code in codes:
            code_clean = code.upper().replace('.SH', '').replace('.SZ', '')
            data = results.get(code_clean)
            
            if data:
                print(f"\n📊 {data['name']} ({code_clean})")
                print(f"   当前价: {data['current']:.2f}")
                print(f"   今开: {data['open']:.2f}, 昨收: {data['close_yesterday']:.2f}")
                print(f"   最高: {data['high']:.2f}, 最低: {data['low']:.2f}")
                print(f"   成交量: {data['volume']:,}股")
                print(f"   成交额: {data['amount']:,.0f}元")
                
                # 计算涨跌幅
                if data['close_yesterday'] > 0:
                    change_pct = (data['current'] - data['close_yesterday']) / data['close_yesterday'] * 100
                    print(f"   涨跌幅: {change_pct:+.2f}%")
            else:
                print(f"\n❌ 无法获取: {code}")
        
        print("-" * 60)


class StockMonitor:
    """股票监控器"""
    
    def __init__(self, data_manager: StockDataManager):
        self.dm = data_manager
        self.fetcher = StockPriceFetcher()
    
    def update_prices(self) -> Dict[str, dict]:
        """更新所有持仓股票价格"""
        positions = self.dm.get_positions()
        if not positions:
            return {}
        
        codes = [p.code for p in positions]
        prices = self.fetcher.fetch_sina(codes)
        
        updated = {}
        for pos in positions:
            if pos.code in prices:
                data = prices[pos.code]
                self.dm.update_position(
                    pos.code,
                    current_price=data['current'],
                    name=data['name']
                )
                updated[pos.code] = data
        
        return updated
    
    def check_alerts(self) -> List[Alert]:
        """检查异动"""
        prices = self.update_prices()
        positions = self.dm.get_positions()
        thresholds = self.dm.data["monitoring"]["alertThresholds"]
        
        alerts = []
        now = datetime.now().isoformat()
        
        for pos in positions:
            if pos.code not in prices:
                continue
            
            data = prices[pos.code]
            current = data['current']
            close_yesterday = data['close_yesterday']
            
            if close_yesterday == 0:
                continue
            
            change_percent = (current - close_yesterday) / close_yesterday * 100
            
            # 检查涨停/跌停
            is_st = 'ST' in data['name'] or 'st' in data['name']
            limit_percent = 5.0 if is_st else 10.0
            
            if thresholds.get('enableLimitUpAlert') and change_percent >= limit_percent - 0.5:
                alerts.append(Alert(
                    timestamp=now,
                    stock_code=pos.code,
                    stock_name=data['name'],
                    current_price=current,
                    price_change=current - close_yesterday,
                    price_change_percent=change_percent,
                    alert_type="limit_up",
                    alert_reason=f"接近涨停 ({change_percent:.2f}%)",
                    volume=data['volume']
                ))
            elif thresholds.get('enableLimitDownAlert') and change_percent <= -(limit_percent - 0.5):
                alerts.append(Alert(
                    timestamp=now,
                    stock_code=pos.code,
                    stock_name=data['name'],
                    current_price=current,
                    price_change=current - close_yesterday,
                    price_change_percent=change_percent,
                    alert_type="limit_down",
                    alert_reason=f"接近跌停 ({change_percent:.2f}%)",
                    volume=data['volume']
                ))
            # 检查涨跌幅超阈值
            elif abs(change_percent) >= thresholds.get('priceChangePercent', 5.0):
                direction = "大涨" if change_percent > 0 else "大跌"
                alerts.append(Alert(
                    timestamp=now,
                    stock_code=pos.code,
                    stock_name=data['name'],
                    current_price=current,
                    price_change=current - close_yesterday,
                    price_change_percent=change_percent,
                    alert_type="price_alert",
                    alert_reason=f"{direction} {abs(change_percent):.2f}%",
                    volume=data['volume']
                ))
        
        # 保存提醒
        for alert in alerts:
            self.dm.add_alert(alert)
        
        return alerts


class CommandParser:
    """自然语言命令解析器"""
    
    @staticmethod
    def parse_buy(text: str) -> Optional[Tuple[str, int, float, str]]:
        """解析买入命令"""
        # 匹配: 买入XX股票1000股成本4.2 / 买入 000001 1000股 4.2元
        patterns = [
            r'买入\s*(\S+)\s*(\d+)\s*股?\s*(?:成本|价格|@)?\s*(\d+\.?\d*)\s*(?:元|块)?',
            r'买入\s*(\S+)\s*(\d+)\s*(?:股|手)?\s*(?:成本|价格|@)?\s*(\d+\.?\d*)',
            r'加仓\s*(\S+)\s*(\d+)\s*股?\s*(?:价格|@)?\s*(\d+\.?\d*)?',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                name_or_code = match.group(1)
                quantity = int(match.group(2))
                price = float(match.group(3)) if match.group(3) else 0.0
                return (name_or_code, quantity, price, "")
        return None
    
    @staticmethod
    def parse_sell(text: str) -> Optional[Tuple[str, int]]:
        """解析卖出命令"""
        patterns = [
            r'卖出\s*(\S+)\s*(\d+)\s*股?',
            r'卖出\s*(\S+)',  # 清仓
            r'减仓\s*(\S+)\s*(\d+)\s*股?',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                name_or_code = match.group(1)
                quantity = int(match.group(2)) if len(match.groups()) > 1 and match.group(2) else None
                return (name_or_code, quantity)
        return None
    
    @staticmethod
    def parse_query(text: str) -> Optional[str]:
        """解析查询命令"""
        patterns = [
            r'查看\s*持仓',
            r'显示\s*持仓',
            r'我的\s*持仓',
            r'持仓',
            r'查看\s*(\S+)',
            r'查询\s*(\S+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                if match.groups() and match.group(1):
                    return match.group(1)
                return "all"
        return None


class StockSkill:
    """股票盯盘Skill主类"""
    
    def __init__(self):
        self.dm = StockDataManager()
        self.monitor = StockMonitor(self.dm)
        self.parser = CommandParser()
    
    def buy(self, code: str, quantity: int, cost_price: float, name: str = ""):
        """买入股票"""
        # 尝试获取股票名称
        if not name:
            price_data = self.monitor.fetcher.fetch_single(code)
            if price_data:
                name = price_data['name']
        
        position = StockPosition(
            code=code.upper().replace('.SH', '').replace('.SZ', ''),
            name=name or code,
            quantity=quantity,
            cost_price=cost_price,
            current_price=cost_price
        )
        
        existing = self.dm.get_position(position.code)
        if existing:
            # 加仓逻辑
            total_cost = existing.cost_price * existing.quantity + cost_price * quantity
            total_qty = existing.quantity + quantity
            new_cost = total_cost / total_qty
            self.dm.update_position(
                position.code,
                quantity=total_qty,
                cost_price=new_cost,
                name=name or existing.name
            )
            print(f"✅ 加仓成功: {name or code}")
            print(f"   新增: {quantity}股 @ {cost_price}元")
            print(f"   总持仓: {total_qty}股, 成本: {new_cost:.3f}元")
        else:
            self.dm.add_position(position)
            print(f"✅ 买入成功: {name or code}")
            print(f"   {quantity}股 @ {cost_price}元")
    
    def sell(self, code: str, quantity: int = None):
        """卖出股票"""
        code = code.upper().replace('.SH', '').replace('.SZ', '')
        position = self.dm.get_position(code)
        
        if not position:
            print(f"❌ 未找到持仓: {code}")
            return
        
        if quantity is None or quantity >= position.quantity:
            # 清仓
            self.dm.remove_position(code)
            print(f"✅ 清仓成功: {position.name} ({code})")
            print(f"   卖出: {position.quantity}股")
        else:
            # 减仓
            new_qty = position.quantity - quantity
            self.dm.update_position(code, quantity=new_qty)
            print(f"✅ 减仓成功: {position.name} ({code})")
            print(f"   卖出: {quantity}股, 剩余: {new_qty}股")
    
    def list_positions(self):
        """列出所有持仓"""
        positions = self.dm.get_positions()
        
        if not positions:
            print("📭 当前无持仓")
            return
        
        # 更新价格
        self.monitor.update_prices()
        positions = self.dm.get_positions()
        
        print("\n" + "=" * 80)
        print(f"{'股票代码':<10} {'股票名称':<12} {'持仓':<8} {'成本价':<10} {'现价':<10} {'市值':<12} {'盈亏':<10}")
        print("-" * 80)
        
        total_value = 0
        total_cost = 0
        
        for p in positions:
            value = p.market_value
            cost = p.cost_value
            pl = p.profit_loss
            pl_pct = p.profit_loss_percent
            
            total_value += value
            total_cost += cost
            
            pl_str = f"{pl:+.2f} ({pl_pct:+.2f}%)"
            print(f"{p.code:<10} {p.name:<12} {p.quantity:<8} {p.cost_price:<10.3f} {p.current_price:<10.3f} {value:<12.2f} {pl_str}")
        
        print("-" * 80)
        total_pl = total_value - total_cost
        total_pl_pct = (total_pl / total_cost * 100) if total_cost else 0
        print(f"{'总计':<10} {'':<12} {'':<8} {'':<10} {'':<10} {total_value:<12.2f} {total_pl:+.2f} ({total_pl_pct:+.2f}%)")
        print("=" * 80)
    
    def show_position(self, code: str):
        """显示单只股票详情"""
        code = code.upper().replace('.SH', '').replace('.SZ', '')
        position = self.dm.get_position(code)
        
        if not position:
            print(f"❌ 未找到持仓: {code}")
            return
        
        # 获取实时行情
        price_data = self.monitor.fetcher.fetch_single(code)
        if price_data:
            self.dm.update_position(code, current_price=price_data['current'])
            position = self.dm.get_position(code)
        
        print(f"\n📊 {position.name} ({position.code})")
        print("-" * 40)
        print(f"持仓数量: {position.quantity}股")
        print(f"成本价格: {position.cost_price:.3f}元")
        print(f"当前价格: {position.current_price:.3f}元")
        print(f"持仓市值: {position.market_value:.2f}元")
        print(f"持仓成本: {position.cost_value:.2f}元")
        print(f"盈亏金额: {position.profit_loss:+.2f}元")
        print(f"盈亏比例: {position.profit_loss_percent:+.2f}%")
        
        if price_data:
            print(f"\n实时行情:")
            print(f"  今开: {price_data['open']:.2f}")
            print(f"  昨收: {price_data['close_yesterday']:.2f}")
            print(f"  最高: {price_data['high']:.2f}")
            print(f"  最低: {price_data['low']:.2f}")
            print(f"  成交量: {price_data['volume']:,}")
    
    def run_monitor(self):
        """运行监控"""
        print("🔍 开始检查持仓股票...")
        alerts = self.monitor.check_alerts()
        
        if alerts:
            print(f"\n⚠️ 发现 {len(alerts)} 条异动:\n")
            for alert in alerts:
                print(f"🚨 [{alert.alert_type}] {alert.stock_name} ({alert.stock_code})")
                print(f"   价格: {alert.current_price:.2f} ({alert.price_change_percent:+.2f}%)")
                print(f"   原因: {alert.alert_reason}")
                print()
        else:
            print("✅ 无异常")
    
    def show_alerts(self, limit: int = 20):
        """显示提醒历史"""
        alerts = self.dm.get_alerts(limit)
        
        if not alerts:
            print("📭 暂无提醒记录")
            return
        
        print(f"\n📢 最近 {len(alerts)} 条提醒:\n")
        for alert in reversed(alerts):
            ts = alert.timestamp[:19].replace('T', ' ')
            print(f"[{ts}] {alert.stock_name} ({alert.stock_code})")
            print(f"   价格: {alert.current_price:.2f} ({alert.price_change_percent:+.2f}%)")
            print(f"   类型: {alert.alert_type} - {alert.alert_reason}")
            print()
    
    def parse_and_execute(self, text: str):
        """解析并执行自然语言命令"""
        text = text.strip()
        
        # 尝试解析买入
        buy_result = self.parser.parse_buy(text)
        if buy_result:
            name_or_code, quantity, price, _ = buy_result
            # 判断是代码还是名称
            if re.match(r'^\d{6}$', name_or_code):
                self.buy(name_or_code, quantity, price)
            else:
                # 需要查询代码
                print(f"⚠️ 请使用6位数字股票代码，如: 000001")
            return
        
        # 尝试解析卖出
        sell_result = self.parser.parse_sell(text)
        if sell_result:
            name_or_code, quantity = sell_result
            if re.match(r'^\d{6}$', name_or_code):
                self.sell(name_or_code, quantity)
            else:
                print(f"⚠️ 请使用6位数字股票代码，如: 000001")
            return
        
        # 尝试解析查询
        query_result = self.parser.parse_query(text)
        if query_result:
            if query_result == "all":
                self.list_positions()
            else:
                self.show_position(query_result)
            return
        
        print("❓ 无法理解的命令，请尝试:")
        print("  - 买入000001 1000股 10.5元")
        print("  - 卖出000001 500股")
        print("  - 查看持仓")


def main():
    """主函数"""
    skill = StockSkill()
    
    if len(sys.argv) < 2:
        print("股票盯盘Skill v1.0.0")
        print("\n用法:")
        print("  python3 stock_skill.py buy <代码> <数量> <价格> [名称]  - 买入")
        print("  python3 stock_skill.py sell <代码> [<数量>]                    - 卖出/清仓")
        print("  python3 stock_skill.py list                                    - 查看持仓")
        print("  python3 stock_skill.py show <代码>                            - 查看详情")
        print("  python3 stock_skill.py monitor                                 - 运行监控")
        print("  python3 stock_skill.py alerts                                  - 查看提醒")
        print("  python3 stock_skill.py parse '<自然语言命令>'                  - 自然语言")
        print("  python3 stock_skill.py test [<代码1> <代码2> ...]             - 测试行情获取")
        return
    
    command = sys.argv[1]
    
    if command == "buy":
        if len(sys.argv) < 5:
            print("用法: buy <代码> <数量> <价格> [名称]")
            return
        code, quantity, price = sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
        name = sys.argv[5] if len(sys.argv) > 5 else ""
        skill.buy(code, quantity, price, name)
    
    elif command == "sell":
        if len(sys.argv) < 3:
            print("用法: sell <代码> [<数量>]")
            return
        code = sys.argv[2]
        quantity = int(sys.argv[3]) if len(sys.argv) > 3 else None
        skill.sell(code, quantity)
    
    elif command == "list":
        skill.list_positions()
    
    elif command == "show":
        if len(sys.argv) < 3:
            print("用法: show <代码>")
            return
        skill.show_position(sys.argv[2])
    
    elif command == "monitor":
        skill.run_monitor()
    
    elif command == "alerts":
        skill.show_alerts()
    
    elif command == "parse":
        if len(sys.argv) < 3:
            print("用法: parse '<命令>'")
            return
        skill.parse_and_execute(sys.argv[2])
    
    elif command == "test":
        # 测试行情获取
        test_codes = sys.argv[2:] if len(sys.argv) > 2 else ["002196", "002044", "002586"]
        StockPriceFetcher.test_fetch(test_codes)
    
    else:
        print(f"未知命令: {command}")


if __name__ == "__main__":
    main()

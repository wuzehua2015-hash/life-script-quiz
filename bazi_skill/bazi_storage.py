"""
八字命理分析数据管理模块
负责八字档案的保存、查询和管理
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional

DATA_FILE = '/root/.openclaw/workspace/bazi_records.json'

class BaziRecordManager:
    """八字档案管理器"""
    
    def __init__(self, data_file: str = DATA_FILE):
        self.data_file = data_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict:
        """加载数据"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"加载数据失败: {e}")
                return {'records': [], 'version': '1.0.0'}
        return {'records': [], 'version': '1.0.0'}
    
    def _save_data(self):
        """保存数据"""
        try:
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"保存数据失败: {e}")
            return False
    
    def add_record(self, name: str, bazi_data: Dict, notes: str = '') -> bool:
        """
        添加八字档案
        
        Args:
            name: 姓名
            bazi_data: 八字数据
            notes: 备注
        """
        # 检查是否已存在
        for record in self.data['records']:
            if record['name'] == name:
                # 更新现有记录
                record['bazi_data'] = bazi_data
                record['updated_at'] = datetime.now().isoformat()
                record['notes'] = notes
                return self._save_data()
        
        # 添加新记录
        new_record = {
            'id': len(self.data['records']) + 1,
            'name': name,
            'bazi_data': bazi_data,
            'notes': notes,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        self.data['records'].append(new_record)
        return self._save_data()
    
    def get_record(self, name: str) -> Optional[Dict]:
        """查询档案"""
        for record in self.data['records']:
            if record['name'] == name:
                return record
        return None
    
    def get_record_by_id(self, record_id: int) -> Optional[Dict]:
        """根据ID查询档案"""
        for record in self.data['records']:
            if record['id'] == record_id:
                return record
        return None
    
    def list_records(self, limit: int = 20) -> List[Dict]:
        """列出所有档案"""
        return self.data['records'][-limit:]
    
    def delete_record(self, name: str) -> bool:
        """删除档案"""
        for i, record in enumerate(self.data['records']):
            if record['name'] == name:
                self.data['records'].pop(i)
                return self._save_data()
        return False
    
    def update_notes(self, name: str, notes: str) -> bool:
        """更新备注"""
        for record in self.data['records']:
            if record['name'] == name:
                record['notes'] = notes
                record['updated_at'] = datetime.now().isoformat()
                return self._save_data()
        return False
    
    def search_records(self, keyword: str) -> List[Dict]:
        """搜索档案"""
        results = []
        keyword = keyword.lower()
        for record in self.data['records']:
            if keyword in record['name'].lower() or \
               keyword in record.get('notes', '').lower():
                results.append(record)
        return results
    
    def get_stats(self) -> Dict:
        """获取统计信息"""
        total = len(self.data['records'])
        gender_stats = {'男': 0, '女': 0}
        day_master_stats = {}
        
        for record in self.data['records']:
            bazi_data = record.get('bazi_data', {})
            gender = bazi_data.get('input', {}).get('gender', '未知')
            if gender in gender_stats:
                gender_stats[gender] += 1
            
            day_master = bazi_data.get('day_master', {}).get('gan', '未知')
            day_master_stats[day_master] = day_master_stats.get(day_master, 0) + 1
        
        return {
            'total': total,
            'gender_stats': gender_stats,
            'day_master_stats': day_master_stats
        }

# 全局管理器实例
_manager = None

def get_manager() -> BaziRecordManager:
    """获取管理器实例"""
    global _manager
    if _manager is None:
        _manager = BaziRecordManager()
    return _manager

def save_bazi_record(name: str, bazi_data: Dict, notes: str = '') -> bool:
    """保存八字档案"""
    return get_manager().add_record(name, bazi_data, notes)

def query_bazi_record(name: str) -> Optional[Dict]:
    """查询八字档案"""
    return get_manager().get_record(name)

def list_bazi_records(limit: int = 20) -> List[Dict]:
    """列出八字档案"""
    return get_manager().list_records(limit)

def delete_bazi_record(name: str) -> bool:
    """删除八字档案"""
    return get_manager().delete_record(name)

if __name__ == '__main__':
    # 测试
    manager = BaziRecordManager()
    print("统计信息:", manager.get_stats())
    print("档案列表:", manager.list_records())

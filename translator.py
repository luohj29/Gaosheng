#!/usr/bin/env python3
"""
LLM Agent翻译工具
使用YAML配置文件管理模型URL、API和语言设置
"""

import yaml
import requests
import json
from typing import Dict, Optional, List
from pathlib import Path


class TranslatorAgent:
    """基于LLM的翻译Agent"""
    
    def __init__(self, config_path: str = "translator.yaml"):
        """
        初始化翻译Agent
        
        Args:
            config_path: YAML配置文件路径
        """
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.api_url = self.config.get("translator", {}).get("api_url", "")
        self.api_key = self.config.get("translator", {}).get("api_key", "")
        self.model = self.config.get("translator", {}).get("model", "")
        self.headers_config = self.config.get("translator", {}).get("headers", {})
        self.timeout = self.config.get("translator", {}).get("timeout", 30)
        self.supported_languages = self.config.get("language", [])
        
    def _load_config(self) -> Dict:
        """加载YAML配置文件"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            return config if config else {}
        except FileNotFoundError:
            raise FileNotFoundError(f"配置文件 {self.config_path} 不存在")
        except yaml.YAMLError as e:
            raise ValueError(f"YAML配置文件解析错误: {e}")
    
    def _get_headers(self) -> Dict[str, str]:
        """获取API请求头"""
        headers = {}
        for key, value in self.headers_config.items():
            # 替换API密钥占位符
            if isinstance(value, str) and "{api_key}" in value:
                value = value.format(api_key=self.api_key)
            headers[key] = value
        return headers
    
    def translate(
        self, 
        text: str, 
        source_lang: str = "english", 
        target_lang: str = "chinese",
        system_prompt: Optional[str] = None
    ) -> str:
        """
        翻译文本
        
        Args:
            text: 要翻译的文本
            source_lang: 源语言
            target_lang: 目标语言
            system_prompt: 自定义系统提示词
            
        Returns:
            翻译后的文本
        """
        # 构建提示词
        if system_prompt is None:
            system_prompt = f"你是一个专业的翻译助手。请将以下{source_lang}文本翻译成{target_lang}。只返回翻译结果，不要添加任何解释或注释。"
        
        user_prompt = f"请翻译以下文本：\n{text}"
        
        # 构建请求数据
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3  # 降低温度以获得更稳定的翻译结果
        }
        
        # 发送API请求
        try:
            response = requests.post(
                self.api_url,
                headers=self._get_headers(),
                json=payload,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            # 解析响应
            result = response.json()
            
            # 提取翻译结果（适配OpenAI API格式）
            if "choices" in result and len(result["choices"]) > 0:
                translated_text = result["choices"][0]["message"]["content"].strip()
                return translated_text
            else:
                raise ValueError(f"API响应格式异常: {result}")
                
        except requests.exceptions.RequestException as e:
            raise ConnectionError(f"API请求失败: {e}")
        except (KeyError, IndexError) as e:
            raise ValueError(f"解析API响应失败: {e}")
    
    def translate_md(self, src_lang="english", target_lang:[str], md_path:str, output_path:str):
        """
        翻译Markdown文件
        
        Args:
            src_lang: 源语言
            target_lang: 目标语言列表
            md_path: Markdown文件路径
            output_path: 输出文件路径, 输出是output_path/target_lang/md_name.md
        """
        md_name = md_path.split("/")[-1]
        with open()
        for lang in target_lang:
            system_prompt = "you are a markdown translator, given the markdown, you neeed to\
            translate it from f{src_lang} to f{lang}, do not change the url to any resource"

    
    def get_supported_languages(self) -> List[str]:
        """获取支持的语言列表"""
        return self.supported_languages


def main():
    """示例使用"""
    try:
        # 初始化翻译Agent
        translator = TranslatorAgent("translator.yaml")
        
        # 测试翻译
        test_text = "Hello, how are you today?"
        print(f"原文: {test_text}")
        
        translated = translator.translate(
            text=test_text,
            source_lang="english",
            target_lang="chinese"
        )
        print(f"译文: {translated}")
        
    except Exception as e:
        print(f"错误: {e}")


if __name__ == "__main__":
    main()


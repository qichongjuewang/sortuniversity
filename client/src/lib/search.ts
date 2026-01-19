/**
 * 搜索匹配工具
 * 支持：中文、英文、首字母缩写
 */

/**
 * 匹配搜索关键词
 * 支持：中文、英文、首字母缩写
 */
export function matchSearch(text: string, keyword: string): boolean {
  if (!keyword) return true;
  
  const lowerKeyword = keyword.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  
  // 直接匹配（中文或英文）
  if (lowerText.includes(lowerKeyword)) {
    return true;
  }
  
  // 英文首字母匹配
  const words = text.split(/[\s\-_]+/);
  const initials = words.map(word => word[0]?.toLowerCase() || '').join('');
  if (initials.includes(lowerKeyword)) {
    return true;
  }
  
  return false;
}

/**
 * 过滤选项列表
 */
export function filterOptions<T>(
  options: T[],
  keyword: string,
  getLabel: (item: T) => string
): T[] {
  if (!keyword) return options;
  
  return options.filter(option => {
    const label = getLabel(option);
    return matchSearch(label, keyword);
  });
}

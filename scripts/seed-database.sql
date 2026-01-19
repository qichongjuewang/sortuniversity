-- Seed database with initial data

-- 1. ISCED-F Level 1
INSERT INTO isced_level1 (code, nameEn, nameZh) VALUES
('01', 'Education', '教育'),
('02', 'Arts and humanities', '艺术与人文'),
('03', 'Social sciences, journalism and information', '社会科学、新闻与信息'),
('04', 'Business, administration and law', '商业、管理与法律'),
('05', 'Natural sciences, mathematics and statistics', '自然科学、数学与统计'),
('06', 'Information and Communication Technologies (ICTs)', '信息与通信技术'),
('07', 'Engineering, manufacturing and construction', '工程、制造与建筑'),
('08', 'Agriculture, forestry, fisheries and veterinary', '农业、林业、渔业与兽医'),
('09', 'Health and welfare', '健康与福利'),
('10', 'Services', '服务业')
ON DUPLICATE KEY UPDATE nameEn=VALUES(nameEn), nameZh=VALUES(nameZh);

-- 2. ISCED-F Level 2
INSERT INTO isced_level2 (code, level1Id, nameEn, nameZh) VALUES
('011', (SELECT id FROM isced_level1 WHERE code='01'), 'Education', '教育学'),
('021', (SELECT id FROM isced_level1 WHERE code='02'), 'Arts', '艺术'),
('022', (SELECT id FROM isced_level1 WHERE code='02'), 'Humanities', '人文学科'),
('023', (SELECT id FROM isced_level1 WHERE code='02'), 'Languages', '语言'),
('031', (SELECT id FROM isced_level1 WHERE code='03'), 'Social and behavioural sciences', '社会与行为科学'),
('032', (SELECT id FROM isced_level1 WHERE code='03'), 'Journalism and information', '新闻与信息'),
('039', (SELECT id FROM isced_level1 WHERE code='03'), 'Social sciences not elsewhere classified', '未分类的社会科学'),
('041', (SELECT id FROM isced_level1 WHERE code='04'), 'Business and administration', '商业与管理'),
('042', (SELECT id FROM isced_level1 WHERE code='04'), 'Law', '法律'),
('051', (SELECT id FROM isced_level1 WHERE code='05'), 'Biological and related sciences', '生物及相关科学'),
('052', (SELECT id FROM isced_level1 WHERE code='05'), 'Environment', '环境'),
('053', (SELECT id FROM isced_level1 WHERE code='05'), 'Physical sciences', '物理科学'),
('054', (SELECT id FROM isced_level1 WHERE code='05'), 'Mathematics and statistics', '数学与统计'),
('061', (SELECT id FROM isced_level1 WHERE code='06'), 'Information and Communication Technologies', '信息与通信技术'),
('071', (SELECT id FROM isced_level1 WHERE code='07'), 'Engineering and engineering trades', '工程与工程技术'),
('072', (SELECT id FROM isced_level1 WHERE code='07'), 'Manufacturing and processing', '制造与加工'),
('073', (SELECT id FROM isced_level1 WHERE code='07'), 'Architecture and construction', '建筑与施工'),
('081', (SELECT id FROM isced_level1 WHERE code='08'), 'Agriculture', '农业'),
('082', (SELECT id FROM isced_level1 WHERE code='08'), 'Forestry', '林业'),
('083', (SELECT id FROM isced_level1 WHERE code='08'), 'Fisheries', '渔业'),
('084', (SELECT id FROM isced_level1 WHERE code='08'), 'Veterinary', '兽医'),
('091', (SELECT id FROM isced_level1 WHERE code='09'), 'Health', '健康'),
('092', (SELECT id FROM isced_level1 WHERE code='09'), 'Welfare', '福利'),
('101', (SELECT id FROM isced_level1 WHERE code='10'), 'Personal services', '个人服务'),
('102', (SELECT id FROM isced_level1 WHERE code='10'), 'Hygiene and occupational health services', '卫生与职业健康服务'),
('103', (SELECT id FROM isced_level1 WHERE code='10'), 'Security services', '安全服务'),
('104', (SELECT id FROM isced_level1 WHERE code='10'), 'Transport services', '运输服务')
ON DUPLICATE KEY UPDATE nameEn=VALUES(nameEn), nameZh=VALUES(nameZh);

-- 3. Countries
INSERT INTO countries (code, nameEn, nameZh, isEU, isSchengen, currency, officialLanguages) VALUES
('GB', 'United Kingdom', '英国', FALSE, FALSE, 'GBP', 'English'),
('CH', 'Switzerland', '瑞士', FALSE, TRUE, 'CHF', 'German, French, Italian'),
('DE', 'Germany', '德国', TRUE, TRUE, 'EUR', 'German'),
('FR', 'France', '法国', TRUE, TRUE, 'EUR', 'French'),
('NL', 'Netherlands', '荷兰', TRUE, TRUE, 'EUR', 'Dutch'),
('SE', 'Sweden', '瑞典', TRUE, TRUE, 'SEK', 'Swedish'),
('DK', 'Denmark', '丹麦', TRUE, TRUE, 'DKK', 'Danish'),
('NO', 'Norway', '挪威', FALSE, TRUE, 'NOK', 'Norwegian'),
('FI', 'Finland', '芬兰', TRUE, TRUE, 'EUR', 'Finnish, Swedish'),
('AT', 'Austria', '奥地利', TRUE, TRUE, 'EUR', 'German')
ON DUPLICATE KEY UPDATE nameEn=VALUES(nameEn), nameZh=VALUES(nameZh);

-- 4. Cities
INSERT INTO cities (nameEn, nameZh, countryId, latitude, longitude) VALUES
('London', '伦敦', (SELECT id FROM countries WHERE code='GB'), 51.5074, -0.1278),
('Oxford', '牛津', (SELECT id FROM countries WHERE code='GB'), 51.7520, -1.2577),
('Cambridge', '剑桥', (SELECT id FROM countries WHERE code='GB'), 52.2053, 0.1218),
('Edinburgh', '爱丁堡', (SELECT id FROM countries WHERE code='GB'), 55.9533, -3.1883),
('Zurich', '苏黎世', (SELECT id FROM countries WHERE code='CH'), 47.3769, 8.5417),
('Lausanne', '洛桑', (SELECT id FROM countries WHERE code='CH'), 46.5197, 6.6323),
('Munich', '慕尼黑', (SELECT id FROM countries WHERE code='DE'), 48.1351, 11.5820)
ON DUPLICATE KEY UPDATE nameEn=VALUES(nameEn), nameZh=VALUES(nameZh);

-- 5. Degree Types
INSERT INTO degree_types (code, nameEn, nameZh, level) VALUES
('BACHELOR', 'Bachelor', '学士', 6),
('MASTER', 'Master', '硕士', 7),
('PHD', 'PhD', '博士', 8),
('MBA', 'MBA', '工商管理硕士', 7)
ON DUPLICATE KEY UPDATE nameEn=VALUES(nameEn), nameZh=VALUES(nameZh);

-- 6. Exchange Rates
INSERT INTO exchange_rates (fromCurrency, toCurrency, rate) VALUES
('GBP', 'CNY', 9.2),
('EUR', 'CNY', 7.8),
('CHF', 'CNY', 8.3),
('USD', 'CNY', 7.2)
ON DUPLICATE KEY UPDATE rate=VALUES(rate), updatedAt=CURRENT_TIMESTAMP;

-- 7. Universities
INSERT INTO universities (nameEn, nameZh, countryId, mainCityId, type, foundedYear, websiteUrl) VALUES
('Imperial College London', '伦敦帝国理工学院', 
  (SELECT id FROM countries WHERE code='GB'), 
  (SELECT id FROM cities WHERE nameEn='London'), 
  2, TRUE, 1907, 'https://www.imperial.ac.uk'),
('University of Oxford', '牛津大学', 
  (SELECT id FROM countries WHERE code='GB'), 
  (SELECT id FROM cities WHERE nameEn='Oxford'), 
  3, TRUE, 1096, 'https://www.ox.ac.uk'),
('ETH Zurich', '苏黎世联邦理工学院', 
  (SELECT id FROM countries WHERE code='CH'), 
  (SELECT id FROM cities WHERE nameEn='Zurich'), 
  7, TRUE, 1855, 'https://ethz.ch'),
('University College London', '伦敦大学学院', 
  (SELECT id FROM countries WHERE code='GB'), 
  (SELECT id FROM cities WHERE nameEn='London'), 
  9, TRUE, 1826, 'https://www.ucl.ac.uk'),
('EPFL', '洛桑联邦理工学院', 
  (SELECT id FROM countries WHERE code='CH'), 
  (SELECT id FROM cities WHERE nameEn='Lausanne'), 
  26, TRUE, 1969, 'https://www.epfl.ch'),
('University of Edinburgh', '爱丁堡大学', 
  (SELECT id FROM countries WHERE code='GB'), 
  (SELECT id FROM cities WHERE nameEn='Edinburgh'), 
  27, TRUE, 1582, 'https://www.ed.ac.uk'),
('Technical University of Munich', '慕尼黑工业大学', 
  (SELECT id FROM countries WHERE code='DE'), 
  (SELECT id FROM cities WHERE nameEn='Munich'), 
  28, TRUE, 1868, 'https://www.tum.de'),
('King''s College London', '伦敦国王学院', 
  (SELECT id FROM countries WHERE code='GB'), 
  (SELECT id FROM cities WHERE nameEn='London'), 
  31, TRUE, 1829, 'https://www.kcl.ac.uk')
ON DUPLICATE KEY UPDATE qsRank=VALUES(qsRank), websiteUrl=VALUES(websiteUrl);

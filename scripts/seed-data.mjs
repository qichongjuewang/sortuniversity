import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建数据库连接
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('开始导入数据...\n');

// 1. 导入ISCED-F Level 1分类
console.log('1. 导入ISCED-F Level 1分类...');
const iscedLevel1Data = [
  { code: '00', nameEn: 'Generic programmes and qualifications', nameZh: '通用课程和资格' },
  { code: '01', nameEn: 'Education', nameZh: '教育学' },
  { code: '02', nameEn: 'Arts and humanities', nameZh: '艺术与人文' },
  { code: '03', nameEn: 'Social sciences, journalism and information', nameZh: '社会科学、新闻与信息' },
  { code: '04', nameEn: 'Business, administration and law', nameZh: '商业、管理与法律' },
  { code: '05', nameEn: 'Natural sciences, mathematics and statistics', nameZh: '自然科学、数学与统计' },
  { code: '06', nameEn: 'Information and Communication Technologies (ICTs)', nameZh: '信息与通信技术' },
  { code: '07', nameEn: 'Engineering, manufacturing and construction', nameZh: '工程、制造与建筑' },
  { code: '08', nameEn: 'Agriculture, forestry, fisheries and veterinary', nameZh: '农业、林业、渔业与兽医' },
  { code: '09', nameEn: 'Health and welfare', nameZh: '健康与福利' },
  { code: '10', nameEn: 'Services', nameZh: '服务业' },
];

for (const item of iscedLevel1Data) {
  await db.insert(schema.iscedLevel1).values(item).onDuplicateKeyUpdate({ set: item });
}
console.log(`✓ 已导入 ${iscedLevel1Data.length} 个Level 1分类\n`);

// 2. 导入ISCED-F Level 2分类（示例）
console.log('2. 导入ISCED-F Level 2分类...');
const iscedLevel2Data = [
  { code: '011', nameEn: 'Education', nameZh: '教育学', level1Id: 2 },
  { code: '021', nameEn: 'Arts', nameZh: '艺术', level1Id: 3 },
  { code: '022', nameEn: 'Humanities', nameZh: '人文学科', level1Id: 3 },
  { code: '031', nameEn: 'Social and behavioural sciences', nameZh: '社会与行为科学', level1Id: 4 },
  { code: '032', nameEn: 'Journalism and information', nameZh: '新闻与信息', level1Id: 4 },
  { code: '041', nameEn: 'Business and administration', nameZh: '商业与管理', level1Id: 5 },
  { code: '042', nameEn: 'Law', nameZh: '法律', level1Id: 5 },
  { code: '051', nameEn: 'Biological and related sciences', nameZh: '生物及相关科学', level1Id: 6 },
  { code: '052', nameEn: 'Environment', nameZh: '环境科学', level1Id: 6 },
  { code: '053', nameEn: 'Physical sciences', nameZh: '物理科学', level1Id: 6 },
  { code: '054', nameEn: 'Mathematics and statistics', nameZh: '数学与统计', level1Id: 6 },
  { code: '061', nameEn: 'Information and Communication Technologies', nameZh: '信息与通信技术', level1Id: 7 },
  { code: '071', nameEn: 'Engineering and engineering trades', nameZh: '工程与工程技术', level1Id: 8 },
  { code: '072', nameEn: 'Manufacturing and processing', nameZh: '制造与加工', level1Id: 8 },
  { code: '073', nameEn: 'Architecture and construction', nameZh: '建筑与施工', level1Id: 8 },
  { code: '091', nameEn: 'Health', nameZh: '健康', level1Id: 10 },
  { code: '092', nameEn: 'Welfare', nameZh: '福利', level1Id: 10 },
];

for (const item of iscedLevel2Data) {
  await db.insert(schema.iscedLevel2).values(item).onDuplicateKeyUpdate({ set: item });
}
console.log(`✓ 已导入 ${iscedLevel2Data.length} 个Level 2分类\n`);

// 3. 导入ISCED-F Level 3分类（示例）
console.log('3. 导入ISCED-F Level 3分类...');
const iscedLevel3Data = [
  { code: '0111', nameEn: 'Education science', nameZh: '教育科学', level2Id: 1 },
  { code: '0112', nameEn: 'Training for pre-school teachers', nameZh: '学前教师培训', level2Id: 1 },
  { code: '0113', nameEn: 'Teacher training without subject specialisation', nameZh: '无学科专业化的教师培训', level2Id: 1 },
  { code: '0114', nameEn: 'Teacher training with subject specialisation', nameZh: '学科专业化教师培训', level2Id: 1 },
  { code: '0211', nameEn: 'Audio-visual techniques and media production', nameZh: '视听技术与媒体制作', level2Id: 2 },
  { code: '0212', nameEn: 'Fashion, interior and industrial design', nameZh: '时尚、室内与工业设计', level2Id: 2 },
  { code: '0213', nameEn: 'Fine arts', nameZh: '美术', level2Id: 2 },
  { code: '0214', nameEn: 'Handicrafts', nameZh: '手工艺', level2Id: 2 },
  { code: '0215', nameEn: 'Music and performing arts', nameZh: '音乐与表演艺术', level2Id: 2 },
  { code: '0221', nameEn: 'Religion and theology', nameZh: '宗教与神学', level2Id: 3 },
  { code: '0222', nameEn: 'History and archaeology', nameZh: '历史与考古', level2Id: 3 },
  { code: '0223', nameEn: 'Philosophy and ethics', nameZh: '哲学与伦理', level2Id: 3 },
  { code: '0231', nameEn: 'Language acquisition', nameZh: '语言习得', level2Id: 3 },
  { code: '0232', nameEn: 'Literature and linguistics', nameZh: '文学与语言学', level2Id: 3 },
  { code: '0311', nameEn: 'Economics', nameZh: '经济学', level2Id: 4 },
  { code: '0312', nameEn: 'Political sciences and civics', nameZh: '政治学与公民学', level2Id: 4 },
  { code: '0313', nameEn: 'Psychology', nameZh: '心理学', level2Id: 4 },
  { code: '0314', nameEn: 'Sociology and cultural studies', nameZh: '社会学与文化研究', level2Id: 4 },
  { code: '0321', nameEn: 'Journalism and reporting', nameZh: '新闻与报道', level2Id: 5 },
  { code: '0322', nameEn: 'Library, information and archival studies', nameZh: '图书馆、信息与档案研究', level2Id: 5 },
  { code: '0411', nameEn: 'Accounting and taxation', nameZh: '会计与税务', level2Id: 6 },
  { code: '0412', nameEn: 'Finance, banking and insurance', nameZh: '金融、银行与保险', level2Id: 6 },
  { code: '0413', nameEn: 'Management and administration', nameZh: '管理与行政', level2Id: 6 },
  { code: '0414', nameEn: 'Marketing and advertising', nameZh: '市场营销与广告', level2Id: 6 },
  { code: '0415', nameEn: 'Secretarial and office work', nameZh: '秘书与办公室工作', level2Id: 6 },
  { code: '0416', nameEn: 'Wholesale and retail sales', nameZh: '批发与零售', level2Id: 6 },
  { code: '0417', nameEn: 'Work skills', nameZh: '工作技能', level2Id: 6 },
  { code: '0421', nameEn: 'Law', nameZh: '法律', level2Id: 7 },
  { code: '0511', nameEn: 'Biology', nameZh: '生物学', level2Id: 8 },
  { code: '0512', nameEn: 'Biochemistry', nameZh: '生物化学', level2Id: 8 },
  { code: '0521', nameEn: 'Environmental sciences', nameZh: '环境科学', level2Id: 9 },
  { code: '0522', nameEn: 'Natural environments and wildlife', nameZh: '自然环境与野生动物', level2Id: 9 },
  { code: '0531', nameEn: 'Chemistry', nameZh: '化学', level2Id: 10 },
  { code: '0532', nameEn: 'Earth sciences', nameZh: '地球科学', level2Id: 10 },
  { code: '0533', nameEn: 'Physics', nameZh: '物理学', level2Id: 10 },
  { code: '0541', nameEn: 'Mathematics', nameZh: '数学', level2Id: 11 },
  { code: '0542', nameEn: 'Statistics', nameZh: '统计学', level2Id: 11 },
  { code: '0611', nameEn: 'Computer use', nameZh: '计算机使用', level2Id: 12 },
  { code: '0612', nameEn: 'Database and network design and administration', nameZh: '数据库与网络设计和管理', level2Id: 12 },
  { code: '0613', nameEn: 'Software and applications development and analysis', nameZh: '软件与应用开发和分析', level2Id: 12 },
  { code: '0711', nameEn: 'Chemical engineering and processes', nameZh: '化学工程与工艺', level2Id: 13 },
  { code: '0712', nameEn: 'Environmental protection technology', nameZh: '环境保护技术', level2Id: 13 },
  { code: '0713', nameEn: 'Electricity and energy', nameZh: '电力与能源', level2Id: 13 },
  { code: '0714', nameEn: 'Electronics and automation', nameZh: '电子与自动化', level2Id: 13 },
  { code: '0715', nameEn: 'Mechanics and metal trades', nameZh: '机械与金属工艺', level2Id: 13 },
  { code: '0716', nameEn: 'Motor vehicles, ships and aircraft', nameZh: '汽车、船舶与飞机', level2Id: 13 },
  { code: '0721', nameEn: 'Food processing', nameZh: '食品加工', level2Id: 14 },
  { code: '0722', nameEn: 'Materials (glass, paper, plastic and wood)', nameZh: '材料（玻璃、纸张、塑料和木材）', level2Id: 14 },
  { code: '0723', nameEn: 'Textiles (clothes, footwear and leather)', nameZh: '纺织品（服装、鞋类和皮革）', level2Id: 14 },
  { code: '0731', nameEn: 'Architecture and town planning', nameZh: '建筑与城市规划', level2Id: 15 },
  { code: '0732', nameEn: 'Building and civil engineering', nameZh: '建筑与土木工程', level2Id: 15 },
  { code: '0911', nameEn: 'Dental studies', nameZh: '牙科学', level2Id: 16 },
  { code: '0912', nameEn: 'Medicine', nameZh: '医学', level2Id: 16 },
  { code: '0913', nameEn: 'Nursing and midwifery', nameZh: '护理与助产', level2Id: 16 },
  { code: '0914', nameEn: 'Medical diagnostic and treatment technology', nameZh: '医学诊断与治疗技术', level2Id: 16 },
  { code: '0915', nameEn: 'Therapy and rehabilitation', nameZh: '治疗与康复', level2Id: 16 },
  { code: '0916', nameEn: 'Pharmacy', nameZh: '药学', level2Id: 16 },
  { code: '0921', nameEn: 'Care of the elderly and of disabled adults', nameZh: '老年人和残疾成人护理', level2Id: 17 },
  { code: '0922', nameEn: 'Child care and youth services', nameZh: '儿童保育和青年服务', level2Id: 17 },
  { code: '0923', nameEn: 'Social work and counselling', nameZh: '社会工作与咨询', level2Id: 17 },
];

for (const item of iscedLevel3Data) {
  await db.insert(schema.iscedLevel3).values(item).onDuplicateKeyUpdate({ set: item });
}
console.log(`✓ 已导入 ${iscedLevel3Data.length} 个Level 3分类\n`);

// 4. 导入学位类型
console.log('4. 导入学位类型...');
const degreeTypesData = [
  { nameEn: 'Bachelor', nameZh: '学士', level: 6, description: 'Undergraduate degree, typically 3-4 years' },
  { nameEn: 'Master', nameZh: '硕士', level: 7, description: 'Postgraduate degree, typically 1-2 years' },
  { nameEn: 'PhD', nameZh: '博士', level: 8, description: 'Doctoral degree, typically 3-5 years' },
  { nameEn: 'MBA', nameZh: '工商管理硕士', level: 7, description: 'Master of Business Administration' },
  { nameEn: 'Diploma', nameZh: '文凭', level: 5, description: 'Short-cycle tertiary education' },
];

for (const item of degreeTypesData) {
  await db.insert(schema.degreeTypes).values(item).onDuplicateKeyUpdate({ set: item });
}
console.log(`✓ 已导入 ${degreeTypesData.length} 个学位类型\n`);

// 5. 导入国家数据
console.log('5. 导入国家数据...');
const countriesData = [
  { code: 'GB', nameEn: 'United Kingdom', nameZh: '英国', isEU: false, isSchengen: false },
  { code: 'CH', nameEn: 'Switzerland', nameZh: '瑞士', isEU: false, isSchengen: true },
  { code: 'DE', nameEn: 'Germany', nameZh: '德国', isEU: true, isSchengen: true },
  { code: 'FR', nameEn: 'France', nameZh: '法国', isEU: true, isSchengen: true },
  { code: 'NL', nameEn: 'Netherlands', nameZh: '荷兰', isEU: true, isSchengen: true },
  { code: 'BE', nameEn: 'Belgium', nameZh: '比利时', isEU: true, isSchengen: true },
  { code: 'SE', nameEn: 'Sweden', nameZh: '瑞典', isEU: true, isSchengen: true },
  { code: 'IE', nameEn: 'Ireland', nameZh: '爱尔兰', isEU: true, isSchengen: false },
  { code: 'IT', nameEn: 'Italy', nameZh: '意大利', isEU: true, isSchengen: true },
  { code: 'DK', nameEn: 'Denmark', nameZh: '丹麦', isEU: true, isSchengen: true },
  { code: 'NO', nameEn: 'Norway', nameZh: '挪威', isEU: false, isSchengen: true },
  { code: 'FI', nameEn: 'Finland', nameZh: '芬兰', isEU: true, isSchengen: true },
];

const countryIdMap = {};
for (const item of countriesData) {
  const [result] = await db.insert(schema.countries).values(item).onDuplicateKeyUpdate({ set: item });
  const [country] = await db.select().from(schema.countries).where({ code: item.code }).limit(1);
  countryIdMap[item.code] = country.id;
}
console.log(`✓ 已导入 ${countriesData.length} 个国家\n`);

// 6. 导入城市数据
console.log('6. 导入城市数据...');
const citiesData = [
  { nameEn: 'London', nameZh: '伦敦', countryId: countryIdMap['GB'], latitude: 51.5074, longitude: -0.1278 },
  { nameEn: 'Oxford', nameZh: '牛津', countryId: countryIdMap['GB'], latitude: 51.7520, longitude: -1.2577 },
  { nameEn: 'Cambridge', nameZh: '剑桥', countryId: countryIdMap['GB'], latitude: 52.2053, longitude: 0.1218 },
  { nameEn: 'Edinburgh', nameZh: '爱丁堡', countryId: countryIdMap['GB'], latitude: 55.9533, longitude: -3.1883 },
  { nameEn: 'Manchester', nameZh: '曼彻斯特', countryId: countryIdMap['GB'], latitude: 53.4808, longitude: -2.2426 },
  { nameEn: 'Zurich', nameZh: '苏黎世', countryId: countryIdMap['CH'], latitude: 47.3769, longitude: 8.5417 },
  { nameEn: 'Lausanne', nameZh: '洛桑', countryId: countryIdMap['CH'], latitude: 46.5197, longitude: 6.6323 },
  { nameEn: 'Munich', nameZh: '慕尼黑', countryId: countryIdMap['DE'], latitude: 48.1351, longitude: 11.5820 },
  { nameEn: 'Berlin', nameZh: '柏林', countryId: countryIdMap['DE'], latitude: 52.5200, longitude: 13.4050 },
  { nameEn: 'Paris', nameZh: '巴黎', countryId: countryIdMap['FR'], latitude: 48.8566, longitude: 2.3522 },
  { nameEn: 'Amsterdam', nameZh: '阿姆斯特丹', countryId: countryIdMap['NL'], latitude: 52.3676, longitude: 4.9041 },
  { nameEn: 'Delft', nameZh: '代尔夫特', countryId: countryIdMap['NL'], latitude: 52.0116, longitude: 4.3571 },
];

const cityIdMap = {};
for (const item of citiesData) {
  await db.insert(schema.cities).values(item).onDuplicateKeyUpdate({ set: item });
  const [city] = await db.select().from(schema.cities).where({ nameEn: item.nameEn, countryId: item.countryId }).limit(1);
  cityIdMap[item.nameEn] = city.id;
}
console.log(`✓ 已导入 ${citiesData.length} 个城市\n`);

// 7. 导入大学数据（从JSON文件读取）
console.log('7. 导入大学数据...');
const universitiesJsonPath = path.join(__dirname, '../data/qs-2026-europe-top50.json');
const universitiesJson = JSON.parse(fs.readFileSync(universitiesJsonPath, 'utf-8'));

const universityIdMap = {};
for (const uni of universitiesJson.slice(0, 20)) { // 先导入前20所
  const countryId = countryIdMap[
    uni.country === 'United Kingdom' ? 'GB' :
    uni.country === 'Switzerland' ? 'CH' :
    uni.country === 'Germany' ? 'DE' :
    uni.country === 'France' ? 'FR' :
    uni.country === 'Netherlands' ? 'NL' :
    uni.country === 'Belgium' ? 'BE' :
    uni.country === 'Sweden' ? 'SE' :
    uni.country === 'Ireland' ? 'IE' :
    uni.country === 'Italy' ? 'IT' :
    uni.country === 'Denmark' ? 'DK' :
    uni.country === 'Norway' ? 'NO' :
    uni.country === 'Finland' ? 'FI' : 'GB'
  ];
  
  const cityId = cityIdMap[uni.city];
  
  if (!countryId || !cityId) {
    console.log(`跳过 ${uni.name}：缺少国家或城市ID`);
    continue;
  }
  
  const universityData = {
    nameEn: uni.name,
    nameZh: uni.nameZh,
    countryId,
    mainCityId: cityId,
    type: 'public',
    foundedYear: 1800,
    websiteUrl: `https://www.${uni.name.toLowerCase().replace(/\s+/g, '')}.edu`,
    descriptionEn: `${uni.name} is a leading research university.`,
    descriptionZh: `${uni.nameZh}是一所领先的研究型大学。`,
  };
  
  await db.insert(schema.universities).values(universityData).onDuplicateKeyUpdate({ set: universityData });
  const [university] = await db.select().from(schema.universities).where({ nameEn: uni.name }).limit(1);
  universityIdMap[uni.name] = university.id;
  
  // 添加排名信息
  await db.insert(schema.rankings).values({
    universityId: university.id,
    rankingType: 'QS',
    rankingCategory: 'overall',
    year: 2026,
    rank: uni.rank,
    score: 90 + (50 - uni.rank) / 5, // 模拟分数
  });
}
console.log(`✓ 已导入 ${Object.keys(universityIdMap).length} 所大学\n`);

// 8. 导入汇率数据
console.log('8. 导入汇率数据...');
const exchangeRatesData = [
  { fromCurrency: 'EUR', toCurrency: 'CNY', rate: 7.85, lastUpdated: new Date() },
  { fromCurrency: 'GBP', toCurrency: 'CNY', rate: 9.15, lastUpdated: new Date() },
  { fromCurrency: 'CHF', toCurrency: 'CNY', rate: 8.32, lastUpdated: new Date() },
  { fromCurrency: 'SEK', toCurrency: 'CNY', rate: 0.68, lastUpdated: new Date() },
  { fromCurrency: 'DKK', toCurrency: 'CNY', rate: 1.05, lastUpdated: new Date() },
  { fromCurrency: 'NOK', toCurrency: 'CNY', rate: 0.67, lastUpdated: new Date() },
];

for (const item of exchangeRatesData) {
  await db.insert(schema.exchangeRates).values(item).onDuplicateKeyUpdate({ set: item });
}
console.log(`✓ 已导入 ${exchangeRatesData.length} 个汇率\n`);

console.log('✅ 所有数据导入完成！');
await connection.end();

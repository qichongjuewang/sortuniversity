import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";

const db = drizzle(process.env.DATABASE_URL!);

// ISCED-F Level 1 classifications
const iscedLevel1Data = [
  { code: "01", nameEn: "Education", nameZh: "教育" },
  { code: "02", nameEn: "Arts and humanities", nameZh: "艺术与人文" },
  { code: "03", nameEn: "Social sciences, journalism and information", nameZh: "社会科学、新闻与信息" },
  { code: "04", nameEn: "Business, administration and law", nameZh: "商业、管理与法律" },
  { code: "05", nameEn: "Natural sciences, mathematics and statistics", nameZh: "自然科学、数学与统计" },
  { code: "06", nameEn: "Information and Communication Technologies (ICTs)", nameZh: "信息与通信技术" },
  { code: "07", nameEn: "Engineering, manufacturing and construction", nameZh: "工程、制造与建筑" },
  { code: "08", nameEn: "Agriculture, forestry, fisheries and veterinary", nameZh: "农业、林业、渔业与兽医" },
  { code: "09", nameEn: "Health and welfare", nameZh: "健康与福利" },
  { code: "10", nameEn: "Services", nameZh: "服务业" },
];

// ISCED-F Level 2 classifications (narrow fields)
const iscedLevel2Data = [
  { code: "011", level1Code: "01", nameEn: "Education", nameZh: "教育学" },
  { code: "021", level1Code: "02", nameEn: "Arts", nameZh: "艺术" },
  { code: "022", level1Code: "02", nameEn: "Humanities", nameZh: "人文学科" },
  { code: "023", level1Code: "02", nameEn: "Languages", nameZh: "语言" },
  { code: "031", level1Code: "03", nameEn: "Social and behavioural sciences", nameZh: "社会与行为科学" },
  { code: "032", level1Code: "03", nameEn: "Journalism and information", nameZh: "新闻与信息" },
  { code: "039", level1Code: "03", nameEn: "Social sciences, journalism and information not elsewhere classified", nameZh: "未分类的社会科学、新闻与信息" },
  { code: "041", level1Code: "04", nameEn: "Business and administration", nameZh: "商业与管理" },
  { code: "042", level1Code: "04", nameEn: "Law", nameZh: "法律" },
  { code: "051", level1Code: "05", nameEn: "Biological and related sciences", nameZh: "生物及相关科学" },
  { code: "052", level1Code: "05", nameEn: "Environment", nameZh: "环境" },
  { code: "053", level1Code: "05", nameEn: "Physical sciences", nameZh: "物理科学" },
  { code: "054", level1Code: "05", nameEn: "Mathematics and statistics", nameZh: "数学与统计" },
  { code: "061", level1Code: "06", nameEn: "Information and Communication Technologies", nameZh: "信息与通信技术" },
  { code: "071", level1Code: "07", nameEn: "Engineering and engineering trades", nameZh: "工程与工程技术" },
  { code: "072", level1Code: "07", nameEn: "Manufacturing and processing", nameZh: "制造与加工" },
  { code: "073", level1Code: "07", nameEn: "Architecture and construction", nameZh: "建筑与施工" },
  { code: "081", level1Code: "08", nameEn: "Agriculture", nameZh: "农业" },
  { code: "082", level1Code: "08", nameEn: "Forestry", nameZh: "林业" },
  { code: "083", level1Code: "08", nameEn: "Fisheries", nameZh: "渔业" },
  { code: "084", level1Code: "08", nameEn: "Veterinary", nameZh: "兽医" },
  { code: "091", level1Code: "09", nameEn: "Health", nameZh: "健康" },
  { code: "092", level1Code: "09", nameEn: "Welfare", nameZh: "福利" },
  { code: "101", level1Code: "10", nameEn: "Personal services", nameZh: "个人服务" },
  { code: "102", level1Code: "10", nameEn: "Hygiene and occupational health services", nameZh: "卫生与职业健康服务" },
  { code: "103", level1Code: "10", nameEn: "Security services", nameZh: "安全服务" },
  { code: "104", level1Code: "10", nameEn: "Transport services", nameZh: "运输服务" },
];

// Countries data
const countriesData = [
  { code: "GB", nameEn: "United Kingdom", nameZh: "英国", isEU: false, isSchengen: false, currency: "GBP", officialLanguages: "English" },
  { code: "CH", nameEn: "Switzerland", nameZh: "瑞士", isEU: false, isSchengen: true, currency: "CHF", officialLanguages: "German, French, Italian" },
  { code: "DE", nameEn: "Germany", nameZh: "德国", isEU: true, isSchengen: true, currency: "EUR", officialLanguages: "German" },
  { code: "FR", nameEn: "France", nameZh: "法国", isEU: true, isSchengen: true, currency: "EUR", officialLanguages: "French" },
  { code: "NL", nameEn: "Netherlands", nameZh: "荷兰", isEU: true, isSchengen: true, currency: "EUR", officialLanguages: "Dutch" },
  { code: "SE", nameEn: "Sweden", nameZh: "瑞典", isEU: true, isSchengen: true, currency: "SEK", officialLanguages: "Swedish" },
  { code: "DK", nameEn: "Denmark", nameZh: "丹麦", isEU: true, isSchengen: true, currency: "DKK", officialLanguages: "Danish" },
  { code: "NO", nameEn: "Norway", nameZh: "挪威", isEU: false, isSchengen: true, currency: "NOK", officialLanguages: "Norwegian" },
  { code: "FI", nameEn: "Finland", nameZh: "芬兰", isEU: true, isSchengen: true, currency: "EUR", officialLanguages: "Finnish, Swedish" },
  { code: "AT", nameEn: "Austria", nameZh: "奥地利", isEU: true, isSchengen: true, currency: "EUR", officialLanguages: "German" },
];

// Cities data
const citiesData = [
  { nameEn: "London", nameZh: "伦敦", countryCode: "GB", latitude: 51.5074, longitude: -0.1278 },
  { nameEn: "Oxford", nameZh: "牛津", countryCode: "GB", latitude: 51.7520, longitude: -1.2577 },
  { nameEn: "Cambridge", nameZh: "剑桥", countryCode: "GB", latitude: 52.2053, longitude: 0.1218 },
  { nameEn: "Edinburgh", nameZh: "爱丁堡", countryCode: "GB", latitude: 55.9533, longitude: -3.1883 },
  { nameEn: "Zurich", nameZh: "苏黎世", countryCode: "CH", latitude: 47.3769, longitude: 8.5417 },
  { nameEn: "Lausanne", nameZh: "洛桑", countryCode: "CH", latitude: 46.5197, longitude: 6.6323 },
  { nameEn: "Munich", nameZh: "慕尼黑", countryCode: "DE", latitude: 48.1351, longitude: 11.5820 },
];

// Degree types
const degreeTypesData = [
  { code: "BACHELOR", nameEn: "Bachelor", nameZh: "学士", level: 6 },
  { code: "MASTER", nameEn: "Master", nameZh: "硕士", level: 7 },
  { code: "PHD", nameEn: "PhD", nameZh: "博士", level: 8 },
  { code: "MBA", nameEn: "MBA", nameZh: "工商管理硕士", level: 7 },
];

// Exchange rates (to RMB)
const exchangeRatesData = [
  { currencyCode: "GBP", currencyName: "British Pound", rateToRMB: 9.2, lastUpdated: new Date() },
  { currencyCode: "EUR", currencyName: "Euro", rateToRMB: 7.8, lastUpdated: new Date() },
  { currencyCode: "CHF", currencyName: "Swiss Franc", rateToRMB: 8.3, lastUpdated: new Date() },
];

async function importData() {
  console.log("Starting data import...");

  try {
    // 1. Import ISCED-F Level 1
    console.log("Importing ISCED-F Level 1...");
    const level1Ids: Record<string, number> = {};
    for (const item of iscedLevel1Data) {
      const [result] = await db.insert(schema.iscedLevel1).values(item).onDuplicateKeyUpdate({ set: item });
      level1Ids[item.code] = result.insertId;
    }

    // 2. Import ISCED-F Level 2
    console.log("Importing ISCED-F Level 2...");
    for (const item of iscedLevel2Data) {
      const level2Item = {
        ...item,
        level1Id: level1Ids[item.level1Code]
      };
      delete (level2Item as any).level1Code;
      await db.insert(schema.iscedLevel2).values(level2Item).onDuplicateKeyUpdate({ set: level2Item });
    }

    // 3. Import Countries
    console.log("Importing countries...");
    const countryIds: Record<string, number> = {};
    for (const item of countriesData) {
      const [result] = await db.insert(schema.countries).values(item).onDuplicateKeyUpdate({ set: item });
      countryIds[item.code] = result.insertId;
    }

    // 4. Import Cities
    console.log("Importing cities...");
    const cityIds: Record<string, number> = {};
    for (const item of citiesData) {
      const cityItem = {
        ...item,
        countryId: countryIds[item.countryCode]
      };
      delete (cityItem as any).countryCode;
      const [result] = await db.insert(schema.cities).values(cityItem).onDuplicateKeyUpdate({ set: cityItem });
      cityIds[item.nameEn] = result.insertId;
    }

    // 5. Import Degree Types
    console.log("Importing degree types...");
    for (const item of degreeTypesData) {
      await db.insert(schema.degreeTypes).values(item).onDuplicateKeyUpdate({ set: item });
    }

    // 6. Import Exchange Rates
    console.log("Importing exchange rates...");
    for (const item of exchangeRatesData) {
      await db.insert(schema.exchangeRates).values(item).onDuplicateKeyUpdate({ set: item });
    }

    // 7. Import Universities and Programs from collected data
    console.log("Importing universities and programs...");
    
    const universities = [
      { nameEn: "Imperial College London", nameZh: "伦敦帝国理工学院", countryCode: "GB", cityId: cityIds["London"], qsRank: 2, isPublic: true, foundedYear: 1907, websiteUrl: "https://www.imperial.ac.uk" },
      { nameEn: "University of Oxford", nameZh: "牛津大学", countryCode: "GB", cityId: cityIds["Oxford"], qsRank: 3, isPublic: true, foundedYear: 1096, websiteUrl: "https://www.ox.ac.uk" },
      { nameEn: "ETH Zurich", nameZh: "苏黎世联邦理工学院", countryCode: "CH", cityId: cityIds["Zurich"], qsRank: 7, isPublic: true, foundedYear: 1855, websiteUrl: "https://ethz.ch" },
      { nameEn: "University College London", nameZh: "伦敦大学学院", countryCode: "GB", cityId: cityIds["London"], qsRank: 9, isPublic: true, foundedYear: 1826, websiteUrl: "https://www.ucl.ac.uk" },
      { nameEn: "EPFL", nameZh: "洛桑联邦理工学院", countryCode: "CH", cityId: cityIds["Lausanne"], qsRank: 26, isPublic: true, foundedYear: 1969, websiteUrl: "https://www.epfl.ch" },
      { nameEn: "University of Edinburgh", nameZh: "爱丁堡大学", countryCode: "GB", cityId: cityIds["Edinburgh"], qsRank: 27, isPublic: true, foundedYear: 1582, websiteUrl: "https://www.ed.ac.uk" },
      { nameEn: "Technical University of Munich", nameZh: "慕尼黑工业大学", countryCode: "DE", cityId: cityIds["Munich"], qsRank: 28, isPublic: true, foundedYear: 1868, websiteUrl: "https://www.tum.de" },
      { nameEn: "King's College London", nameZh: "伦敦国王学院", countryCode: "GB", cityId: cityIds["London"], qsRank: 31, isPublic: true, foundedYear: 1829, websiteUrl: "https://www.kcl.ac.uk" },
    ];

    const universityIds: Record<string, number> = {};
    for (const uni of universities) {
      const [result] = await db.insert(schema.universities).values(uni).onDuplicateKeyUpdate({ set: uni });
      universityIds[uni.nameEn] = result.insertId;
    }

    // Import programs from collected JSON files
    const dataDir = "/home/ubuntu/programs_data_extracted";
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
    
    const universityFileMap: Record<string, string> = {
      "Imperial College London": "/home/ubuntu/european-university-portal/data/imperial-programs.json",
      "University of Oxford": files.find(f => f.includes("oxford")) || "",
      "ETH Zurich": files.find(f => f.includes("eth")) || "",
      "University College London": files.find(f => f.includes("ucl")) || "",
      "EPFL": files.find(f => f.includes("epfl")) || "",
      "Technical University of Munich": files.find(f => f.includes("tum")) || "",
      "University of Edinburgh": files.find(f => f.includes("edinburgh")) || "",
      "King's College London": files.find(f => f.includes("kcl")) || "",
    };

    for (const [uniName, fileName] of Object.entries(universityFileMap)) {
      if (!fileName) continue;
      
      const filePath = fileName.startsWith("/home") ? fileName : path.join(dataDir, fileName);
      if (!fs.existsSync(filePath)) continue;

      const programsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const programs = Array.isArray(programsData) ? programsData : programsData.programs || [];

      console.log(`Importing ${programs.length} programs for ${uniName}...`);

      for (const prog of programs) {
        // Parse tuition fee
        const tuitionMatch = prog.tuition_fee?.match(/([£€CHF$])?\s*([\d,]+)/);
        let tuitionAmount = 0;
        let tuitionCurrency = "GBP";
        
        if (tuitionMatch) {
          tuitionAmount = parseInt(tuitionMatch[2].replace(/,/g, ""));
          if (prog.tuition_fee.includes("CHF")) tuitionCurrency = "CHF";
          else if (prog.tuition_fee.includes("€")) tuitionCurrency = "EUR";
        }

        // Get ISCED code (first 2 or 3 digits)
        const iscedCode = prog.isced_f_code || prog.iscedFCode || "061";
        const iscedLevel2Code = iscedCode.substring(0, 3);

        const programData = {
          nameEn: prog.program_en || prog.nameEn,
          nameZh: prog.program_zh || prog.nameZh,
          universityId: universityIds[uniName],
          degreeTypeCode: prog.degree_type?.toUpperCase() || "MASTER",
          iscedLevel2Code: iscedLevel2Code,
          durationMonths: prog.duration_months || prog.duration || 12,
          teachingLanguage: prog.teaching_language || prog.language || "English",
          tuitionFeeAmount: tuitionAmount,
          tuitionFeeCurrency: tuitionCurrency,
          applicationRequirements: prog.application_requirements || prog.requirements || "",
          descriptionEn: prog.features_en || prog.descriptionEn || "",
          descriptionZh: prog.features_zh || prog.descriptionZh || "",
          qsSubjectRank: prog.qs_subject_rank || prog.qsSubjectRank || null,
        };

        await db.insert(schema.programs).values(programData);
      }
    }

    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}

importData();

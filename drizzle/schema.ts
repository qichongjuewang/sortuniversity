import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index, unique } from "drizzle-orm/mysql-core";

/**
 * 核心用户表，支持认证流程
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * ISCED-F 第一级分类（Broad fields）
 * 例如：Education, Arts and humanities, Social sciences, Business, administration and law等
 */
export const iscedLevel1 = mysqlTable("isced_level1", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 2 }).notNull().unique(), // 01-10
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ISCED-F 第二级分类（Narrow fields）
 */
export const iscedLevel2 = mysqlTable("isced_level2", {
  id: int("id").autoincrement().primaryKey(),
  level1Id: int("level1Id").notNull(),
  code: varchar("code", { length: 3 }).notNull().unique(), // 011-999
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  level1Idx: index("level1_idx").on(table.level1Id),
}));

/**
 * ISCED-F 第三级分类（Detailed fields）
 */
export const iscedLevel3 = mysqlTable("isced_level3", {
  id: int("id").autoincrement().primaryKey(),
  level2Id: int("level2Id").notNull(),
  code: varchar("code", { length: 4 }).notNull().unique(), // 0111-9999
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  level2Idx: index("level2_idx").on(table.level2Id),
}));

/**
 * 国家表
 */
export const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(), // ISO 3166-1 alpha-3
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  isEU: boolean("isEU").default(false).notNull(), // 是否欧盟成员国
  isSchengen: boolean("isSchengen").default(false).notNull(), // 是否申根国
  currency: varchar("currency", { length: 3 }).notNull(), // EUR, GBP, CHF等
  officialLanguages: text("officialLanguages"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * 城市/地区表
 */
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  countryId: int("countryId").notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }), // 州/省/大区
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  countryIdx: index("country_idx").on(table.countryId),
}));

/**
 * 学校表
 */
export const universities = mysqlTable("universities", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 500 }).notNull(),
  nameZh: varchar("nameZh", { length: 500 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 50 }), // 缩写
  countryId: int("countryId").notNull(),
  mainCityId: int("mainCityId").notNull(), // 主校区城市
  type: mysqlEnum("type", ["public", "private"]).notNull(),
  foundedYear: int("foundedYear"),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  wikipediaUrl: varchar("wikipediaUrl", { length: 500 }),
  logoUrl: varchar("logoUrl", { length: 500 }),
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  studentCount: int("studentCount"),
  internationalStudentPercent: decimal("internationalStudentPercent", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  countryIdx: index("country_idx").on(table.countryId),
  cityIdx: index("city_idx").on(table.mainCityId),
  nameEnIdx: index("name_en_idx").on(table.nameEn),
}));

/**
 * 校区表
 */
export const campuses = mysqlTable("campuses", {
  id: int("id").autoincrement().primaryKey(),
  universityId: int("universityId").notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  cityId: int("cityId").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  isMainCampus: boolean("isMainCampus").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  universityIdx: index("university_idx").on(table.universityId),
  cityIdx: index("city_idx").on(table.cityId),
}));

/**
 * 学位类型表
 */
export const degreeTypes = mysqlTable("degree_types", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(), // bachelor, master, phd等
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  nameZh: varchar("nameZh", { length: 100 }).notNull(),
  level: int("level").notNull(), // 1=本科, 2=硕士, 3=博士
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * 专业表（核心表）
 */
export const programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
  universityId: int("universityId").notNull(),
  nameEn: varchar("nameEn", { length: 500 }).notNull(),
  nameZh: varchar("nameZh", { length: 500 }).notNull(),
  degreeTypeCode: varchar("degreeTypeCode", { length: 20 }).notNull(), // BACHELOR, MASTER, PHD
  iscedLevel1Code: varchar("iscedLevel1Code", { length: 2 }).notNull(), // 01-10
  iscedLevel2Code: varchar("iscedLevel2Code", { length: 3 }).notNull(), // 011-104
  iscedLevel3Code: varchar("iscedLevel3Code", { length: 4 }), // 0111-1041 (optional)
  
  // 学费信息
  tuitionFee: decimal("tuitionFee", { precision: 10, scale: 2 }), // 年度学费
  tuitionCurrency: varchar("tuitionCurrency", { length: 3 }).default("EUR"),
  tuitionPaymentType: mysqlEnum("tuitionPaymentType", ["annual", "semester"]).default("annual"),
  tuitionFeeRMB: decimal("tuitionFeeRMB", { precision: 10, scale: 2 }), // 换算后的人民币
  
  // 授课信息
  teachingLanguages: text("teachingLanguages"), // JSON array: ["English", "German"]
  duration: int("duration"), // 学制（月）
  startDate: varchar("startDate", { length: 50 }), // 开学时间
  
  // 申请要求
  requirementsEn: text("requirementsEn"),
  requirementsZh: text("requirementsZh"),
  minGPA: decimal("minGPA", { precision: 3, scale: 2 }),
  languageRequirements: text("languageRequirements"), // JSON
  
  // 链接
  programUrl: varchar("programUrl", { length: 500 }),
  applicationUrl: varchar("applicationUrl", { length: 500 }),
  
  // 描述
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  highlightsEn: text("highlightsEn"), // 优势特点
  highlightsZh: text("highlightsZh"),
  
  // 其他信息
  applicationDeadline: varchar("applicationDeadline", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  universityIdx: index("university_idx").on(table.universityId),
  degreeIdx: index("degree_idx").on(table.degreeTypeCode),
  isced1Idx: index("isced1_idx").on(table.iscedLevel1Code),
  isced2Idx: index("isced2_idx").on(table.iscedLevel2Code),
  isced3Idx: index("isced3_idx").on(table.iscedLevel3Code),
  activeIdx: index("active_idx").on(table.isActive),
}));

/**
 * 排名表
 */
export const rankings = mysqlTable("rankings", {
  id: int("id").autoincrement().primaryKey(),
  universityId: int("universityId").notNull(),
  rankingType: varchar("rankingType", { length: 50 }).notNull(), // QS, THE, ARWU等
  rankingCategory: varchar("rankingCategory", { length: 100 }).notNull(), // overall, subject等
  subjectArea: varchar("subjectArea", { length: 255 }), // 学科领域（如果是学科排名）
  year: int("year").notNull(),
  rank: int("rank"),
  rankRange: varchar("rankRange", { length: 50 }), // 如 "201-250"
  score: decimal("score", { precision: 5, scale: 2 }),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  universityIdx: index("university_idx").on(table.universityId),
  typeYearIdx: index("type_year_idx").on(table.rankingType, table.year),
  categoryIdx: index("category_idx").on(table.rankingCategory),
}));

/**
 * 住宿信息表
 */
export const accommodations = mysqlTable("accommodations", {
  id: int("id").autoincrement().primaryKey(),
  universityId: int("universityId").notNull(),
  campusId: int("campusId"),
  typeEn: varchar("typeEn", { length: 100 }).notNull(), // Dormitory, Shared Apartment等
  typeZh: varchar("typeZh", { length: 100 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  priceMin: decimal("priceMin", { precision: 10, scale: 2 }).notNull(),
  priceMax: decimal("priceMax", { precision: 10, scale: 2 }).notNull(),
  priceCurrency: varchar("priceCurrency", { length: 3 }).default("EUR"),
  priceUnit: varchar("priceUnit", { length: 20 }).default("month"), // month, semester, year
  priceMinRMB: decimal("priceMinRMB", { precision: 10, scale: 2 }),
  priceMaxRMB: decimal("priceMaxRMB", { precision: 10, scale: 2 }),
  facilities: text("facilities"), // JSON array
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  universityIdx: index("university_idx").on(table.universityId),
}));

/**
 * 奖学金表
 */
export const scholarships = mysqlTable("scholarships", {
  id: int("id").autoincrement().primaryKey(),
  universityId: int("universityId").notNull(),
  programId: int("programId"), // null表示全校性奖学金
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameZh: varchar("nameZh", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  amountCurrency: varchar("amountCurrency", { length: 3 }),
  amountRMB: decimal("amountRMB", { precision: 10, scale: 2 }),
  coverage: varchar("coverage", { length: 100 }), // full, partial, tuition-only等
  eligibilityEn: text("eligibilityEn"),
  eligibilityZh: text("eligibilityZh"),
  applicationUrl: varchar("applicationUrl", { length: 500 }),
  deadline: varchar("deadline", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  universityIdx: index("university_idx").on(table.universityId),
  programIdx: index("program_idx").on(table.programId),
}));

/**
 * 实习和学生工作机会表
 */
export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  universityId: int("universityId").notNull(),
  programId: int("programId"),
  type: mysqlEnum("type", ["internship", "student_job", "research_assistant"]).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleZh: varchar("titleZh", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  salaryCurrency: varchar("salaryCurrency", { length: 3 }),
  salaryUnit: varchar("salaryUnit", { length: 20 }), // hour, month
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  universityIdx: index("university_idx").on(table.universityId),
  programIdx: index("program_idx").on(table.programId),
  typeIdx: index("type_idx").on(table.type),
}));

/**
 * 国家政策信息表
 */
export const countryPolicies = mysqlTable("country_policies", {
  id: int("id").autoincrement().primaryKey(),
  countryId: int("countryId").notNull(),
  category: mysqlEnum("category", ["cost_of_living", "tourism", "study", "residence", "work", "green_card"]).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleZh: varchar("titleZh", { length: 255 }).notNull(),
  contentEn: text("contentEn").notNull(),
  contentZh: text("contentZh").notNull(),
  officialUrl: varchar("officialUrl", { length: 500 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  countryIdx: index("country_idx").on(table.countryId),
  categoryIdx: index("category_idx").on(table.category),
}));

/**
 * 汇率表（用于学费和住宿费转换）
 */
export const exchangeRates = mysqlTable("exchange_rates", {
  id: int("id").autoincrement().primaryKey(),
  fromCurrency: varchar("fromCurrency", { length: 3 }).notNull(),
  toCurrency: varchar("toCurrency", { length: 3 }).notNull().default("CNY"),
  rate: decimal("rate", { precision: 10, scale: 6 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  currencyPairIdx: unique("currency_pair_idx").on(table.fromCurrency, table.toCurrency),
}));

// 导出类型
export type IscedLevel1 = typeof iscedLevel1.$inferSelect;
export type IscedLevel2 = typeof iscedLevel2.$inferSelect;
export type IscedLevel3 = typeof iscedLevel3.$inferSelect;
export type Country = typeof countries.$inferSelect;
export type City = typeof cities.$inferSelect;
export type University = typeof universities.$inferSelect;
export type Campus = typeof campuses.$inferSelect;
export type DegreeType = typeof degreeTypes.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Ranking = typeof rankings.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;
export type Scholarship = typeof scholarships.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type CountryPolicy = typeof countryPolicies.$inferSelect;
export type ExchangeRate = typeof exchangeRates.$inferSelect;

import { eq, and, or, inArray, like, desc, asc, sql, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  iscedLevel1,
  iscedLevel2,
  iscedLevel3,
  countries,
  cities,
  universities,
  campuses,
  degreeTypes,
  programs,
  rankings,
  accommodations,
  scholarships,
  opportunities,
  countryPolicies,
  exchangeRates,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ 用户相关 ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ ISCED-F 分类查询 ============

export async function getAllIscedLevel1() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(iscedLevel1).orderBy(asc(iscedLevel1.code));
}

export async function getIscedLevel2ByLevel1(level1Id: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(iscedLevel2).where(eq(iscedLevel2.level1Id, level1Id)).orderBy(asc(iscedLevel2.code));
}

export async function getIscedLevel3ByLevel2(level2Id: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(iscedLevel3).where(eq(iscedLevel3.level2Id, level2Id)).orderBy(asc(iscedLevel3.code));
}

// ============ 国家和城市查询 ============

export async function getAllCountries() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(countries).orderBy(asc(countries.nameEn));
}

export async function getCitiesByCountry(countryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cities).where(eq(cities.countryId, countryId)).orderBy(asc(cities.nameEn));
}

export async function getCountryById(countryId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(countries).where(eq(countries.id, countryId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ 大学查询 ============

export async function getAllUniversities() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(universities).orderBy(asc(universities.nameEn));
}

export async function getUniversitiesByCountry(countryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(universities).where(eq(universities.countryId, countryId)).orderBy(asc(universities.nameEn));
}

export async function getUniversityById(universityId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(universities).where(eq(universities.id, universityId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCampusesByUniversity(universityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(campuses).where(eq(campuses.universityId, universityId));
}

// ============ 学位类型查询 ============

export async function getAllDegreeTypes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(degreeTypes).orderBy(asc(degreeTypes.level));
}

// ============ 专业查询（核心功能）============

export interface ProgramFilters {
  iscedLevel1Codes?: string[];
  iscedLevel2Codes?: string[];
  iscedLevel3Codes?: string[];
  countryIds?: number[];
  cityIds?: number[];
  universityIds?: number[];
  degreeTypeCodes?: string[];
  page?: number;
  pageSize?: number;
}

export async function queryPrograms(filters: ProgramFilters) {
  const db = await getDb();
  if (!db) return { programs: [], total: 0 };

  const conditions: SQL[] = [eq(programs.isActive, true)];

  if (filters.iscedLevel1Codes && filters.iscedLevel1Codes.length > 0) {
    conditions.push(inArray(programs.iscedLevel1Code, filters.iscedLevel1Codes));
  }
  if (filters.iscedLevel2Codes && filters.iscedLevel2Codes.length > 0) {
    conditions.push(inArray(programs.iscedLevel2Code, filters.iscedLevel2Codes));
  }
  if (filters.iscedLevel3Codes && filters.iscedLevel3Codes.length > 0) {
    conditions.push(inArray(programs.iscedLevel3Code, filters.iscedLevel3Codes));
  }
  if (filters.degreeTypeCodes && filters.degreeTypeCodes.length > 0) {
    conditions.push(inArray(programs.degreeTypeCode, filters.degreeTypeCodes));
  }
  if (filters.universityIds && filters.universityIds.length > 0) {
    conditions.push(inArray(programs.universityId, filters.universityIds));
  }

  // 如果有国家或城市筛选，需要join universities表
  let query = db.select().from(programs);
  
  if (filters.countryIds && filters.countryIds.length > 0) {
    query = query.innerJoin(universities, eq(programs.universityId, universities.id)) as any;
    conditions.push(inArray(universities.countryId, filters.countryIds));
  }
  
  if (filters.cityIds && filters.cityIds.length > 0) {
    if (!filters.countryIds || filters.countryIds.length === 0) {
      query = query.innerJoin(universities, eq(programs.universityId, universities.id)) as any;
    }
    conditions.push(inArray(universities.mainCityId, filters.cityIds));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 获取总数
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(programs)
    .where(whereClause);
  const total = countResult[0]?.count || 0;

  // 获取分页数据
  const page = filters.page || 0;
  const pageSize = filters.pageSize || 50;
  
  const results = await query
    .where(whereClause)
    .orderBy(desc(sql`1`)) // 默认排序，后续会根据排名排序
    .limit(pageSize)
    .offset(page * pageSize);

  return { programs: results, total };
}

export async function getProgramById(programId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(programs).where(eq(programs.id, programId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProgramsByUniversity(universityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(programs).where(and(
    eq(programs.universityId, universityId),
    eq(programs.isActive, true)
  ));
}

// ============ 排名查询 ============

export async function getRankingsByUniversity(universityId: number, year?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(rankings.universityId, universityId)];
  if (year) {
    conditions.push(eq(rankings.year, year));
  }
  
  return await db.select().from(rankings).where(and(...conditions)).orderBy(desc(rankings.year));
}

export async function getLatestRankingByUniversity(universityId: number, rankingType: string = 'QS') {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(rankings).where(and(
    eq(rankings.universityId, universityId),
    eq(rankings.rankingType, rankingType),
    eq(rankings.rankingCategory, 'overall')
  )).orderBy(desc(rankings.year)).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// ============ 住宿信息查询 ============

export async function getAccommodationsByUniversity(universityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(accommodations).where(eq(accommodations.universityId, universityId));
}

// ============ 奖学金查询 ============

export async function getScholarshipsByUniversity(universityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(scholarships).where(eq(scholarships.universityId, universityId));
}

export async function getScholarshipsByProgram(programId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(scholarships).where(eq(scholarships.programId, programId));
}

// ============ 实习和学生工作机会查询 ============

export async function getOpportunitiesByUniversity(universityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(opportunities).where(eq(opportunities.universityId, universityId));
}

export async function getOpportunitiesByProgram(programId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(opportunities).where(eq(opportunities.programId, programId));
}

// ============ 国家政策查询 ============

export async function getCountryPolicies(countryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(countryPolicies).where(eq(countryPolicies.countryId, countryId)).orderBy(asc(countryPolicies.category));
}

// ============ 汇率查询 ============

export async function getExchangeRate(fromCurrency: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(exchangeRates).where(and(
    eq(exchangeRates.fromCurrency, fromCurrency),
    eq(exchangeRates.toCurrency, 'CNY')
  )).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// ============ 响应式筛选选项查询 ============

export async function getAvailableFilterOptions(currentFilters: ProgramFilters) {
  const db = await getDb();
  if (!db) return {
    iscedLevel1: [],
    iscedLevel2: [],
    iscedLevel3: [],
    countries: [],
    cities: [],
    universities: [],
    degreeTypes: [],
  };

  // 根据当前筛选条件，查询可用的筛选选项
  // 这个函数会返回在当前筛选条件下，还有哪些选项是可用的
  
  const conditions: SQL[] = [eq(programs.isActive, true)];
  
  // 构建基础查询条件
  if (currentFilters.iscedLevel1Codes && currentFilters.iscedLevel1Codes.length > 0) {
    conditions.push(inArray(programs.iscedLevel1Code, currentFilters.iscedLevel1Codes));
  }
  if (currentFilters.iscedLevel2Codes && currentFilters.iscedLevel2Codes.length > 0) {
    conditions.push(inArray(programs.iscedLevel2Code, currentFilters.iscedLevel2Codes));
  }
  if (currentFilters.iscedLevel3Codes && currentFilters.iscedLevel3Codes.length > 0) {
    conditions.push(inArray(programs.iscedLevel3Code, currentFilters.iscedLevel3Codes));
  }
  if (currentFilters.degreeTypeCodes && currentFilters.degreeTypeCodes.length > 0) {
    conditions.push(inArray(programs.degreeTypeCode, currentFilters.degreeTypeCodes));
  }
  if (currentFilters.universityIds && currentFilters.universityIds.length > 0) {
    conditions.push(inArray(programs.universityId, currentFilters.universityIds));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 查询可用的ISCED Level 1
  const availableIsced1 = await db
    .selectDistinct({ id: programs.iscedLevel1Code })
    .from(programs)
    .where(whereClause);

  // 查询可用的ISCED Level 2
  const availableIsced2 = await db
    .selectDistinct({ id: programs.iscedLevel2Code })
    .from(programs)
    .where(whereClause);

  // 查询可用的ISCED Level 3
  const availableIsced3 = await db
    .selectDistinct({ id: programs.iscedLevel3Code })
    .from(programs)
    .where(whereClause);

  // 查询可用的学位类型
  const availableDegrees = await db
    .selectDistinct({ id: programs.degreeTypeCode })
    .from(programs)
    .where(whereClause);

  // 查询可用的大学
  const availableUniversities = await db
    .selectDistinct({ id: programs.universityId })
    .from(programs)
    .where(whereClause);

  return {
    iscedLevel1Codes: availableIsced1.map(r => r.id),
    iscedLevel2Codes: availableIsced2.map(r => r.id),
    iscedLevel3Codes: availableIsced3.map(r => r.id),
    degreeTypeCodes: availableDegrees.map(r => r.id),
    universityIds: availableUniversities.map(r => r.id),
  };
}

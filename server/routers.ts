import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ISCED-F 分类接口
  isced: router({
    // 获取所有第一级分类
    getLevel1: publicProcedure.query(async () => {
      return await db.getAllIscedLevel1();
    }),
    
    // 获取第二级分类（根据第一级）
    getLevel2: publicProcedure
      .input(z.object({ level1Id: z.number() }))
      .query(async ({ input }) => {
        return await db.getIscedLevel2ByLevel1(input.level1Id);
      }),
    
    // 获取第三级分类（根据第二级）
    getLevel3: publicProcedure
      .input(z.object({ level2Id: z.number() }))
      .query(async ({ input }) => {
        return await db.getIscedLevel3ByLevel2(input.level2Id);
      }),
  }),

  // 国家和城市接口
  location: router({
    // 获取所有国家
    getAllCountries: publicProcedure.query(async () => {
      return await db.getAllCountries();
    }),
    
    // 获取国家详情
    getCountry: publicProcedure
      .input(z.object({ countryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCountryById(input.countryId);
      }),
    
    // 获取某国家的所有城市
    getCitiesByCountry: publicProcedure
      .input(z.object({ countryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCitiesByCountry(input.countryId);
      }),
    
    // 获取国家政策信息
    getCountryPolicies: publicProcedure
      .input(z.object({ countryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCountryPolicies(input.countryId);
      }),
  }),

  // 大学接口
  university: router({
    // 获取所有大学
    getAll: publicProcedure.query(async () => {
      return await db.getAllUniversities();
    }),
    
    // 获取大学详情
    getById: publicProcedure
      .input(z.object({ universityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getUniversityById(input.universityId);
      }),
    
    // 获取某国家的所有大学
    getByCountry: publicProcedure
      .input(z.object({ countryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getUniversitiesByCountry(input.countryId);
      }),
    
    // 获取大学的所有校区
    getCampuses: publicProcedure
      .input(z.object({ universityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCampusesByUniversity(input.universityId);
      }),
    
    // 获取大学的排名信息
    getRankings: publicProcedure
      .input(z.object({ 
        universityId: z.number(),
        year: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getRankingsByUniversity(input.universityId, input.year);
      }),
    
    // 获取大学的住宿信息
    getAccommodations: publicProcedure
      .input(z.object({ universityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAccommodationsByUniversity(input.universityId);
      }),
    
    // 获取大学的奖学金信息
    getScholarships: publicProcedure
      .input(z.object({ universityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getScholarshipsByUniversity(input.universityId);
      }),
    
    // 获取大学的实习和学生工作机会
    getOpportunities: publicProcedure
      .input(z.object({ universityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getOpportunitiesByUniversity(input.universityId);
      }),
  }),

  // 学位类型接口
  degree: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllDegreeTypes();
    }),
  }),

  // 专业查询接口（核心功能）
  program: router({
    // 查询专业列表（支持多维度筛选和分页）
    query: publicProcedure
      .input(z.object({
        iscedLevel1Ids: z.array(z.number()).optional(),
        iscedLevel2Ids: z.array(z.number()).optional(),
        iscedLevel3Ids: z.array(z.number()).optional(),
        countryIds: z.array(z.number()).optional(),
        cityIds: z.array(z.number()).optional(),
        universityIds: z.array(z.number()).optional(),
        degreeTypeIds: z.array(z.number()).optional(),
        page: z.number().default(0),
        pageSize: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return await db.queryPrograms(input);
      }),
    
    // 获取专业详情
    getById: publicProcedure
      .input(z.object({ programId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProgramById(input.programId);
      }),
    
    // 获取某大学的所有专业
    getByUniversity: publicProcedure
      .input(z.object({ universityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProgramsByUniversity(input.universityId);
      }),
    
    // 获取专业的奖学金信息
    getScholarships: publicProcedure
      .input(z.object({ programId: z.number() }))
      .query(async ({ input }) => {
        return await db.getScholarshipsByProgram(input.programId);
      }),
    
    // 获取专业的实习和学生工作机会
    getOpportunities: publicProcedure
      .input(z.object({ programId: z.number() }))
      .query(async ({ input }) => {
        return await db.getOpportunitiesByProgram(input.programId);
      }),
  }),

  // 响应式筛选选项接口
  filter: router({
    // 获取当前筛选条件下可用的筛选选项
    getAvailableOptions: publicProcedure
      .input(z.object({
        iscedLevel1Ids: z.array(z.number()).optional(),
        iscedLevel2Ids: z.array(z.number()).optional(),
        iscedLevel3Ids: z.array(z.number()).optional(),
        countryIds: z.array(z.number()).optional(),
        cityIds: z.array(z.number()).optional(),
        universityIds: z.array(z.number()).optional(),
        degreeTypeIds: z.array(z.number()).optional(),
      }))
      .query(async ({ input }) => {
        return await db.getAvailableFilterOptions(input);
      }),
  }),

  // 汇率接口
  exchange: router({
    // 获取汇率（转换为人民币）
    getRate: publicProcedure
      .input(z.object({ fromCurrency: z.string() }))
      .query(async ({ input }) => {
        return await db.getExchangeRate(input.fromCurrency);
      }),
  }),
});

export type AppRouter = typeof appRouter;

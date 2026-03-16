import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  jsonb,
  timestamp,
  serial,
} from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  difficulty: varchar('difficulty', { length: 20 }).notNull(),
  cookTimeMinutes: integer('cook_time_minutes').notNull(),
  servingCount: integer('serving_count').notNull(),
  ingredients: jsonb('ingredients').notNull().$type<IngredientJson[]>(),
  cookingSteps: jsonb('cooking_steps').notNull().$type<CookingStepJson[]>(),
  nutrition: jsonb('nutrition').$type<NutritionJson>(),
  sourceType: varchar('source_type', { length: 20 }),
  sourceUrl: text('source_url'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 사용자 테이블 스키마
 * 회원가입 시 필요한 모든 정보를 저장합니다.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

interface IngredientJson {
  name: string;
  amount?: string;
  unit?: string;
}

interface CookingStepJson {
  order: number;
  description: string;
  tip?: string;
}

interface NutritionJson {
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
}

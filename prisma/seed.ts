import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем заполнение базы данных...')

  // Clear existing data
  await prisma.sandboxSubmission.deleteMany();
  await prisma.sandboxTask.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.note.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();

  // Create sandbox tables
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "orders";`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "products";`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "users";`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "users" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "products" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "price" INTEGER NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "orders" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
      "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
      "quantity" INTEGER NOT NULL
    );
  `);

  // Insert data into sandbox tables
  await prisma.$executeRawUnsafe(`
    INSERT INTO "users" ("name", "email") VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@another.com');
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO "products" ("name", "price") VALUES
    ('Laptop', 1200),
    ('Mouse', 25),
    ('Keyboard', 75);
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO "orders" ("user_id", "product_id", "quantity") VALUES
    (1, 1, 1),
    (1, 3, 1),
    (2, 2, 2);
  `);

  // Создаем курс "Тестовый курс"
  const testCourse = await prisma.course.create({
    data: {
      title: 'Тестовый курс',
      description: 'Это тестовый курс для демонстрации возможностей платформы.',
      tags: ['Тест', 'Демо'],
      chapters: {
        create: [
          {
            title: 'Глава 1: Введение',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Урок 1.1: Первый взгляд',
                  content: '# Добро пожаловать!\n\nЭто содержимое первого урока. Здесь вы можете использовать **Markdown** для форматирования текста, добавления `кода` и многого другого.',
                  order: 1,
                },
                {
                  title: 'Урок 1.2: Основные концепции',
                  content: '# Основные концепции\n\n- **Концепция 1:** Описание первой концепции.\n- **Концепция 2:** Описание второй концепции.',
                  order: 2,
                },
              ],
            },
          },
          {
            title: 'Глава 2: Продвинутые темы',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Урок 2.1: Сложные техники',
                  content: '# Сложные техники\n\nЗдесь мы рассмотрим более сложные аспекты темы. Например, вложенные списки:\n\n1. Элемент 1\n   - Подэлемент 1.1\n   - Подэлемент 1.2\n2. Элемент 2',
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Seed sandbox tasks
  await prisma.sandboxTask.createMany({
    data: [
      {
        title: 'Выбрать все из таблицы users',
        description: 'Напишите запрос, который выберет все записи из таблицы `users`.',
        language: 'sql',
        difficulty: 'easy',
        tags: ['SELECT', 'FROM'],
        initialCode: 'SELECT * FROM users;',
        solution: 'SELECT * FROM users;',
      },
      {
        title: 'Выбрать пользователей по имени',
        description: 'Напишите запрос, который выберет пользователей с именем `Alice`.',
        language: 'sql',
        difficulty: 'easy',
        tags: ['SELECT', 'WHERE'],
        initialCode: 'SELECT * FROM users WHERE name = \'Alice\';',
        solution: 'SELECT * FROM users WHERE name = \'Alice\';',
      },
    ],
  });

  console.log('База данных успешно заполнена!')
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

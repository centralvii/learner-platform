import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем заполнение базы данных...')

  // Создаем курс "Основы JavaScript"
  const jsCourse = await prisma.course.create({
    data: {
      title: 'Основы JavaScript',
      description: 'Полный курс по изучению основ JavaScript с нуля до продвинутого уровня. Включает практические задания, проекты и современные подходы к разработке.',
      tags: ['JavaScript', 'Web Development', 'Frontend'],
    },
  })

  // Создаем главы для курса JavaScript
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: jsCourse.id,
      title: 'Введение в JavaScript',
      order: 1,
    },
  })

  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: jsCourse.id,
      title: 'Основы синтаксиса',
      order: 2,
    },
  })

  // Создаем уроки для первой главы
  const lesson1 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: 'История JavaScript',
      content: `# История JavaScript

JavaScript был создан в 1995 году Бренданом Эйхом в компании Netscape. Изначально язык назывался Mocha, затем LiveScript, и наконец получил имя JavaScript.

## Ключевые моменты развития:

- **1995** - Создание языка за 10 дней
- **1997** - Стандартизация ECMAScript
- **2009** - Появление Node.js
- **2015** - ES6/ES2015 - крупное обновление языка

## Почему JavaScript важен?

JavaScript стал одним из самых популярных языков программирования благодаря:

1. Простоте изучения
2. Универсальности (фронтенд и бэкенд)
3. Огромной экосистеме
4. Активному сообществу

Сегодня JavaScript используется практически везде - от веб-сайтов до мобильных приложений и серверов.`,
      attachments: ['presentation.pdf'],
      order: 1,
    },
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: 'Настройка среды разработки',
      content: `# Настройка среды разработки

Для разработки на JavaScript нам понадобится:

## Браузер
Любой современный браузер (Chrome, Firefox, Safari, Edge)

## Текстовый редактор
Рекомендуется использовать:
- Visual Studio Code
- Sublime Text
- Atom
- WebStorm

## Node.js
Для серверной разработки и использования пакетного менеджера npm.

## Инструменты разработчика
В браузере нажмите F12 для открытия DevTools.`,
      videoUrl: 'https://example.com/setup-video',
      attachments: ['setup-guide.pdf', 'vscode-settings.json'],
      order: 2,
    },
  })

  const lesson3 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: 'Первая программа на JavaScript',
      content: `# Первая программа на JavaScript

Давайте напишем нашу первую программу!

## Hello World в браузере

Создайте файл \`index.html\`:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Моя первая программа</title>
</head>
<body>
    <h1>Hello World!</h1>
    <script>
        console.log("Привет, мир!");
        alert("Добро пожаловать в JavaScript!");
    </script>
</body>
</html>
\`\`\`

## Объяснение кода

- \`console.log()\` - выводит сообщение в консоль браузера
- \`alert()\` - показывает всплывающее окно с сообщением`,
      attachments: ['hello-world-example.html'],
      order: 3,
    },
  })

  // Создаем уроки для второй главы
  const lesson4 = await prisma.lesson.create({
    data: {
      chapterId: chapter2.id,
      title: 'Переменные и типы данных',
      content: `# Переменные и типы данных

В JavaScript есть несколько способов объявления переменных:

## Объявление переменных

\`\`\`javascript
var oldWay = "старый способ";
let modernWay = "современный способ";
const constant = "константа";
\`\`\`

## Типы данных

JavaScript имеет следующие примитивные типы:
- Number (числа)
- String (строки)
- Boolean (логический)
- Undefined
- Null
- Symbol
- BigInt

## Примеры

\`\`\`javascript
let number = 42;
let text = "Привет!";
let isActive = true;
let notDefined;
let empty = null;
\`\`\``,
      order: 1,
    },
  })

  const lesson5 = await prisma.lesson.create({
    data: {
      chapterId: chapter2.id,
      title: 'Операторы',
      content: `# Операторы в JavaScript

JavaScript предоставляет множество операторов для работы с данными.

## Арифметические операторы

\`\`\`javascript
let a = 10;
let b = 3;

console.log(a + b); // 13 (сложение)
console.log(a - b); // 7 (вычитание)
console.log(a * b); // 30 (умножение)
console.log(a / b); // 3.333... (деление)
console.log(a % b); // 1 (остаток от деления)
console.log(a ** b); // 1000 (возведение в степень)
\`\`\`

## Операторы сравнения

\`\`\`javascript
console.log(5 == '5');  // true (нестрогое равенство)
console.log(5 === '5'); // false (строгое равенство)
console.log(5 != '5');  // false
console.log(5 !== '5'); // true
console.log(5 > 3);     // true
console.log(5 < 3);     // false
\`\`\`

## Логические операторы

\`\`\`javascript
console.log(true && false); // false (И)
console.log(true || false); // true (ИЛИ)
console.log(!true);         // false (НЕ)
\`\`\``,
      videoUrl: 'https://example.com/operators-video',
      order: 2,
    },
  })

  // Создаем курс "React для начинающих"
  const reactCourse = await prisma.course.create({
    data: {
      title: 'React для начинающих',
      description: 'Полный курс по React включая hooks, context и современные практики разработки',
      tags: ['React', 'JavaScript', 'Frontend'],
    },
  })

  // Создаем главу для React курса
  const reactChapter1 = await prisma.chapter.create({
    data: {
      courseId: reactCourse.id,
      title: 'Введение в React',
      order: 1,
    },
  })

  // Создаем урок для React
  const reactLesson1 = await prisma.lesson.create({
    data: {
      chapterId: reactChapter1.id,
      title: 'Что такое React?',
      content: `# Что такое React?

React - это JavaScript библиотека для создания пользовательских интерфейсов.

## Основные концепции:

1. **Компоненты** - переиспользуемые части UI
2. **JSX** - расширение синтаксиса JavaScript
3. **Virtual DOM** - эффективное обновление интерфейса
4. **Однонаправленный поток данных**

## Преимущества React:

- Компонентный подход
- Высокая производительность
- Большое сообщество
- Экосистема инструментов`,
      order: 1,
    },
  })

  console.log('База данных успешно заполнена!')
  console.log(`Создано курсов: 2`)
  console.log(`Создано глав: 3`)
  console.log(`Создано уроков: 6`)
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

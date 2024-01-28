const defaultSubjects = {
  '5': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'history_intro', label: 'Історія (Вступ до історії)'},
    {id: 'mathematics', label: 'Математика'},
    {id: 'natural_science', label: 'Природознавство'},
    {id: 'informatics', label: 'Інформатика'},
    {id: 'health_basics', label: 'Основи здоров’я'}
  ],
  '6': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'history_ukraine_world', label: 'Історія України та Всесвітня історія (інтегрований курс)'},
    {id: 'mathematics', label: 'Математика'},
    {id: 'biology', label: 'Біологія'},
    {id: 'geography', label: 'Географія'},
    {id: 'informatics', label: 'Інформатика'},
    {id: 'health_basics', label: 'Основи здоров’я'}
  ],
  '7': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'ukraine_history', label: 'Історія України'},
    {id: 'world_history', label: 'Всесвітня історія'},
    {id: 'algebra', label: 'Алгебра'},
    {id: 'geometry', label: 'Геометрія'},
    {id: 'biology', label: 'Біологія'},
    {id: 'geography', label: 'Географія'},
    {id: 'physics', label: 'Фізика'},
    {id: 'chemistry', label: 'Хімія'},
    {id: 'informatics', label: 'Інформатика'}
  ],
  '8': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'ukraine_history', label: 'Історія України'},
    {id: 'world_history', label: 'Всесвітня історія'},
    {id: 'algebra', label: 'Алгебра'},
    {id: 'geometry', label: 'Геометрія'},
    {id: 'biology', label: 'Біологія'},
    {id: 'geography', label: 'Географія'},
    {id: 'physics', label: 'Фізика'},
    {id: 'chemistry', label: 'Хімія'},
    {id: 'informatics', label: 'Інформатика'}
  ],
  '9': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'ukraine_history', label: 'Історія України'},
    {id: 'world_history', label: 'Всесвітня історія'},
    {id: 'algebra', label: 'Алгебра'},
    {id: 'geometry', label: 'Геометрія'},
    {id: 'biology', label: 'Біологія'},
    {id: 'geography', label: 'Географія'},
    {id: 'physics', label: 'Фізика'},
    {id: 'chemistry', label: 'Хімія'},
    {id: 'informatics', label: 'Інформатика'}
  ],
  '10': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'ukraine_history', label: 'Історія України'},
    {id: 'world_history', label: 'Всесвітня історія'},
    {id: 'civic_education', label: 'Громадянська освіта'},
    {id: 'mathematics', label: 'Математика (Алгебра і початки аналізу та геометрія)'},
    {id: 'biology_ecology', label: 'Біологія і екологія'},
    {id: 'geography', label: 'Географія'},
    {id: 'physics', label: 'Фізика'},
    {id: 'chemistry', label: 'Хімія'},
    {id: 'ukraine_defense', label: 'Захист України'}
  ],
  '11': [
    {id: 'ukrainian_language', label: 'Українська мова'},
    {id: 'ukrainian_literature', label: 'Українська література'},
    {id: 'english_language', label: 'Англійська мова'},
    {id: 'foreign_literature', label: 'Зарубіжна література'},
    {id: 'ukraine_history', label: 'Історія України'},
    {id: 'world_history', label: 'Всесвітня історія'},
    {id: 'mathematics', label: 'Математика (Алгебра і початки аналізу та геометрія)'},
    {id: 'biology_ecology', label: 'Біологія і екологія'},
    {id: 'geography', label: 'Географія'},
    {id: 'physics_astronomy', label: 'Фізика і астрономія'},
    {id: 'chemistry', label: 'Хімія'},
    {id: 'ukraine_defense', label: 'Захист України'}
  ],
} as Record<Grade, Array<Subject>>;

const extraSubjects: Subject[] = [
  {
    id: 'art',
    label: 'Мистецтво',
  },
  {
    id: 'technology',
    label: 'Технології',
  },
  {
    id: 'informatics',
    label: 'Інформатика',
  },
  {
    id: 'financial_literacy',
    label: 'Фінансова грамотність',
  }
];

const allSubjects: Subject[] = Array.from(new Set(Object.values(defaultSubjects).flat().concat(extraSubjects).map(el => JSON.stringify(el)))).map(el => JSON.parse(el)).sort(
  (a, b) => a.label.localeCompare(b.label)
);


export default {
  allSubjects,
  defaultSubjects,
  extraSubjects
}

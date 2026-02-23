# Reequal Quiz Builder Demo

A gamified quiz creation and play module built with **Vue.js 3** and **Vuetify 3**, demonstrating TDD workflow, Composition API mastery, and Pinia state management. Created as a technical showcase for **Reenbow** (Station F, Paris) -- a gamified LMS platform with VR/AI features for schools and training centers.

![App Screenshot](docs/screenshot-placeholder.png)

## Features

- **Quiz List** -- Dashboard with search/filter, create, edit, and delete actions
- **Quiz Editor** -- Dynamic question/answer form with validation and correct answer tagging
- **Quiz Player** -- Gamified step-through experience with progress path, immediate feedback, score screen, and per-question recap

## Tech Stack

| Layer            | Technology                       |
|------------------|----------------------------------|
| Framework        | Vue.js 3 (Composition API only) |
| UI Library       | Vuetify 3 (custom Reequal theme) |
| State Management | Pinia                            |
| Router           | Vue Router 4                     |
| Language         | TypeScript (strict mode)         |
| Unit Testing     | Vitest + Vue Test Utils          |
| E2E Testing      | Cypress                          |
| Build Tool       | Vite                             |
| CI               | GitLab CI                        |
| Linting          | ESLint                           |

## Getting Started

### Prerequisites

- Node.js >= 20

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
# Unit tests
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests (start dev server first)
npm run dev &
npm run test:e2e

# E2E tests with Cypress UI
npm run test:e2e:open
```

### Lint and Type-Check

```bash
npm run lint
npm run type-check
```

### Build for Production

```bash
npm run build
```

Output is in `dist/`.

## Project Structure

```
src/
  components/
    quiz/         QuizCard, QuizForm, QuestionEditor, QuestionStep, QuizPlayer, ScoreScreen
    ui/           ProgressPath, FeedbackAnimation
  composables/    useQuiz, useQuizPlayer
  stores/         quizStore (Pinia)
  types/          Quiz, Question, Answer, QuestionResult
  views/          QuizListView, QuizEditorView, QuizPlayerView
  router/         Vue Router config
  styles/         Vuetify theme overrides
cypress/
  e2e/            quiz-creation, quiz-playing
```

## TDD Workflow

Every feature follows Red-Green-Refactor:

1. **Red** -- Write a failing test first
2. **Green** -- Write the minimum code to pass
3. **Refactor** -- Clean up while keeping tests green

Test counts: **227 unit tests** (Vitest) + **15 e2e tests** (Cypress).

## CI Pipeline

GitLab CI runs 3 stages on every push:

1. **lint** -- ESLint + vue-tsc type-check
2. **test** -- Vitest with coverage report + Cypress headless
3. **build** -- Vite production build

## License

MIT

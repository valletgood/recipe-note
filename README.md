# Recipe Note

AI 기반 레시피 저장 및 관리 서비스입니다. 이미지나 URL을 넣으면 AI가 레시피를 분석해 보기 좋은 포맷으로 정리해 줍니다.

**배포 URL:** [https://recipe-note-opal.vercel.app](https://recipe-note-opal.vercel.app) · [로그인](https://recipe-note-opal.vercel.app/login)

PWA로 설치하면 홈 화면에 앱 아이콘을 추가해 앱처럼 사용할 수 있습니다. (모바일: 브라우저 메뉴 → "홈 화면에 추가" / 데스크톱: 주소창 또는 설치 배너 활용)

---

## 주요 기능

- **AI 레시피 분석**
  - **이미지**: 레시피 사진·스크린샷 업로드 시 AI가 재료, 조리 단계, 소요 시간 등을 추출해 구조화
  - **URL**: 블로그·사이트 주소 입력 시 페이지 내용을 분석해 통일된 레시피 포맷으로 정리
- **레시피 관리**: 저장, 목록 조회, 상세 보기, 수정, 삭제
- **회원/인증**: 이메일 회원가입, 로그인, 세션 기반 인증
- **UI/UX**: 세이지 그린 포인트 컬러, 글래스모피즘, 라이트/다크 모드, 반응형 웹, 너구리 마스코트

_(예정: AI 챗봇 재료 대체 추천, 외부 플랫폼 연동, AI 칼로리 추정)_

---

## 기술 스택

| 구분        | 기술                               |
| ----------- | ---------------------------------- |
| 프레임워크  | Next.js 16 (App Router, Turbopack) |
| UI          | React 19, Tailwind CSS 4           |
| DB          | PostgreSQL + Drizzle ORM           |
| AI          | Vercel AI SDK, Google AI           |
| 상태/데이터 | Zustand, TanStack Query, Axios     |
| 인증        | JWT( jose ), bcrypt, 쿠키 세션     |
| 언어        | TypeScript                         |

---

## 프로젝트 구조

```
src/
├── app/                    # App Router 페이지·API
│   ├── api/                # API Routes (auth, recipes)
│   ├── login, signup       # 인증 페이지
│   └── recipes/            # 레시피 목록·상세·등록·수정
├── components/
│   ├── auth/               # AuthGuard, GuestGuard
│   ├── character/          # RaccoonLogo 등 마스코트
│   ├── recipe/             # 레시피 폼, 리스트, 카드
│   └── ui/                 # Button, Input, Modal, GlassCard 등
├── api/                    # API 클라이언트 (auth, recipe)
├── db/                     # Drizzle 스키마·쿼리
├── lib/                    # axios, jwt, session, api-response
├── constants/              # UI·카테고리 상수
└── types/                  # 공통 타입
```

---

## 시작하기

### 요구 사항

- Node.js 20+
- PostgreSQL
- (AI 분석 사용 시) Google AI API 키

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd recipe-note
pnpm install
```

### 2. 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 다음 변수를 설정합니다.

```env
# DB (필수)
DATABASE_URL="postgresql://user:password@host:port/database"

# AI 레시피 분석 (이미지/URL 분석 시 필요)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"

# JWT/세션 (필수 - 로그인·회원가입)
JWT_SECRET="your-secret-key"
```

### 3. DB 마이그레이션

```bash
pnpm run db:push
# 또는
pnpm run db:migrate
```

### 4. 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다. (개발 스크립트는 `192.168.0.3` 호스트로 설정되어 있을 수 있습니다.)

### 5. 빌드 및 프로덕션 실행

```bash
pnpm run build
pnpm run start
```

---

## 주요 스크립트

| 명령어                 | 설명                      |
| ---------------------- | ------------------------- |
| `pnpm run dev`         | 개발 서버 실행            |
| `pnpm run build`       | 프로덕션 빌드             |
| `pnpm run start`       | 프로덕션 서버 실행        |
| `pnpm run lint`        | ESLint 실행               |
| `pnpm run lint:fix`    | ESLint 자동 수정          |
| `pnpm run format`      | Prettier 포맷 적용        |
| `pnpm run db:generate` | Drizzle 마이그레이션 생성 |
| `pnpm run db:push`     | 스키마를 DB에 반영        |
| `pnpm run db:migrate`  | 마이그레이션 실행         |
| `pnpm run db:studio`   | Drizzle Studio 실행       |

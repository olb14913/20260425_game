# 블러핑 눈치게임 (Bluffing Nunchi Game)

AI와 심리전을 펼치는 한국식 눈치게임. Claude API로 실시간 대화 가능.

## 🎯 게임 소개

- 1~10 중 숫자를 골라 AI와 대결
- 5라운드, 라운드당 30초
- AI 성격 3종 (솔직이/거짓말쟁이/예측불가) - 직접 파악해야 함
- AI와 자유롭게 대화하며 심리전
- 5라운드 종료 후 AI 숫자 한꺼번에 공개
- localStorage 기반 역대 순위 저장

## 🛠️ 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: JavaScript (TypeScript 안 씀, 원하면 변환 가능)
- **스타일**: 인라인 스타일 (라이브러리 없음)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **배포**: Vercel
- **저장소**: localStorage (DB 없음)

## 📁 프로젝트 구조

```
bluffing-game/
├── README.md                          # 이 파일
├── SETUP_GUIDE.md                     # 단계별 셋업 가이드
├── package.json
├── next.config.js
├── .env.local.example                 # 환경변수 예시
├── .gitignore
└── src/
    ├── app/
    │   ├── layout.js                  # 루트 레이아웃
    │   ├── page.js                    # 메인 페이지
    │   ├── globals.css                # 전역 CSS
    │   └── api/
    │       └── chat/
    │           └── route.js           # 백엔드 API (Claude 호출)
    └── components/
        └── BluffingNunchiGame.jsx     # 메인 게임 컴포넌트
```

## 🚀 빠른 시작 (Cursor에서)

### 1. Anthropic API 키 발급
1. https://console.anthropic.com 접속 → 가입/로그인
2. 결제 수단 등록 (사용한 만큼 과금, 게임 1판당 약 $0.01-0.05)
3. **API Keys** 메뉴 → **Create Key**
4. 생성된 키 복사 (`sk-ant-...` 형식)

### 2. 로컬 개발 환경 셋업
```bash
# 의존성 설치
npm install

# 환경변수 파일 만들기
cp .env.local.example .env.local
# .env.local 파일 열어서 API 키 입력

# 개발 서버 실행
npm run dev
# → http://localhost:3000 접속
```

### 3. Vercel 배포
```bash
# Git 저장소 초기화 + GitHub에 push
git init
git add .
git commit -m "initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main

# Vercel 연결
# 1. vercel.com 접속
# 2. "Import Git Repository" 클릭
# 3. GitHub 레포 선택
# 4. Environment Variables에 ANTHROPIC_API_KEY 추가
# 5. Deploy 버튼 클릭
```

자세한 가이드는 `SETUP_GUIDE.md` 참고.

## 🔒 보안 메모

- **API 키는 절대 프론트엔드에 노출하면 안 됨**
- 이 프로젝트는 백엔드 API 라우트(`/api/chat`)에서만 키 사용
- `.env.local`은 `.gitignore`에 포함되어 있음 (커밋 안 됨)
- Vercel 배포 시 환경변수는 대시보드에서 별도 설정

## 💰 비용 예상

Claude Sonnet 4 기준 (2025년 기준):
- 입력: $3/M 토큰
- 출력: $15/M 토큰
- 게임 한 판 (5라운드 × 평균 5턴 대화): 약 $0.01-0.05
- 월 100명이 1번씩 플레이 = 약 $1-5

> 💡 비용 절감 옵션: Claude Haiku 모델로 변경하면 1/10 가격
> `route.js`에서 `model: 'claude-haiku-4-5-20251001'`로 변경

## 🎨 추가 개선 아이디어

- [ ] AI 성격을 게임 시작 전에 선택 가능하게
- [ ] 멀티플레이 모드 (둘 다 사용자)
- [ ] 통계 페이지 (승률, AI 성격별 승률 등)
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 음향 효과 추가
- [ ] 다크 모드

## 📝 라이선스

개인 프로젝트용. 상업적 사용 시 별도 검토 필요.

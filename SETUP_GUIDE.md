# 셋업 가이드 (단계별)

이 문서는 처음 보는 사람도 따라 할 수 있도록 자세하게 작성되었어요. Cursor에서 이 문서 보면서 따라 하면 돼요.

---

## ✅ 사전 준비물

다음이 설치되어 있어야 해요:
- **Node.js** v18 이상 → [nodejs.org](https://nodejs.org) 에서 LTS 버전 설치
- **Git** → [git-scm.com](https://git-scm.com) 에서 설치
- **GitHub 계정**
- **Vercel 계정** → GitHub로 가입 가능
- **신용카드** (Anthropic API 결제용)

확인 명령어:
```bash
node -v   # v18.x.x 이상이어야 함
npm -v    # 9.x.x 이상이면 OK
git --version
```

---

## 🔑 STEP 1: Anthropic API 키 발급

### 1-1. 콘솔 접속 및 가입
1. https://console.anthropic.com 접속
2. 구글 또는 이메일로 가입
3. 이메일 인증 완료

### 1-2. 결제 수단 등록
1. 왼쪽 메뉴 **Billing** 클릭
2. **Add credit card** → 신용카드 정보 입력
3. **Buy credits** 또는 자동결제 설정
   - 처음에는 $5 정도 충전하면 충분 (게임 100판 이상 가능)

### 1-3. API 키 생성
1. 왼쪽 메뉴 **API Keys** 클릭
2. **Create Key** 버튼 클릭
3. Key 이름 입력 (예: `bluffing-game`)
4. 생성된 키 복사 → **나중에 다시 못 봄!** 메모장 등에 잠시 보관
   - 형식: `sk-ant-api03-...`

> ⚠️ **주의**: 이 키는 절대 GitHub에 올리거나 공개하면 안 돼요. 누군가 훔치면 미나씨 카드로 마음대로 사용 가능해요.

---

## 💻 STEP 2: 로컬에서 실행하기

### 2-1. 프로젝트 폴더 위치 확인
이 프로젝트 폴더 (`bluffing-game/`)를 원하는 곳에 둬요.
```bash
# 예: 바탕화면에 프로젝트 폴더 두기
cd ~/Desktop/bluffing-game
```

### 2-2. 의존성 설치
```bash
npm install
```
1~2분 정도 걸려요. `node_modules/` 폴더가 생성돼요.

### 2-3. 환경변수 설정
```bash
# 예시 파일 복사
cp .env.local.example .env.local

# 에디터로 열기
# (Cursor에서는 그냥 .env.local 파일 열기)
```

`.env.local` 파일 내용:
```
ANTHROPIC_API_KEY=sk-ant-api03-여기에_본인_키_붙여넣기
```

### 2-4. 개발 서버 실행
```bash
npm run dev
```

성공하면 이런 메시지가 떠요:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
```

브라우저에서 http://localhost:3000 열기 → 게임 화면이 보이면 성공! 🎉

### 2-5. 테스트
1. 이름 입력 → 게임 시작
2. AI 메시지가 자연스럽게 스트리밍되는지 확인
3. 채팅 가능한지 확인
4. 한 판 다 끝까지 플레이

> 🔧 **문제 발생 시 트러블슈팅**:
> - "API 키 없음" 에러 → `.env.local` 파일 확인, 서버 재시작 (`Ctrl+C` 후 `npm run dev`)
> - "402 Payment Required" → Anthropic 콘솔에서 크레딧 충전
> - 메시지가 "..."로만 나옴 → 브라우저 개발자 도구(F12) → Network 탭에서 `/api/chat` 응답 확인

---

## 🚢 STEP 3: GitHub에 올리기

### 3-1. Git 초기화
```bash
git init
git add .
git commit -m "initial commit: bluffing nunchi game"
```

### 3-2. GitHub 레포 만들기
1. https://github.com 접속 → **New repository**
2. 이름: `bluffing-nunchi-game` (또는 원하는 이름)
3. **Public** 또는 **Private** 선택
4. **README, .gitignore 추가하지 마세요** (이미 있음)
5. **Create repository** 클릭

### 3-3. 로컬 → GitHub push
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bluffing-nunchi-game.git
git push -u origin main
```

> ⚠️ `.env.local` 파일이 push되지 않았는지 확인! GitHub에서 레포 보고 `.env.local` 파일 없으면 OK.

---

## 🌐 STEP 4: Vercel 배포

### 4-1. Vercel 가입 및 프로젝트 생성
1. https://vercel.com 접속 → GitHub 계정으로 가입/로그인
2. **Add New** → **Project** 클릭
3. GitHub 레포 목록에서 `bluffing-nunchi-game` 찾기 → **Import**

### 4-2. 환경변수 등록 ⚠️ 가장 중요!
**Configure Project** 화면에서:
1. **Environment Variables** 섹션 펼치기
2. **Name**: `ANTHROPIC_API_KEY`
3. **Value**: `sk-ant-api03-...` (본인 API 키)
4. **Add** 클릭

### 4-3. 배포
1. **Deploy** 버튼 클릭
2. 약 1~2분 대기 (빌드 진행)
3. 완료되면 URL 나옴: `https://bluffing-nunchi-game-xxx.vercel.app`

### 4-4. 동작 확인
- 발급받은 URL 접속
- 다른 기기(폰 등)에서도 테스트
- 친구에게 링크 공유해서 플레이해보라고 하기 🎮

---

## 🔄 코드 수정 후 재배포

GitHub에 push만 하면 Vercel이 자동으로 재배포해줘요:
```bash
git add .
git commit -m "수정 내용"
git push
```

---

## 🛡️ 보안 체크리스트

배포 전 꼭 확인하세요:
- [ ] `.env.local`이 `.gitignore`에 포함되어 있다
- [ ] GitHub 레포에 API 키가 노출되지 않았다
- [ ] Vercel에 환경변수로 등록했다
- [ ] API 사용량 모니터링 설정 (Anthropic 콘솔에서)

---

## 📊 사용량 모니터링

배포 후에는:
1. https://console.anthropic.com → **Usage** 메뉴
2. 일별/월별 사용량 확인
3. 너무 많이 쓰이면 → Anthropic 콘솔에서 **Rate Limits** 설정
4. 비상시 → API 키 비활성화 가능

---

## 🆘 도움 필요할 때

- **Cursor에 물어보기** — 코드 보여주면서 "이 부분 왜 안 돼?" 질문
- **Vercel 로그 확인** — 배포된 프로젝트 → **Logs** 탭
- **Anthropic 문서** — https://docs.anthropic.com

---

## 📝 다음 단계 아이디어

배포 성공하면 이런 것들 추가해보세요:
1. **커스텀 도메인** 연결 (예: `bluffing.미나도메인.com`)
2. **Google Analytics** 연동 (사용자 통계)
3. **Open Graph 이미지** 추가 (링크 공유 시 미리보기)
4. **서버사이드 순위표** (DB 사용)

화이팅! 💪

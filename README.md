[![banner](/docs/banner.png)](https://tmoji.org)

# TMOJI WEB (FE)

> 폰트 스타일을 유지하며 이미지를 번역하는 서비스

### [TMOJI 웹 사이트 바로가기](https://tmoji.org)

![간단한 시연 사진](./docs/example.gif)

#### [TMOJI SERVERAPI 명세서 바로가기](https://api.tmoji.org/docs)

#### [TMOJI UI/UX 화면 설계서 바로가기](https://www.figma.com/design/JvbYnuSH3OT1lQWxcJpusq/TMOJI?node-id=67-2&t=VsGnnqBIsh5wtLi5-1)

- 이미지 번역 서비스 TMOJI의 WEB 파트 레포지토리입니다.


# Requires

```bash
vscode
node.js 22.19.0
pnpm 10.15.1
```

# How to start

pnpm이 설치되어있지 않다면, npm을 이용해 설치해주세요.

```bash
npm i -g pnpm
```
본 프로젝트는 PNPM을 패키지매니저로 사용합니다.

필요한 패키지를 설치해주세요.

```bash
pnpm i
```

프로젝트 실행은 아래 명령어를 참고해주세요.

```bash
# DEV 환경 실행
pnpm dev

# 프로젝트 빌드
# 빌드 된 파일은 @/dist 폴더에 위치합니다.
pnpm build

# 배포환경 미리보기
pnpm serve
```

# Styling

본 프로젝트는 CSS Styling으로 [Tailwind CSS](https://tailwindcss.com/)를 사용하고 있습니다.

# Linting & Formatting

본 프로젝트는 [eslint](https://eslint.org/) 와 [prettier](https://prettier.io/)를 linting과 formatting으로 사용하고 있습니다. Eslint는 [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint)로 설정을 관리하고 있습니다. 관련된 명령어는 아래와 같습니다.

```bash
pnpm lint
pnpm format
pnpm check
```

# Routing

본 프로젝트는 [TanStack Router](https://tanstack.com/router)로 라우터를 관리하고 있습니다. File based router이며, `src/routes`에서 관리되며 해당 폴더에 새 파일과 폴더를 추가하여 Route를 추가할 수 있습니다.

# Data Fetching

본 프로젝트는 서버와 통신하여 데이터를 패칭하는 도구로 React-Query를 사용하고 있습니다.

`useQuery`는 `GET`과 같은 데이터 수신에, `POST`, `PATCH` 등과 같은 데이터 송신은 `useMutation`을 사용합니다.

React-Query 사용 방법은 다음 문서를 참고해주세요. [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

# 폴더 구조

```bash
📁.github ─ 📁workflows : github actions 스크립트 폴더
📁.husky : Commit시 Linting & Formatting 검사를 실행하는 Githook 관련 스크립트 폴더
📁.tanstack : Routing 관련 Tanstack router가 자동 관리하는 폴더
📁.vscode : vscode 설정 폴더
📁dist : 빌드된 파일이 위치하는 폴더
📁docs : 본 문서에 필요한 파일이 담긴 폴더
📁node_modules : 본 프로젝트에 필요한 모듈이 설치되는 폴더
📁public : Vite 프로젝트에서 정적 파일을 제공하는 폴더
📁src ┬ 📁api : 서버 api 훅 및 인터페이스를 관리
🔸    ├ 📁assets : 아이콘, 이미지 등의 에셋
🔸    ├ 📁components : 공통적으로 사용되는 컴포넌트 관리
🔸    ├ 📁constansts : 공통적으로 사용되는 상수 값 관리
🔸    ├ 📁integrations : tanstack-query 설정 파일
🔸    ├ 📁routes : router 관리 파일 (pages)
🔸    ├ 📁utils : 공통적으로 사용되는 훅 및 함수 관리
🔸    ├ 📃main.tsx : 최상위 메인 컴포넌트
🔸    ├ 📃reportWebVitals.ts
🔸    ├ 📃routeTree.gen.ts
🔸    └ 📃styles.css : 최상위 전역 css 파일
📃.cta.json
📃.env : 환경 변수 관리
📃.gitignore : commit되지 않아야하는 파일을 관리
📃.prettierignore : Formatting 되지 않아야하는 파일을 고나리
📃eslint.config.js : Linting 관련 eslint 설정 파일
📃index.html : 최상위 html 파일
📃package.json : 본 프로젝트의 패키지 정보
📃pnpm-lock.yaml : 의존성 패키지를 관리하는 파일
📃prettierrrc.cjs : Formatting 관련 prettier 설정 파일
📃README.md
```

# 환경변수
``` bash
# .env

VITE_API_URL=YOUR_BE_SERVER_URL # https://api.tmoji.org
```

# CI/CD
본 프로젝트는 Github Actions를 이용하여 자동 배포되고 있습니다. `.github/workflows/deploy.yml` 파일을 참고해주세요.

`main` -> `prod`로 PR을 통해 Merge된다면 Github Actions가 이를 감지해 새로 빌드한 후 AWS S3 Bucket으로 업로드, AWS Cloudfront의 캐시를 무효화하여 웹 페이지를 갱신하고 있습니다.

# TMOJI 파트별 링크
> 각 파트별 자세한 내용은 아래 Repository에 접속하여 확인할 수 있습니다.

<table>
  <thead>
    <tr>
      <th>분류</th>
      <th>URL</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">텍스트 변환 모델</td>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/TextCtrl-Translate'>TextCtrl-Translate</a></td>
      <td>한국어 환경에 맞게 파인튜닝된 텍스트 변환 모델</td>
    </tr>
    <tr>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/ko_trocr_tr'>ko-trocr-tr</a></td>
      <td>한국어 환경 TextCtrl에 필요한 한국어 OCR 모델</td>
    </tr>
    <tr>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/SRNet-Datagen_kr'>SRNet-Datagen(ko)</a></td>
      <td>한국어 환경의 TextCtrl 학습에 필요한 데이터셋 Generator</td>
    </tr>
    <tr>
      <td rowspan="2">웹 서비스</td>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/tmoji-web'>웹(FE)</a></td>
      <td>TMOJI 프론트엔드</td>
    </tr>
    <tr>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/tmoji-server'>서버(BE)</a></td>
      <td>TMOJI 백엔드</td>
    </tr>
  </tbody>
</table>
# People Journal PWA

## GitHub Pages 배포

1. GitHub에서 새 repository를 만듭니다. 이름 예시: `people-journal`
2. 이 폴더의 파일을 repository 최상위(root)에 모두 업로드합니다.
3. GitHub repository에서 **Settings → Pages** 로 이동합니다.
4. **Build and deployment → Source → Deploy from a branch** 를 선택합니다.
5. Branch는 **main**, 폴더는 **/(root)** 로 선택하고 Save 합니다.
6. 배포 후 표시되는 Pages 주소를 iPhone의 Safari에서 엽니다.
7. Safari 공유 버튼 → **홈 화면에 추가(Add to Home Screen)** 를 선택합니다.

## 데이터 저장

- 사람 프로필과 일지는 웹앱 코드와 별개로 해당 기기의 브라우저 저장공간(localStorage)에 저장됩니다.
- GitHub repository에는 사용자가 입력한 일지 데이터가 자동으로 올라가지 않습니다.
- 앱 안의 **백업 파일 받기** 기능으로 JSON 백업을 주기적으로 보관하는 것을 권장합니다.

# MVP LAB 무료 로컬 브리지 (1단계)
Windows PowerShell에서:
```powershell
git clone https://github.com/hornmush/maple.git
cd maple/bridge
npm install
npm start
```
크롬에서 `http://127.0.0.1:8787/health` 열기.
`bridge: running`, `mcpConnected: true` 및 도구 목록이 보이면 MCP 연결 성공.
`mcpConnected: false`면 콘솔 오류를 확인.
크롬에서 넥슨 경매장 로그인 및 Maple Auction MCP 확장 활성화 필요.
현재는 연결 진단 단계로, 실제 시세 검색 API는 MCP 도구 스키마 검증 후 구현 예정.
서버는 127.0.0.1에만 바인딩되고 허용된 웹사이트 Origin에만 CORS를 제공합니다.

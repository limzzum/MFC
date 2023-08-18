## 1. gitlab 소스 클론 이후 빌드 및 배포할 수 있는 작업문서


1. 사용한 JVM, 웹서버 버전, 설정
- AWS: EC2
- OS: Ubuntu 20.04 LTS
- JVM: 17버전
- 웹서버: Spring Boot 2.7 내장 톰켓 서버
- 서비스 포트번호: 443
- Mysql: 8.0.33
- node.js: 18.16.1

#### IDE
- IntelliJ 2023.1.2
- VSCode 1.81.1

2. 빌드 시 사용되는 환경 변수 등의 주요 내용 상세 기재
- application.yml 파일

3. 배포 시 특이사항 기재
- 서버는 letsencrypt를 사용하여 ssl 설정
- Backend 포트는 8081
- Frontend 포트는 3000
- letsencrypt certonly --standalone -d [도메인명] 명령어로 얻은 keyfile을 ~/apps/narang/certificates/live/[도메인명] 에 복사
- 로컬 프로젝트의 back 폴더에서 터미널 실행하여 gradle clean build 명령어 실행
- aws ubuntu 접속
- ~/apps/narang/libs 에 jar 파일 저장
- ~/apps/narang에 docker-compose.yml 파일과 .env 파일 작성
- ~/apps/narang/db 에 init.sql 파일 작성
- docker-compose up -d 명령어로 컨테이너 다중 실행

4. 데이터베이스 접속 정보 등 프로젝트에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록
- init.sql
    - db 초기화 파일

- .env
    - openvidu 환경변수 파일

- goldentime.conf
    - nginx 프록시 설정 파일

- application.yml
    - spring boot 프로젝트의 DB 등의 설정값을 관리하는 파일
======================================
- Dockerfile
    - jar 파일을 컨테이너로 실행할 때 필요한 설정 파일



## 2. 프로젝트에서 사용하는 외부 서비스 정보 문서
- 비속어 인식을 위한 Perspective API 사용(https://perspectiveapi.com/)
- 모션 인식을 위한 MediaPipe(https://developers.google.com/mediapipe)




## 3. DB 덤프파일
- mfcdump.sql

## 4. 시연 시나리오
- MFC_시연_시나리오.docx
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
3. 배포 시 특이사항 기재

- 서버는 letsencrypt를 사용하여 ssl 설정
- Backend 포트는 8081
- Frontend 포트는 3000

-----------------------------------------------------
docker run -it --rm --name certbot -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib/letsencrypt" certbot/certbot certonly --standalone -d goldenteam.site -d www.goldenteam.site  명령어로 얻은 keyfile을 /etc/letsencrypt/live/goldenteam.site 에 복사

빌드(back)
로컬 프로젝트의 backend 폴더에서 터미널 실행하여 ./gradlew clean build 명령어 실행 

빌드(front)
로컬 프로젝트의 frontend 폴더에서 터미널 실행하여 npm i && npm run build 명령어 실행 


도커 이미지 빌드 (back)
docker build -t [이미지이름] ./  ==> backend에 있는 Dockerfile로 이미지 빌드

도커 이미지 빌드 (front)
docker build -t [이미지이름] ./  ==> frontend에 있는 Dockerfile로 이미지 빌드

이미지 도커허브로 푸시 후 서버에서 pull 하여 사용.

도커 이미지 실행 (back)
docker run -d -p 8081:8081 —name backend -v "/var/www/profiles:/var/www/profiles" -v "/var/www/room-files:/var/www/room-files" [이미지 이름]

도커 이미지 실행 (front)
docker run -d -p 3000:3000 —name frontend [이미지 이름]

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
-  회원가입 시 이메일 인증을 위한 네이버 SMTP 사용, 네이버 메일 발송
- 서비스 포트 465 아웃바운드 추가




## 3. DB 덤프파일
- mfcdump.sql

## 4. 시연 시나리오
- MFC_시연_시나리오.docx
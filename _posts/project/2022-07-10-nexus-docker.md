---
title: Docker 기반 Nexus Repository 구성
date: 2022-07-10
modified: 2022-07-10
tags: [devops]
description: Docker 기반 Nexus Repository 구성과 Jenkins CI 연동 메모
---

## Artifact Repository

Artifact 저장소는 지속적 통합으로 생성된 빌드 artifact를 저장한다. 이를 활용하면 테스트, 스테이징, 프로덕션 환경으로 자동화된 배포를 구성할 수 있다.

빌드 artifact는 배포 패키지, WAR 파일, 로그, 보고서처럼 빌드 프로세스에서 생성된 파일을 의미한다. CI 서버의 저장소 또는 CI 서버에서 이용 가능한 외부 위치에 artifact를 저장할 수 있다.

## Nexus란

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/nexus-docker/main/resource/nexus.PNG" alt="Nexus Repository">
</p>

사내에서 개발 프로젝트를 진행할 때 외부 repository에 접속하기 어려운 경우가 있다. 사내망에서 프로젝트를 진행할 때 필요한 라이브러리를 다운로드할 수 있도록 별도의 repository를 구축해 사용할 수 있다.

Nexus는 이러한 용도의 artifact repository로 사용할 수 있다.

- 보안 : 외부에 유출되지 않도록 내부 repository를 구성할 수 있다.
- 라이브러리 버전 관리 : 메타데이터 기반으로 라이브러리 정보를 관리할 수 있다.
- 공유 및 협업 강화 : 컴포넌트를 공유할 수 있다.
- 다양한 artifact와 binary를 저장할 수 있다.

## Nexus 장점

- 중앙 저장소의 cache 역할을 수행할 수 있다.
- 자체 artifact 배포를 위한 private repository를 만들 수 있다.
- 외부망 연결이 제한된 환경에서도 Nexus repository만 외부와 연결하면 빌드에 필요한 artifact를 가져올 수 있다.

## Jenkins CI와 연동

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/nexus-docker/main/resource/nexus-jenkins.PNG" alt="Nexus and Jenkins">
</p>

Jenkins CI에서 빌드를 수행할 때 Nexus를 artifact repository로 사용할 수 있다. Gradle이나 Maven repository 설정을 Nexus로 지정하면 외부 repository를 직접 조회하지 않고 Nexus를 통해 dependency를 내려받을 수 있다.

## Blob Store

모든 Nexus repository는 blob store에 지정되어야 한다. Blob store는 hosted 또는 proxy repository를 통해 배포된 artifact를 저장하는 저장소다.

## Repository

- Snapshots : 빌드 등으로 수시 릴리스되는 artifact repository다.
- Releases : 정식 릴리스를 통해 배포되는 artifact repository다.
- 3rd Party : 특정 벤더에서 제공하는 artifact repository다.
- Proxy Repository : 외부에 원본 repository가 있는 경우 local cache처럼 사용한다.
- Virtual Repository : 여러 repository를 그룹화해 하나의 repository처럼 참조할 수 있다.

## Repository Type

- Proxy : 외부망에 있는 repository와 연동해 버전을 관리한다.
- Hosted : 내부망 내 개발용으로 연동하는 repository다.
- Virtual : 서로 다른 타입의 repository를 연결하는 adapter 역할을 한다.
- Group : 위 타입들을 그룹화한다.

## Nexus Repository 구성 방식

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/nexus-docker/main/resource/nexus-configuration.PNG" alt="Nexus Repository configuration">
</p>

단일 Nexus 인스턴스를 여러 repository로 구성할 수 있고, 개발, 테스트, 운영 환경처럼 목적에 따라 분리하거나 그룹화할 수도 있다. 온프레미스나 클라우드에서 실행할 수 있으며, 컨테이너 오케스트레이션, CI/CD, 데이터 서비스를 위한 통합 플랫폼으로 구성할 수도 있다.

## 설치

Nexus는 다음 명령어로 실행할 수 있다.

```sh
docker run --name nexus -d -p 8081:8081 \
    -v ~/nexus-data:/nexus-data \
    -u root sonatype/nexus3
```

초기 관리자 비밀번호는 다음 명령어로 확인한다.

```sh
docker exec -it nexus bash -c "cat /nexus-data/admin.password"
```

로그인 이후 다음 설정을 진행한다.

- 비밀번호를 설정한다.
- anonymous access configuration을 설정한다.
- `security -> Users`로 이동한다.
- admin 권한을 가진 local user를 생성한다.

## AWS S3 Blob Store와 Repository 생성

- Blob Stores에서 AWS S3 bucket을 생성하고 설정한다.
- 기본 blob store는 현재 AWS EC2의 파일 시스템을 사용한다.
- `Create blob store -> S3`를 선택한다.
- proxy type repository를 생성해 Maven Central cache로 사용한다.

## Nexus Artifact를 활용한 Docker 빌드

- Gradle에서 repository를 Nexus로 설정한다.
- Gradle 빌드 시 Nexus artifact를 사용하고, jar가 정상 생성되는지 확인한다.
- Jib을 이용해 Docker image를 빌드하고 AWS ECR에 push한다.
- local에 Docker image를 배포하고 컨테이너를 실행한다.

```sh
gradle clean build --info

aws ecr get-login-password --region ap-northeast-2 \
    | docker login --username AWS --password-stdin <AWS ECR repository URL>

gradle jib --console=plain

docker run -d -p 8080:8080 -t <AWS ECR repository URL>:tag
```

## 참고

- [le2sky/nexus-docker](https://github.com/le2sky/nexus-docker)

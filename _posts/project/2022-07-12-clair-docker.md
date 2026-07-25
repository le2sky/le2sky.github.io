---
title: 컨테이너 보안을 위한 Clair 활용
date: 2022-07-12
modified: 2022-07-12
tags: [devops]
description: Clair 기반 컨테이너 이미지 취약점 스캔 구성 메모
---

## Docker 컨테이너 보안

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/clair-docker/main/resource/clair.PNG" alt="Container security">
</p>

보안 검사는 개발 단계에서부터 이루어져야 한다.

- 정적 코드 분석 : Jacoco와 SonarQube가 정적 코드 분석에 해당한다. 코드를 작성할 때 보안 요소를 확인한다.
- 종속성 확인 : 라이브러리와 종속성에 보안 영향이 있는지 확인한다. 프로젝트별 종속성을 식별하고, 알려진 보안 취약점이 있는지 확인하는 것이 중요하다.
- 컨테이너 이미지 스캔 : 컨테이너 이미지 빌드 시점에 보안 취약점을 스캔한다. Clair를 이 영역에서 활용할 수 있다.

## Clair

Clair는 컨테이너 취약점 정적 분석을 위한 오픈 소스 프로젝트다. 클라이언트는 Clair API를 사용해 컨테이너 이미지를 색인화한 다음 알려진 취약점과 대조할 수 있다. Clair의 목표는 컨테이너 기반 인프라의 보안을 더 투명하게 볼 수 있도록 하는 것이다.

색인화를 수행하면 이미지의 기능 목록이 만들어지고 데이터베이스에 저장된다. 클라이언트는 Clair API를 사용해 데이터베이스에 저장된 특정 이미지의 취약점을 쿼리한다. 각 요청에서는 취약점과 기능의 상관관계를 파악하므로 이미지를 매번 다시 스캔할 필요가 없다.

취약점 metadata에 대한 업데이트가 발생하면 시스템 변경 사항이 발생했음을 알리는 알람을 보낼 수도 있다.

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/clair-docker/main/resource/clair_arch.PNG" alt="Clair architecture">
</p>

ClairCore는 콘텐츠 검사와 취약점 보고를 위한 엔진이다. ClairCore library에서 제공하는 기능에 대한 Clair service wrapper를 제공할 수 있고, 취약성 소스와 레이어 인덱스 관련 개발 대부분은 ClairCore를 통해 적용된다. Updater는 REST API 서버를 통해 취약점 데이터베이스의 업데이트를 담당한다.

ClairCore로 할 수 있는 일은 다음과 같다.

- Updater와 데이터 소스 목록을 처리하는 부분을 구현할 수 있다.
- 취약점 데이터베이스 저장을 구현할 수 있다.
- 업데이트된 Docker image layer 분석 결과를 출력할 수 있다.

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/clair-docker/main/resource/clair_runwau.PNG" alt="Clair runtime flow">
</p>

Manifest는 컨테이너 이미지에 대한 Clair 명세 내용이다. Clair는 OCI manifest와 layer가 중복 작업을 줄이기 위해 콘텐츠 주소를 지정한다는 특징을 활용한다. Manifest가 indexing되면 나중에 검색할 수 있도록 index report가 유지된다.

Clair의 흐름은 indexing, matching, notification으로 나눌 수 있다.

- Indexing : manifest를 Clair에 전달하는 것으로 시작된다. Clair는 컨테이너 이미지의 layer 정보를 가져오고, 해당 콘텐츠를 scan한 다음 index report라는 중간 데이터를 반환한다.
- Matching : index report를 가져오고, report가 나타내는 manifest에 영향을 미치는 관련 취약점을 연결한다. Clair는 지속적으로 새로운 보안 데이터를 수집하고 있으며, matching server에 대한 요청을 통해 항상 index report의 최신 취약점을 분석하고 제공한다.
- Notification : Clair는 notification을 통해 알람 서비스를 구현한다. 새로운 취약점이 발견되면 알람 서비스는 이러한 취약점이 indexing된 manifest에 영향을 미치는지 확인한다. 관리자는 알람을 통해 구성에 따라 조치를 취할 수 있다.

## 컨테이너 이미지 분석 방식

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/clair-docker/main/resource/clair_container_image_analy.PNG" alt="Container image analysis">
</p>

특정 image repository에 컨테이너 이미지가 있어야 Clair가 접근해서 분석을 수행할 수 있다.

- 특정 repository의 이미지를 선택해 local 또는 Clair server를 통해 해당 이미지를 가져온다.
- Registry에 있는 컨테이너 이미지를 사용하고, 해당 layer의 HTTP URL을 통해 layer tar를 가져와 분석한다.
- 앞서 분석한 image layer 외에 다른 layer를 분석하기 위해 다른 API endpoint를 통해 tar 파일을 얻는다.
- 이러한 API 호출 방식에 따라 Clair가 컨테이너 이미지를 image layer별로 분석할 수 있다.
- Clair에게 하나로 통합된 scan 가능한 layer로 구성된 Docker image를 통합 분석하도록 요청할 수 있다.
- 몇 가지 매개변수를 사전에 작성하고 API를 호출해 Clair가 분석한 결과를 취합한 JSON 형식으로 반환받을 수 있다.

Clair scanner를 사용하면 비교적 간단하게 scan을 수행할 수 있다.

## Clair와 Jenkins 연동

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/clair-docker/main/resource/clair_jenkins.PNG" alt="Clair and Jenkins">
</p>

Jenkins 파이프라인에서 Docker image를 빌드한 뒤 Clair scan을 수행하면, 배포 이전에 container image 취약점을 확인할 수 있다.

## 설치

Clair DB와 Clair server 컨테이너를 실행한다.

```sh
docker run -p 5432:5432 -d --name db arminc/clair-db:latest
docker run -p 6060:6060 --link db:postgres -d --name clair arminc/clair-local-scan:latest
```

Clair 보안 취약점 scan 기능을 사용하기 위해 `clair-scanner` CLI binary를 설치한다.

```sh
wget https://github.com/arminc/clair-scanner/releases/download/v12/clair-scanner_linux_amd64

chmod +x clair-scanner_linux_amd64
sudo mv clair-scanner_linux_amd64 /usr/local/bin/clair-scanner
```

## Clair 보안 설정과 Docker 빌드 스캔

Clair 실행 서버 private IP를 확인한다.

```sh
export IP=$(ip r | tail -n1 | awk '{ print $9 }')
echo ${IP}
```

Gradle, AWS CLI Docker image scan 및 결과 확인 명령어는 다음과 같다.

```sh
clair-scanner --ip ${IP} --clair=http://localhost:6060 \
    --log="clair.log" --report="gradle_report.txt" gradle:jdk11

clair-scanner --ip ${IP} --clair=http://localhost:6060 \
    --log="clair.log" --report="aws-cli_report.txt" bitnami/aws-cli:latest
```

Spring Boot web application Docker image build 보안 scan 명령어는 다음과 같다.

```sh
clair-scanner --ip ${IP} --clair=http://localhost:6060 \
    --log="clair.log" --report="spring-boot-web_report.txt" <example-docker-image-name>
```

보안 scan 테스트용 image는 다음 명령어로 받을 수 있다.

```sh
docker pull gradle:jdk11
docker pull bitnami/aws-cli:latest
```

## 참고

- [le2sky/clair-docker](https://github.com/le2sky/clair-docker)
- [Clair official documentation](https://quay.github.io/clair/concepts/indexing.html)

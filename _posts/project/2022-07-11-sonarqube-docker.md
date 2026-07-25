---
title: 코드 품질을 위한 SonarQube 구성
date: 2022-07-11
modified: 2022-07-11
tags: [devops]
description: SonarQube와 Jacoco 기반 코드 품질 분석 구성 메모
---

## 정적 분석과 동적 분석

정적 분석은 소스 코드 또는 컴파일된 binary를 대상으로 한다. 소스 코드의 모든 부분을 분석할 수 있고, 개발 단계에서 코드상의 문제나 실수를 찾는 데 활용한다.

동적 분석은 프로그램 실행 환경을 대상으로 한다. 실행 가능한 경로를 기준으로 테스트하고, 테스트나 모니터링에 활용한다.

## SonarQube

SonarQube는 정적 분석의 대표적인 도구다. 개발된 코드의 지속적인 정적 분석을 통해 품질 목표를 달성하도록 돕는다. 코드 품질 현황을 가시화하고, 리스크를 분석하고, 코드에서 발생하는 문제를 해결하는 데 사용할 수 있다.

SonarQube는 다음 기능을 제공한다.

- 프로젝트 코드 품질 측정
- 빌드 및 통합 후 품질 변화 측정
- Java, Go 등 여러 언어별 rule 지원
- Jacoco 같은 분석 플러그인 지원
- Quality Profiles 관리
- Quality Gates 설정
- 빌드 시스템과 CI 도구를 통한 DevOps 방식의 품질 관리

Quality Profile은 rule의 집합이다. 분석 ruleset을 정의하고 적용하며, ruleset 기반 profile을 구성할 수 있다.

Quality Gate는 애플리케이션을 릴리스하기 전에 품질 요구사항을 지키고 있는지 확인하는 기준 목록이다. 이를 통해 애플리케이션 출시 여부를 결정할 수 있다.

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/sonarqube-docker/main/resource/sonarqube.PNG" alt="SonarQube architecture">
</p>

SonarQube 구성 요소는 다음과 같이 볼 수 있다.

- 개발자가 품질 snapshot을 검색하고, SonarQube instance를 구성하고, UI에서 검색하고, 코드 분석 보고서를 처리할 수 있다.
- SonarQube database는 보안, 플러그인 설정 등 SonarQube instance 구성 데이터와 프로젝트 품질 snapshot을 저장한다.
- 여러 언어, SCM 연동, 인증 플러그인을 포함해 서버에 설치할 수 있다.
- 프로젝트 분석을 위해 Gradle이나 Jenkins 같은 빌드, CI 도구에서 scanner를 실행한다.

## SonarQube와 Jenkins CI 연동

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/sonarqube-docker/main/resource/sonar-jenkins.PNG" alt="SonarQube and Jenkins">
</p>

Jenkins CI에서 빌드와 테스트를 수행한 뒤 SonarQube scan을 실행하면, 빌드 파이프라인 안에서 코드 품질을 확인할 수 있다.

## 설치

SonarQube는 다음 명령어로 실행할 수 있다.

```sh
docker run --name sonarqube -d -p 9000:9000 sonarqube:latest
```

## 코드 품질 설정과 Docker 빌드 스캔

- Gradle에서 SonarQube와 Jacoco 플러그인을 설정한다.
- Gradle 빌드와 Docker 빌드를 수행한다.
- SonarQube 정적 분석 scan을 수행한다.
- SonarQube에서 정적 코드 품질 분석 결과를 확인한다.

## Jacoco

Jacoco는 Java code coverage를 측정하는 도구다.

- Java source file의 코드 커버리지를 제공한다.
- 테스트 케이스에 의해 수행된 테스트 수를 측정한다.
- Instruction coverage를 통해 코드 실행량을 측정한다.
- Branch coverage를 통해 `if`나 `switch` 문의 분기 실행 여부를 확인한다.
- Cyclomatic complexity를 통해 function 테스트 시 필요한 최소 경로 정보를 확인한다.

## 명령어

```sh
# 빌드. 빌드 과정 중 테스트가 진행된다.
./gradlew clean build --info

# Jacoco 코드 커버리지 측정과 리포트 작성
./gradlew jacocoTestCoverageVerification --info
./gradlew jacocoTestReport --info

# SonarQube 코드 품질 scan 결과 연동
./gradlew sonarqube --info

# Docker 이미지 빌드 및 push
./gradlew jib --console=plain
```

## 참고

- [le2sky/sonarqube-docker](https://github.com/le2sky/sonarqube-docker)

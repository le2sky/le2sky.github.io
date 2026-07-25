---
title: Docker 빌드를 위한 Jenkins CI 구성
date: 2022-07-07
modified: 2022-07-07
tags: [devops]
description: Jenkins와 Jib 기반 Docker 빌드 파이프라인 구성 메모
---

## Docker 이미지 빌드 메모

컨테이너를 실행하면 하나의 파일 시스템처럼 보인다. 레이어로 나누어진 이미지는 UFS(Union File System) 방식을 사용해 여러 파일 시스템을 하나의 파일 시스템처럼 구성할 수 있기 때문이다.

## 빌드란

소프트웨어 빌드는 소스 코드 파일을 컴퓨터나 휴대폰에서 실행할 수 있는 독립 소프트웨어 아티팩트로 변환하는 과정 또는 그 결과물을 의미한다. 소프트웨어 빌드에서 중요한 단계 중 하나는 소스 코드가 실행 코드로 변환되는 컴파일 과정이다. 컴퓨터 프로그램의 빌드 과정은 보통 다른 프로그램을 제어하는 빌드 도구에 의해 관리된다.

빌드 방식은 크게 두 가지로 볼 수 있다.

- 전체 빌드 : 매 빌드마다 전체 코드를 포함해 빌드한다.
- 증분 빌드 : 변경된 코드 대상만 분리해 빌드한다.

## Gradle

Gradle은 Groovy를 이용한 빌드 자동화 시스템이다. Android Studio의 공식 빌드 시스템이기도 하며, Java, C/C++, Python 등 여러 언어를 지원한다.

Gradle 빌드는 크게 세 단계로 진행된다.

- 초기화 단계 : 빌드할 프로젝트를 설정하고 생성한다.
- 구성 단계 : 프로젝트 객체를 구성하고, 빌드에 포함할 빌드 스크립트와 태스크를 작성한다.
- 실행 단계 : 모든 태스크를 통합하고 빌드를 실행한다.

Gradle 프로젝트 구조는 대략 다음과 같다.

```text
app
├── build.gradle
├── src
│   ├── main
│   │   ├── java
│   │   └── resources
│   └── test
│       ├── java
│       └── resources
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

`build.gradle`은 프로젝트의 소스 코드에 대한 라이브러리 의존성, 플러그인, 라이브러리 저장소를 설정하는 빌드 스크립트 파일이다.

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '2.6.2'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'com.google.cloud.tools.jib' version '3.1.4'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

repositories {
    mavenCentral()
}

version = '0.0.1-SNAPSHOT'
description = 'test-docker-spring-boot'
group = 'com.test'

java.sourceCompatibility = JavaVersion.VERSION_11

jar {
    enabled = false
}

tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
}

test {
    useJUnitPlatform()
}

jib {
    from {
        image = 'adoptopenjdk/openjdk11:alpine-jre'
    }
    container {
        mainClass = 'com.test.StartApplication'
        jvmFlags = ['-Xms512m', '-Xmx512m', '-Xdebug', '-XshowSettings:vm', '-XX:+UnlockExperimentalVMOptions', '-XX:+UseContainerSupport']
        ports = ['8080']

        environment = [SPRING_OUTPUT_ANSI_ENABLED: "ALWAYS"]
        labels = [version: project.version, name: project.name, group: project.group]

        creationTime = 'USE_CURRENT_TIMESTAMP'
        format = 'Docker'
    }
    extraDirectories {
        paths {
            path {
                from = file('build/libs')
            }
        }
    }
}
```

`settings.gradle`은 프로젝트 구성 정보 파일이다.

```gradle
rootProject.name = 'app'
```

## Jib

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/jenkins-docker/main/resource/docker_build_flow.png" alt="Docker build flow">
</p>

Jib은 Docker daemon 없이, 그리고 Docker 권장 사항에 대한 깊은 숙달 없이 Java 애플리케이션에 최적화된 Docker 및 OCI 이미지를 빌드할 수 있도록 돕는다.

- Maven과 Gradle용 플러그인, Java 라이브러리로 사용할 수 있다.
- 애플리케이션을 여러 레이어로 분리해 클래스와 의존성을 분리하고, 변경된 레이어만 배포할 수 있다.
- Docker 이미지 빌드와 배포를 빠르게 수행할 수 있다.
- Docker daemon이나 Docker CLI가 없어도 Gradle 내부에서 Docker 이미지를 빌드하고 원하는 이미지 저장소로 push할 수 있다.
- Dockerfile이 필요하지 않다.

`build.gradle`에서 사용하는 Jib 주요 설정은 다음과 같다.

```text
from : base image 설정
to : 생성된 컨테이너 이미지가 저장될 repository와 tag 설정
container : 컨테이너 이미지가 실행될 때 필요한 애플리케이션 설정 지정
```

## Gradle을 활용한 빌드 준비

Gradle은 다음 명령어로 설치할 수 있다.

```sh
apt install gradle
```

Gradle 프로젝트 생성 및 빌드는 다음과 같이 진행한다.

```sh
gradle init --dsl=groovy --type=java-application \
    --test-framework=junit \
    --package=com.test --project-name=test-docker-spring-boot

gradle build --info
```

Jib을 이용한 Docker 빌드 및 push 명령어는 다음과 같다.

```sh
./gradlew jib
```

Docker 이미지를 pull하고 실행할 때는 다음 명령어를 사용한다.

```sh
docker pull <repo:tag>
docker run -d -p 8080:8080 <docker-image-id>
```

## Jenkins

Jenkins는 지속적 통합 서비스를 제공하는 도구다. 여러 개발자가 하나의 프로그램을 개발할 때 버전 충돌을 방지하기 위해 각자 작업한 내용을 Git 같은 저장소에 자주 업로드하고, 이를 기반으로 지속적 통합을 수행할 수 있도록 돕는다.

Jenkins는 다음 특징을 가진다.

- 빌드 자동화
- 자동화 테스트
- 코드 품질 검사와 정적 분석
- 빌드 파이프라인 구성

Jenkins에서는 플러그인을 활용할 수 있다.

- Credential plugin : AWS token, Git access token 등 정보를 저장할 때 사용한다.
- Pipeline plugin : 파이프라인을 관리한다.
- Docker plugin : Docker 관련 작업을 관리한다.

## Jenkins 컨테이너 실행

보안 그룹은 SSH, HTTP, 8080 포트를 개방한다고 가정한다.

```sh
docker run --name jenkins -d -p 8080:8080 \
    -v ~/jenkins:/var/jenkins_home \
    -u root jenkins/jenkins:latest
```

Jenkins 접속 후 초기 관리자 비밀번호는 다음 명령어로 확인한다.

```sh
docker exec -it jenkins bash -c "cat /var/jenkins_home/secrets/initialAdminPassword"
```

접속 이후에는 관리 계정을 생성하고, 필요한 경우 timezone 설정을 진행한다.

## Jenkins 플러그인 설치

Jenkins 관리의 Plugin Manager에서 다음 플러그인을 설치한다.

```text
Job DSL
Simple Build DSLfor Pipeline
Docker Pipeline
Pipeline: Declarative Agent API
Pipeline utility Steps
Build Pipeline
SSH pipeline steps
Pipeline: AWS steps
Pipeline: Github
git parameter
github integration
github authentication
docker
docker commons
docker api
docker-build-step
cloudbees docker build and publish
cloudbees docker custom build environment
amazon web services SDK :: ALL
cloudbees AWS credentials
amazon ecr
aws global configuration
ssh
ssh agent
```

## 인증 설정

- local에서 SSH key를 만든다.
- GitHub에 SSH key를 등록한다.
- Jenkins에서 `security -> manage credentials -> global credentials -> ssh username with private key`를 선택한다.
- AWS credential을 추가한다.
- 배포 서버 pem을 추가한다.

SSH key는 다음 명령어로 생성할 수 있다.

```sh
ssh-keygen -b 2048 -t rsa -f ~/ssh-key/id_rsa
```

## 파이프라인 잡 생성

- 새로운 item에서 pipeline을 선택한다.
- GitHub project를 선택한다.
- Pipeline script from SCM을 선택하고 SSH key를 설정한다.
- branch를 설정한다.
- script path를 지정한다.

```text
jenkins-docker/jenkins-docker-app/Jenkinsfile
```

## Jenkins CI/CD

<p align="center">
  <img src="https://raw.githubusercontent.com/le2sky/jenkins-docker/main/resource/jenkins-cicd.PNG" alt="Jenkins CI/CD">
</p>

설정 이후 `Build Now`를 실행하고, console output에서 로그를 확인한다.

## 참고

- [le2sky/jenkins-docker](https://github.com/le2sky/jenkins-docker)

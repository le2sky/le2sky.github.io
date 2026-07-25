---
title: Docker Compose 기반 Grafana와 MySQL 구성
date: 2022-07-05
modified: 2022-07-05
tags: [devops]
description: Docker Compose 기반 Grafana와 MySQL 구성 메모
---

## Grafana란

Grafana는 Grafana Labs에서 관리하는 오픈 소스 시각화 및 분석 도구다.

Grafana는 Prometheus, InfluxDB, Elasticsearch, 관계형 데이터베이스 엔진과 같은 다양한 데이터 소스에 연결된다. 대시보드는 이러한 데이터 소스를 사용해 필요한 필드를 선택하고, 차트, 히트맵, 히스토그램 같은 여러 시각화 컴포넌트를 조합해 구성할 수 있다.

보통 운영 환경에서는 Grafana를 별도 데이터 소스와 함께 연동해서 사용한다. Grafana는 여러 데이터 소스에 대한 대시보드 템플릿을 제공하기 때문에 Prometheus 등의 쿼리 방법을 깊게 모르는 상황에서도 기본적인 대시보드를 구성할 수 있다.

## Grafana를 사용하는 경우

- 애플리케이션 성능과 오류율을 언제든지 확인하기 위한 인프라 모니터링 도구로 사용할 수 있다.
- 시각화 대시보드를 사용하면 스택이 정상적으로 동작하는지 빠르게 평가할 수 있다.
- 데이터 포인트를 수동으로 필터링하지 않아도 실시간 통찰력을 얻을 수 있다.
- 집계해야 할 데이터 소스가 여러 개인 경우에 유용하다.
- 하드웨어 리소스 사용률, 주요 로그, 데이터베이스에서 집계한 사용자 등록 수 등을 하나의 대시보드에 표시할 수 있다.
- 조직 내부에서 발생하는 일에 대한 요약 화면이 필요할 때 하나의 목적지를 제공할 수 있다.

데이터 포인트는 특정 측정치 집계 기간 동안의 측정치 값을 의미한다.

## 고려 사항

- Grafana는 엔지니어링과 운영을 데이터 우선 방식으로 진행하도록 돕는다.
- 여러 소스에서 많은 데이터를 함께 볼 때 가장 큰 이점을 얻을 수 있다.
- 사용 중인 뷰는 조직과 목표에 맞게 지정해야 한다.
- 잘못된 데이터를 표시하는 것은 데이터가 없는 것만큼 위험하다.
- 대시보드에 데이터를 무작정 많이 채우지 말아야 한다. Grafana의 목적은 데이터를 쉽게 이해하는 것이다.
- 시각화 대상 인프라 구성 요소에 미치는 영향도 고려해야 한다.
- 데이터베이스와 모니터링 대상 서비스에서 데이터를 가져올 때 오버헤드가 발생할 수 있다.
- 낮은 빈도의 새로고침으로 충분하다면 새로고침 주기를 낮게 유지하는 것이 인프라 부하를 줄이는 데 좋다.

## Grafana 구성

첫 번째 단계에서는 Grafana 단일 컨테이너 구성을 목표로 한다.

- Grafana 컨테이너의 3000번 포트를 호스트의 3000번 포트와 바인딩한다.
- Grafana 설정 파일인 `grafana.ini`는 호스트에서 주입할 수 있도록 구성하고 읽기 전용으로 설정한다.
- Grafana의 로컬 데이터 저장 경로를 확인해 Docker volume을 마운트한다.
- Grafana 플러그인 추가 설치를 위한 환경 변수를 설정한다.
- 로그 드라이버 옵션을 통해 로그 로테이션을 설정한다.

## Grafana와 MySQL 구성

두 번째 단계에서는 Grafana의 저장소를 기본 SQLite에서 MySQL로 변경한다.

- 1단계 Grafana 요구사항을 포함한다.
- `grafana.ini`를 통해 database 설정을 SQLite에서 MySQL로 변경한다.
- MySQL 컨테이너를 `docker-compose`의 `db` 서비스로 추가한다.
- Grafana 서비스가 `db` 서비스를 database로 연결하도록 구성한다.
- MySQL의 로컬 데이터 저장 경로를 확인해 Docker volume을 마운트한다.

## 실행

```sh
docker-compose up -d
```

## 종료

```sh
docker-compose down -v
```

## 참고

- [le2sky/grafana-mysql](https://github.com/le2sky/grafana-mysql)
- [Grafana Docker guide](https://grafana.com/docs/grafana/latest/installation/docker)
- [MySQL Docker guide](https://hub.docker.com/_/mysql)

---
title: 무중단 배포 패턴 Rolling, Blue/Green, Canary
date: 2022-05-30
modified: 2022-05-30
tags: [devops]
description: 무중단 배포 패턴 Rolling, Blue/Green, Canary
image: ""
---

> Medium에 작성했던 [무중단 배포 패턴: Rolling, Blue/Green, Canary](https://medium.com/@leehaneul0623/%EB%AC%B4%EC%A4%91%EB%8B%A8-%EB%B0%B0%ED%8F%AC-%ED%8C%A8%ED%84%B4-rolling-blue-green-canary-7d88d441a184)를 블로그로 옮겨 정리한 글이다.

애플리케이션을 배포할 때 중요한 목표 중 하나는 사용자에게 장애나 중단을 노출하지 않는 것이다. 이를 위해 여러 배포 전략을 사용할 수 있는데, 대표적으로 Rolling Deployment, Blue/Green Deployment, Canary Deployment가 있다.

각 전략은 새 버전을 운영 환경에 반영한다는 목적은 같지만, 트래픽을 전환하는 방식과 롤백 난이도, 필요한 인프라 비용, 배포 중 공존하는 버전의 수가 다르다.

## Rolling Deployment

Rolling Deployment는 서버를 한 번에 모두 교체하지 않고, 일부 인스턴스부터 순차적으로 새 버전으로 바꾸는 방식이다.

예를 들어 서버가 10대 있다면 1대씩 새 버전을 배포하고, 문제가 없는지 확인한 뒤 다음 서버로 넘어간다. 전체 서비스는 계속 살아 있으므로 무중단 배포가 가능하다.

다만 배포가 진행되는 동안 구버전과 신버전이 동시에 존재한다. 그래서 API, DB 스키마, 메시지 포맷 등에서 하위 호환성을 신경 써야 한다. 새 버전만 이해할 수 있는 데이터나 요청을 만들면 아직 구버전으로 동작하는 서버에서 문제가 생길 수 있다.

![Rolling Deployment](/assets/img/medium-migration/deployment-rolling.png)
<small>Rolling Deployments</small>

## Blue/Green Deployment

Blue/Green Deployment는 현재 운영 중인 환경과 같은 크기의 새 환경을 미리 준비한 뒤, 새 버전 배포가 끝나면 트래픽을 한 번에 전환하는 방식이다.

기존 운영 환경을 Blue, 새 운영 환경을 Green이라고 부를 수 있다. Green 환경에 새 버전을 배포하고 검증한 다음, 로드밸런서나 라우팅 설정을 바꿔 사용자 트래픽을 Green으로 보내는 식이다.

![Blue/Green Deployment 패치 수행 이전](/assets/img/medium-migration/deployment-blue-before.png)
<small>패치 수행 이전</small>

![Blue/Green Deployment 패치 수행 후](/assets/img/medium-migration/deployment-blue-after.png)
<small>패치 수행 후</small>

이 방식의 장점은 롤백이 쉽다는 점이다. 기존 Blue 환경을 바로 폐기하지 않는다면, 문제가 생겼을 때 트래픽을 다시 Blue로 돌릴 수 있다. 반면 같은 규모의 환경을 하나 더 준비해야 하므로 비용 부담이 크다.

## Canary Deployment

Canary Deployment는 새 버전을 일부 사용자나 일부 트래픽에만 먼저 노출한 뒤, 점진적으로 비율을 늘려가는 방식이다.

예를 들어 처음에는 전체 트래픽의 5%만 새 버전으로 보내고, 오류율이나 지연 시간 같은 지표가 안정적이면 20%, 50%, 100%처럼 확대할 수 있다. 통계적으로 새 버전의 안정성을 보고 싶거나 A/B 테스트를 함께 하고 싶을 때 유용하다.

Canary도 Rolling과 마찬가지로 일정 시간 동안 구버전과 신버전이 같이 존재한다. 따라서 하위 호환성 관리는 여전히 필요하다.

![Canary Deployment](/assets/img/medium-migration/deployment-canary.png)
<small>Canary Deployment</small>

## 어떤 상황에서 선택할까

작은 변경을 안정적으로 반영하고 싶다면 Rolling Deployment가 무난하다. 서버 몇 대에만 먼저 배포하고 로그를 확인하면서 점진적으로 확장할 수 있기 때문이다.

대규모 변경이나 빠른 롤백 가능성이 중요한 배포라면 Blue/Green Deployment를 고려할 수 있다. 비용은 더 들지만, 환경 단위로 전환하기 때문에 운영 판단이 단순해진다.

새 버전의 성능, 오류율, 사용자 반응을 점진적으로 확인하고 싶다면 Canary Deployment가 적합하다. 특히 기능 실험이나 트래픽 기반 검증이 필요한 경우 선택하기 좋다.

결국 배포 전략은 정답이 하나로 정해지는 문제가 아니다. 변경의 크기, 롤백 요구사항, 인프라 비용, 관측 가능성, 하위 호환성 수준을 함께 고려해 선택해야 한다.

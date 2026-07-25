---
title: 실무에서 적용하는 테스트 코드 작성 방법과 노하우
date: 2023-07-24
modified: 2023-07-24
tags: [jvm]
description: 실무에서 적용하는 테스트 코드 작성 방법과 노하우
image: ""
---

> [스프링 캠프 2023 - 김남윤 스피커님의 발표](https://www.youtube.com/watch?v=XSkz0kO7J3w&list=PLdHtZnJh1KdbR9xXyiVJ-BClLTXCw66y3&index=5&ab_channel=SpringCampbyKSUG)를  듣고 정리한 글입니다. 문제가 될 경우 삭제 조치 하도록 하겠습니다.

## 1. 효율적인 Mock Test

### HTTP Mock Server Test로 시작해 보자.

-   기존 가맹점 등록 flow는 다음과 같음
    -   운영자가 사업자 번호, 가맹점명을 **가맹점 서비스**에게 전달(직접 입력받음)
    -   실제 구현은 입력받은 값을 그대로 영속화하는 코드를 작성함
-   서비스가 점점 커지면서 **파트너 서비스**가 독립적으로 분리된다고 가정
    -   운영자가 사업자 번호를 가맹점 서비스에 전달하면..
    -   가맹점 서비스는 파트너 서비스에 사업자 번호로 가맹점명을 질의함
    -   실제 구현은 PartnerClient를 이용해 HTTP 통신해 데이터를 받아와 영속화하는 코드를 작성함
-   구현 코드가 변경되어 테스트 코드도 변경되어야 함
    -   PartnerClient에 의존했기 때문에 HTTP Mocking을 하여 실제 통신을 진행하는 테스트 코드를 작성(Mock Server 이용)
    -   괜찮아 보이는데..?

### HTTP Mock Server Test의 문제점

-   PartnerClient에 직간접적으로 의존하고 있는 모든 코드에 Mock Server가 필요하다..
-   PartnerClient의 변경은 의존하는 모든 테스트 코드를 변경하도록 함

**장단점 정리**

- (장) : HTTP 통신을 실제 진행 하여 서비스 환경과 가장 근접한 테스트
- (단) : HTTP 통신 Mocking을 의존하는 모든 구간에 Mocking 필요

### @MockBean은 어떨까?

-   신규 가맹점 등록 @MockBean 기반 테스트 코드
-   @MockBean 주입받아 HTTP Mocking이 아닌 객체의 행위를 Mocking 하여 해결해 보자. 
-   하지만, 모든 테스트 코드에 Mocking을 해줘야 하는 사실은 변함이 없음..
-   그래도 HTTP Mocking보단 나음..

### @MockBean의 Application Context 이슈

-   @MockBean을 여러 객체가 사용하니 Application Context를 N번 초기화함
-   Application Context 재사용 불가능(각기 다른 MockBean을 사용하기 때문에)
-   테스트 빌드 속도 악영향

**장단점 정리**

- (장) :  HTTP Mocking에 비해 비교적 간단하게 Mocking 가능
- (단) : Application Context 이슈 있음

### @TestConfiguration 기반 Bean 제공으로 해결해 보자.

-   원인은 @MockBean...
-   그러면 Bean으로 관리할까?
-   Mockito.mock(PartnerClient::class.java) 를 @Bean 으로!
-   또한 테스트에서만 사용하기 위해 @TestConfiguration으로 지정

### @TestConfiguration 기반 Bean 제공은 멀티 모듈에서 어려울지도...

-   Service A 모듈에서 HTTP Client 모듈(PartnerClient, ClientTestConfiguration 포함)을 의존
-   Service A 모듈에서 Mocking 된 Bean(PartnerClient)를 가져오기 위해서는 test 디렉터리에 접근해야 함
-   하지만... Service A 모듈의 test 디렉터리에서 HTTP Client 모듈의 test 디렉터리 임포트가 불가능함

**장단점 정리**

- (장) : Application Context 이슈 해결, 비교적 간단한 Mocking
- (단) : 멀티 모듈 환경에서 @TestConfiguration Bean 사용 어려움

### 멀티 모듈이라면 java-test-fixtures를 사용해 보자.

-   **java-test-fixtures gradle plugin**을 이용해 볼 수 있음
-   테스트 코드에서 공통으로 사용되는 자원들을 관리 가능
-   테스트 환경을 간편하게 설정 가능함
-   Service A 모듈에서 testApi(testFixtures(project(":http-client")))를 명시해서 사용 가능함
-   main에서는 접근 불가능하지만, test에서만 접근 가능!

꼭 이렇게 어렵게 해야 할까?

-   사실 HTTP Client 모듈의 main 디렉터리에 TestConfiguration을 위치시켜도 괜찮음
-   하지만... main에서도 접근할 수 있음. (이것이 문제)

**테스트 코드를 작성하면서 다음과 같은 의문을 가져라!**

-   테스트를 쉽게 하기 위해, 운영 코드 설계를 변경하는 것이 옳은가?
-   바람직하지 않음... 실제 운영환경에 Mock Bean이 올라가면 문제가 될 수도 있음.
-   깨진 창문 이론을 생각하라

**장단점 정리**

- (장) : 외부 모듈에서 @TestConfiguration Bean 사용 가능
- (단) : 멀티 모듈 아니면 굳이?

### 테스트할 수 없는 영역 대처 자세

-   테스트할 수 없는 Black Box 영역이 있음. 이 영역은 다양한 이유로 생김
-   Black Box 영역은 전이됨. 즉 모든 구간이 테스트하기 어려워짐
-   특정 계층이 테스트하기 어려우면, 그 영향이 외부로 전이되지 않도록 격리해야 함

## 2. 테스트 코드로 부터 피드백받기

-   정말 HTTP Mock Test는 필요 없는가?
    -   불편하긴 하지만, 필요하다!
    -   중요한 것은 해당 객체의 책임이 무엇이고, 객체의 관심사가 무엇이냐는 것
    -   이때, 객체의 관심사가 테스트해야 할 대상임
-   **PartnerClient 객체의 책임과 역할**은 무엇인가?
    -   PartnerClient는 파트너 서비스와 HTTP 통신을 수행하는 책임과 역할을 가지고 있음
    -   이를 디테일하게 분리하면 두 가지 부분으로 나뉠 수 있음
        -   Business Logic(status code 응답 분기.. exception 처리... 등)
        -   HTTP 요청/응답(http 요청, 응답, 설정... 등)
    -   더욱 계층별로 살펴보자.
        -   Service Layer(Business Login)
        -   RestTemplate(High Level)
        -   HTTP Client(Low Level)
    -   분리 가능하겠는데?
        -   PartnerClientService : Service Layer
        -   PartnerClient : HTTP 통신
-   책임은 변화와 관련되어 있음. 
    -   PartnerClient 내부에 다른 부류의 책임들이 혼재하면... 변경이 어려움
    -   수정 포인트가 무려 두 개...
    -   테스트도 작성하기 불편함... Service Layer 테스팅하고 싶은데.. MockServer, HTTP 어쩌구... 필요해?
    -   분리하면 편하겠쥬?
-   테스트 코드가 뭔가 불편하고 어려우면... 구현 코드를 의심해 보자!!!
-   객체의 책임을 분리하면 외부 모듈에도 긍정적인 영향을 줌!
-   **해당 객체가 본인의 책임을 다하지 않으면 그 책임은 다른 객체로 넘어감.**
-   **만약 해당 객체가 이미 자신의 책임을 다하고 있음에도 불구하고 책임이 과중된다면, 협력할 수 있는 다른 객체를 추가하여 책임을 분리하라**
-   테스트 코드는 우리에게 신호를 보냄.

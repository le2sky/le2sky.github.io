---
title: 자바 성능 튜닝 이야기
date: 2024-02-15
modified: 2024-02-15
tags: [jvm]
description: 자바 성능 튜닝 이야기를 정리 요약한 글입니다
image: ""
article_class: java-performance-tuning
---

{::options smart_quotes="apos,apos,quot,quot"/}

> 자바 성능 튜닝 이야기를 정리 요약한 글입니다.

## 디자인 패턴 꼭 써야 한다

### 1.  MVC

J2EE 패턴을 이해하기 위해서는 MVC 모델에 대해 먼저 이해해야 하는데, 왜냐하면 J2EE 패턴에는 MVC 구조가 기본으로 깔려 있고, Spring 프레임워크의 Spring MVC도 매우 인기 있는 부분이기 때문이다.

-   C : 뷰와 모델의 연결자
-   V : 화면, 이벤트를 발생시키고, 이벤트의 결과를 보여줌
-   M : 뷰에서 입력된 내용을 저장, 관리, 수정하는 역할(이벤트에 대한 실질적인 일을 함)



2티어 구조에서는 그냥 사용하면 되는데, 웹 기반 3티어 구조에서는 JSP 모델1 혹은 모델2를 사용한다.



#### JSP model 1

![](/java-performance-tuning/106-01.gif)

*출처:&amp;nbsp;https://premaseem.wordpress.com/2013/02/11/jsp-model-1-architecture/*

-   JSP에서 자바 빈을 호출하고 DB에서 정보를 조회, 등록, 수정, 삭제 업무를 한 후 결과를  브라우저로 보내준다.
-   간단하게 개발할 수 있지만, 개발 후 프로세스 변경이 생길 경우 수정이 어렵다.
-   화면과 비즈니스 모델의 분업화가 어렵고, 컨트롤러가 없어서 실질적으로 MVC라고 부르기엔 어려움



#### JSP model 2

![](/java-performance-tuning/106-02.jpg)

*https://premaseem.wordpress.com/2013/02/11/jsp-model-2-architecture-mvc/*

-   모델2에서는 서블릿이 컨트롤러 역할을 수행한다.
-   프론트 컨트롤러 떡밥인가?



 model1을 쓰냐 model2를 쓰냐에 따라 성능 차이는 없지만, 간결한 구조를 통해 코드 중복 호출을 극복할 수 있으니 결국 성능에 영향이 없다고는 할 수 없음.



### 2\. J2EE 디자인 패턴이란?

패턴은 무엇인가를 만들기 위한 모델, 가이드, 설명의 집합을 의미한다. 즉, 시스템을 만들기 위해서 전체 중 일부 의미 있는 클래스들을 묶은 각각의 집합을 디자인 패턴이라고 볼 수 있다.

![](/java-performance-tuning/106-03.gif)

*Sun에서 제공했던 Core J2EE 디자인 패턴 카탈로그*



가장 윗부분은 프레젠테이션 티어, 중간 부분은 비즈니스 티어, 하단 부분은 인테그레이션 티어임. 즉, 위로 갈수록 화면에 아래로 갈수록 저장소에 가까움

-   Intercepting Filter 패턴 : 요청 타입에 따라 다른 처리를 하기 위한 패턴
-   Front Controller 패턴 : 요청 전후에 처리하기 위한 컨트롤러를 지정하는 패턴
-   View Helper 패턴 : 프레젠테이션 로직과 상관없는 비즈니스 로직을 헬퍼로 지정하는 패턴
-   Composite View 패턴 : 최소 단위의 하위 컴포넌트를 분리하여 화면을 구성하는 패턴
-   Service to Worker 패턴 : Front Controller와 View Helper 사이에 디스패처를 두어 조합하는 패턴
-   Dispatcher View 패턴 : Front Controller와 View Helper로 디스패처 컴포넌트를 형성. 뷰 처리가 종료될 때까지 다른 활동을 지연한다는 점이 Service to Worker과 다름
-   Business Delegate 패턴 : 비즈니스 서비스 접근을 캡슐화하는 패턴
-   Service Locator 패턴 : 서비스와 컴포넌트 검색을 쉽게 하는 패턴
-   Session Facade 패턴 : 비즈니스 티어 컴포넌트를 캡슐화하고, 원격 클라이언트에서 접근할 수 있는 서비스를 제공하는 패턴
-   Composite Entity 패턴 : 로컬 엔티티 빈과 POJO를 이용하여 큰 단위의 엔티티 객체를 구현하는 패턴
-   Transfer Object 패턴 : 일명 VO 패턴이라고도 알려져 있는데, 데이터를 전송하기 위한 객체에 대한 패턴
-   Transfer Object Assembler 패턴 : 하나의 Transfer Object로 모든 타입 데이터를 처리할 수 없으므로, 여러 Transfer Object를 조합하거나 변형한 객체를 생성하여 사용하는 패턴
-   Value List Handler 패턴 : 데이터 조회를 처리하고, 결과를 임시 저장하며, 결과 집합을 검색하여 필요한 항목을 선택하는 역할을 수행
-   Data Access Object 패턴 : 일명 DAO, DB 접근을 전담하는 클래스를 추상화하고 캡슐화
-   Service Activator 패턴 : 비동기적 호출을 처리하기 위한 패턴





#### 기억하자

-   J2EE 패턴 중 성능과 가장 밀접한 패턴은 Service Locator 패턴이다.
-   성능에 직접적으로 많은 영향을 미치진 않지만, 애플리케이션 개발 시 반드시 사용해야 하는 Transfer Object!
-   자바 기반의 시스템을 분석, 설계하고 개발하면서 패턴을 모른다면 반쪽 분선 설계자나 개발자라고 할 수 있음!
-   프레임워크도 마찬가지. 프레임워크를 만든 사람의 사상과 프레임워크 구조, 기능을 정확히 알고 있어야 제대로 프레임워크를 활용 가능하다.
-   성능 개선, 개발, 유지보수의 편의를 위해서 적어도! Business Delegate, Session Facade, Data Access Object, Service Locator, Transfer Object 패턴은 적용해야 한다고 필자는 주장한다!

## 내가 만든 프로그램의 속도를 알고 싶다



### 1.  프로파일링 툴

-   프로파일링 툴은 시스템 문제 분석 툴을 의미함
-   요즘 많이 사용하는 툴로는 APM(application performance monitorting)이 있는데, 운영용 서버를 진단 및 모니터링하기 위해서 사용됨



#### APM 툴 vs 프로파일링 툴

| 구분 | 특징 |
| --- | --- |
| 프로파일링 툴 | - 소스 레벨의 분석을 위한 툴<br>- 애플리케이션의 세부 응답 시간까지 분석 가능<br>- 메모리 사용량을 객체나 클래스, 소스의 라인 단위까지 분석 가능<br>- APM 툴에 비해 저렴<br>- 사용자 수 기반으로 가격이 정해짐<br>- 자바 기반의 클라이언트 프로그램 분석 가능 |
| APM 툴 | - 애플리케이션의 장애 상황에 대한 모니터링 및 문제점 진단이 주 목적<br>- 서버의 사용자 수나 리소스에 대한 모니터링 가능<br>- 실시간 모니터링을 위한 툴<br>- 가격이 프로파일링 툴에 비해 비쌈<br>- 보통 CPU 수를 기반으로 가격이 정해짐<br>- 자바 기반의 클라이언트 프로그램 분석 불가능 |



#### 프로파일링 툴 제공 기능

-   응답 시간 프로파일링 기능 : 응답 시간 측정(클래스 내에서 사용되는 메서드 단위의 응답 시간)
-   메모리 프로파일링 (잠깐 사용하고 GC의 대상이 되는 부분을 찾거나 메모리 릭이 발생하는 부분을 찾기 위함, 클래스 및 메서드 단위의 메모리 사용량 분석)



### 2\. System 클래스

-   System.currentTimeMillis, System.nanoTime
-   JDK 5.0부터 nanoTime 메서드가 추가됨. 
-   결과 차이가 발생할 수 있으니, JDK 5.0 이상이라면 시간 측정용으로 만들어진 nanoTime을 사용하는 것을 권장
-   nanoTime은 시간 측정용으로 추가된 메서드이기 때문에 오늘의 날짜를 알아내는 부분에는 사용하지 말것.
-   전문 측정 라이브러리로는 JMH, Caliper, JUnitPerf, JUnitBench, ContiPerf 등이 존재함

## 왜 자꾸 String을 쓰지 말라는거야



### 1\. String 클래스를 잘못 사용한 사례

```java
String strSQL = "";
strSQL += "select * ";
strSQL += "from ( ";
..중략
```

-   위와 같은 형식으로 문자열을 다루는 사례가 많음
-   위와 같은 형식은 메모리를 많이 사용하게 되는 문제가 존재함



### 2\. StringBuffer 클래스와 StringBuilder 클래스

-   JDK 5.0 기준으로 문자열을 만드는 클래스는 String, StringBuffer, StringBuilder가 자주 사용됨
-   StringBuffer와 StringBuilder의 차이점은 Thread Safe(StringBuffer가 지원)
-   StringBuilder는 단일 스레드에서의 안정성만 보장함
-   CharBuffer, String, StringBuffer, StringBuilder는 CharSequence를 구현함. StringBuffer나 StringBuilder로 값을 만든 이후 굳이 toString을 수행하여 필요 없는 객체를 만들어서 넘겨주기보다 CharSequence로 받아서 처리하는 것이 메모리 효율이 좋음!



insert, append 메서드를 사용하여 문자열을 추가할 수 있는데, 제발 다음과 같이 사용하지는 말자.

```java
sb.append("ABCDE" + "EFGHIJ"); // 띠요옹?
```



### 3\. String vs StringBuffer vs StringBuilder

> 자바 기반의 애플리케이션의 응답을 측정할 경우, 무조건 처음 수행한 결과 값은 무시해야 함. 클래스가 메모리로 로딩할 때는 시간이 오래 걸리기 때문에, 그때 측정한 결과 값은 의미가 없음

-   응답 시간 비교 : StringBuilder > StringBuffer &gt;&gt;&gt; String
-   메모리 사용량 비교 : StringBuilder == StringBuffer &lt;&lt;&lt; String
-   String이 느린 이유 : String에 값을 더하면, 새로운 String 클래스의 객체가 만들어지고, 기존 String 객체는 GC 대상이 됨
-   StringBuffer, StringBuilder가 빠른 이유 : 새로운 객체를 생성하지 않고, 기존에 있는 객체의 크기를 증가시키면서 값을 더함
-   **무조건 String을 쓰지 말아야 하나?**
    -   String은 짧은 문자열을 더할 경우 사용
    -   StringBuffer는 스레드에 안전한 프로그램이 필요할 때나, 개발 중인 시스템의 부분이 스레드에 안전한 지 모를 경우 사용하면 좋음. static 문자열 혹은 singleton으로 선언된 클래스에 선언된 문자열을 변경하는 경우에는 StringBuffer를 무조건 사용해야 함
    -   StringBuilder는 스레드에 안전한 지의 여부와 전혀 관계없는 프로그램을 개발할 때 사용.



### 4\. 버전에 따른 차이

-   JDK 5.0 이상을 사용한다면 결과가 약간 달라짐
-   WAS나 시스템이 JDK 5.0 이상을 사용한다면, 컴파일러에서 자동으로 StringBuffer로 변환해 줌
-   역 컴파일 해보면 (new StringBuilder("문자열")).append(&#46;&#46;&#46;) 와 같은 코드를 볼 수 있는데, 여전히 매번 불필요한 객체를 만듦

## 어디에 담아야 하는지



### 1\. Collection 및 Map 인터페이스의 이해

![](/java-performance-tuning/117-01.png)

*출처 :&amp;nbsp;https://gangnam-americano.tistory.com/41*

-   Collection : 가장 상위 인터페이스
-   Set : 중복을 허용하지 않는 집합을 처리하기 위한 인터페이스
    -   HashSet : 데이터를 해쉬 테이블에 담는 클래스로 순서 없이 저장됨
    -   TreeSet : \*red-black 트리에 데이터를 담음. 값에 따라서 순서가 정해지며 데이터를 담으면서 동시에 정렬을 하기 때문에 HashSet보다 성능상 느림(SortedSet의 구현체)
    -   LinkedHashSet : 해쉬 테이블에 데이터를 담는데, 저장된 순서에 따라서 순서가 결정됨
-   SortedSet : 오름차순을 갖는 Set 인터페이스
-   List : 순서가 있는 집합을 처리하기 위한 인터페이스이기 때문에 인덱스가 있어 위치를 지정하여 값을 찾을 수 있음. 중복을 허용하며, List 인터페이스를 상속받는 클래스 중에 가장 많이 사용하는 것으로 ArrayList가 존재
    -   Vector : 객체 생성 시에 크기를 지정할 필요가 없는 배열 클래스
    -   ArrayList : Vector와 비슷하지만, 동기화 처리가 되어 있지 않음
    -   LinkedList : ArrayList와 동일하지만, Queue 인터페이스를 구현했기 때문에 FIFO 큐 작업을 수행함
-   Queue : 여러 개의 객체를 처리하기 전에 담아서 처리할 때 사용하기 위한 인터페이스. 기본적으로 FIFO를 따름(그림에는 없지만, Collection의 하위 인터페이스)
    -   Queue 인터페이스 구현체는 java.util에 속하는 LinkedList, PriorityQueue 와 같은 일반적인 목적의 큐 클래스들이 있으며, java.util.concurrent 패키지에 속하는 클래스들이 있음(컨커런트 큐 클래스)
    -   PriorityQueue : 큐에 추가된 순서와 상관없이 우선순위에 의해 반환 객체가 정해짐
    -   LinkedBlockingQueue : 저장할 데이터의 크기를 선택적으로 정할 수도 있는 FIFO 기반의 링크 노드를 사용하는 \*블로킹 큐
    -   ArrayBlockingQueue : 저장되는 데이터의 크기가 정해져 있는 FIFO 기반의 \*블로킹 큐
    -   PriorityBlockingQueue : 저장되는 데이터의 크기가 정해져 있지 않고, 객체의 우선순위에 따라서 순서가 저장되는 \*블로킹 큐
    -   DelayQueue : 큐가 대기하는 시간을 지정하여 처리하도록 되어 있느 큐
    -   SynchronousQueue : put() 메서드를 호출하면, 다른 스레드에서 take() 메서드가 호출될 때까지 대기하도록 되어 있는 큐. 이 큐에는 저장된 데이터가 없음. API에서 제공하는 대부분의 메서드는 0이나 null을 반환
-   Map : 키와 값의 쌍으로 구성된 객체의 집합을 처리하기 위한 인터페이스. 중복되는 키를 허용하지 않음
    -   Hashtable : 데이터를 해쉬 테이블에 담는 클래스. 내부에서 관리하는 해쉬 테이블 객체가 동기화되어 있으므로, 동기화가 필요한 부분에서는 이 클래스를 권장
    -   HashMap : 데이터를 해쉬 테이블에 담는 클래스. Hashtable 클래스와 다른 점은 null 값을 허용한다는 것과 동기화되어 있지 않다는 것
    -   TreeMap : \*red-black 트리에 데이터를 담음. TreeSet과 다른 점은 키에 의해 순서가 정해진다는 것
    -   LinkedHashMap : HashMap과 거의 동일하며 이중 연결 리스트라는 방식을 사용해 데이터를 담는다는 점만 다름
-   SortedMap : 키를 오름차순으로 정렬하는 Map 인터페이스



**\* 레드 블랙 트리**

![](/java-performance-tuning/117-02.png)

*출처 : 위키*

-   이진 트리 구조로 데이터를 담는 구조
-   각각의 노드는 검은색이나 붉은색이어야 함
-   가장 상위 노드는 검은색
-   가장 말단 노드는 검은색
-   붉은 노드는 검은 하위 노드만을 가짐(따라서 검은 노드는 붉은 상위 노드만을 가짐)
-   모든 말단 노드로 이동하는 경로의 검은 노드 수는 동일함



**\* 블로킹 큐**

-   크기가 지정되어 있는 큐에 더 이상 공간이 없을 경우, 공간이 생길 때까지 대기하도록 만들어진 큐를 의미함



### 2\. Set 클래스 중 무엇이 가장 빠를까?

-   값 추가 응답 시간 비교 : HashSet, LinkedHashSet > TreeSet
-   데이터 크기가 지정된 HashSet vs 지정되지 않은 HashSet
    -   큰 차이가 발생하지 않지만 저장되는 데이터의 크기를 알고 있을 경우에는 객체 생성 시 크기를 미리 지정하는 것이 성능상 유리함
    -   HashSetWithInitialSize > HashSet
-   값 읽기(iter.next()) 응답 시간 비교 : HashSet, LinkedHashSet > TreeSet (근소한 차이)
-   값 읽기(랜덤 액세스) 응답 시간 비교 : HashSet, LinkedHashSet, HashSet > TreeSet (차이 엄청 심함)
    -   TreeSet은 Hash기반이 아니라서 그런가? - 하늘 -
-   TreeSet이 느린 이유 :
    -   TreeSet은 데이터를 저장하면서 정렬함
    -   구현한 인터페이스 중 NavigableSet이 있는데, 이 인터페이스는 특정 값보다 큰 값이나 작은 값, 가장 큰 값, 가장 작은 값 등을 추출하는 메서드를 선언해 놓았음(JDK 1.6+)
    -   즉, 데이터를 순서에 따라 탐색하는 작업이 필요한 경우 TreeSet이 유용하지만, 그럴 필요가 없을 경우 HashSet이나 LinkedHashSet을 사용하는 것을 권장



### 3\. List 관련 클래스 중 무엇이 빠를까?

-   값 추가 응답 시간 비교 : ArrayList, Vector, LinkedList 전부 비슷
-   값 읽기(list.get()) 응답 시간 비교 : ArrayList > Vector > LinkedList
-   LinkedList가 느린 이유 : Queue를 상속받기 때문에 순차적으로 결과를 받아오는 peek을 사용해야 함!(혹은 poll)
-   ArrayList가 Vector보다 빠른 이유 : Vector는 여러 스레드에서 접근할 경우를 방지하기 위해서 get()에 synchronized가 선언되어 있기 때문에 성능 저하가 발생함
-   값 삭제 응답 시간 비교 :
    -   First 위치 값을 삭제하는 작업이 Last 삭제 작업보다 느림
    -   ArrayList, Vector는 실제로 그 안에 배열을 사용하기 때문에 배열의 0번째 값을 삭제하면 1번째에 있던 값이 0번째로 와야 함. 이때, 모든 값의 위치가 변경되어야 하기 때문에 느림  
        -   ArrayListFirst : 418ms
        -   ArrayListLast : 146ms
        -   VectorFirst : 687ms
        -   VectorLast : 426ms
    -   LinkedList의 경우 별 차이가 없음
        -   LinkedListFirst : 423ms
        -   LinkedListLast : 407ms 



### 4\. Map 관련 클래스 중에서 무엇이 빠를까?

-   값 추가 응답 시간 비교 : 모두 비슷함
-   값 읽기(map.get()) 응답 시간 비교 : 
    -   \* seq는 순차 읽기, random은 랜덤 읽기 방식임 
    -   SeqHashMap : 32ms
    -   RandomHashMap : 40ms
    -   SeqHashtable : 106ms
    -   RandomHashtable : 120ms
    -   SeqLinkedHashMap : 34ms
    -   RandomLinkedHashMap : 46ms
    -   SeqTreeMap : 197ms
    -   RandomTreeMap : 277ms
-   TreeMap이 가장 느림!
-   무난한 경우, ArrayList, HashSet, HashMap, LinkedList(for Queue)를 사용할 것을 권장 



### 5\. Collection 관련 클래스의 동기화

-   HashSet, TreeSet, LinkedHashSet, ArrayList, LinkedList, HashMap, TreeMap, LinkedhashMap은 동기화(synchronized)되지 않은 클래스임
-   반대로 Vector, Hashtable은 동기화되어 있음
-   Collections 클래스에는 최신 버전 클래스들의 동기화를 지원하기 윈한 synchronized로 시작하는 메서드들이 있음

```java
List list = Collections.synchronizedList(...);
Set set = Collections.synchronizedSet(...);
```

-   Map의 경우 키 값들을 Set으로 가져와 Iterator를 통해 데이터를 처리하는 경우가 발생함
    -   이때, ConcurrentModificationException이라는 예외가 발생할 수 있음
    -   이 예외가 발생하는 여러 가지 원인 중 하나는 스레드에서 Iterator로 어떤 Map 객체의 데이터를 꺼내고 있는데, 다른 스레드에서 해당 Map을 수정하는 경우임.
    -   이러한 경우 가장 편하게 java.util.concurrent 패키지에 있는 클래스들을 확인해 볼 수 있음
-   (결) Collection 관련 클래스들 자체에서 처리하는 속도는 그리 느리지 않음. 일반적인 웹 개발할 때는 Collection 성능 차이를 비교하는 것은 큰 의미가 없음. 각 클래스에는 사용 목적이 있기 때문에 목적에 부합하는 클래스를 선택해서 사용하는 것이 바람직함!

## 지금까지 사용하던 for 루프를 더 빠르게 할 수 있다고?



### 1.  조건문에서의 속도는?

-   조건문의 종류는 다음과 같음
    -   if-else if-else
    -   switch
-   switch의 경우 JDK 6까지 4가지 타입(byte, short, char, int)을 사용한 조건 분기만 가능했지만 JDK 7부터는 String도 가능함
-   일반적으로 if문에서 분기를 많이 하면 시간이 많이 소요된다고 생각하지만, If문 조건 안에 들어가는 비교 구문에서 속도를 잡아먹지 않는 한, if 문장 자체에서는 그리 많은 시간이 소요되지 않음
-   응답 시간 비교 : randomOnly > if 10개 > if 100개 (별 차이가 없음)
-   switch는 숫자 비교 시 if보다 가독성이 좋아지므로 정해져 있는 순자로 분기할 경우 switch 권장
-   JDK 7에서 Switch 문에서 String 비교가 가능한 이유는 Object.hashCode() 메서드 덕분임
    -   Switch 문을 컴파일하면, case 문에 있는 각 값들을 hashcode로 변환하고, 그 값이 작은 것부터 정렬한 다음에 String의 equals 메서드를 사용하여 실제 값과 동일한지 비교함
    -   중요한 것은 숫자를 정렬한다는 점임. Switch 문은 작은 숫자부터 큰 숫자를 비교하는 게 가장 빠름. (case가 적으면 상관없지만, 많다면 소요 시간이 오래 걸림)
    -   간단한 Switch 문이라도 성능을 고려하면서 사용하기를 권장



### 2\. 반복 구문에서의 속도는?

-   자바에서 사용하는 반복 구문은 다음과 같음
    -   for
    -   do-while
    -   while
-   while문은 무한 루프에 빠질 수 있기 때문에 되도록 for문 사용 권장
-   다음과 같은 코딩 습관은 별로 좋지 않음(매번 size 메서드를 호출함)

```java
for(int loop = 0; loop < list.size(); loop++)...
```

-   JDK 5부터는 For-Each 루프를 사용할 수 있음 ex) for(String str : list)
    -   단, 데이터의 첫 번째 값부터 마지막까지 처리해야 할 경우에만 유용함.
    -   순서를 거꾸로 돌리거나 특정 값부터 데이터를 담색하는 경우에는 적절하지 않음
-   응답 시간 비교 : for > for 크기 반복 비교(list.size() 매번 호출) > for-each (사실상 거의 차이 없음)



### 3\. 반복 구문에서의 필요 없는 반복

```java
public void sample(DataVO data, String key) {
    TreeSet treeSet2 = null;
    treeSet2 = (TreeSet) data.get(key);
    if(treeSet2 != null) {
        for(int i = 0; i < treeSet2.size(); i++) {
            DataVO2 data2 = (DataVO2) treeSet2.toArray()[i];
            ...
        }
    }

}
```

-   TreeSet 형태의 데이터를 갖고 있는 DataVO에서 TreeSet을 하나 추출해서 처리하는 로직
-   위 소스의 문제는 toArray()를 반복해서 수행한다는 것
-   sample 메서드는 애플리케이션이 한 번 호출되면 40번씩 수행됨
-   treeSet2 객체에 256개의 데이터들이 들어가 있다면, 결과적으로 toArray 메서드는 한 번 호출될 때마다 10,600번 반복 호출됨
-   따라서 toArray() 메서드가 반복되지 않도록 for 문 앞으로 옮기는 것이 좋음

```java
public void sample(DataVO data, String key) {
    TreeSet treeSet2 = null;
    treeSet2 = (TreeSet) data.get(key);
    if(treeSet2 != null) {
        DataVO2 [] dataVO2 = (DataVO2) treeSet2.toArray();
        int treeSet2Size = treeSet2.size();
        for(int i = 0; i < treeSet2Size; i++) {
            ...
        }
    }

}
```

-   성능 튜닝은 응답 시간의 비중이 큰 부분부터 하는 것이 기본 중의 기본이지만, 작은 부분을 차지하는 반복 구문이 큰 성능 저하를 가져올 수도 있다는 것을 명심하라
-   반복 구문의 문제점을 찾으면 성능상 문제가 되는 부분을 더 쉽게 해결할 수도 있음

## Static 제대로 한번 써 보자



### 1\. static의 특징

-   static은 '정적인', '움직이지 않는'이라는 의미
-   자바에서 static은 해당 메서드나 변수가 정적이라는 뜻
-   class에 static으로 선언되어 있는 변수를 클래스 변수라고 함
-   인스턴스를 생성하더라도, 모든 객체가 클래스 변수에 대해서 동일한 주소의 값을 참조함
-   static 초기화 블록이라는 것이 존재함.

```java
public class StaticBasicSample2 {

    static String staticVal;
    static {
        staticVal = "static value";
        staticVal = StaticBasicSample.staticInt + "";
    }

    public static void main(String[] args) {
        System.out.println(StaticBasicSample2.staticVal);
    }

    static {
        staticVal = "Performance is important!");
    }
}
```

-   static 초기화 블록은 위와 같이 클래스 어느 곳에나 지정 가능
-   static 블록은 클래스가 최초 로딩될 때 수행되므로 생성자 실행과 상관없이 수행됨
-   위 예시처럼 여러 번 사용 가능
-   static 블록은 순차적으로 읽히며 위의 경우 Performance is Important! 가 출력됨
-   static의 특징
    -   다른 JVM에서는 static이라고 선언해도 다른 주소나 다른 값을 참조하지만, 하나의 JVM이나 WAS 인스턴스에서는 같은 주소에 존재하는 값을 참조한다는 것.
    -   GC 대상이 되지 않음



### 2\. static 잘 활용하기

-   자주 사용하고 절대 변하지 않는 변수는 final static으로 선언하자
    -   자주 변경되지 않고, 경우의 수가 단순한 쿼리 문장이 있다면 final static이나 static으로 선언해서 사용
    -   자주 사용되는 로그인 관련 쿼리들이나 간단한 목록 조회 쿼리를 final static으로 선언하면 적어도 1바이트 이상의 객체가 GC 대상에 포함되지 않음
    -   JNDI 이름이나 간단한 코드성 데이터들을 static으로 선언해 놓으면 편리함
    -   템플릿 성격의 객체를 static으로 선언하는 것도 성능 향상에 도움이 됨(로딩이 오래 걸리는)
-   설정 파일 정보도 static으로 관리하자
    -   클래스의 객체를 생성할 때마다 설정 파일을 로딩하면 성능 저하가 발생함
    -   static으로 데이터를 읽어서 관리해야 함
-   코드성 데이터는 DB에서 한 번만 읽자
    -   부서가 적은 회사의 코드나, 건수가 그리 많지 않되 조회 빈도가 높은 코드성 데이터는 DB에서 한 번만 읽어서 관리하는 것이 성능 측면에서 좋음

```java
public class CodeManager {

    private HashMap<String, String> codeMap;
    private static CodeDAO cDAO;
    private static CodeManager cm;
    static {
        cDAO = new CodeDao();
        cm = new CodeManager();
        if(!cm.getCodes()) {
            // 에러 처리
        }
    }

    private codeManager() { }

    public static CodeManager getInstance() {
        return cm;
    }

    private boolean getCodes() {
        try {
            codeMap = cDAO.getCodes();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean updateCodes() {
        return cm.getCodes();
    }

    public String getCodeValue(String code) {
        return codeMap.get(code);
    }
}
```

-   CodeManager는 코드 정보를 미리 담아 놓는 클래스
-   클래스가 메모리에 로드되면 static 초기화 블록에서 cDAO, cm을 초기화하고, getCodes를 호출함
-   위와 같은 경우 서버 인스턴스가 하나만 존재한다면 코드 변경에 대해서 걱정이 없지만, 여러 개라면 문제가 될 수 있음
-   JVM 간에 상이한 결과가 나오는 것을 방지하기 위해 캐시를 사용 가능함



### 3\. static 잘못 쓰면 이렇게 된다

```java
public class BadQueryManager {

    private static String queryURL = null;

    public BadQueryManager(String badUrl) {
        queryURL = badUrl;
    }

    public static String getSql(String idSql) {
        try {
            FileReader reader = new FileReader();
            HashMap<String, String> document = reader.read(queryURL);
            return document.get(idSql);
        } catch (Exception ex) {
            System.out.println(ex);
        }

        return null;
    }
}
```

-   queryURL이라는 문자열을 static으로 지정함. 이 문자열에는 쿼리가 포함된 파일의 이름과 위치가 지정되어 있음
-   문자열이 있는 생성자로 이 클래스 객체를 생성하면 쿼리 파일이 지정됨
-   getSql 메서드에서는 DAO에서 쿼리를 요청하면, 해당 쿼리 파일을 읽어서 리턴함(static)
-   어떤 화면에서 생성자를 통해서 queryURL을 설정하고 getSQL을 호출하기 전에 다른 queryURL을 사용하는 화면의 스레드에서 BadQueryManager의 생성자를 호출한다면?
    -   시스템이 오류를 발생
    -   먼저 호출한 화면에서는 생성자를 호출했을 때의 URL을 유지할 것이라고 생각함
    -   하지만, 그 값은 다른 화면의 스레드에 의해서 변경됨
-   이 코드는 느림. 쿼리를 한 번 호출하기 위해서 매번 파일을 읽을 수밖에 없는 구조이기 때문에 IO가 발생하면서 대기하는 IO wait가 발생하는 것을 피할 수 없음



아래는 static을 잘못 사용한 다른 사례

```java
// 응시자의 합격 여부를 잠깐 담아 놓기 위한 클래스 변수
private static boolean successFlag;
```

-   위 코드는 이전 사례와 비슷함. 여러 명이 동시에 요청하면 flag 값이 변경되어&#46;&#46;&#46; 끔찍한 결과를 초래할 수 있음



### 4\. static과 메모리 릭

-   static으로 선언한 부분은 GC가 되지 않음
-   그렇다면 만약 어떤 클래스에 데이터를 Vector, ArrayList에 담을 때 해당 Collection 객체를 static으로 선언하면 어떻게 될까?
    -   지속적으로 해당 객체에 데이터가 쌓이면 OOM이 발생함
-   더 이상 사용 가능한 메모리가 없어지는 현상을 **메모리 릭(memory leak)**이라고 하는데, static과 Collection 객체를 잘못 사용하면 메모리 릭이 발생함.
-   메모리 릭이 발생했을 때, 모니터링 화면에 나타난 메모리 사용량 그래프를 보면 아무리 GC가 수행되더라도 메모리가 어느 정도 이하로 떨어지지 않는 현상을 관측할 수 있음
-   메모리 릭의 원인은 메모리의 현재 상태를 파일로 남기는 HeapDump 파일을 통해서 가능함. JDK/bin 디렉터리에 있는 jmap이라는 파일을 사용해 덤프를 남길 수 있으며, 남긴 덤프는 MAT와 같은 툴을 통해서 분석하면 됨!

## 클래스 정보, 어떻게 알아낼 수 있나?



### 1\. reflection 관련 클래스들

-   자바 API에는 reflection이라는 패키지가 있음
-   이 패키지에 있는 클래스들을 사용하면 JVM에 로딩되어 있는 클래스와 메서드 정보를 읽어올 수 있음
-   Class 클래스
    -   클래스에 대한 정보를 얻을 때 사용하기 좋고, 생성자는 따로 없음
    -   ClassLoader 클래스의 defineClass 메서드를 이용해서 클래스 객체를 만들 수도 있지만, 좋은 방법은 아님
    -   Object.getClass() 메서드를 이용하는 것이 일반적임
    -   String getName() : 클래스의 이름을 반환(패키지 정보까지 반환. 단지 이름만을 원하면 getSimpleName 사용)
    -   Package getPackage() : 클래스의 패키지 정보를 패키지 클래스 타입으로 반환
    -   Field\[\] getFields() : public으로 선언된 변수 목록을 Field 클래스 배열 타입으로 반환
    -   Field getField(String name) : public으로 선언된 변수를 Field 클래스 타입으로 반환
    -   Field\[\] getDeclaredFields() : 해당 클래스에서 정의된 변수 목록을 Field 클래스 배열 타입으로 반환
    -   Field getDeclaredField(String name) : name과 동일한 이름으로 정의된 변수를 Field 클래스 타입으로 반환
    -   Method\[\] getMethod() : public으로 선언된 모든 메서드 목록을 Method 클래스 배열 타입으로 반환. 해당 클래스에서 사용 가능한 상속받은 메서드도 포함
    -   Method getMethod(String name, Class&#46;&#46;&#46; parameterTypes) : 지정된 이름과 매개변수 타입을 갖는 메서드를 Method 클래스 타입으로 반환
    -   Method\[\] getDeclaredMethods() : 해당 클래스에서 선언된 모든 메서드 정보를 반환
    -   Method getDeclaredMethod(String name, Class&#46;&#46;&#46; parameterTypes) : 지정된 이름과 매개변수 타입을 갖는 해당 클래스에서 선언된 메서드를 Method 클래스 타입으로 반환
    -   Constructor\[\] getConstructors() : 해당 클래스에 선언된 모든 public 생성자의 정보를 Constructor 배열 타입으로 반환
    -   Constructor\[\] getDeclaredConstructors() : 해당 클래스에 선언된 모든 생성자의 정보를 Constructor 배열 타입으로 반환
    -   int getModifiers() : 해당 클래스의 접근자(modifier) 정보를 int 타입으로 반환
    -   String toString() : 해당 클래스 객체를 문자열로 반환
-   Method 클래스
    -   메서드에 대한 정보를 얻을 수 있음. 하지만, Method 클래스에는 생성자가 없으므로 Method 클래스의 정보를 얻기 위해서는 Class 클래스의 getMethods 혹은 getDeclaredMethods를 사용해야 함
    -   Class&lt;?&gt; getDeclaringClass() : 해당 메서드가 선언된 클래스 정보를 반환
    -   Class&lt;?&gt; getReturnType() : 해당 메서드의 반환 타입을 반환
    -   Class&lt;?&gt;\[\] getParameterTypes() : 해당 메서드를 사용하기 위한 매개변수의 타입들을 반환
    -   String getName() : 해당 메서드의 이름을 반환
    -   int getModifiers() : 해당 메서드의 접근자 정보를 반환
    -   Class&lt;?&gt;\[\] getExceptionTypes() : 해당 메서드에 정의되어 있는 예외 타입들을 반환
    -   Object invoke(Object obj, Object&#46;&#46;&#46; args) : 해당 메서드를 수행
    -   String toGenericString() : 타입 매개변수를 포함한 해당 메서드의 정보를 반환
    -   String toString() : 해당 메서드의 정보를 반환
-   Field 클래스
    -   클래스에 있는 변수들의 정보를 제공하기 위해서 사용. Method와 마찬가지로 Class 클래스의 getField, getDeclaredFields를 사용해야 함  
        -   int getModifiers() : 해당 변수의 접근자 정보를 반환(Modifier.toString() 이용할 수 있음)
        -   String getName() : 해당 변수의 이름을 반환
        -   String toString() : 해당 변수의 정보를 반환



### 2\. reflection 클래스를 잘못 사용한 사례

-   일반적으로 로그를 프린트할 경우, 클래스 이름을 알아내기 위해서 다음과 같이 Class 클래스를 많이 사용함

```java
this.getClass().getName();
```

-   위 코드는 성능에 많은 영향을 미치진 않음. 다만, getClass를 호출하면 Class 객체를 만들고, 그 객체의 이름을 가져오는 메서드를 수행하는 시간과 메모리를 사용할 뿐
-   어떤 개발자들은 다음과 같이 사용하는 경우도 있음

```java
public String checkClass(Object src) {
    if(src.getClass().getName().equals("java.math.BigDecimal") { ... }
}
```

-   위와 같은 코드는 응답 속도에 많은 영향을 주지는 않지만, 많이 사용하면 필요 없는 시간을 낭비하게 됨.
-   차라리 instanceOf를 사용하는 것이 성능이 더 잘 나옴.
-   클래스의 메타 데이터 정보는 JVM의 Perm 영역(JDK 8부터 meta space라고 함)에 저장된다는 사실을 기억하자
-   만약 Class 클래스를 사용하여 엄청나게 많은 클래스를 동적으로 생성하는 일이 벌어지면,  Perm 영역이 더 이상 사용할 수 없게 되어 OOM이 발생할 수도 있으니 조심하자.

## synchronized는 제대로 알고 써야 한다



### 1\. 자바에서 스레드는 어떻게 사용하나

-   프로세스와 스레드
    -   클래스를 하나 수행시키거나 WAS를 기동 하면, 서버에 자바 프로세스가 하나 생성됨
    -   하나의 프로세스에는 여러 개의 스레드가 생성됨
    -   단일 스레드가 생성되어 종료될 수도 있으며, 여러 개의 스레드가 생성되어 수행될 수 있음
    -   즉, 프로세스와 스레드의 관계는 일대다 관계임
    -   스레드는 다른 말로 Lightweight Process(LWP)라고도 함
    -   즉, 가벼운 프로세스이며 프로세스에서 만들어 사용하고 있는 메모리를 공유함
-   Thread 클래스 상속과 Runnable 인터페이스 구현
    -   스레드의 구현은 Thread 클래스를 상속받는 방법, Runnable 인터페이스를 구현하는 두 가지 방법이 있음
    -   사실 Thread 클래스는 Runnable의 구현체라 어느 것을 사용해도 차이가 없음

```java
public class RunnableImpl implements Runnable {

    public void run() {
        System.out.println("This is RunnableImpl.");
    }
}
```

```java
public class threadExtends extends Thread {

    public void run() {
        System.out.println("This is ThreadExtends.");
    }
}
```

-   Thread를 상속받은 경우에는 start를 호출해서 실행하면 되고, Runnable을 구현한 경우에는 Thread 클래스의 Runnable 인터페이스를 매개변수로 받는 생성자를 사용해서 Thread 클래스를 만든 후 start를 호출해야 함(동작 순서는 고정되지 않음)
-   sleep(), wait(), join() 메서드
    -   현재 진행 중인 스레드를 대기하도록 하기 위해서 sleep, wait, join 메서드를 사용할 수 있음
    -   세 가지 메서드는 모두 예외를 던지도록 되어 있어 사용할 때는 반드시 예외 처리를 해주어야 함
    -   wait() 메서드는 모든 클래스의 부모 클래스인 Object 클래스에 선언되어 있으므로 어떤 클래스에서도 사용 가능함
    -   sleep() 메서드는 명시된 시간만큼 해당 스레드를 대기시킴. 이 메서드는 다음과 같이 두 가지 방법으로 매개변수를 지정해서 사용함
        -   sleep(long millis) : ms 만큼 대기
        -   sleep(long millis, int nanos) : ms + 나노 시간(0~999999) 만큼 대기
    -   wait() 메서드도 명시된 시간만큼 해당 스레드를 대기시킴. sleep 과 다른 점은 매개변수인데, 아무런 매개변수를 지정하지 않으면 notify() 메서드 혹은 notifyAll() 메서드가 호출될 때까지 대기함.
    -   join() 메서드는 명시된 시간만큼 해당 스레드가 죽기를 기다림. 만약 아무런 매개변수를 지정하지 않으면 죽을 때까지 계속 대기함.
-   interrupt(), notify(), notifyAll() 메서드
    -   interrupt() 메서드는 wait, join, sleep 모두 멈출 수 있는 유일한 메서드임
    -   interrupt에 의해 중지된 스레드는 InterruptedException 이 발생함
    -   제대로 수행되었는지 확인하기 위해 isInterrupted, interrupted 메서드를 호출하면 됨(interrupted는 메서드의 상태를 변경시키고, isInterrupted는 상태만을 반환함)
    -   isAlive() 메서드는 해당 스레드가 살아있는지 확인하는 메서드임
    -   notify(), notifyAll() 메서드는 모두 wait() 메서드를 멈추기 위해 사용됨. 이 두 메서드는 Object 클래스에 정의되어 있는데, wait() 메서드가 호출된 후 대기 상태로 바뀐 스레드를 깨움
    -   notify() 메서드는 객체의 모니터와 관련있는 단일 스레드를 깨우며, notifyAll() 메서드는 객체의 모니와 관련 있는 모든 스레드를 깨움.

샘플 예제

```java
public class Sleep extends Thread {

    @Override
    public void run() {
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            System.out.println("somebody stopped me T T");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Sleep sleep = new Sleep();
        sleep.start();

        try {
            int cnt = 0;
            while (cnt < 5) {
                sleep.join(1000);
                cnt++;
                System.out.format("%d second waited\n", cnt);
            }
            if (sleep.isAlive()) {
                sleep.interrupt();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```



### 2\. 인터럽트란?

-   스레드에게 하던 것을 멈추고 다른 것을 하라는 지시를 인터럽트라고 함
-   인터럽트된 스레드에서 이를 어떻게 처리해야 한다는 규칙은 없지만, 대부분의 경우 인터럽트는 하던 일을 멈추라는 신호이며, 해당 스레드는 이를 적절히 처리해야 함
-   어떤 스레드를 인터럽트 하고 싶으면 대상 스레드의 Thread.interrupt() 메서드를 호출하면 됨.
-   interrupt state는 대상 스레드가 자신이 인터럽트 되었는지 확인할 수 있는 상태 값
-   isInterrupted(), interrupted() 메서드로 확인 가능함.  후자의 경우 호출하면 interrupt state가 해제됨



### 3.interrupt() 메서드는 절대적인 것이 아니다

-   interrupt() 메서드를 호출하여 특정 메서드를 중지시키려고 할 때 항상 해당 메서드가 멈출까?
    -   현재 스레드가 대상 스레드를 수정할 수 있는 권한이 없다면 **SecurityException**이 발생함
    -   만약 스레드가 Object 클래스의 wait, wait(long), wait(long, int) 혹은 스레드 객체의 join(), join(long), join(long, int), sleep(long), sleep(long, int), 또는 Future.get(), BlockingQueue.take() 등의 메서드에 의해 차단(blocked)된 경우, interrupt state가 클리어되고 **InterruptedException**이 발생함
    -   만약 스레드가 인터럽트 가능한 채널(InterruptibleChannel)을 이용한 I/O 작업에서 차단된 경우,  interrupt state가 설정되고, **ClosedByInterruptException**이 발생함
    -   만약 스레드가 셀렉터에서 차단된 경우, 인터럽트 상태가 설정되고, 셀렉션 작업에서 반환됨
    -   이외의 경우에는 interrupt state가 설정됨
-   즉, interrupt() 메서드는 해당 스레드가 block 되거나, 특정 상태에서만 작동한다는 뜻
-   interrupt() 메서드는 해당 스레드가 대기 상태일 때에만 중단시킴.
-   따라서, block될 수 없는 스레드를 중단시키기 위해서 interrupt를 호출하면 멈추지 않음
-   이를 해결하기 위해 중단 대상 스레드에 sleep을 추가하거나, interrupted, isInterrupted를 사용할 수 있음
-   중요한 것은 interrupt() 메서드를 호출한다고 해당 스레드가 반드시 중단되지 않다는 사실



### 4\. synchronized를 이해하자

-   제대로 알지 못하고 synchronized를 사용하면 성능에 악영향을 미칠 수 있음
-   synchronize 동사 : 동시에 일어나다, 동시에 진행하다.
-   synchronized는 하나의 객체에 여러 객체가 동시에 접근하여 처리하는 상황이 발생할 때 사용함
-   하나의 객체에 여러 요청이 동시에 달려들면 원하는 처리를 하지도 못하고 이상한 결과가 나올 수 있음. 따라서 synchronized를 사용해서 동기화를 수행함
-   synchronized는 메서드, 블록으로 사용 가능하며, 생성자의 식별자로는 사용할 수 없음

```java
public synchronized void sampleMethod() {}

private Object obj = new Object();
public void sampleBlock() {

    synchronized(obj) {

    }
}
```

-   위 예제 처럼, 메서드 선언부에 사용하거나, 특정 부분을 동기화하려면 해당 블록에만 선언해서 사용하면 됨
-   동기화를 사용해야하는 경우는 다음과 같음(아래 경우가 아니면 동기화를 할 필요가 없음!)
    -   하나의 객체를 여러 스레드에서 동시에 사용할 경우
    -   static으로 선언한 객체를 여러 스레드에서 동시에 사용할 경우



### 5\. 동기화는 이렇게 사용한다 - 동일 객체 접근 시

-   여러 기부자(Contrinutor)가 어떤 기부금을 처리하는 단체(Contribution)에 기부금을 내는 상황을 가정해 보라
-   기부자는 스레드로 구현되며, 기부금을 내는 사람의 이름 정보가 있어야 함
-   기부금을 받는 단체는 기부금을 받을 창구로 donate() 메서드를 제공함. 전체 기부금을 확인하는 메서드는 getTotal()
-   응답 시간 및 안정성 비교 :
    -   각각 단체에 기부 동기화 미사용 : 안정성 o, 1.3ms
    -   동일 단체에 기부 동기화 미사용 : 안정성 x, 1.3ms
    -   동일 단체에 기부 동기화 사용 : 안정성 o, 10.1ms
-   별 차이 안나는 것 같지만, 대부분의 프로그램에서 동기화를 부여한 메서드는 그리 간단하지 않음. 위 예시에서 약간의 대기 시간을 주면 성능 저하는 심각해짐. (sleep 1000 주면 동기화 사용 케이스는 16초 소요)
-   동기화는 응답 속도에 영향을 주기 때문에, 꼭 필요한 부분에만 동기화를 사용해야 성능 저하를 줄일 수 있을 것



### 6\. 동기화는 이렇게 사용한다 - static 사용 시

-   static을 사용하는 경우에 동기화를 사용할 수 있음
-   클래스 변수를 동기화하기 위해서 인스턴스 메서드를 synchronized 처리하면 제대로 동작하지 않음
-   synchronized는 각각의 객체에 대한 동기화를 하는 것이기 때문에, 인스턴스 변수에 대한 동기화는 수행되고, 클래스 변수에는 동기화가 동작하지 않음
-   이를 해결하기 위해서 synchronized 메서드를 static으로 선언해야 함
-   중요한 것은. 항상 변하는 값에 대해서 static으로 선언하여 사용하면 굉장히 위험함. synchronized도 필요한 경우에만 사용하도록 할 것.



### 7\. 동기화를 위해서 자바에서 제공하는 것들

-   JDK 5.0부터 추가된 java.utill.concurrent 패키지에는 주요 개념 네 가지가 포함되어 있음
    -   Lock : 실행 중인 스레드를 간단한 방법으로 정지시켰다가 실행시킴. 상호 참조로 인해 발생하는 데드락을 피할 수 있음
    -   Executors : 스레드를 더 효율적으로 관리할 수 있는 클래스들을 제공함. 스레드 풀도 제공하므로, 필요에 따라 유용하게 사용 가능
    -   Concurrent 컬렉션 : 동기화 지원 컬렉션 제공
    -   Atomic 변수 : 동기화되어 있는 변수를 제공함. 이 변수를 사용하면, synchronized 식별자를 메서드에 지정할 필요 없이 사용 가능함.





### 8\. JVM 내에서 synchronization은 어떻게 동작할까?

-   자바의 HotSpot VM은 자바 모니터(monitor)를 제공함으로써 스레드들이 '상호 배제 프로토콜(mutual exclusion protocol)'에 참여할 수 있도록 도움
-   자바 모니터는 잠긴 상태(lock)나 풀림(unlocked) 중 하나이며, 동일한 모니터에 진입한 여러 스레드들 중에서 한 시점에는 단 하나의 스레드만 모니터를 가질 수 있음.
-   즉, 모니터를 가진 스레드만 모니터에 의해서 보호되는 영역에 들어가서 작업할 수 있음. 이때 보호된 영역이란 synchronized 블록을 의미
-   모니터를 보유한 스레드가 보호 영역에서의 작업을 마치면, 모니터는 다른 대기 중인 스레드에게 넘어감
-   JDK 5부터는 -XX:+UseBiasedLocking 옵션을 통해서 biased locking 기능을 제공함
-   이전까지는 대부분의 객체들이 하나의 스레드에 의해 잠기게 되었지만, 이 옵션을 사용하면 스레드가 자기 자신을 향하여 bias 됨.
-   즉, 이 상태가 되면 스레드는 많은 비용이 드는 인스트럭션 재배열 작업을 통해서 잠김과 풀림 작업을 수행할 수 있게 됨.
-   이 작업들은 진보된 적응 스피닝(adaptive spinning) 기술을 사용하여 처리량을 개선시킬 수 있다고 함. (대강 동기화 속도가 빨라졌다는 이야기)
-   HotSpot VM에서 대부분의 동기화 작업은 fast-path 코드 작업을 통해서 진행함.
-   만약 여러 스레드가 경합을 일으키는 상황이 발생하면 이 fast-path 코드는 slow-path 코드 상태로 변환됨. (slow-path 구현은 c++)
-   fast-path 코드는 JIT 컴파일러에서 제공하는 장비에 의존적인 코드로 작성되어 있음

## IO에서 발생하는 병목 현상



### 1\. 기본적인 IO는 이렇게 처리한다

-   자바에서 입력과 출력은 **스트림(stream)**을 통해서 이루어 짐
-   일반적으로 IO라고 하면, 파일 IO만을 의미하는 것이 아닌 **어떤 디바이스를 통해 이뤄지는 작업을 모두 IO라고 함**
-   네트워크를 통해서 다른 서버로 데이터를 전송하거나, 다른 서버로부터 데이터를 전송받는 것도 IO에 포함됨.
-   뿐만 아니라, System.out.println으로 콘솔에 출력하는 것도 스트림을 이용해 출력하는 것
-   System.out : System 클래스의 static 변수로 PrintStream을 정의해 놓음
-   IO에서 발생하는 시간은 대기 시간에 속하기 때문에 가장 성능에 영향을 많이 미침
-   스트림을 읽은 데 관련된 java.io 소속 주요 스트림 클래스는 다음과 같음(출력은 Input -> Output으로 바꾸면 끝)
    -   아래 스트림들은 모두 java.io.InputStream을 상속받음
    -   ByteArrayInputStream : 바이트로 구성된 배열을 읽어서 입력 스트림을 만듦
    -   FileInputStream : 이미지와 같은 바이너리 기반의 파일의 스트림을 만듦
    -   FilterInputStream : 여러 종류의 유용한 입력 스트림의 추상화 클래스
    -   ObjectInputStream : PipedOutputStream을 통해서 출력된 스트림을 읽어서 처리하기 위한 스트림을 만듦
    -   SequenceInputStream : 별개인 두 개의 스트림을 하나의 스트림으로 만듦
-   문자열 기반의 스트림을 읽기 위해서 사용하는 클래스는 이와 다르게 java.io.Reader 클래스의 하위 클래스들임
    -   BufferedReader : 문자열 입력 스트림을 버퍼에 담아서 처리함. 일반적으로 문자열 기반의 파일을 읽을 때 가장 많이 사용됨
    -   CharArrayReader : char의 배열로 된 문자 배열을 처리함
    -   FilterReader : 문자열 기반의 스트림을 처리하기 위한 추상 클래스
    -   FileReader : 문자열 기반의 파일을 읽기 위한 클래스
    -   InputStreamReader : 바이트 기반의 스트림을 문자열 기반의 스트림으로 연결하는 역할을 수행
    -   PipedReader : 파이프 스트림을 읽음
    -   StringReader : 문자열 기반의 소스를 읽음
-   바이트 단위로 읽거나, 문자열 단위로 읽을 때 중요한 것은 한 번 연(open한) 스트림은 반드시 닫아 주어야 한다는 것
-   스트림을 닫지 않으면 나중에 리소스가 부족해질 수 있음
-   문자열 기반의 파일 읽기 응답 속도 비교 : 
    -   버퍼 없이 FileReader 사용 : 2480ms
    -   버퍼 포함 FileReader 사용 : 400ms
    -   BufferedReader 사용 : 350ms



### 2\. IO에서 병목이 발생한 사례

-   다음은 사용자의 요청이 발생할 때마다 매번 파일을 읽는 시스템의 코드

```java
String configUrl;
public Vector getRoute(String type) {
    if(configUrl == null) {
        configUrl = this.getClass().getResource("/xxx/config.xml");
    }

    obj = new DaoUtility(configUrl, "1");
    ...
}
```

-   하나의 경로를 가져오기 위해서 매번 configUrl을  DaoUtility에 넘겨줌.
-   DaoUtility는 매 요청마다 config.xml 을 읽고 파싱하여 관련 DB 쿼리 데이터를 읽음.(엄청난 IO로 인한 응답 시간 악영향)
-   많은 프로젝트의 웹 애플리케이션에서 생각보다 많은 IO 작업이 수행됨. 최근에는 특히 DB 쿼리나 여러 종류의 설정을 파일에 저장하고 사용하는 경우가 많음
-   다른 예시로 쿼리 관련 메서드가 호출될 때마다 설정 파일이 수정되었는지 확인하고, 다시 읽는 메서드를 생각해볼 수 있음.  
    -   위 상황은 데몬 스레드를 만들어 5분이나 10분마다 확인하도록 풀어낼 수 있음



### 3\. 그럼 NIO의 원리는 어떻게 되는 거지?

-   JDK 1.4부터 NIO(New Input Output)이 추가됨
-   이를 알아보기 이전에 운영체제에서 IO 작업이 어떻게 수행되는지 알아보자.
-   상황 : 자바를 사용해 하드 디스크에 있는 데이터를 읽는 과정
-   흐름 :
    1.  파일을 읽으라는 메서드를 자바에 전달
    2.  파일명을 전달받은 메서드가 운영체제의 커널에게 파일을 읽어 달라고 요청
    3.  커널이 하드 디스크로부터 파일을 읽어서 자신의 커널에 있는 버퍼에 복사하는 작업을 수행(DMA에서 이 작업을 하게 됨)
    4.  자바에서는 마음대로 커널의 버퍼를 사용하지 못하므로, JVM으로 그 데이터를 전달함
    5.  JVM에서 메서드에 있는 스트림 관리 클래스를 사용해 데이터를 처리함
-   자바에서 3번 복사 작업을 할때, 4번 전달 작업을 수행할 때 대기 시간이 발생함. 이러한 단점을 보완하기 위해 NIO가 등장함
-   3번 작업을 자바에서 직접 통제하여 시간을 단축할 수 있도록 함
-   NIO를 사용한다고 모든 IO 병목을 잡을 수 있는 것은 아님. NIO에서는 IO를 위한 여러 가지 새로운 개념이 도입됨!
    -   버퍼 도입
    -   채널 도입
    -   문자열 인코더, 디코더 제공
    -   Perl 스타일의 정규 표현식에 기초한 패턴 매칭 방법 제공
    -   파일을 잠그거나 메모리 매핑이 가능한 파일 인터페이스 제공
    -   서버를 위한 복합적인 Non-blocking IO 제공



### 4\. DirectByteBuffer를 잘못 사용하여 문제가 발생한 사례

-   NIO를 사용할 때 ByteBuffer를 사용하는 경우가 있음
-   ByteBuffer는 네트워크나 파일에 있는 데이터를 읽어 들일 때 사용함. 
-   ByteBuffer 객체를 생성하기 위해서는 wrap(), allocate(), allocateDirect()를 사용 가능함
-   이 중 allocateDirect() 메서드는 데이터를 자바 JVM에 올려서 사용하는 것이 아닌, OS 메모리에 할당된 메모리를 Native한 JNI(Java Native Interface)로 처리하는 DirectByteBuffer 객체를 생성함
-   **하지만 이 DirectByteBuffer 객체는 필요할 때 계속 생성하면 안됨!**
    -   책에 나온 예제 기준, jstat으로 GC 상황을 모니터링해 보면 5-10초에 한 번씩 Full GC 발생
    -   하지만 Old 영역 메모리는 증가하지 않음
    -   이유는 DirectByteBuffer의 생성자 때문임!
        -   해당 생성자는 java.nio에 아무런 접근 제어자가 없이 선언된 Bits라는 클래스의 reserveMemory() 메서드를 호출함
        -   reserveMemotry() 메서드에서는 JVM에서 할당되어 있는 메모리보다 더 많은 메모리를 요구할 경우 System.gc() 메서드를 호출하도록 되어 있음

-   따라서 생성자가 무차별적으로 생성될 경우 GC가 자주 발생하고 성능에 영향을 줌.
-   가능하다면, singleton 패턴을 사용해 해당 JVM에는 하나의 객체만 생성하도록 하는 것을 권장함



### 5\. lastModified() 메서드의 성능 저하

-   JDK 6까지는 자바에서 파일이 변경되었는지를 확인하기 위해서 File 클래스의 lastModified() 메서드를 사용해 왔음
-   해당 메서드는 최종 수정된 시간을 밀리초 단위로 제공함
-   lastModified() 메서드는 처리 절차가 복잡함
    -   System.getSecurityManager() 메서드를 호출해 SecurityManager 객체를 받아옴
    -   만약 null이 아니라면 SecurityManager 객체의 checkRead() 메서드 수행
    -   File 클래스 내부에 있는 FileSystem이라는 클래스의 객체에서 getLastModifiedTime() 메서드를 수행해서 결과 반환
-   단일 실행에서는 성능 저하가 없지만, 반복하는 형태의 서비스를 제공한다면 이야기가 달라짐
-   대신 JDK 7 이상이라면 NIO2 Watch 관련 클래스와 스레드를 잘 활용하면 파일을 쉽게 모니터링할 수 있음!
-   **결론) 필요에 따른 정확한 API를 사용하는 것도 중요하지만, 필요 없이 반복적으로 파일을 읽거나 쓰도록 되어 있지 않은지도 확인해 보자!**

## 로그는 반드시 필요한 내용만 찍자



### 1\. System.out.println()의 문제점

-   **시스템 로그(System.out.println)**를 사용하는 사이트의 각 튜닝 별 개선율 비교 : 
-   **개선율(%) = (튜닝 전 응답 속도 - 튜닝 후 응답 속도) \* 100 / 튜닝 후 응답 속도** 
    -   변경 1(로거를 사용하면서 로그 사용 여부를 false로 설정) : **39%**
    -   변경 2(로그를 주석 처리하고, System.out.println()을 제거) : **146%**
-   시스템 로그를 프린트하면 반드시 성능에 영향을 주게 됨
-   왜 이러한 결과가 발생하는가?
    -   내용이 완전히 프린트되거나 저장될 때까지, 뒤에 프린트하려는 부분은 대기해야 함
    -   특히 콘솔에 로그를 남길 경우에 그러함. 이때 애플리케이션에서 대기 시간이 발생하게 됨
    -   해당 대기 시간은 시스템의 속도에 의존적. 만약 디스크에 로그를 남긴다면, 서버 디스크의 RPM이 높을수록 로그의 처리 속도는 빨라질 것임
-    더더욱 큰 문제는 System.out.println으로 출력하는 로그가 개발할 때만 사용된다는 것.
    -   운영할 때는 전혀 사용되지 않고, 볼 수도 없는 디버그용 로그를 운영 서버에서 고스란히 처리하고 있는 셈
    -   의미 없는 디버그용 로그를 프린트하기 위해서 아까운 서버의 리소스와 디스크가 낭비된다는 뜻
    -   많은 서비스들이 통계성 데이터를 로그에 쌓고 처리하려고 하는데, System.out.println으로 로그를 쌓는 것은 적절하지 않음
    -   이러한 데이터는 오픈소스 저장소에 담고, 필요할 때 가져가도록 할 수 있음



### 2\. System.out.format() 메서드

-   JDK 5부터 System 클래스에서 사용하는 out 객체 클래스인 PrintStream에 format 메서드가 추가됨
-   두 가지 방식으로 사용 가능(단 줄 바꿈 미포함)
    -   format(String format, Object &#46;&#46;&#46;args) : 지정된 포맷으로 프린트함. 뒤에 있는 매개변수를 쉼표로 나열하도록 되어 있음
    -   format(Locale I, String format, Object &#46;&#46;&#46;args) : 위 메서드와 동일하지만, 가장 앞에 지역 정보를 포함함. 지역에 따라 다른 형태의 데이터를 프린트 가능
-   타입의 데이터를 표시하는 방법(%f, %d..)는 java.util.Formatter 클래스 설명 확인
-   String add와 Format 방식의 응답 속도 비교 : StringAdd > Format
-   Format이 느린 이유 :
    -   역 컴파일해 보면, StringAdd는 StringBuilder를 사용함. 반면, Format 방식은 새로운 Object 배열을 생성하여 그 값을 배열에 포함시키도록 함.(long 값을 Object를 나타내기 위해 Long 클래스 valueOf도 호출)
    -   뿐만 아니라 Formatter 클래스에는 %를 파싱해야 해서 빠를 수가 없음
-   단순 디버그용이라면 가독성이 좋은 format 메서드 사용을 권장하지만, 운영 시에는 디버그용 로그를 제거해야 함!



### 3\. 로그를 더 간결하게 처리하는 방법

-   디버그용 로그가 꼭 필요할 경우, 가장 좋은 방법은 **로거(Logger)**를 사용해서 로그를 처리하는 것
-   로거를 사용하기 힘들다면&#46;&#46;&#46; 두 가지 방법이 존재
    -   ~~자체 로거 클래스를 만드는 방법~~(이미 만들어져 있는 로거를 사용하는 것이 효율적..)
    -   시스템 로그를 컴파일할 때 삭제되도록 하는 방법
-   어떻게 하면 컴파일할 때 시스템 로그가 삭제될 수 있을까?
    -   flag 클래스 변수를 모든 클래스에 선언할 수 있음. 역 컴파일해 보면 사용되지 않는 코드라면 코드가 만들어지지도 않음. 다만, 모든 코드를 쫓아다니면서 flag 값을 관리해줘야 함
    -   flag 관리 클래스를 하나 선언하면 일괄 변경이 가능함. 여기서 더욱 보완하자면 SimpleLogger 클래스를 만들어서 사용할 수 있음. 
    -   하지만, flag를 수정하기 위해서 다시 컴파일해야 한다는 점과 SimpleLogger.log 메서드 요청을 하기 위해서 메시지 문자열을 생성해야 한다는 것이 단점임



### 4\. 로거 사용 시의 문제점

-   컴파일 시에 로그를 제거하는 방법을 사용하지 않는 한, 로그를 프린트 하든 하지 않든, 로그를 삭제하기 위한 한 줄을 처리하기 위해서는 어차피 객체를 생성해야 함
-   즉, 운영 시 로그 레벨을 올려놓는다고 해도, 디버그용 로그 메시지는 간단한 문자든 간단한 쿼리든 상관없이 하나 이상의 객체가 필요함
-   또한 메모리에서 제거하기 위해서는 GC를 수행해야 하고, GC 시간이 소요됨
-   예를 들면 아래와 같은 코드임

```java
logger.info("query=" + query);
```

-   결국 info 메서드는 호출될 것이고, 문자열이 전달되어야 하기 때문에 괄호 안에 있는 값들을 문자열로 변환하는 작업이 수행됨..
-   쿼리가 한 두줄이라면 상관없겠지만, 일반적으로는 그렇지 않은 것이 현실
-   따라서 가장 좋은 방법은 디버그용 로그를 제거하는 것. (쉽지 않은 것이 현실)
    -   대안으로 logger.isLoggable를 이용해서 로그를 처리하는 방법이 있음
    -   if 문장으로 처리하면 로그를 위한 불필요한 메모리 사용을 줄일 수 있어, 효율적으로 메시지 처리 가능
    -   로그를 처리하는 데 발생할 수 있는 문제점을 해결하는 데 도움을 주는 slf4j 로거도 있음!



### 5\. 로그를 깔끔하게 처리해주는 slf4j와 LogBack

-   Simple Logging Facade For Java(slf4j)

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Wombat {

    final Logger logger = LoggerFactory.getLogger(Wombat.class);
    Integer t;
    Integer oldT;

    public void setTemperature(Integer temperature) {
        oldT = t;
        t = temperature;

        logger.debug("temperature set to {}. old temperature was {}.", t, oldT);
        ...
    }
}
```

-   slf4j의 logger.debug는 format 문자열에 중괄호를 넣고, 순서대로 출력하고자 하는 데이터들을 콤마로 구분해 전달함. 이렇게 전달해 주면 로그를 출력하지 않을 경우 필요 없는 문자열 더하기 연산이 발생하지 않음
-   slf4j는 자바의 기본 로거를 비롯해 Log4j, 아파치 commons 로깅 등과 연계해 사용할 수 있도록 되어 있음
-   추가로 최근에는 LogBack이라는 로거도 많이 사용되고 있음. LogBack은 예외의 스택 정보를 출력할 때 해당 클래스가 어떤 라이브러리(jar)를 참고하고 있는지도 포함하여 제공하기 때문에 쉽게 관련 클래스를 확인할 수 있음



### 6\. 예외 처리는 이렇게

-   catch 절에서 e.printStackTrace를 호출하면?
    -   예외가 발생하면 Exception 클래스에 기본 정보가 전달
    -   이때 스택 정보를 찾아보지 않지만(스택 정보란 어떤 클래스의 어떤 메서드가 어떤 클래스의 어떤 메서드를 호출했는지에 대한 관계를 나타내는 정보를 의미)
    -   e.printStackTrace를 호출하면 스택 정보를 확인하고, 프린트함
        -   알아먹기가 힘듦. (여러 스레드에서 콘솔에 로그를 프린트하면 데이터가 섞이기 때문)
        -   최대 100개까지 프린트하기 때문에 서버의 성능에 부하를 줌
        -   이때 스택 정보를 가져오는 부분에서 90% CPU 사용 시간 + 프린트 대기 시간 소요
-   그래도 printStackTrace에서 출력해주는 데이터가 필요한 경우가 있음..  
    -   getStackTrace로 필요한 정보만 추출해서 logger로 출력할 수 있음
    -   다른 방법으로는 임의로 만든 예외 클래스에서 원하는 스택 정보를 가공해 메시지를 처리할 수도 있음
-   **결론 ) 더 깔끔한 소스와 로그를 원한다면, 필요 없는 로그들은 소스에서 지우고, 반드시 Log4j, slf4j, LogBack과 같은 로거를 사용하라. 또한 예외 처리 시에는 필요한 내용만 처리하자.**

## JSP와 서블릿, Spring에서 발생할 수 있는 여러 문제점(1) - Servlet, JSP 파트



### 1\. JSP와 Servlet의 기본적인 동작 원리는 꼭 알아야 한다

-   일반적으로 JSP와 같은 웹 화면단을 처리하는 부분에서 소요 시간은 많지 않음
-   JSP의 경우 가장 처음에 호출되는 경우에만 시간이 소요되고, 그 이후의 시간에는 컴파일된 서블릿 클래스가 수행되기 때문
-   **JSP의 라이프 사이클**은 다음과 같음
    1.  JSP URL 호출
    2.  페이지 번역
    3.  JSP 페이지 컴파일
    4.  클래스 로드
    5.  인스턴스 생성
    6.  jspInit 메서드 호출
    7.  \_jspService 메서드 호출
    8.  jspDestroy 메서드 호출
-   이때, JSP 페이지가 이미 컴파일되어 있고, 클래스가 로드되어 있고, JSP 파일이 변경되지 않았다면, 2번 ~ 4번 프로세스는 생략됨
-   서버의 종류에 따라서 서버가 기동될 때 컴파일을 미리 수행하는 **pre-compile 옵션**이 있는데, 해당 옵션을 선택하면 서버에 최신 버전을 반영한 이후에 처음 호출되었을 때 응답 시간이 느린 현상을 방지할 수 있음. 단, 개발 시에 해당 옵션을 켜 놓으면 서버를 기동 할 때마다 컴파일을 수행하기 때문에 시간이 오래 걸림

> JSP는 페이지가 로딩될 경우, 컴파일이 수행됨. 이 시점에서 JSP의 유효성을 알 수 있으며 무중단 배포를 사용할 경우, CPU Load(CPU에 실행중이거나 대기 중인 작업의 개수의 평균값)가 집중되어 서버에 부하를 주기 때문에 안정적인 서비스를 하기 어렵게 만듦. 따라서 load를 미리 줄여주기 위해 JSP pre-compile을 수행한 뒤에 배포하는 것을 권장함  
>   
> 출처 : https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=njin0528&logNo=220230340032

-   **서블릿의 라이프 사이클**은 어떻게 될까? WAS의 JVM이 시작한 후에 흐름은 다음과 같음 

![](/java-performance-tuning/127-01.png)

*서블릿의 라이프 사이클*

-   Servlet 객체가 자동으로 생성되고 초기화 되거나,
-   사용자가 해당 Servlet을 처음으로 호출했을 때, 생성되고 초기화됨
-   이후, 사용 가능 상태로 대기함(중간에 예외가 발생하면 사용 불가능 상태로 빠졌다가 다시 사용 가능 상태로 변환되기도 함!)
-   이후, 해당 서블릿이 더 이상 필요 없을 경우, 파기 상태로 넘어간 이후 JVM에서 제거됨
-   **기억해야 할 점은 서블릿은 JVM에서 여러 객체로 생성되지 않는다는 점!**
    -   즉, 메서드 내에 선언한 지역 변수가 아닌 멤버 변수를 선언해 service() 메서드에서 사용하면 여러 스레드에서 접근하면서 계속 값이 바뀔 수도 있음(static을 사용하는 것과 동일한 결과를 만들어냄)
    -   따라서, service() 메서드를 구현할 경우, 멤버 변수 혹은 static 한 클래스 변수를 선언해 지속적으로 변경하는 작업은 피해야 함



### 2\. 적절한 include 사용하기

-   JSP의 include 기능을 사용하면, 하나의 JSP에서 다른 JSP를 호출해 여러 JSP 파일을 혼합해 하나의 JSP로 만들 수 있음
-   JSP에서 사용 가능한 include 방식은 두 가지 방식이 있음
    -   정적인 방식(include directive) : &lt;%@ include file="관련 URL""%&gt;
    -   동적인 방식(include action) : &lt;jsp:include page="relativeURL"/&gt;
-   정적인 방식은 JSP의 라이프 사이클 중 JSP 페이지 번역 및 컴파일 단계에서 필요한 JSP를 읽어서 메인 JSP의 자바 소스 및 클래스에 포함을 시키는 방식
-   동적인 방식은 페이지가 호출될 때마다 지정된 페이지를 불러들여서 수행하도록 되어 있음
-   응답 속도 비교 : 정적인 방식 > 동적인 방식(30배 느림)
-   단, 정적인 방식을 사용하면 메인 JSP와 추가된 JSP에 동일한 이름의 변수가 존재하면 심각한 오류가 발생할 수 있으니, 상황에 맞게 알맞은 incldue 방식을 사용할 것



### 3\. 자바 빈즈, 잘 쓰면 약 못 쓰면 독

-   자바 빈즈(Java Beans)는 UI에서 서버 측 데이터를 담아서 처리하기 위한 컴포넌트
-   자바 빈즈의 문제점
    -   자바 빈즈를 통해 useBean을 하면 성능에 많은 영향을 미치지는 않지만, 너무 많이 사용하면 JSP에서 소요되는 시간이 증가될 수 있음
    -   한두 개의 자바 빈즈를 사용하는 것은 상관없지만, 10-20개의 자바 빈즈를 사용하면 성능에 영향을 주기 때문에, TO를 만들어서 사용하는 것을 권장(TO를 사용하면 소요 시간을 절약할 수 있음)



### 4\. 태그 라이브러리도 잘 써야 한다

-   **태그 라이브러리(Tag library)**는 JSP에서 공통적으로 반복되는 코드를 클래스로 만들고, 그 클래스를 HTML 태그와 같이 정의된 태그로 사용할 수 있도록 하는 라이브러리.
-   태그 라이브러리는 XML 기반의 TLD(tag library discriptor) 파일과 태그 클래스로 구성되어 있음

```html
<!-- WEB-INF/web.xml -->
<web-app>
<taglib>
<taglib-uri>/tagLibURI</taglib-uri>
<taglib-location>
/WEB-INF/tlds/tagLib.tld
</taglib-location
<taglib>
</web-app>


<!-- WEB-INF/tlds/tagLib.tld -->
<?xml version="1.0" encoding="ISO-8859-1"?>
<taglib
    xmlns="..."
    xmlns:xsi="..."
    xsi:schemaLocation="..."
    version="2.1">

<tliversion>1.0</tliversion>
<jspversion>1.1</jspversion>
<shortname>tagLibSample</shortname>
<uri/>
<tag>
<name>tagLibSample</name>
<tagclass>com.perf.jsp.TagLibSample</tagclass>
<bodycontent>JSP</bodycontents>
</tag>
</taglib>
```

-   위 파일에서 중요한 부분은 tag 태그 하위 태그에 있는 내용. 이곳에서 태그 라이브러리의 이름, 클래스를 지정함
-   태그 안에 포함되는 내용의 종류는 bodycontent 태그 안에 지정해 허용함
-   JSP 내부에서 사용하는 방법은 다음과 같음

```html
<%@ taglib uri="/tagLibURI" prefix="myPreFix""/>

<myPrefix:tagLibSample>
<%=contents%>
</myPrefix:tagLibSample>
```



#### 태그 라이브러리의 문제점

-   태그 라이브러리 클래스를 잘못 작성하거나, 라이브러리 클래스로 전송되는 데이터가 많을 경우 성능에 문제가 됨
-   태그 라이브러리는 태그 사이에 있는 데이터를 넘겨주어야 하는데, 이때 넘겨주는 데이터 형태는 대부분 문자열 타입. 따라서 데이터가 많으면 많을수록 처리를 해야 하는 내용이 많아지고, 자연스럽게 태그 라이브러리 클래스에서 처리되는 시간이 많아짐.
-   목록을 처리하면서 대용량의 데이터를 처리할 경우에는 태그 라이브러리의 사용을 자제하는 것을 권장

## JSP와 서블릿, Spring에서 발생할 수 있는 여러 문제점(2) - Spring 파트



### 1\. 스프링 프레임워크 간단 정리

-   스프링 프레임워크는 데스크톱, 웹 애플리케이션, 작고 간단한 애플리케이션부터 여러 서버와 연동해 동작해야 하는 엔터프라이즈 애플리케이션을 위한 범용적인 애플리케이션 프레임워크
-   스프링의 가장 큰 특징은 복잡한 애플리케이션도 POJO(Plain Old Java Object)로 개발할 수 있다는 점(JSP와 Servlet은 POJO가 아님)
-   Servlet을 개발하려면 반드시 HttpServlet이라는 클래스를 상속해야 하는데, 스프링을 사용하면 HttpServlet을 확장하지 않아도 웹 요청을 처리할 수 있는 클래스를 만들 수 있음
-   이외에도 JMS, JMX, Mail, Web Service 등 여러 가지 기능을 POJO 기반으로 사용할 수 있기 때문에, 개발자가 보다 쉽게 자신이 작성한 코드를 테스트할 수 있음



#### 스프링의 핵심 기술

![](/java-performance-tuning/130-01.png)

*Spring Triangle*

-   스프링의 핵심 기술은 의존성 주입(Dependency Injection), 관점 지향 프로그래밍(Aspect Oriented Programming), PSA(Portable Service Abstraction)
-   **의존성 주입**은 객체 간의 의존 관계를 정리하는 기술
    -   객체는 보통 혼자서 모든 일을 처리 하지 않고, 여러 다른 객체와 협업하는데, 이때 자신과 협업하는 객체와 자신과의 의존성을 가능한 낮춰야 유리한 경우가 많음
    -   스프링은 의존성을 쉽게 주입하는 방법을 제공하며 생성자, 세터, 필드 주입 등 다양한 의존성 주입 방법을 제공하고 있음
-   **관점 지향 프로그래밍**은 OOP를 보다 더 OOP스럽게 보완해 줄 수 있음
    -   트랜잭션, 로깅, 보안 체크 코드는 여러 모듈, 여러 계층에 스며들기 마련
    -   필요한 작업이긴 하지만, 중복 코드가 생기고, 코드 가독성이 저하됨
    -   AOP는 이러한 코드를 실제 비즈니스 로직과 분리할 수 있도록 도와줌
    -   자바에서 유명한 AOP 프레임워크로는 AspectJ가 있으며 스프링은 AspectJ를 더욱 쉽게 사용할 수 있도록 스프링 AOP를 제공함
-   **PSA**의 핵심은 추상화를 이용해 다른 기술로 변경할 때 어려움이 없다는 것(기술 특화되지 않은 코드, 확장성, 잘 만든 인터페이스)
    -   스프링은 비슷한 기술을 모두 아우를 수 있는 추상화 계층을 제공하여, 사용하는 기술이 바뀌더라도 비즈니스 로직의 변화가 없도록 도와줌.



### 2\. 스프링 프레임워크를 사용하면서 발생할 수 있는 문제점들

-   스프링 프레임워크를 사용할 때 성능 문제가 가장 많이 발생하는 부분은 '프록시(proxy)'와 관련되어 있음.
-   스프링 프록시는 기본적으로 실행 시에 생성됨. 따라서 개발할 때 적은 요청을 할 때는 이상이 없다가, 요청량이 많은 운영 상황으로 넘어가면 문제가 될 수 있음
-   스프링이 프록시를 사용하게 하는 주요 기능은 트랜잭션
    -   @Transactional 애노테이션을 사용하면 해당 애노테이션을 사용한 클래스의 인스턴스를 처음 만들 때 프록시 객체를 만듦
-   이외에도 개발자가 직접 스프링 AOP를 사용해서 별도의 기능을 추가하는 경우에도 프록시를 사용하는데, 이때 문제가 많이 발생함
-   개발자가 직접 작성한 AOP 코드는 예상하지 못한 성능 문제를 보일 가능성이 매우 높음(간단한 부하 툴을 사용해서라도 성능 테스트 수행해야 함!)
-   스프링이 내부 매커니즘에서 사용하는 캐시도 조심해서 사용해야 함

```java
@RequestMapping("/member/{id}")
public String hello(@PathVariable int id) {
    return "redirect:/member/" + id;
}
```

-   스프링 MVC에서 작성하는 메서드의 리턴 타입으로 문자열을 사용할 수 있음
-   이때, 스프링은 해당 문자열에 해당하는 실제 뷰 객체를 찾는 메커니즘을 사용하는데, 매번 동일한 문자열에 대한 뷰 객체를 새로 찾기보다는 이미 찾아본 뷰 객체를 캐싱해 두면 다음에 더욱 빠르게 뷰 객체를 찾을 수 있음
-   ViewResolver 중에서 InternalResourceViewResolver에서 이러한 캐싱 기능을 제공함
-   캐시 값이 많이 생길 여지가 있다면(매번 다른 문자열이 생기는 경우), 뷰 이름을 문자열로 반환하기보다 뷰 객체 자체를 반환하는 방법이 메모리 릭을 방지하는 데 도움이 됨



## DB를 사용하면서 발생 가능한 문제점들



### 1\. DB Connnection과 Connection Pool, DataSource

-   JDBC 관련 API는 클래스가 아닌 인터페이스
-   JDK의 API에 있는 java.sql 인터페이스를 각 DB 벤더에서 상황에 맞게 구현함. 따라서, 같은 인터페이스여도 벤더마다 처리 속도와 내부 처리 방식이 상이함
-   **일반적으로 DB 연결 방식은 다음과 같음**  
    -   드라이버를 로드함 : Class.forName("oracle.jdbc.driver.OracleDriver)
    -   DB 서버의 IP와 ID, PW 등을 DriverManager 클래스의 getConnection 메서드를 사용해 Connection 객체로 만듦
    -   Connection으로부터 PreparedStatement 객체를 받음
    -   PreparedStatement.executeQuery를 수행해 그 결과로 ResultSet 객체를 받아서 데이터를 처리함
    -   모든 데이터를 처리한 이후에는 finally 구문안에서 ResultSet, PreparedStatement, Connection 객체를 close함(close 과정에서 예외가 발생할 수 있음)
-   **JDBC 관련 클래스에 대해서 기본 개념과 유념해야 할 부분**
    -   쿼리를 날리는 작업 중, **Connection 객체를 얻는 부분의 소요 시간이 가장 느림**
        -   why? 같은 장비에 DB가 구성되어 있다고 해도, DB와 WAS 사이에 통신을 해야 하기 때문
        -   다른 장비에 있다면 통신 시간이 더 소요됨
        -   사용자가 갑자기 증가하면 Connection 객체를 얻기 위한 시간이 엄청나게 소요될 것
    -   Connection 객체 생성 부분에서 발생하는 대기 시간을 줄이고, 네트워크의 부담을 줄이기 위해서 사용하는 것이 **DB 커넥션 풀**!
    -   초반에 JSP, 서블릿 기술이 나오면서 Connection Pool에 대한 소스 코드들이 안정적이지 않았나 봄!
    -   하지만 최근에는 모든 WAS에서 Connection Pool을 제공하고, DataSource를 사용해 JNDI로 호출해 사용 가능하기 때문에 문제가 많이 줄어듦!
    -   가능하다면 안정되고 검증된 WAS에서 제공하는 DB Connection Pool이나 DataSource를 사용할 것을 권장
-   **DataSource와 DB Connection Pool의 차이점**
    -   DataSource는 JDK 1.4부터 생긴 표준
    -   Connection Pool로 연결을 관리해야 하고, 트랜잭션 관리도 가능하도록 해야 함.
    -   따라서 DataSource가 DB Connection Pool을 포함한다고 생각해도 무방
    -   유의할 점은 DB Connection Pool은 자바 표준으로 지정되어 있다는 것이 없음
    -   즉, WAS 벤더 별로 사용법이 많이 상이함
    -   하지만, DataSource는 자바 표준이므로 WAS에 상관없이 사용법은 동일함
-   **Statement(인터페이스) vs PreparedStatement(자식 클래스)**
    -   이 둘의 가장 큰 차이점은 **캐시(cache) 사용 여부**!
    -   이 둘을 처음 사용할 때는 다음과 같은 과정을 거침(쿼리 문장 분석 -> 컴파일 -> 실행)
    -   **Statement** : 매번 쿼리를 수행할 때마다 1~3 단계를 수행
    -   **PreparedStatement** : 처음 한 번만 세 단계를 거친 이후 캐시에 담아서 재사용함
    -   **결론** :
        -   동일한 쿼리를 반복적으로 수행한다면 PreparedStatement가 DB에 훨씬 적은 부하를 주고, 성능도 좋음
        -   쿼리에서 변수를 " 대신 ?로 처리하기 때문에 가독성도 좋아짐!
-   **Statement의 쿼리 수행 메서드**
    -   executeQuery() : select 관련 쿼리로 결과로 ResultSet 객체가 전달됨
    -   executeUpate() : select를 제외한 DML(insert, update, delete) 및 DDL(create table, create view) 쿼리를 수행하며 결과로 int가 반환됨
    -   execute() : 쿼리의 종류와 상관없이 수행하는데, boolean을 반환함
        -   결과가 true인 경우 : getResultSet()으로 결과를 받아 올 수 있음
        -   결과가 false인 경우 : getUpdateCount()로 변경된 행의 수를 알 수 있음
-   **쿼리의 수행 결과를 담는 ResultSet 인터페이스**
    -   여러 건의 데이터가 넘어오기 때문에 next 메서드를 사용해 데이터의 커서를 다음으로 옮기면서 처리 가능함
    -   first() : 가장 첫 커서로 이동
    -   last() : 가장 마지막 커서로 이동
    -   getXXX(Int, Float, Long, Blob) : get으로 시작하는 메서드로 데이터를 읽어올 수 있음
    -   ResultSet 객체는 데이터를 갖고 있지 않으며, 커서만을 관리하는 객체임(벤더마다 다를 수 있음!)



### 2\. DB를 사용할 때 닫아야 하는 것들

-   **C**onn, **S**tmt, **R**s는 닫아야 하는데, 객체를 얻는 순서는 C -> S -> R 순이고, 닫는 순서는 R -> S -> C 순
-   우선 ResultSet(Rs)가 닫히는 경우는 다음과 같음
    -   close() 메서드를 호출하는 경우
    -   GC의 대상이 되어 GC 되는 경우
    -   연관 Statement 객체의 close() 메서드가 호출되는 경우  
        -   엥? 근데 왜 Rs 먼저 닫아야 하는가?
            -   자동으로 호출되기 전에 관련된 DB와 JDBC 리소스를 해제하기 위함
            -   0.00001초라도 빨리 닫으면, 그만큼 해당 DB 서버의 부담이 적어지게 됨
-   Statement(Stmt)가 닫히는 경우도 비슷
    -   close 메서드를 호출하는 경우
    -   GC 대상이 되어 GC 되는 경우
    -   단, Connection이 닫혀도 자동으로 닫히지 않으니 꼭 close 할 것
-   **Connection이 닫히는 경우(가장 중요)**
    -   close 메서드를 호출하는 경우
    -   GC의 대상이 되어 GC 되는 경우
    -   치명적인 에러가 발생하는 경우
    -   CP는 시스템이 기동 되면 지정된 개수만큼 Connection을 연결하고, 필요할 때 증가시키도록 되어 있음
    -   증가되는 최대 값 또한 지정하도록 되어 있으며, 사용자가 증가해 더 이상 사용 가능한 연결이 없으면 여유가 생길 때까지 대기함
    -   그러다가 어느 정도 시간이 지나면 오류를 발생함.
    -   **즉, close 메서드를 호출해 연결을 닫아야 함! GC가 될 때까지 기다리면 CP가 금방 말라버림!**
-   **close 나쁜 사례!**
    -   null로 치환해서 stmt, conn, rs를 GC 대상으로 만들 수는 있지만, 언제 GC 될지 모름! -> CP 고갈 ㅠㅠ
    -   try 내부에서 close 시도 -> 예외가 발생하면 close 호출이 안될 것임!
    -   conn만을 위한 try-catch를 별도로 구성하는 케이스 -> 쿼리를 수행하는 부분에서 오류가 발생하면&#46;&#46;&#46; conn이 닫히지 않을 수 있음
-   가장 좋은 방법은 아닐지도 모르지만, 가장 정상적인 방법은 쿼리 실행에 대한 try-catch-finally 중 finally 내부에서 각각 close 마다 try-catch를 해줌
-   가장 좋은 방법은 DB와 관련된 처리를 담당하는 관리 클래스를 만드는 것
    -   보통 DBManager라는 이름의 클래스 사용
    -   Connection 객체도 JNDI를 찾아서 사용하는 DataSource를 이용해 얻음. 여기에 Service Locator 패턴까지 적용하면 DB 연결 시의 시간을 최소한으로 단축 가능함.



### 3\. JDK 7에서 등장한 AutoClosable 인터페이스

-   JDK 7부터 java.lang 패키지에 AutoClosable 인터페이스가 등장함
-   AutoClosable 인터페이스에는 반환 타입이 void인 close 메서드 단 한 개만 선언되어 있음
    -   try-with-resources 문장으로 관리되는 객체에 대해서 자동적으로 close 처리함
    -   InterruptedException을 던지지 않도록 하는 것을 권장
    -   close 메서드를 두 번 이상 호출할 경우 눈에 보이는 부작용이 나타나도록 해야 함
-   **try-with-resources**
    -   try 블록 시작될 때 () 안에 close 메서드를 호출하는 객체를 생성해 주면 close 처리를 간단하게 할 수 있음
    -   간결하며, 에러 스택 트레이스가 누락되는 경우를 방지할 수 있음
    -   자원이 실수로 닫히지 않는 경우나 에러로 인해 자원이 닫히지 않는 경우를 방지 가능
    -   close 호출 대상이 여러 개라면 ; 으로 구분



### 4\. ResultSet.last() 메서드

-   ResultSet.last : ResultSet 객체가 갖고 있는 결과의 커서를 맨 끝으로 옮기는 메서드
-   이 메서드를 사용하는 이유
    -   last로 이동하고 getRow로 행번호를 가져와서 전체 데이터 개수를 확인하는 경우, 사용함
    -   일단 select count(\*) from .. 으로 가져오는 게 훨씬 빠름
-   **ResultSet.last의 문제점**
    -   last 메서드의 수행 시간 = 데이터의 건수 및 DB와의 통신 속도에 따라 달라짐
    -   건수가 많을수록 대기 시간이 증가
    -   next 메서드를 수행할 때와 비교할 수 없을 정도로 속도 차이가 남
    -   일부 DBMS는 이 부분의 성능을 개선해 놓은 것도 존재함(확인 필요)



### 5\. JDBC를 사용하면서 유의할 만한 몇 가지 팁

-   **setAutoCommit() 메서드는 필요할 때만 사용하자**
    -   해당 메서드를 이용해 자동 커밋 여부를 지정하는 작업은 필요할 때만 사용하자. 단순한 select 작업만을 수행할 때에도 커밋 여부를 지정하여 사용하는 경우가 많은데, 여러 쿼리를 동시에 작업할 때 성능에 영향을 주게 됨
-   **배치성 작업은 executeBatch 메서드를 사용하라**
    -   배치성 작업을 할 때는 Statement 인터페이스에 정의되어 있는 addBatch 메서드를 사용해 쿼리를 지정하고,
    -   executeBatch 메서드를 사용해 쿼리를 수행하라
    -   여러 쿼리를 한 번에 수행할 수 있기 때문에 JDBC 호출 횟수가 감소되어 성능이 좋아짐
-   **setFetchSize 메서드를 사용해 데이터를 더 빠르게 가져와라**
    -   한 번에 가져오는 열의 개수는 JDBC의 종류에 따라 다름
    -   하지만, 가져오는 데이터의 수가 정해져 있는 경우에 Statement와 ResultSet 인터페이스에 있는 setFetchSize 메서드를 사용해 원하는 개수를 정의하라
    -   단, 너무 많은 건수를 지정하면 서버에 많은 부하가 올 수 있으니 적절히 사용할 것
-   **한 건만 필요할 때는 한 건만 가져와라**
    -   실제 쿼리에서 100건 정도 가져오는데, ResultSet.next를 while 블록을 사용해서 수행하지 않고, 단 한 번만 메서드를 수행해 결과를 처리하는 경우가 있음
    -   해당 경우에는 단 한 건만 가져오도록 쿼리를 수정해야 함

## XML과 JSON도 잘 쓰자



### 1\. 자바에서 사용하는 XML 파서의 종류는?

#### 마크업 언어란?

-   태그 기반의 텍스트로 된 언어



#### XML이란?

-   XML = eXtensible Markup Language
-   장점 : 누구나 데이터의 구조를 정의하고, 정의된 구조를 공유하여 일관된 데이터 전송 및 처리(파서 필요)



#### 파서의 종류

| 약어 | 의미 | 패키지 |
| --- | --- | --- |
| JAXP | Java API for XML Processing | javax.xml.parsers |
| SAX | Simple API for XML | org.xml.sax |
| DOM | Document Object Model | org.w3c.dom |
| XSLT | Xml Stylesheet Language for Transformations | javax.xml.transform |

-   JAXP는 SAX, DOM, XSLT에서 사용하는 기본 API를 제공(JAXP 기반 API 사용하는 경우, 파서 벤더에 종속적이지 않게 됨)
-   javax.xml.parsers 에서 SAXParserFactory, DocumentBuilderFactory를 제공
-   XSLT는 SAX, DOM, InputStream을 통해 들어온 데이터를 원하는 형태의 화면으로 구성하는 작업을 수행(서버단 프로그램에서 사용하기 적합하지는 않으므로 다루지 않음)



### 2\. SAX 파서

![](/java-performance-tuning/142-01.gif)

*출처 : https://pirlwww.lpl.arizona.edu/resources/guide/software/jwsdp/tutorial/*

-   순차적으로 처리하는 이벤트 기반의 모델로 순차적으로 XML을 처리(DOM에 비해 메모리 부담 적음)
-   핸들러를 이용해 순차적인 이벤트를 처리하기 때문에 이미 읽은 데이터의 구조를 수정 혹은 삭제하기 어려움
-   전체 데이터를 처리할 필요는 없지만, 원하는 데이터를 만들려면 데이터를 어떻게 처리할지 결정해서 구현해야 함



#### SAX API

> DTD랑 EntityResolver는 뭔가 와닿지가 않네

-   SAXParserFactory : 파서 객체 생성을 위한 추상 클래스
-   SAXParser : 여러 종류의 parse 메서드를 제공하는 추상 클래스
-   DefaultHandler : 아래 4개의 인터페이스들을 구현한 클래스
-   ContentHandler : XML 태그의 내용을 읽기 위한 메서드를 정의한 인터페이스
-   ErrorHandler : 에러 처리 메서드가 정의되어 있는 인터페이스
-   DTDHandler : 기본 DTD(Document Type Definition) 관련 이벤트 식별 인터페이스
-   EntityResolver : URI를 통한 식별을 하기 위한 인터페이스



```java
public void test() throws Exception {
    ParseSAX handler = new ParseSAX(); // DefaultHandler를 상속
    SAXParserFactory factory = SAXParserFactory.newInstance();
    SAXParser saxParser = factory.newSAXParser();
    saxParser.parse("sample.xml", handler);
}
```

-   데이터 샘플 = &lt;Product name=’prod1’&gt;&lt;Price&gt;200&lt;/Price&gt;&lt;/Product&gt;
-   데이터 100건의 경우, 847ms 소요
-   데이터 1000건의 경우, 3925ms 소요(반드시 10배 소요 x)



### 3\. DOM 파서

![](/java-performance-tuning/142-02.gif)

*출처 : https://pirlwww.lpl.arizona.edu/resources/guide/software/jwsdp/tutorial/*

-   모든 XML을 읽어서 트리를 만든 이후 XML 처리
-   읽은 XML을 통해 노드를 추가, 수정, 삭제하기 쉬운 구조로 되어 있음



#### DOM 주요 클래스

-   DucumentBuilderFactory : 파싱을 하는 파서 객체를 생성하기 위한 추상 클래스
-   DocumentBuilder : 여러 종류의 parse 메서드를 제공하는 추상 클래스
-   Document : 파싱을 처리한 결과를 저장하는 클래스
-   Node : XML과 관련된 모든 데이터의 상위 인터페이스(단일 노드 정보 포함)



```java
DocumentBuilderFactory factpry = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
Document document = builder.parse(xmlName);
Node rootNode = document.getChildNodes().item(0);
...
```

-   따로 핸들러를 지정하지 않고, 파싱 데이터를 Document 클래스의 객체에 담아서 리턴함
-   데이터 샘플 = SAX와 동일
-   데이터 100건의 경우, 1395ms 소요
-   데이터 1000건의 경우, 7129ms 소요



#### SAX와 비교

-   두 파서가 XML을 처리하는 시간 중에서 가장 많은 비중을 차지하는 것은 parse 메서드를 처리하는 CPU 시간(대기 시간은 없고, XML을 처리하는 과정에서 CPU에 순간적으로 많은 부하가 발생)
-   속도는 SAX가 빠름
-   SAX는 XML 파일의 2배 정도의 메모리를 사용하며, DOM은 XML 파일의 10배 정도의 메모리를 사용함(파서 종류에 따라 사용량 다름)
-   → XML 파일의 크기가 클 경우, DOM을 사용할 경우 OOM 발생 가능



### 4\. 파서와 WAS

> 힙 덤프란 현재 JVM의 힙 메모리에서 점유하고 있는 객체에 대한 정보를 파일로 생성해 놓은 것으로, OOM이 발생했을 경우 자동으로 힙 덤프를 저장하려면 -XX:+HeapDumpOnOutOfMemoryError 옵션 추가

-   XML을 파싱 하기 위해서는 파서가 있어야 하는데, 대부분의 WAS에는 파서가 내장되어 있음
-   내장 파서가 말썽꾸러기일 수도 있음!



### 5\. JSON과 파서들

#### JSON

-   데이터 교환 형식 중 하나
-   JSON 데이터는 다음과 같은 두 가지의 구조를 기본으로 함
    -   name/value 형태의 쌍으로 collection 타입
    -   값의 순서가 있는 목록 타입
-   JSON도 많은 CPU와 메모리를 점유하며 응답 시간도 느림
-   JSON 파서로는 Jackson JSON, google-gson 등이 존재



#### Jackson JSON

```java
JsonFactory factory = new JsonFactory();
...
JsonParser jsonParser = factory.createJsonParsert(new File(json));
jsonParser.nextToken();
while(jsonParser.nextToken() != JsonToken.END_ARRAY) {
     String fieldName = jsonParser.getCurrentName();
     if(fieldName != null) { 
         jsonParser.nextToken();
         String text = jsonParser.getText();
         ....
     }
}
```

-   데이터 샘플 = {”productName” : “prod1”, “price” : “1”}
-   데이터 100건의 경우, 245ms 소요
-   데이터 1000건의 경우, 1379ms 소요
-   XML 보다 빠르다고 생각이 들 수 있지만, 데이터를 직렬화 및 역직렬화하는 경우 JSON 데이터 처리 성능이 좋지 않음
    -   Serialize : 데이터를 전송할 수 있는 상태로 처리하는 것
    -   Deserialize : 전송받은 데이터를 사용 가능한 상태로 처리하는 것
-   일반적으로 XML 파서보다 JSON 파서가 더 느림

## 서버를 어떻게 세팅해야 할까?





### 1\. 설정해야 하는 대상

-   개발만큼 중요한 것은 서버 세팅. 개발된 프로그램이 서버 세팅으로 인해 느려질 수 있음!
    -   이 문제를 진단하는 가장 좋은 방법은 성능 테스트를 통해 병목 지점을 미리 파악하는 것
    -   무조건 애플리케이션 위주로 병목을 찾는 것보다는 일단 문제가 될 만한 설정 값을 진단하는 것이 가장 효율적
-   웹 기반의 시스템에서 성능에 영향을 줄만한 세팅은 다음과 같음
    -   웹 서버 세팅
    -   WAS 서버 세팅
    -   DB 서버 세팅
    -   장비 세팅



### 2\. 아파치 웹 서버의 설정

#### WAS는 WAS, 웹 서버는 웹서버

-   웹 서버는 반드시 WAS 앞에 두며, WAS를 웹 서버로 사용하면 안 됨
-   why?
    -   WAS는 Web Application Server이기 때문, 정적인 부분은 웹 서버에서 처리해야 함
    -   그렇지 않으면 이미지, CSS, JS, HTML 등을 처리하기 위해 아까운 WAS 서버의 스레드를 점유하게 됨



#### 아파치 웹 서버에서 성능에 영향을 줄 수 있는 세팅

> 서버가 정말 좋아서 더 많은 요청을 처리해야 할 필요가 있다면, 서버가 최대한의 자원을 사용하도록 변경

-   아파치 웹 서버는 MPM을 사용
    -   MPM(Multi-Processing Module) : 여러 개의 프로세싱 모듈 기반의 서비스를 제공, 클라이언트 요청을 어떻게 처리할지 결정
    -   아파치에서 대중적으로 사용하는 MPM에는 prefork, worker, event 방식이 존재
    -   prefork와 worker의 차이점은 다음과 같음

![](/java-performance-tuning/144-01.png)

![](/java-performance-tuning/144-02.png)

*출처 : https://www.openmaru.io/apache-httpd-비교/*



-   아파치 웹 서버의 설정을 바꾸는 방법?
    -   config/httpd.conf 를 수정하는 것
    -   ThreadsPerChild : 웹 서버가 사용하는 스레드의 개수(프로세스 하나당), 이 수치가 크다면, 서버가 더 많은 사용자의 요청을 처리할 수 있음
    -   MaxRequestsPerChild : 최대 요청 개수를 지정, 0은 제한을 두지 않다는 의미(가급적 0 사용 권장)



-   스레드와 관련된 내용을 보다 세밀하게 지정하려면?
    -   httpd.conf 파일의 “include conf/extra/httpd-mpm.conf” 를 주석 해제
    -   httpd-mpm.conf를 통해 세밀하게 스레드 설정 가능
    -   스레드 방식을 사용하기 위해서는 worker 부분을 수정
    -   StartServers : 서버를 띄울 때 프로세스의 개수를 지정(child 프로세스의 수)
    -   MaxClients : 최대 처리 가능한 클라이언트의 수를 지정
    -   MinSpareThreads : 최소 여유 스레드 수를 지정
    -   MaxSpareThreads : 최대 여유 스레드 수를 지정
    -   ThreadsPerChild : 프로세스당 스레드 수를 지정
    -   MaxRequestPerChild : 최대 요청 개수를 지정



-   예시를 들어보자.
    -   서버 설정 :
        -   ThreadsPerChild = 25, StartServers = 2, 기본적으로 50개 요청 처리 가능
        -   MaxSpareThreads = 75, StartServers = 2, 최대 사용 가능한 클라이언트 수(MaxClient) = 150(150명 이상의 요청은 서버 리소스에 여유가 있어도 처리하지 않음)
    -   사용자가 늘어나거나 WAS가 멈춘다면?
        -   자바는 GC를 하는 동안 JVM 자체가 멈춤
        -   GC에 2초가 소요 시, 아파치 웹 서버에 300명의 요청이 기다림(WAS가 멈춰 새로운 연결을 할 수 없음)
        -   위 경우 Tomcat에서 AJP Connector라는 웹 서버와 WAS 사이의 커넥터에 설정한 backlog라는 값의 영향을 받음
        -   backlog 기본값은 100, WAS가 응답하지 않는 경우 100개의 요청까지 큐에 담아둠
        -   이외에 100개를 넘는 요청들은 503(Service Unavailable)을 받음
    -   클라이언트가 503을 받지 않게 하려면 어떻게 해야할까?
        -   서버 증설 : 돈 많으면 ㅎㅎ
        -   서비스 튜닝 : 서비스가 응답이 안 되는 원인을 찾고 튜닝
        -   GC 튜닝 : GC가 오래 소요되어 응답이 안될 경우
        -   각종 옵션 값을 튜닝 : 웹 서버 및 WAS 전문가, 엔지니어와 이야기해서 설정을 추천 ㅎㅎ



### 3\. 웹 서버의 Keep Alive

-   웹 서버와 웹 브라우저가 연결이 되었을 때 KeepAlive 기능이 켜져 있지 않으면, 매번 HTTP 연결을 맺었다 끊었다 하는 작업을 반복 (HTTP/1.1은 persistent connection 지원)
-   KeepAlive 기능이 켜져 있으면 연결을 계속 재사용하여, 연결을 하기 위한 대기 시간이 짧아지기 때문에 사용자가 느끼는 응답 속도도 빨라짐
-   사용자가 많다면, 정적인 파일들을 웹 서버에서 처리하지 않고 CDN 서비스를 이용
-   무조건 켜야 하는 것은 아님(안 킨 게 성능 좋을 때도 있음)
-   KeepAlive 설정을 할 때 KeepAlive-Timeout 설정을 함께 해야 함
    -   초 단위로 KeepAlive가 끊기는 시간을 설정
    -   사용자가 너무 많아 접속이 잘 안 될 경우, 해당 설정을 5초 정도로 짧게 주는 방법이 있음



### 4\. DB Connection Pool 및 스레드 개수 설정

-   DB Connection Pool, 스레드 수는 WAS에 많은 성능 영향을 줌
-   대부분의 WAS에서는 DB Connection Pool의 개수를 최소치, 증가치, 최대치 등으로 자세하게 지정 가능



#### 개수 설정

-   서버가 기동 될 때 연결을 수행하는 개수
-   개발자용 PC에서는 최소한으로 지정 → 최소 개수가 많을수록 서버 기동 시간이 오래 걸림
-   운영 중인 경우에는 최소 및 최대 값을 동일하게 하는 것이 좋음
    -   사용자 수가 갑자기 증가하면 DB Connection Pool의 개수도 증가해야 하며, 증가할 때 대기 시간이 발생할 확률이 크기 때문
    -   DB 서버 리소스가 부족하다면 최솟값을 적게 해 놓는 것도 방법
-   대부분의 WAS ⇒ 최대, 최소의 기본 수가 10-20개 정도
-   DB Connection Pool은 보통 40-50개로 지정하며, 스레드 수는 이보다 10개 정도 더 지정함
    -   why? 모든 애플리케이션이나 화면이 DB에 접속하는 것은 아니기 때문에, 여유 스레드를 갖도록 지정하는 것이 일반적임



#### 가장 적합한 사이즈

-   상황에 따라 다름. 성능 테스트를 통해서 가장 적절한 값을 구해야 함
-   DB Connection Pool = 40인 경우, 40개를 전부 사용하면서 DB CPU 사용량이 100%에 도달한다면?
    -   DB의 CPU를 점유하는 쿼리를 찾아서 튜닝을 수행(쿼리 플랜 확인)
    -   40개를 전부 사용한다고 해서 DB Connection Pool 수를 늘리면 모든 DB와의 연결을 전부 사용하고 응답 시간은 느려짐
-   DB Connection Pool = 20인 경우, DB CPU 50%, WAS CPU 100%에 도달한다면?
    -   WAS 애플리케이션을 튜닝
    -   만약 튜닝이 되어 있다면 DB Connection Pool의 수를 25-30개 정도로 지정



#### 대기 시간 지정

-   MyBatis처럼 자바 프로그램을 DB와 매핑해 주는 프레임워크에는 각종 설정 값이 존재하는데, 이 중 대기 시간을 나타내는 wait time과 관련된 값들이 존재
-   DB Connection Pool의 수를 넘어섰을 때, 애플리케이션은 남는 Connection을 기다리게 됨(대기 시간 발생, MyBatis의 경우 20초)
-   즉, DB에 연결을 못해 기다리는 사용자들은 적어도 20초는 기다려야 함
-   너무 적게 설정하면 → Full GC에 걸리는 시간보다 짧다면, Full GC 순간에 대기하던 스레드는 타임 아웃을 내뿜을 수 있음



### 5\. WAS 인스턴스 개수 설정

-   장비 하나당 인스턴스 개수는 성능 테스트를 통해서 구하는 것이 가장 바람직함
-   인스턴스를 더 늘린다고 해서 TPS가 증가하지 않는 상황에서는 오히려 유지보수성만 떨어질 수 있음
-   만약, WAS에 4GB 메모리 여유가 있다고 해도, 하나의 인스턴스에 4GB의 메모리를 지정해서 사용하는 것은 좋지 않은 방법
    -   why? Full GC가 발생할 때마다 많은 시간이 소요될 확률이 커지기 때문
    -   가급적 512MB ~ 2GB 사이의 메모리를 지정하는 것이 좋음
    -   다른 애플리케이션이나 OS에서도 메모리를 사용하므로 여유를 주는 것이 좋음
-   단독 인스턴스를 구성해 사용하는 것은 서버에 예기치 못한 상황이 발생했을 때, 서비스가 불가능해지므로 되도록 피해야 함(장비가 하나여도, 2개 이상의 인스턴스가 서로 클러스터링 하도록 지정)



### 6\. Session Timeout 시간 설정

-   session-timeout 설정을 확인(WEB-INF/web-xml에서 설정하며, 서블릿 스펙에 정의된 표준 설정 값)
-   세션 종료 시간 설정 값은 분 단위이며, 설정되어 있는 분만큼 요청이 없으면 세션을 메모리에서 제거함
-   설정을 하지 않은 상태에서, WAS에서 따로 설정한 바가 없거나 세션 객체의 invalidate() 메서드가 수행되지 않으면 세션은 삭제되지 않으므로 유의할 것

## JVM은 도대체 어떻게 구동될까?



### 1\. HotSpot VM은 어떻게 구성되어 있을까?

#### HotSpot이란?

-   Java HotSpot Performance Engine
-   자바를 만든 Sun에서는 자바의 성능을 개선하기 위해 JIT 컴파일러를 만들었고, 이름을 HotSpot으로 지었음
-   JIT 컴파일러 :
    -   프로그램의 성능에 영향을 주는 지점에 대해서 지속적으로 분석
    -   분석된 지점은 부하를 최소화하고, 높은 성능을 내기 위한 최적화의 대상이 됨
-   HotSpot(JIT 컴파일러)이 탑재된 VM 은 자바 1.3 부터 기본 VM 으로 사용되어 왔음
-   최근 운영되고 있는 대부분의 시스템들은 모두 HotSpot 기반의 VM이라고 생각하면 됨



#### HotSpot VM의 구조

![](/java-performance-tuning/145-01.png)

*출처 : https://dzone.com/articles/understanding-garbage-collectorsgc-in-depth*

-   HotSpot VM은 높은 성능과 확장성을 제공
    -   ex) JIT 컴파일러는 자바 애플리케이션이 수행되는 상황을 보고 동적으로 최적화를 수행함
-   VM 런타임에 다양한 GC 방식과 JIT을 골라 끼울 수 있는 구조
-   HotSpot VM은 세 가지 주요 컴포넌트로 이루어짐
    -   VM(Virtual Machine) 런타임 : JIT 컴파일러 용 API, 가비지 컬렉터용 API 제공, JVM 시작 런처 및 스레드 관리, JNI 제공
    -   JIT(Just In Time) 컴파일러
    -   메모리 관리자



### 2\. JIT Optimizer라는 게 도대체 뭘까?

#### 최적화 방식

-   클라이언트와 서버 버전으로 나뉘어짐
-   JVM은 항상 바이트 코드로 시작하며, 동적으로 기계에 의존적인 코드로 변환함
-   JIT는 애플리케이션에서 각각의 메서드를 컴파일할 만큼 시간적 여유가 많지 않음
-   따라서, 모든 코드는 초기에 인터프리터에 의해 시작되고, 해당 코드가 충분히 많이 사용될 경우 컴파일 대상이 됨
-   이 작업은 HotSpot VM에서 다음 카운터들을 통해서 통제됨
    -   수행 카운터(invocation counter) : 메서드 시작할 때마다 증가
    -   백에지 카운터(backedge counter) : 높은 바이트 코드 인덱스에서 낮은 인덱스로 컨트롤 흐름이 변경될 때마다 증가(아래에서 위로 흐르니 반복문), 메서드가 루프 존재하는지 판단(수행보다 컴파일 우선순위 높음)
-   카운터들이 인터프리터에 의해 증가될때마다 값들이 한계치에 도달했는지 확인하고, 도달하면 인터프리터는 컴파일을 요청함



#### 한계치

```
백에지 카운터 한계치 = CompileThreshold(수행 카운터 한계치) * OnStackReplacePercentage / 100
```

-   XX:CompileThreshold = 35000
-   XX:OnStackReplacePercentage=80 인 경우,
-   백에지 카운터가 28000(35000 \* 80 / 100)이 되었을 때, 메서드가 35000번 호출되었을 때 JIT에서 컴파일 함



#### 컴파일 요청 이후에는?

-   컴파일이 요청되면 컴파일 대상 목록 큐에 쌓이며, 하나 이상의 컴파일러 스레드가 큐를 모니터링 함
-   컴파일러 스레드가 바쁘지 않는 경우, 큐에서 대상을 빼내서 컴파일을 수행함
-   인터프리터는 컴파일이 종료되기를 기다리지 않는 대신, 수행 카운터를 리셋하고 인터프리터에서 메서드 수행을 계속 함(기다리도록 하려면 -Xbatch or -XX:-BackgroundCompliation 옵션을 지정)
-   컴파일이 종료되면, 컴파일된 코드와 메서드가 연결되어 그 이후부터는 메서드가 호출되면 컴파일된 코드를 사용함



#### OSR(On Stack Replacement)

-   인터프리터에서 수행한 코드 중 오랫동안 루프가 지속되는 경우에 사용됨
-   해당 코드의 컴파일이 완료된 상태에서 최적화되지 않은 코드가 수행되고 있는 것을 발견한 경우, 인터프리터에 계속 머무르지 않고 컴파일된 코드로 변경



### 3\. JRockit JVM의 JIT 컴파일 및 최적화 절차

![](/java-performance-tuning/145-02.gif)

![](/java-performance-tuning/145-03.gif)

*출처 : https://docs.oracle.com/cd/E15289_01/JRSDK/underst_jit.htm*



-   JVM은 각 OS에서 작동할 수 있도록 자바 코드를 바이트 코드로 받아 각종 변환을 거쳐, 해당 칩의 아키턱처에서 잘 동작하는 기계어 코드로 변환되어 수행되는 구조로 되어 있음
-   Jrockit은 위와 같은 최적화 단계를 거치게 됨
-   **JRockit runs JIT compilation → JIT-compiled machine code**
    -   자바 애플리케이션을 실행하면 JIT 컴파일을 거친 후 실행
    -   해당 단계를 거친 이후 메서드가 수행되면, 다음부터는 컴파일된 코드를 호출하기 때문에 처리 성능 빨라짐
    -   JIT를 사용하면 시작할 때의 성능은 느리지만, 지속적으로 수행할 때는 더 빠른 처리가 가능
    -   모든 메서드를 컴파일하고 최적화하는 작업은 JVM 시작 시간을 느리게 만들기 때문에 시작할 때 모든 메서드를 최적화하지는 않음

-   **JRockit monitors threads**
    -   JRockit에는 ‘sampler thread’라는 스레드가 주기적으로 애플리케이션의 스레드를 점검
    -   해당 스레드는 어떤 스레드가 동작 중인지 여부와 수행 내역을 관리
    -   이 정보들을 이용해 어떤 메서드가 많이 사용되는지를 확인해 최적화 대상을 찾음
-   **JRockit runs optimization → Highly optimized machine code**
    -   sampler thread가 식별한 대상을 최적화함
    -   백그라운드에서 진행되며, 애플리케이션에 영향을 주지 않음
    -   코드 최적화 과정은 위 사진의 출처 페이지에 자세히 나와있음



### 4\. IBM JVM의 JIT 컴파일 및 최적화 절차

-   IBM JVM의 JIT 컴파일 방식은 5가지로 나뉨
-   인라이닝(Inlining)
    -   메서드가 단순할 경우 적용
    -   호출된 메서드가 단순할 경우 그 내용이 호출한 메서드의 코드에 포함됨
    -   자주 호출되는 메서드의 성능이 향상
-   지역 최적화(Local optimizations)
    -   작은 단위의 코드를 분석하고 개선
-   조건 구문 최적화(Control flow optimizations)
    -   메서드 내부의 조건 구문을 최적화하고, 효율성을 위해 코드의 수행 경로를 변경
-   글로벌 최적화(Global optimizations)
    -   메서드 전체를 최적화
    -   매운 비싼 방식, 컴파일 시간이 많이 소요된다는 단점이 존재(but, 성능 개선은 많이 될 수 있음)
-   네이티브 코드 최적화(Native code optimizations)
    -   플랫폼 아키텍처에 의존적(아키텍처에 따라 최적화를 다르게 처리)
-   컴파일된 코드는 코드 캐시라고 하는 JVM 프로세스 영역에 저장됨
-   **JVM 프로세스는 JVM 수행 파일과 컴파일된 JIT 코드의 집합으로 구분**



### 5\. JVM이 시작할 때의 절차는 이렇다

> java 명령으로 HelloWorld 클래스를 실행하면 어떤 단계로 수행될까?



-   java 명령어 줄에 있는 옵션 파싱
    -   일부 명령은 자바 실행 프로그램에서 적절한 JIT 컴파일러를 선택하는 등의 작업을 위해 사용
    -   다른 명령들은 HotSpot VM에 전달
-   자바 힙 크기 할당 및 JIT 컴파일러 타입 지정
    -   메모리 크기나 JIT 컴파일러 종류가 명시적으로 지정되지 않은 경우에 자바 실행 프로그램이 시스템의 상황에 맞게 선정
    -   해당 과정은 좀 복잡한 단계(HotSpot VM Adaptive Tuning)를 거침
-   CLASSPATH와 LD\_LIBRARY\_PATH 같은 환경 변수를 지정
-   자바의 Main 클래스가 지정되지 않았으면, Jar 파일의 manifest 파일에서 Main 클래스 확인
-   JNI의 표준 API인 JNI\_CreateJavaVM를 사용해 새로 생성한 non-primordial 스레드에서 HotSpot VM을 생성
-   HotSpot VM이 생성되고, 초기화되면, Main 클래스가 로딩된 런처에서는 main() 메서드의 속성 정보를 읽음
-   CallStaticVoidMethod는 네이티브 인터페이스를 불러 HotSpot VM에 있는 main() 메서드가 수행(이때, 자바 실행 시 Main 클래스 뒤에 있는 값들이 전달)



#### JNI\_CreateJavaVM 단계 더 자세히 알아보기

-   JNI\_CreateJavaVM는 동시에 두 개의 스레드에서 호출 불가능, 오직 하나의 HotSpotVM 인스턴스가 프로세스 내에서 생성될 수 있도록 보장. HotSpot VM이 정적인 데이터 구조를 생성하기 때문에 다시 초기화는 불가능함 → 오직 하나의 HotSpot VM이 프로세스에서 생성될 수 있음
-   JNI 버전이 호환성이 있는지 점검하고, GC 로깅을 위한 준비를 완료
-   OS 모듈 초기화(랜덤 번호 생성기, PID 할당 포함)
-   커맨드 라인 변수 및 속성들이 JNI\_CreateJavaVM 변수에 전달(나중에 사용하기 위해서 파싱한 후 보관)
-   표준 자바 시스템 속성(properties)이 초기화
-   동기화, 메모리, safepoint 페이지와 같은 모듈들이 초기화
-   libzip, libhpi, libjava, libthread와 같은 라이브러리 로드
-   시그널 처리기 초기화 및 설정
-   스레드 라이브러리 초기화
-   출력 스트림 로거 초기화
-   JVM 모니터링을 위한 에이전트 라이브러리 초기화 및 시작(설정되어 있는 경우)
-   스레드 처리를 위해 필요한 스레드 상태와 스레드 로컬 저장소가 초기화
-   HotSpot VM의 ‘글로벌 데이터’들 초기화 (이벤트 로그, OS 동기화, 성능 통계 메모리, 메모리 할당자 포함)
-   HotSpot VM에서 스레드를 생성할 수 있는 상태가 됨(main 스레드가 생성되고, 현재 OS 스레드에 붙지만 스레드 목록에 추가되지는 않음)
-   자바 레벨의 동기화 초기화 및 활성화
-   부트 클래스로더, 코드 캐시, 인터프리터, JIT 컴파일러, JNI, 시스템 dictionary, universe(글로벌 데이터 구조의 집합) 초기화
-   스레드 목록에 자바 main 스레드가 추가되고, universe 상태 점검(HotSpot VM Thread 생성, 이 시점에 VM의 현재 상태를 JVMTI에 전달)
-   java.lang 패키지에 있는 String, System, Thread, ThreadGroup, Class 클래스와 java.lang 하위 패키지에 있는 Method, Finalizer 클래스 등이 로딩되고 초기화
-   HotSpot VM의 시그널 핸들러 스레드가 시작되며, JIT 컴파일러가 초기화 되고, HotSpot의 컴파일 브로커 스레드가 시작됨. 또한, HotSpot VM과 관련된 각종 스레드들이 시작함 → 이때부터 HotSpot VM의 전체 기능이 동작
-   JNIEnv가 시작되며, HotSpot VM을 시작한 호출자에게 새로운 JNI 요청을 처리할 상황이 되었다고 전달



### 6\. JVM이 종료될 때의 절차는 이렇다(정상 종료 절차)

> JVM이 시작할 때 오류가 있어 시작을 중지하거나, JVM에 심각한 에러가 있어서 중지할 필요가 있을 경우, DestroyJavaVM 메서드를 HotSpot 런처에서 호출함. 이는 아래의 과정과 같음



-   HotSpot VM이 작동중인 상황에서는 단 하나의 데몬이 아닌 스레드(non-daemon thread)가 수행될 때까지 대기
-   java.lang 패키지에 있는 Shutdown 클래스의 shutdown() 메서드가 수행되는데, 해당 메서드가 수행되면 자바 레벨의 shutdown hook이 수행되고, finalization-on-exit이라는 값이 true일 경우에 자바 객체 finalizer를 수행
-   HotSpot VM 레벨의 shutdown hook을 수행함으로 HotSpot VM의 종료를 준비. 해당 작업은 JVM\_OnExit() 메서드를 통해서 지정되며 HotSpot VM의 profiler, start sampler, watcher, garbage collector 스레드를 종료시킴. 종료된 이후에는 JVMTI를 비활성화하며, Signal 스레드를 종료
-   HotSpot VM 스레드를 종료함. 해당 작업을 수행하면 HotSpot VM에 남아 있는 HotSpot VM 스레드들을 safepoint로 옮기고, JIT 컴파일러 스레드를 중지
-   JNI, HotSpot VM, JVMTI barrier에 있는 추적 기능을 종료
-   네이티브 스레드에서 수행하고 있는 스레드들을 위해 HotSpot의 vm exited 값을 설정
-   현재 스레드를 삭제
-   입출력 스트림을 삭제 및 PerfMemory 리소스 연결을 해제
-   JVM 종료를 호출한 호출자로 복귀

> JVM 시작 및 종료 절차에 대해서 반드시 외우고 있어야 할 필요가 없음. 참고로 알아두면 좋은 내용이니 이해가 되지 않는다고 좌절하지 말것…. 이라고 적혀있다.



### 7\. 클래스 로딩 절차도 알고싶어요?

> 단계가 복잡해 보이지만, 로딩 → 링킹 → 이니셜라이징으로 기억하면 됨



#### 클래스 로딩 절차

-   주어진 클래스의 이름으로 클래스 패스에 있는 바이너리로 된 자바 클래스를 찾음
-   자바 클래스를 정의
-   해당 클래스를 나타내는 java.lang 패키지의 Class 클래스의 객체를 생성
-   링크 작업이 수행됨. 해당 단계에서 static 필드를 생성 및 초기화하고, 메서드 테이블을 할당함
-   클래스의 초기화가 진행되며, 클래스의 static 블록과 static 필드가 가장 먼저 초기화 됨(해당 클래스가 초기화 되기 전에 부모 클래스의 초기화가 먼저 이루어짐)



#### 클래스 로더 위임

-   클래스 로더가 클래스를 찾고 로딩할 때, 다른 클래스 로더에 클래스를 로딩해 달라고 하는 경우를 class loader delegation 이라고 함
-   클래스 로더는 계층적으로 구성되어 있음
-   기본 클래스 로더는 시스템 클래스 로더라고 불리며 main 메서드가 있는 클래스와 클래스 패스에 있는 클래스들이 해당 클래스 로더에 속함
-   하위에 있는 애플리케이션 로더는 자바 SE의 기본 라이브러리에 있는 것이 될 수도 있고, 개발자가 임의로 만든 것일 수 있음



#### 내부 클래스 로딩 데이터의 관리

-   HotSpot VM은 클래스 로딩을 추적하기 위해 아래 3개의 해시 테이블을 관리
-   SystemDictionary
-   PlaceholderTable
-   LoaderConstraintTable



### 8\. 예외는 JVM에서 어떻게 처리될까?

-   JVM은 자바 언어의 제약을 어겼을 때 예외라는 시그널로 처리함
-   일반적인 예외 처리 경우는 아래 두 가지 경우
    -   예외를 발생한 메서드에서 잡을 경우
    -   호출한 메서드에 의해서 잡힐 경우
-   예외는…
    -   던져진 바이트 코드에 의해서 초기화 될 수 있으며
    -   VM 내부 호출의 결과로 넘어올 수 잇고,
    -   JNI 호출로부터 넘어올 수도 있고,
    -   자바 호출로부터 넘어올 수도 있음
-   VM이 예외가 던져졌다는 것을 알아차렸을 때, 해당 예외를 처리하는 가장 가까운 핸들러를 찾기 위해서 HotSpot VM 런타임 시스템이 수행 됨.
-   이때, 현재 메서드, 현재 바이트 코드, 예외 객체 등 3개의 정보를 이용해 핸들러를 찾음

## 도대체 GC는 언제 발생할까?

> GC 방식을 외우면서 개발하거나 서버를 설정할 필요는 없고, 이해만 하면 됨. 필요할 때나 찾아보고, 개발한 시스템에 적용하는 정도가 가장 바람직함



### 1\. GC란?

-   Garbage Collection : 쓰레기를 정리하는 작업
-   자바에서 쓰레기는 객체임. 하나의 객체는 메모리를 점유하고, 필요하지 않으면 메모리에서 해제되어야 함
-   이때, 쓰레기 객체를 효과적으로 처리하는 작업을 GC(Garbage Collection)이라고 함



### 2\. 자바의 Runtime data area는 이렇게 구성된다

![](/java-performance-tuning/147-01.png)

*출처: https://ko.wikipedia.org/wiki/자바_가상_머신*

-   Class Loader : 클래스나 인터페이스를 JVM으로 로딩하는 기능 수행
-   Execution Engine : 로딩된 클래스의 메서드들에 포함되어 있는 모든 인스트럭션 정보를 실행
-   Runtime data area : JVM Memory
-   주요한 메모리 영역은 다음과 같음
    -   PC 레지스터
    -   JVM 스택
    -   힙
    -   메서드 영역
    -   런타임 상수 풀
    -   네이티브 메서드 스택
-   힙 영역에서 GC가 수행
-   자바의 메모리 영역은 Heap 메모리와 Non-Heap 메모리로 분류



#### Heap 메모리

-   클래스 인스턴스, 배열이 해당 메모리 영역에 쌓임
-   해당 메모리는 shared memory라고도 불리며, 여러 스레드에서 공유하는 데이터들이 저장되는 메모리



#### Non-Heap 메모리

-   자바 내부 처리를 위해서 필요한 영역. 메서드 영역이 핵심
-   **메서드 영역** : 메서드 영역은 모든 JVM 스레드에서 공유. 해당 영역에 저장되는 데이터는 다음과 같음
    -   **런타임 상수 풀** :
        -   자바의 클래스 파일에는 constant\_pool이라는 정보가 포함되어 있음
        -   이 constant\_pool에 대한 정보를 실행 시에 참조하기 위한 영역
        -   실제 상수 값도 여기에 포함될 수 있지만, 실행 시에 변하게 되는 필드 참조 정보도 포함됨
    -   필드 정보에는 메서드 데이터, 메서드와 생성자 코드가 있음
-    **JVM 스택** : 스레드가 시작될 때 JVM 스택이 생성됨. 해당 스택에는 메서드가 호출되는 정보인 프레임(frame)이 저장됨. 또한, 지역 변수와 임시 결과, 메서드 수행과 리턴에 관련된 정보들도 포함
-   **네이티브 메서드 스택** : 자바 코드가 아닌 다른 언어로 된(일반적으로 C) 코드들이 실행하게 될 때의 스택 정보를 관리
-   **PC 레지스터** : 자바의 스레드들은 각자의 pc(Program Counter) 레지스터를 가짐. 네이티브한 코드를 제외한 모든 자바 코드들이 수행될 경우, JVM의 인스트럭션 주소를 pc 레지스터에 보관함



#### StackOverflowError vs OutOfMemoryError

-   StackOverflowError : 연산을 하다가, JVM의 스택 크기의 최대치를 넘어섰을 경우 발생
-   OutOfMemoryError : 가변적일 경우 스택의 크기를 늘이려고 할 때 메모리가 부족하거나, 스레드를 생성할 때 메모리가 부족한 경우 발생



#### 힙 영역과 메서드 영역

![](/java-performance-tuning/147-02.png)

*출처: 어썸오의 JVM Memory Layout*

-   힙, 메서드 영역은 JVM이 시작될 때 생성됨
-   JVM 스택, PC 레지스터, 네이티브 메서드 스택은 스레드가 생성될 때마다 같이 생성되고 서로 다른 스레드가 침범할 수 없는 영역임



### 3\. GC의 원리

-   GC 작업을 하는 가비지 콜렉터(Garbage Collector)는 다음의 역할을 수행함
    -   메모리 할당
    -   사용 중인 메모리 인식
    -   사용하지 않는 메모리 인식
-   사용하지 않는 메모리를 인식하는 작업을 수행하지 않으면? → **할당한 메모리 영역이 꽉 차서 JVM에 행(Hang, 서버가 요청을 처리하지 못하는 상태)이 걸리거나, 더 많은 메모리를 할당하려는 현상이 발생할 것**
-   만약 JVM의 최대 메모리 크기를 지정해서 전부 사용한 다음, GC를 해도 더 이상 사용 가능한 메모리 영역이 없는데 계속 메모리를 할당하려고 하면? → **OOM이 발생해 JVM이 다운될 가능성이 존재함**



#### 자바의 메모리 영역을 더 자세히 알아보자

![](/java-performance-tuning/147-03.jpg)

*출처 :&amp;nbsp;https://www.programmersought.com/article/4905216600/*

![](/java-performance-tuning/147-04.png)

*출처 :&amp;nbsp;https://medium.com/platform-engineer/understanding-java-memory-model-1d0863f6d973*

-   Java Heap(JDK 8+) = (Young Generation = Eden + Survivor 1 / 2) + Old Generation
-   일단 메모리에 객체가 생성되면, Eden 영역에 객체가 지정됨
-   Eden 영역에 데이터가 꽉 차면? → 이 영역에 있던 객체가 어디론가 옮겨지거나 삭제되어야 함
    -   이때, 옮겨 가는 위치가 Survivor 영역(두 개의 Survivor 영역 사이에 우선순위가 있는 것은 아님)
    -   이 두 개의 영역 중 한 영역은 반드시 비어 있어야 함
    -   비어 있는 영역에 Eden 영역에 있던 객체 중 GC 후에 살아남아 있는 객체들이 이동함
    -   즉, Eden 영역에 있던 객체는 Survivor 영역의 둘 중 하나에 할당됨
-   위와 같은 작업을 반복하면서, Survivor 1과 2를 왔다 갔다 하던 객체들은 Old 영역으로 이동함
-   Young에서 Survivor을 거치지 않고, 바로 Old 영역으로 이동하는 객체가 있을 수 있음
    -   이는 객체의 크기가 아주 큰 경우에 해당됨
    -   ex) Survivor 영역의 크기가 16MB인데, 20MB를 점유하는 객체가 Eden 영역에서 생성되면, Survivor 영역으로 옮겨갈 수가 없음



### 4\. GC의 종류

-   GC는 크게 두 가지 타입으로 나뉨
    -   마이너 GC : Young 영역에서 발생하는 GC
    -   메이저 GC : Old 영역 혹은 Perm 영역에서 발생하는 GC(jdk7 이하 기준인 듯!), Full GC라고도 함!
-   두 가지 GC가 어떻게 상호 작용하느냐에 따라 GC 방식에 차이가 나며, 성능에도 영향을 줌
-   GC가 발생하거나 객체가 각 영역에서 다른 영역으로 이동할 때 애플리케이션의 병목이 발생하면서 성능에 영향을 주게 됨
-   따라서, 핫 스팟 JVM에서는 스레드 로컬 할당 버퍼(TLABs: Thread-Local Allocation Buffers)라는 것을 사용 → 이를 통해 스레드별 메모리 버퍼를 사용하면 다른 스레드에 영향을 주지 않는 메모리 할당 작업이 가능해짐



### 5\. 5가지 GC 방식

> stop-the-world란, GC을 실행하기 위해 JVM이 애플리케이션 실행을 멈추는 것. stop-the-world가 발생하면 GC를 실행하는 스레드를 제외한 나머지 스레드는 모두 작업을 멈춤. GC 작업을 완료한 이후에야 중단했던 작업을 다시 시작함.

-   해당 책에서는 5가지의 GC 방식을 소개함
    -   Serial Collector(시리얼 콜렉터)
    -   Parallel Collector(병렬 콜렉터)
    -   Parallel Compacting Collector(병렬 콤팩팅 콜렉터)
    -   Concurrent Mark-Sweep Collector(CMS 콜렉터)
    -   Garbage First Collector(G1 콜렉터)
-   명시된 GC 방식은 WAS나 자바 애플리케이션 수행 시 옵션을 지정해 선택 가능함
-   어떤 GC 알고리즘을 사용하더라도 stop-the-world는 발생, GC 튜닝이란 이 stop-the-world 시간을 줄이는 것



#### 시리얼 콜렉터

![](/java-performance-tuning/147-05.png)

![](/java-performance-tuning/147-06.png)

![](/java-performance-tuning/147-07.png)

*출처 : Sun Microsystem, "Memory Management in the Java HotSpotTM Virtual Machine"*

-   Young 영역과 Old 영역이 시리얼하게(연속적으로) 처리되며, 하나의 CPU를 사용함
-   수행 과정은 다음과 같음
    -   일단 살아 있는 객체들은 Eden 영역에 존재함(각각의 둥근 사각형이 객체 하나라고 보면 됨)
    -   Eden 영역이 꽉 차게 되면 To Survivor 영역(비어 있는 영역)으로 살아 있는 객체가 이동함. 이때 Survivor 영역에 들어가기에 너무 큰 객체는 바로 Old 영역으로 이동함. 또한, From Survivor 영역에 있는 살아 있는 객체는 To Survivor 영역으로 이동
    -   To Survivor 영역이 꽉 찼을 경우, Eden 영역이나 From Survivor 영역에 남아 있는 객체들은 Old 영역으로 이동함
    -   이후에 Old 영역이나 Perm 영역에 있는 객체들은 Mark-sweep-compact 콜렉션 알고리즘을 따름
-   (하늘) 내가 이해한 바가 맞다면, 위에서 young generation collection이 수행되면, From Survivor이 비게 되니, To Survivor 영역이 다시 From Survivor이 되는 듯함. 이후에 old generation collection 수행(메이저 GC)
-   모든 가비지 컬렉션 일을 처리하기 위해 1개의 쓰레드만을 이용 → CPU의 코어가 여러 개인 운영 서버에서 Serial GC를 사용하는 것은 반드시 피해야 함!

![](/java-performance-tuning/147-08.png)

*출처 :&amp;nbsp;Sun Microsystem, "Memory Management in the Java HotSpotTM Virtual Machine"*

-   **Mark-sweep-compact 콜렉션 알고리즘** : 쓰이지 않는 객체를 표시해서 삭제하고 한 곳으로 모으는 알고리즘
    -   Old 영역으로 이동된 객체들 중 살아 있는 객체를 식별(표시)
    -   Old 영역의 Mark가 되지 않은 객체들을 메모리에서 제거(스윕)
    -   살아 있는 객체들을 한 곳으로 모음(컴팩션)

-   시리얼 콜렉터는 일반적으로 클라이언트 종류의 장비에서 많이 사용됨
-   즉, 대기 시간이 많아도 크게 문제 되지 않는 시스템에서 사용됨
-   —XX:+UseSerialGC 옵션으로 시리얼 콜렉터를 명시적으로 지정 가능



#### 병렬 콜렉터

![](/java-performance-tuning/147-09.png)

*출처 :&amp;nbsp;Sun Microsystem, "Memory Management in the Java HotSpotTM Virtual Machine"*

-   이 방식은 스루풋 콜렉터(throughput collector)로도 알려진 방식임
-   해당 방식의 목표는 다른 CPU가 대기 상태로 남아 있는 것을 최소화하는 것
-   시리얼 콜렉터와 달리 Young 영역에서의 콜렉션을 병렬로 처리함
-   많은 CPU를 사용하기 때문에 GC의 부하를 줄이고 애플리케이션의 처리량을 증가시킬 수 있음
-   Old 영역의 GC는 시리얼 콜렉터와 마찬가지로 Mark-sweep-compact 콜렉션 알고리즘을 사용
-   —XX:+UseParallelGC 옵션으로 병렬 콜렉터를 명시적으로 지정 가능



#### 병렬 콤팩팅 콜렉터

-   Parallel Old GC라고도 하나 봄!
-   병렬 콜렉터와 다른 점은 Old 영역에서 새로운 알고리즘을 사용함
-   Young 영역에 대한 GC는 병렬 콜렉터와 동일하지만, Old 영역에 대한 GC는 다음의 3단계를 거침
    -   표시 단계 : 살아 잇는 객체를 식별하여 표시해 놓는 단계
    -   종합 단계 : 이전에 GC를 수행하여 컴팩션된 영역에 살아 있는 객체의 위치를 조사하는 단계(서머리)
    -   컴팩션 단계 : 컴팩션을 수행하는 단계. 수행 이후에는 컴팩션된 영역과 비어있는 영역으로 나뉨
-   병렬 콜렉터와 동일하게 해당 방식도 여러 CPU를 사용하는 서버에 적합
-   —XX:ParallelGCThreads=n : GC 사용 스레드 수 지정
-   —XX:+UseParallelOldGC 옵션으로 병렬 콤팩팅 콜렉터를 명시적으로 지정 가능



#### CMS 콜렉터

![](/java-performance-tuning/147-10.png)

*출처 :&amp;nbsp;Sun Microsystem, "Memory Management in the Java HotSpotTM Virtual Machine"*

-   해당 방식은 로우 레이턴시 콜렉터(low-latency collector)로도 알려져 있으며, 힙 메모리 영역의 크기가 클 때 적합
-   CMS GC는 Java9 버전부터 deprecated 되었고 결국 Java14에서는 사용이 중지
-   Young 영역에 대한 GC는 병렬 콜렉터와 동일
-   Old 영역 GC는 다음 단계를 거침(병렬 Mark-Sweep)
    -   초기 표시 단계(Initial Mark) : 매우 짧은 대기 시간으로 살아 있는 객체를 찾는 단계
    -   컨커런트 표시 단계(Concurrent Mark) : 서버 수행과 동시에 살아 있는 객체에 표시를 해 놓는 단계
    -   재표시 단계(Remark) : 컨커런트 표시 단계에서 표시하는 동안 변경된 객체에 대해서 다시 표시하는 단계
    -   컨커런트 스윕 단계(Concurrent Sweep) : 표시되어 있는 쓰레기를 정리하는 단계

![](/java-performance-tuning/147-11.png)

-   CMS는 컴팩션 단계가 없어서, 위 그림처럼 듬성듬성함!
-   —XX:+UseConcMarkSweepGC 옵션으로 CMS 콜렉터를 명시적으로 지정 가능(JDK 13 이하까지겠지?)



#### G1 콜렉터

![](/java-performance-tuning/147-12.jpg)

*출처 :&amp;nbsp;https://www.dhaval-shah.com/g1-gc-primer/*

-   바둑판의 사각형을 Region이라고 함
-   Young 영역과 Old 영역이 물리적으로 나뉘어 있지 않고, 각 구역의 크기는 모두 동일함(1MB ~ 32MB)
-   이전에 본 콜렉터들은 모두 Young, Old가 리니어하게 나열되지만, G1은 아님(구역의 수는 약 2000개)
-   바둑판 모양의 각 구역은 각각 Eden, Survivor, Old 영역의 역할을 변경해 가면서 하고, Humongous라는 영역도 포함됨 + Available/Unused 역할도 존재하나 봄!



#### G1의 마이너 GC

> Eden 지역에서 GC가 수행되면 살아남은 객체를 식별(Mark)하고, 메모리를 회수(Sweep)함. 그리고 살아남은 객체를 다른 지역으로 이동시키게 됨. 복제되는 지역이 Available/Unused 지역이면 해당 지역은 이제 Survivor 영역이 되고, Eden 영역은 Available/Unused 지역이 됨

-   몇 개의 구역을 선정해 Young 영역으로 지정함
-   이 리니어하지 않은 구역에 객체가 생성되면서 데이터가 쌓임
-   Young 영역으로 할당된 구역에 데이터가 꽉 차면, GC를 수행
-   GC를 수행하면서 살아있는 객체들만 Survivor 구역으로 이동
-   살아남은 객체들이 이동된 구역은 새로운 Survivor 영역이 됨
-   다음에 Young GC가 발생하면 Survivor 영역에 계속 쌓다가.. 몇 번의 aging 작업을 통해서 Old 영역으로 승격 시킴
    -   Survivor 영역에 있는 객체가 몇 번의 Young GC 이후에도 살아 있다면!



#### G1의 메이저 GC

-   CMS GC의 방식과 비슷하며, 아래 여섯 단계로 나뉨(STW라고 표시되어 있는 단계에서는 모두 Stop The World가 발생)
    -   초기 표시 단계(Initial Mark, **STW**) : Old 영역에 있는 객체에서 Survivor 영역의 객체를 참조하고 있는 객체들을 표시
    -   기본 구역 스캔(Root region scanning) : Old 영역 참조를 위해서 Survivor 영역을 훑는데, 이 작업은 Young GC가 발생하기 전에 수행
    -   컨커런트 표시 단계(Concurrent Mark) : 전체 힙 영역에 살아있는 객체를 찾음. 만약, 이때 Young GC가 발생하면 잠시 멈춤!
    -   재표시 단계(Remark, **STW**) : 힙에 살아 있는 객체들의 표시 작업을 완료함. 이때, SATB라는 알고리즘을 사용하며, 이는 CMS GC에서 사용하는 방식보다 빠름
    -   청소 단계(Cleaning, **STW**) : 살아있는 객체와 비어 있는 구역을 식별하고, 필요 없는 개체들을 지움. 그러고 나서 비어 있는 구역을 초기화함!!
    -   복사 단계(**STW**) : 살아있는 객체들을 비어 있는 구역으로 모음



### 6\. 강제로 GC 시키기

-   System.gc(), Runtime.getRuntime().gc() 메서드로 강제 GC 가능함!
-   절대 하지 말기!!!!

## GC가 어떻게 수행되고 있는지 보고 싶다



### 1\. 자바 인스턴스 확인을 위한 jps

```bash
jps [-q] [-mlvV] [-Joption] [<hostid>]
```

-   jps는 해당 머신에서 운영 중인 JVM의 목록을 보여줌(jdk의 bin 디렉터리에 있음)
-   \-q : 클래스나 JAR 파일명, 인수 등을 생량하고 내용을 나타냄(프로세스 id만 보임)
-   \-m : main 메서드에 지정한 인수들을 나타냄
-   \-l : 애플리케이션의 main 클래스나 애플리케이션 JAR 파일의 전체 경로 이름을 나타냄
-   \-v : JVM에 전달된 자바 옵션 목록을 나타냄
-   \-V : JVM의 플래그 파일(.hotspotrc의 확장자를 가지거나 자바 옵션에 —XX:Flag로 명시한 파일)을 통해 전달된 인수를 나타냄
-   \-Joption : 자바 옵션을 이 옵션 뒤에 지정 가능함



### 2\. GC 상황을 확인하는 jstat

```
jstat --<option> [-t] [-h<lines>] <vmid> [<interval> [<count>]]
```

-   jstat는 GC가 수행되는 정보를 확인하기 위한 명령어
-   유닉스 장비에서 vmstat이나 netstat와 같이 라인 단위로 결과를 보여줌
-   &lt;option&gt;을 제외한 jstat 명령의 옵션은 다음과 같음
    -   \-t : 수행 시간(해당 자바 인스턴스가 생성된 시점부터의 시간. 즉, 서버가 기동 된 시점부터의 시간)을 표시함
    -   \-h:lines : 각 열의 설명을 지정된 라인 주기로 표시함
    -   interval : 로그를 남기는 시간의 차이(밀리초 단위)를 의미
    -   count : 로그 남기는 횟수
-   &lt;option&gt;의 종류는 다음과 같으며, 이 값에 따라서 결과의 내용이 많이 달라짐!
    -   class : 클래스 로더에 대한 통계
    -   compiler : 핫스팟 JIT 컴파일러에 대한 통계
    -   gc : GC 힙 영역에 대한 통계
    -   gccapacity : 각 영역의 허용치와 연관된 영역에 대한 통계
    -   gccause : GC의 요약 정보와, 마지막 GC와 현재 GC에 대한 통계
    -   gcnew : 각 영역에 대한 통계
    -   gcnewcapacity : Young 영역과 관련된 영역에 대한 통계
    -   gcold : Old와 Perm 영역에 대한 통계
    -   gcoldcapacity : Old 영역의 크기에 대한 통계
    -   gcpermcapacity : Perm 영역의 크기에 대한 통계
    -   gcutil : GC에 대한 요약 정보
    -   printcompilation : 핫스팟 컴파일 메서드에 대한 통계



```bash
jstat -gcnew -t -h10 2624 1000 20 > jstat_WAS1.log
```

-   각 영역에 대한 통계를 보여줌(gcnew)
-   수행 시간을 나타냄(-t)
-   10줄에 한 번씩 각 열의 설명(타이틀)을 나타냄(-h10)
-   프로세스 번호는 2424
-   1초(1000ms)에 한 번씩 정보를 보여줌
-   20회 반복 수행함
-   jstat\_WAS1.log 파일에 결과를 저장함
-   jstat에서 프린트되는 결과를 사용하여 그래프를 그리면 GC가 처리되는 추이를 알아볼 수 있으므로 편리함!
-   결과를 파일로도 남길 수 있어 나중에 분석할 때 사용할 수 있음
-   하지만, 이 결과만으로 어떻게 해석하면 좋을지 알기 어렵다는 단점이 존재함
-   하지만, JVM 파라미터 튜닝을 하거나, GC를 수행하는 데 소요된 모든 시간을 보고 싶을 때 유용하게 사용할 수 있음
-   하지만, jstat을 로그로 남겨 분석하는 데는 한계가 존재함.
    -   why? → 로그를 남기는 주기에 GC가 한 번 발생할 수도 있고, 10번 발생할 수도 있기 때문임
    -   **따라서, 정확한 분석을 하고자 하면, verbosegc 옵션 사용을 권장함**



### 3\. GC 튜닝할 때 가장 유용한 jstat 옵션은 두 개

-   jstat 명령에서 GC 튜닝을 위해서 자주 사용하는(상민님이) 옵션은 -gcutil과 -gccapacity!



#### \-gccapacity 옵션

![](/java-performance-tuning/148-01.png)

-   해당 옵션은 현재 각 영역에 할당되어 있는 메모리의 크기를 KB 단위로 나타냄
-   각 영역의 크기를 알 수 있기 때문에, 어떤 영역의 크기를 좀 더 늘리고, 줄여야 할지를 확인할 수 있다는 장점이 있음!
-   NGC로 시작하는 것 : New(Young) 영역의 크기 관련 정보
-   OGC로 시작하는 것 : Old 영역 크기 관련 정보
-   PGC로 시작하는 것 : Perm 영역 크기 관련 정보(jdk17이라 위 사진에서는 나오지 않음!)
-   S0C : Survivor0 영역의 현재 할당된 크기
-   S1C : Survivor1 영역의 현재 할당된 크기
-   EC : Eden 영역의 현재 할당된 크기
-   OC : Old 영역의 현재 할당된 크기
-   PC : Perm 영역의 현재 할당된 크기(jdk17이라 위 사진에서는 나오지 않음!)
-   MN : MIN 이라는 뜻
-   MX : MAX 라는 뜻
-   C : Committed 라는 뜻
-   FGC : Full GC 횟수
-   YGC : Minor GC 횟수



#### \-gcutil 옵션

![](/java-performance-tuning/148-02.png)

-   해당 옵션은 힙 영역의 사용량을 %로 보여줌
-   S0, S1 : Survivor 영역
-   E / O : Eden, Old
-   YGC : Young 영역(S0, S1, E)의 GC 횟수
-   YGCT : Young 영역의 GC가 수행된 누적 시간(초)
-   P : Perm (M은 메타스페이스인 듯)
-   FGC : Full GC 횟수
-   FGCT : Full GC가 수행된 누적 시간(초)
-   GCT : YGCT + FGCT
-   Young GC가 한 번 수행될 때의 시간 : YGCT / YGC
-   CMS GC의 경우 Full GC의 단계에 따라서 수행되는 시간이 다름(평균값이 낮다고 무시해서는 안됨) → verbosegc를 활용하는 것이 확실함



### 4\. 원격으로 JVM 상황을 모니터링하기 위한 jstatd

```bash
jstatd [-nr] [-p port] [-n rminame]
```

-   위 명령어들은 로컬 시스템에서만 모니터링 가능함(원격 모니터링 불가능)
-   jstatd 데몬으로 원격 모니터링이 가능함!
-   하지만, 데몬을 중지하면, 서버가 가동 중일 경우에도 원격 모니터링이 불가능함!
-   nr : RMI registry가 존재하지 않을 경우, 새로운 RMI 레지스트리를 jstatd 프로세스 내에서 시작하지 않는 것을 정의하기 위한 옵션
-   p : RMI 레지스트리를 식별하기 위한 포트 번호
-   n : RMI 객체의 이름을 지정함.(기본은 JStatRemoteHost)

![](/java-performance-tuning/148-03.png)

-   막 실행하면, 오류가 발생함
-   자바에 기본적으로 지정되어 있는 보안 옵션이 jstatd가 리모트 객체를 만드는 것을 억제하기 때문임.
-   이를 해결하기 위해서는 Amazon Corretto 17 기준, 설치 경로에 들어가서 lib/security/default.policy를 수정하면 되는 것으로 보임!
-   jstatd를 통해 ‘프로세스ID@호스트명:포트 번호’를 지정하면 원격으로 jstat 명령을 수행해 결과를 확인할 수 있음(해당 포트를 방화벽에서 열어주어야 함!)
-   jstat -gcutil 2904@le2sky:2020 1000



### 5\. verbosegc 옵션을 이용해 gc 로그 남기기

```bash
java -verbosegc <기타 다른 옵션들> 자바 애플리케이션 이름
```

-   jvmstat을 사용할 수 없는 상황에서는 verbosegc 옵션을 이용하면 됨!
-   자바 수행 시, 간단하게 -verbosegc라는 옵션을 추가하면 됨!

![](/java-performance-tuning/148-04.png)

-   Young 영역에 마이너 GC가 발생했으며, 29MB에서 26MB로 축소됨
-   전체 할당 크기는 260MB이며, GC 수행 시간은 30.268ms임!!



#### PrintGCTimeStamps 옵션

-   \-XX:PrintGCTimeStamps 옵션을 추가하면, 수행한 시간이 포함됨!
-   서버가 기동 되기 시작한 이후부터 해당 GC가 수행될 때까지의 시간을 로그에 포함하기 때문에 언제 GC가 발생되었는지 확인할 수 있음
-   open jdk aws 17 기준, 없는 옵션



#### PrintHeapAtGC 옵션

-   해당 옵션을 지정하면 GC에 대한 더 많은 정보를 볼 수 있지만, 너무 많은 내용을 보여줌
-   Before 블록에는 GC 전의 메모리 상황, After 블록에는 GC 후의 메모리 상황을 제공(벤더마다 다름)
-   open jdk aws 17 기준, 없는 옵션



#### PrintGCDetails

![](/java-performance-tuning/148-05.png)

-   PrintHeapAtGC보다 훨씬 간결하고 보기 쉬운 옵션



#### 각 서버에 알맞은 분석 툴이 있다!?

-   vervosegc 옵션에 다양한 추가 옵션을 사용하면, GC 현상에 대해 더 정밀하게 분석 가능함
-   하지만, 텍스트 기반으로 나온 결과를 직접 머리로 계산하면서 분석하고 싶은 사람은 없을 것 ㅠㅠ…
-   따라서, 각 서버에 알맞은 분석 툴들이 존재함
    -   GC Analyzer
    -   IBM GC 분석기
    -   HPjtune



### 6\. 어설프게 아는 것이 제일 무섭다

-   메모리 릭은 1%도 안 되는 시스템에서 발생함
-   메모리 릭이 발생하는지 확인하는 가장 확실한 방법은 vervosegc를 남겨서 보는 방법임!
-   또한, 간단하게 확인할 수 있는 다른 방법은 Full GC가 일어난 이후에 메모리 사용량을 보는 것
-   정확하게는 Full GC가 수행된 후에 Old 메모리 사용량을 봐야 함
-   만약 사용량이 80% 이상이면 메모리 릭을 의심해봐야 함
-   하지만, Full GC를 한 번도 하지 않은 시스템에 메모리 릭이 있다고 이야기할 수 없음
-   **jstat, vervosegc 로그 결과를 가지고 이야기해야 함. jstat의 old 영역은 항상 올라가는 것이 정상임. Full GC가 발생한 이후의 메모리 사용량으로 메모리 릭 여부를 판단하라!**

## GC 튜닝을 항상 할 필요는 없다(+ GC 튜닝 절차)





### 1\. GC 튜닝을 꼭 해야 할까?

-   GC 튜닝은 항상 할 필요는 없고, 자바의 GC 튜닝은 꼭 필요한 경우에만 하는 것이 좋음
-   기본적인 메모리 크기 정도만 지정하면 웬만큼 사용량이 많지 않은 시스템에서는 튜닝을 할 필요가 없음
-   GC 튜닝을 하는 가장 좋은 시기는 시스템이 오픈한 이후임
    -   **why?** 아무리 성능 테스트를 통해서 부하를 준다 해도, 실제 사용자들이 사용하는 패턴과 동일하게 구현하기가 힘들기 때문
-   GC 튜닝이 필요 없다는 이야기는 운영 중인 Java 기반 시스템의 옵션에 기본적으로 다음과 같은 것들은 추가되어 있을 때의 경우임
    -   \-Xms, -Xmx 옵션으로 메모리 크기를 지정
    -   \-server 옵션이 포함
-   또한, 시스템의 로그에는 타임아웃 관련 로그가 남아있지 않아야 함. 여기서 타임 아웃은 다음과 같은 것들을 말함
    -   DB 작업과 관련된 타임아웃
    -   다른 서버와의 통신 시 타임아웃
    -   **why?** 타임아웃 로그가 존재하고 있다는 것은 해당 시스템을 사용하는 사용자 중 대다수나 일부는 정상적인 응답을 받지 못했다는 것을 의미함. 또한, 대부분 서로 다른 서버 간에 통신 문제나 원격 서버의 성능이 느려서 타임아웃이 발생할 수도 있지만, 그 이유가 GC 때문일 수도 있음
    -   즉, 타임아웃 관련 로그가 쌓여있다면, GC 튜닝을 해야 하는지 생각해 볼 여지가 있음



#### GC 튜닝을 고려해볼 상황

-   JVM의 메모리 크기도 지정하지 않았음!
-   Timeout이 지속적으로 발생하고 있음!
-   개발하고 있는 시스템에서 GC 튜닝을 하는 것이 좋음. 그렇지 않다면, GC 튜닝할 시간에 다른 작업을 하는 것이 더 나음
-   반드시, 명심해야하는 부분은 GC 튜닝은 가장 마지막에 하는 작업이라는 것



#### GC 튜닝을 하는 근본적인 이유

-   Java에서 생성된 객체는 가비지 컬렉터가 처리해서 지움
-   생성된 객체가 많으면 많을수록 가비지 컬렉터가 처리해야 하는 대상도 많아짐
-   GC를 수행하는 횟수도 증가함
-   즉, 운영하고 만드는 시스템이 GC를 적게 하도록 하려면 객체 생성을 줄이는 작업을 먼저 해야 함
-   만약 애플리케이션 메모리 사용도 튜닝을 많이 해서 어느 정도 만족할 만한 상황이 되었다면, 본격적으로 GC 튜닝을 시작하면 됨
-   필자(상민님)는 GC 튜닝의 목적을 두 가지로 봄
    -   Old 영역으로 넘어가는 객체의 수를 최소화하는 것
    -   Full GC의 실행 시간을 줄이는 것



#### Old 영역으로 넘어가는 객체의 수 최소화하기

-   Oracle JVM에서 제공하는 모든 GC는 Generational GC임
-   즉, Eden 영역에서 객체가 처음 만들어지고, Survivor를 오가다가, 끝까지 남아 있는 객체는 Old 영역으로 이동함(G1은 조금 상이하게 동작)
-   간혹 Eden 영역에서 바로 Old 영역으로 넘어가는 객체도 존재하긴 함
-   **Old 영역의 GC는 New 영역의 GC에 비해, 상대적으로 시간이 오래 소요되기 때문에 Old 영역으로 이동하는 객체의 수를 줄이면 Full GC가 발생하는 빈도를 많이 줄일 수 있음**
-   Old 영역으로 넘어가는 객체의 수를 줄인다는 말을 오해하면, 객체를 마음대로 New 영역에만 남길 수 있다고 생각할 수 있지만, 그렇게는 할 수 없음. 하지만, New 영역의 크기를 잘 조절함으로써 큰 효과는 볼 수 있음



#### Full GC 시간 줄이기

-   Full GC의 수행 시간은 상대적으로 Young GC에 비해 오래 소요됨
-   따라서, Full GC 실행에 시간이 오래 소요되면(1초 이상) 연계된 여러 부분에서 타임아웃이 발생할 수 있음
-   그렇다고 해서 Full GC 실행 시간을 줄이기 위해 Old 영역의 크기를 줄이면 OOM이 발생하거나 Full GC 빈도가 늘어남
-   반대로, Old 영역의 크기를 늘리면 Full GC 횟수는 줄어들지만, 실행 시간이 늘어날 것
-   **Old 영역의 크기를 적절하게 잘 설정해야 함**



### 2\. GC의 성능을 결정하는 옵션들

-   이런저런 옵션을 많이 설정한다고 시스템의 GC 수행 속도가 월등히 빨라지진 않음
-   **두 대 이상의 서버에 GC 옵션을 다르게 적용해서 비교해 보고, 옵션을 추가한 서버의 성능이나 GC 시간이 개선된 때에만 옵션을 추가하는 것이 GC 튜닝의 기본 원칙**
-   다음 표는 성능에 영향을 주는 GC 옵션 중 메모리 크기와 관련된 옵션

| 구분 | 옵션 | 설명 |
| --- | --- | --- |
| 힙(heap) 영역 크기 | -Xms | JVM 시작 시 힙 영역 크기 |
|  | -Xmx | 최대 힙 영역 크기 |
| New 영역의 크기 | -XX:NewRatio | New 영역과 Old 영역의 비율 |
|  | -XX:NewSize | New 영역의 크기 |
|  | -XX:SurvivorRatio | Eden 영역과 Survivor 영역의 비율 |

-   이 중 필자(상민님)가 GC 튜닝할 때 자주 사용하는 옵션은 -Xms, -Xmx, -XX:NewRatio 옵션
-   특히 -Xms, -Xmx는 필수 옵션임.
-   또한, NewRatio의 값에 따라서 GC 성능에 많은 차이가 발생함
-   Perm 영역의 크기는 OOM의 원인이 Perm인 경우에만 조정할 것(메타스페이스도 마찬가지일 듯!!?)



| 구분 | 옵션 |
| --- | --- |
| Serial GC | -XX:+UseSerialGC |
| Parallel GC | -XX:+UseParallelGC |
|  | -XX:ParallelGCThreads=value |
| Parallel Compacting GC | -XX:+UseParallelOldGC |
| CMS GC | -XX:+UseConcMarkSweepGC |
|  | -XX:+UseParNewGC |
|  | -XX:+CMSParallelRemarkEnabled |
|  | -XX:CMSInitiatingOccupancyFraction=value |
|  | -XX:+UseCMSInitiatingOccupancyOnly |
| G1 | -XX:+UnlockExperimentalVMOptions |
|  | -XX:+UseG1GC |

-   GC의 성능에 많은 영향을 주는 또 다른 옵션은 GC 방식임 위 표는 GC 방식에 따라서 지정할 수 있는 옵션임(aws jdk 17의 경우 cms, parallel compacting gc는 없는 것으로 보임)
-   G1 GC를 제외하고는, 각 GC 방식의 첫 번째 줄에 있는 옵션을 지정하면 GC 방식이 변경됨
-   GC 방식 중 특별히 신경 쓸 필요가 없는 방식은 Serial GC(클라이언트 장비에 최적화되어 있기 때문)



### 3\. GC 튜닝의 절차

-   GC 튜닝 절차 또한, 대부분의 성능 개선 작업과 크게 다르지 않음
-   절차는 다음과 같음
    -   **GC 상황 모니터링** : GC 상황을 모니터링하며, 현재 운영되는 시스템의 GC 상황을 확인
    -   **모니터링 결과 분석 후 GC 튜닝 여부 결정** :
        -   GC 수행 시간이 1-3초, 심지어 10초가 넘는다면, GC 튜닝 진행(즉, 소요시간이 오래 걸리는 경우라면!)
        -   자바 메모리를 10GB로 할당하고, 메모리의 크기를 줄일 수 없다면..? → GC 튜닝 이전에 시스템의 메모리를 왜 높게 잡아야 하는지 생각해 봐야만 함.
        -   만약 메모리를 1-2GB로 지정했을 때, OOM이 발생한다면, 힙 덤프를 떠서 원인을 확인하고, 문제점을 제거해야 함(힙 덤프 생성 중에 Java 프로세스가 멈추기 때문에 운영 중에는 파일 생성하지 말 것)
    -   **GC 방식/메모리 크기 지정 :**
        -   GC 튜닝을 진행하기로 결정했다면, GC 방식을 선정하고 메모리의 크기를 지정함
        -   서버가 여러 대이면, 서버에 GC 옵션을 서로 다르게 지정하여 GC 옵션에 따른 차이를 확인하는 것이 중요함
    -   **결과 분석 :**
        -   GC 옵션을 지정하고 적어도 24시간 이상 데이터를 수집한 후에 분석을 실시함
        -   운이 좋으면 해당 시스템에 가장 적합한 GC 옵션을 찾을 수 있음
        -   그렇지 않으면, 로그를 분석해 메모리가 어떻게 할당되는지 확인해야 함
        -   그다음에 GC 방식/메모리 크기를 변경해 가면서 최적의 옵션을 찾아 나감!
    -   **결과가 만족스러울 경우 전체 서버에 반영 및 종료 :** 잘못하면 장애로 이어질 수 있기 때문에 조심할 것.



> 더욱 자세히 알아보자.



#### 1, 2 단계 : GC 상황 모니터링 및 결과 분석하기

-   jstat으로 간단하게 확인할 수 있음
-   다음 데이터를 살펴볼 것
    -   YGC, YGCT의 값 →YGCT / YGC = Young GC 평균 소요 시간
    -   FGC, FGCT의 값 → FGCT / FGC = Full GC 평균 소요 시간
    -   단, 평균이라는 점을 감안할 것
-   \-vervosegc으로 로그를 남겨 분석하는 방법도 있음
-   다음에 나오는 모든 조건이 만족하면 GC 튜닝이 필요 없음(시간은 절댓값이 아닌, 서비스의 상황에 따라 달라질 수 있음) → 서비스의 특성에 따라 GC 튜닝 작업을 진행할지 결정할 것
    -   Minor GC의 처리 시간이 빠름(50ms 내외)
    -   Minor GC 주기가 빈번하지 않음(10초 내외)
    -   Full GC의 처리 시간이 빠름(보통 1초 내외)
    -   Full GC 주기가 빈번하지 않음(10분에 1회)
-   GC 상황을 확인할 때 Minor GC와 Full GC의 시간만 보면 안 되며, 수행 횟수도 확인해야 함
-   New 영역의 크기가 너무 작다면, Minor GC의 빈도가 높고, Old 영역으로 넘어가는 객체의 수도 증가하여 Full GC 횟수도 증가함. → gccapacity 옵션을 적용해 각 영역을 얼마나 점유하여 사용하는지도 확인해야 함!



#### 3-1 단계 : GC 방식 지정

-   Serial GC는 운영에서 사용하지 못함.
-   GC를 선택하는 가장 좋은 방법은 직접 적용해 보고 확인해보는 것..
-   책에서는 CMS GC와 Parallel GC와의 차이점인 Compaction에 대해서 더 자세히 다룸(Concurrent mode failure, 단편화와 같은 이야기들). 다만, CMS는 jdk 9부터 deprecated 되었으니, 생략
-   여하튼! 중요한 것은 운영 중인 시스템 특성에 따라 적합한 GC 방식이 다르므로 해당 시스템에 최적인 방식을 찾아야 한다는 것! 운영 서버가 6대 정도 있다면, 2대씩 각 옵션을 동일하게 지정하고 -verbosegc 옵션을 추가해 결과를 분석하는 방법을 추천함



#### 3-2 단계 : 메모리 크기

-   해당 파트에서 말하는 메모리 크기는 JVM의 시작 크기(-Xms)와 최대 크기(-Xmx)를 말함
-   메모리 크기와 GC 발생 횟수, GC 수행 시간의 관계는 다음과 같음(중요)
    -   메모리 크기가 클수록
        -   GC 발생 횟수 감소
        -   GC 수행 시간 증가
    -   메모리 크기가 작을수록
        -   GC 발생 횟수 증가
        -   GC 수행 시간 감소
-   자원이 좋은 시스템이라서 메모리를 10GB로 설정해도 Full GC가 1초 이내에 끝나면, 10GB로 지정해도 괜찮음.
    -   **but!** → 대부분의 서버는 메모리를 10GB로 설정하면 Full GC 시간이 10-30초 정도 소요됨(객체의 크기가 어떻게 되어 있느냐에 따라 다름)
-   그러면… 어떻게 지정하는 게 좋을까?!
    -   필자(상민님)는 보통 500MB로 설정하는 것을 추천(-Xms, -Xmx가 둘 다 500m이 아님)
    -   GC 튜닝 이전에 현재 상황을 모니터링한 결과를 바탕으로 Full GC가 발생한 이후에 남아 있는 메모리의 크기를 봐야 함!
    -   만약, Full GC 이후에 남아 있는 Old 영역의 메모리가 300MB 정도라면. 300MB(기본 사용) + 500MB(Old 영역용 최소) + 200MB(여유 메모리)를 감안해 1GB 정도로 지정하는 것이 좋음(Old 영역을 위해서 500MB 이상 여유가 있는 공간을 지정)
    -   따라서, 3대 정도의 운영 서버가 있으면 서버 한대는 1GB, 다른 한대는 1.5GB, 다른 한대는 2GB로 지정하고 결과를 지켜본 다음 결정함
    -   이론적으로 1 > 1.5 > 2 순으로 GC가 빠르지만, 그 차이가 근소할 수 있음. 따라서, 측정 데이터 셋을 최대한 만들어서 모니터링을 통해서 확인하는 것이 가장 좋음(트레이드오프를 고려하기 위해!)
    -   1이랑 1.5가 0.2초 차이지만, Full GC 횟수가 줄어들 수 있음. 0.2초를 감안하고 1.5를 선택하는 것도 방법임

-   메모리 크기를 지정할 때 또 고려해야 하는 것이 존재함!
    -   바로바로… NewRatio!!!!!!! 이전에 말했던 것처럼. New Ratio는 New 영역과 Old 영역의 비율임
    -   ex) -XX:NewRatio=1 로 지정하면 1:1 비율이 됨
    -   ex) -XX:NewRatio=2 로 지정하면, 1(New):2(Old) 비율이 됨
    -   즉, 값이 커질수록 Old가 커짐
    -   **New 영역의 크기가 작을수록(중요) → Old 영역으로 넘어가는 메모리의 양이 많아져, Full GC도 잦아지고 시간도 오래 걸림**
    -   2-3 정도가 경험상 괜찮았지만, 직접 해보는 게 중요함(서비스의 상황에 맞는 값을 찾는 작업)



#### 중간 팁) GC 튜닝을 가장 빨리 진행하는 방법은 무엇일까?

-   성능 테스트로 결과를 비교하는 것이 가장 빠르게 검토 결과를 얻을 수 있는 방법임
-   동일한 서비스를 제공하는 운영 서버의 대수가 많으면, 서버마다 옵션을 다르게 지정하고 상황을 모니터링하면 됨
    -   이렇게 설정한 이후, 적어도 하루에서 이틀 정도 데이터가 쌓인 후에 보는 것이 바람직함
    -   성능 테스트를 통해 GC 튜닝을 하면 빠른 시간에 결과를 얻을 수 있지만, 운영 상황과 동일하게 부하를 줄 수 있는 환경을 구성하는 작업이 쉽지가 않음 + 부하를 주는 URL과 같은 요청 비율도 운영과 동일해야 함
    -   시간이 오래 걸리더라도 운영에 적용하고 결과를 기다리는 것이 더 간단하고 편리함



### 4단계: GC 튜닝 결과 분석

-   GC 옵션을 적용하고, -verbosegc 옵션을 지정한 다음에 tail 명령어로 로그가 제대로 쌓이고 있는지 확인해야 함
-   로그가 잘 쌓이고 있다면, 하루 혹은 이틀 정도의 데이터가 축적된 후 결과를 확인해 보자
-   분석할 때는 다음의 사항을 중심으로 살펴볼 것(순서대로 우선순위가 높음)
    -   Full GC 수행 시간
    -   Minor GC 수행 시간
    -   Full GC 수행 간격
    -   Minor GC 수행 간격
    -   전체 Full GC 수행 시간
    -   전체 Minor GC 수행 시간
    -   전체 GC 수행 시간
    -   Full GC 수행 횟수
    -   Minor GC 수행 횟수

## 모니터링 API인 JMX



### 1\. JMX란?

-   JMX(Java Management Extensions) : 자바 기반의 모든 애플리케이션을 모니터링하기 위해서 만든 기술로, JDK 5.0부터 본격적으로 지원되었음.
-   JMX를 이용해 리소스를 관리하기 위해서는 MBean(Managed Bean)을 생성해야 함. 자원을 MBean으로 감싸고, 외부에서 API로 설정, 데이터수집, 원격제어등을 할 수 있도록 함.
-   JMX는 주로 3개의 레벨로 나뉘어 서비스를 제공함.



#### JMX 아키텍처 컴포넌트 사이의 관계

![](/java-performance-tuning/150-01.jpg)

*출처 : https://docs.jboss.org/jbossas/docs/Server_Configuration_Guide/4/html/The_JBoss_JMX_Microkernel-An_Introduction_to_JMX.html*

-   Instrumentation Level : 하나 이상의 MBean을 제공하며, 이 MBean에서 필요한 리소스들의 정보를 취합해 에이전트로 전달하는 역할을 수행함
-   Agent Level : 에이전트는 리소스를 관리하는 역할을 수행함. 일반적으로 에이전트는 모니터링이 되는 서버와 같은 장비에 위치함. 에이전트는 MBean 서버와 MBean을 관리하는 서비스의 집합으로 구성되며, JMX의 데이터를 관리하는 관리자와 연계를 위한 어댑터나 커넥터를 해당 레벨에서 제공함
-   Distributed Services Level : 해당 레벨은 JMX 관리자를 구현하기 위한 인터페이스와 컴포넌트를 제공함. 여러 에이전트에서 제공하는 정보를 관리할 수 있는 화면과 같은 부분을 여기서 담당함

#### MBean에 대해서 조금만 더 자세히 알아보자

-   JMX를 제대로 이해하기 위해서는 MBean에 대해서 정확하게 이해해야 함
-   MBean은 4가지 종류가 존재함
    -   표준 MBean : 변경이 많지 않은 시스템을 관리하기 위한 MBean이 필요한 경우 사용
    -   동적 MBean : 애플리케이션이 자주 변경되는 시스템을 관리하기 위한 MBean이 필요한 경우 사용
    -   모델 MBean : 어떤 리소스나 동적으로 설치가 가능한 MBean이 필요한 경우 사용
    -   오픈 MBean : 실행 중에 발견되는 객체의 정보를 확인하기 위한 MBean이 필요할 때 사용
-   에이전트의 작동 원리는 다음과 같음
    -   MBean은 에이전트 서비스를 통해 MBean 서버에 데이터를 전달
    -   MBean 서버를 통해서 클라이언트에서 서버의 상황을 모니터링 가능
        -   이때 에이전트는 다음 기능을 제공해야 함!
        -   현재 서버에 있는 MBean의 속성값을 얻고, 변경
        -   현재 서버에 있는 MBean의 메서드를 수행
        -   모든 MBean에서 수행된 정보를 받음
        -   기존 클래스나 새로 다운로드된 클래스의 새로운 MBean을 초기화하고 등록
        -   기존 MBean들의 구현과 관련된 관리 정책을 처리하기 위해서 에이전트 서비스를 사용되도록 함



### 2\. Visual VM을 통한 JMX 모니터링

-   jdk 설치 경로 하위 bin 내부에 jconsole, jvisualvm(Java Visual VM이라는 것인데, 없을 수도 있음)이 존재
-   위 두 개의 툴은 JVM을 모니터링하기 위해서 만들어진 툴임
-   위 두 개의 툴을 이용하면 JMX의 데이터를 볼 수 있음
-   이 외에도 다양한 툴도 있나 봄!(Mission Control.. 등)



### 3\. 원격으로 JMX를 사용하기 위해서

-   **모니터링 툴로 인한 부하는 절대 무시할 수 없음(상용 툴도 마찬가지). 서버의 CPU 및 메모리, 네트워크 리소스에 여유가 없는 상황에서는 주의해서 사용해야 할 것**
-   원격지에 있는 서버와 통신을 하여 JMX 모니터링을 하기 위해서는 서버나 자바 애플리케이션을 시작할 때 VM 옵션을 지정해야 함
-   아이디와 패스워드를 지정해 접속할 수 있도록 변경하려면 다음과 같이 지정
    -   \-Dcom.sun.management.jmxremote.port=9003
    -   \-Dcom.sun.management.jmxremote.password.file=…
    -   \-Dcom.sun.management.jmxremote.access.file=…
    -   \-Dcom.sun.management.jmxremote.ssl=false
-   아래처럼 지정하면 아이디, 패스워드 필요 없이 서버의 IP/포트만으로 서버에 원격 접속 가능
    -   \-Dcom.sun.management.jmxremote.port=9003
    -   \-Dcom.sun.management.jmxremote.ssl=false
    -   \-Dcom.sun.management.jmxremote.authenticate=false

## 반드시 튜닝해야 하는 대상은?

> 여러 테스트를 수행할 때, 튜닝까지는 아니더라도 구간별 응답 속도를 체크하는 작업은 필요함.

### 1\. 반드시 튜닝해야 하는 대상 선정

-   개발자가 시간적 여유가 있으면 자신이 만든 화면을 모두 분석할 수도 있지만, 현실적으로 불가능함
-   만약 APM 툴이 있다면, 이를 이용해 전체 프로그램을 분석하면 됨
-   하지만, 없다면 어떻게 분석 및 튜닝 대상을 선정할 수 있을까?
    -   파레토의 법칙 : 상위 20%가 전체 부의 80%를 차지함
    -   유지보수 대상 시스템에도 파레토의 법칙은 적용됨
    -   즉, 상위 20%의 사용량을 점유하는 화면을 찾는 것
-   상위 20%의 사용량을 점유하는 화면은 어떻게 찾아야 할까?
    -   기존 시스템이 존재한다면, 기존 시스템 모니터링 툴의 통계 기능을 사용 가능함
    -   모니터링 툴 없이 기존 시스템을 사용해 왔다면, 기존 시스템의 웹 로그(Access Log)를 분석하는 방법이 있음 → 22장 참고
    -   기존 시스템 없이 새로운 시스템을 만들 경우에는 (고객이 있는 SI 프로젝트라면) 요구 사항을 만들어 내는 고객에게 예상되는 화면을 선정해 달라고 요청할 수 있음
    -   대민 서비스(대외 오픈 서비스)를 하지 않은 대부분의 시스템은 사용하는 사용자 수와 업무를 바탕으로 선정할 수도 있음



#### 대표적으로 많이 사용되는 화면 - 병원 시스템

| 구분 | 화면명 |
| --- | --- |
| 초기 화면 | 로그인 |
| 원무 | 환자 접수 신청 |
| 진료 | 환자 조회, 처방전 지정, 치료 일수 입력, 처방 내림, 외래 기록지 저장 |
| 원무 | 수납 조회, 수납 처리 |

-   이외에도 여러 기능 및 화면이 있을 수 있지만, 가장 많이 사용하는 기능들은 대부분 위 표에 해당됨
-   시스템을 오픈했을 때, 위 화면에 기능이나 성능 문제가 있으면 사용자들은 불만을 가지게 될 것이고, 시스템의 신뢰성은 떨어질 수밖에 없음
-   따라서, 위 표에 해당되는 기능들은 점검 및 튜닝이 필수가 될 수 있음



#### 다른 프로젝트의 사례 - 하나의 화면(JSP) 때문에 시스템이 다운되는 경우

-   한 시스템이 매일 14-16시 사이에만 다운되는 현상이 발생(대외로 오픈된 시스템)
-   시스템의 로그 분석을 해서 하나의 화면이 한 시간에 10만 번 이상 호출되는 것을 발견함
-   그 화면은 천 개가 넘는 협력사의 요청 처리 정보가 그 시간대에 공개되는 화면이었음
-   정말 이 화면 때문일까? → 확실하게 하기 위해 서버 구성을 변경하고 확신!
-   분석 :
    -   호출되는 화면의 응답 속도는 0.2-0.3초로 양호
    -   DB 쿼리 수행 시간 대 애플리케이션 수행 시간의 비율은 8:2로, DB에서 많은 응답 시간이 소요됨
    -   검색 조건 화면을 로딩할 때 DB에서 3회 검색을 수행함
    -   화면의 응답 속도는 사용자가 증가할수록 오래 소요
    -   DB 쿼리 수행 시간 및 애플리케이션 수행 시간이 증가하면서 발생하는 당연한 현상
    -   해당 화면에서 실행되는 쿼리는 총 49번 정도..
    -   이외에 코드성 데이터를 가져오기 위한 쿼리도 다수 존재
    -   검색 조건 화면을 로딩할 때도 DB 쿼리를 수행
-   (하늘 생각) 쿼리 잘 짜라 … 이건가? 아니면 튜닝의 중요성을 강조하는 것일까?



### 2\. 왜 로그인 화면을 튜닝(분석) 해야 하는가?

-   그룹웨어는 그룹의 전 임직원 및 사외의 비즈니스 협력 관계에 있는 사람들과 상호 커뮤니케이션을 하기 위한 시스템이기 때문에 중요함
-   그룹웨어 시스템이 다운될 경우 기업에 많은 손실을 가져올 수 있음
-   그룹웨어의 사용자가 가장 집중되는 시간은 오전 출근 시간대, 오후 중식 이후 시간대일 것
-   해당 시간대에 로그인이 안되면 메일, 게시, 결재 등 중요한 업무를 처리할 기회조차 없음
-   대부분의 업무 시스템에서 로그인한 후의 화면은 여러 포틀릿(포탈 페이지를 구성하는 웹 컴포넌트)으로 구성
-   하나의 프레임으로 구성되어 있는 초기 화면이라면 단 하나의 포틀릿이나 구성 요소만 응답하지 않아도 다음 화면으로 진행할 수 없기 때문에 시스템 사용자가 불편을 겪게 될 것.
-   **만약 시스템을 운영하고 있다면, 가장 많이 사용하는 로그인 화면이 얼마나 많은 요청을 수행하는지, 필요 없는 요청이 있는지 확인하자!**



### 3\. 쇼핑몰 사이트에서는…

-   일반적으로 소비자는 원하는 물건을 구매할 때 쇼핑몰이나 가격 비교 사이트를 통해 상품을 조회하고, 제품의 상세 정보를 조회함
-   쇼핑몰이나 가격 비교 사이트의 초기 페이지가 열리지 않거나, 제품의 상세 정보 조회가 되지 않으면 해당 사이트는 많은 고객을 잃을 것
-   결제 수행을 할 수 없을 경우에도 동일한 결과가 발생
-   (하늘 생각) 튜닝 열심히 하자.. 라는 이야기인 듯



### 4\. 필자가 하고 싶은 말

-   성능을 분석할 대상을 정할 때, 모든 화면을 대상으로 하는 것은 상당히 무모한 행동임
-   시간적 여유가 있고, 모니터링 툴이 있다면 전체 화면을 점검하는 것을 권장하지만, 시간 대비 효율을 따졌을 때 상당히 비효율적인 작업이 될 수 있음
-   **따라서 여기에서 정리한 대로, 로그인 및 초기 화면, 가장 많이 사용하는 화면을 위주로 성능을 분석하는 것이 가장 현명한 방법**

## 어떤 화면이 많이 쓰이는지 알고 싶다



### 1\. 웹 로그란?

-   웹 로그 :
    -   아파치나 Nginx과 같은 모든 웹 서버에 공통적으로 제공되는 기능
    -   웹 서버에 어떤 사용자가 어떤 요청을 했고, 결과는 어떠한지 파일에 한 줄씩 쌓아 줌
-   사이트의 규모 및 사용자의 양에 따라서 로그가 많이 쌓이는 사이트도 있고, 그렇지 않은 사이트도 있음
-   웹 로그를 분석할 수 있는 도구들이 존재함



### 2\. Common Log Format

```
LogFormat "%h %l %u %y \\"%r\\" %>s %b" common
127.0.0.1 - - [22/Oct/20XX:14:04:43 +0900] "GET /a.gif HTTP/1.1" 200 2326
```

-   가장 일반적으로 사용하는 포맷으로 많은 서버가 일반 로그 포맷을 사용
-   %h : 서버에 요청한 클라이언트 IP 주소
-   %l : identd라는 사용자 인식 데몬이 클라이언트에서 동작하고 있는 경우에만 해당 정보가 나타남
-   %u : HTTP 인증을 통해 확인된 문서를 요청한 사용자의 ID가 표시
-   %t : 서버가 요청을 마친 시간. 즉, 웹 서버에서 해당 요청이 처리되어 종료된 시간
-   \\"%r\\" : 클라이언트에서 요청한 Request 정보
-   %>s : 서버에서 클라이언트로 보낸 최종 상태 코드
-   %b : 클라이언트로 전송한 데이터의 크기가 표시됨(헤더 정보의 크기 미포함)



### 3\. 기본 웹 로그의 단점과 극복

-   기본 웹 로그만 가지고는 성능에 대한 아무 데이터를 얻을 수 없음.(도움이 되긴 하지만!)
-   %D, %T를 추가해서 어느정도 해소 가능함
    -   %D : 요청의 처리 시간을 마이크로초 단위로 나타냄 (권장)
    -   %T : 요청의 처리 시간을 초 단위로 나타냄
-   (하늘 생각) common log format이 아닌 다른 형식을 사용할 경우에도 마찬가지로 비슷하게 적용 가능할 듯



### 4\. 결론

-   웹 로그를 사용하면, 그 동안 생각지도 못했던 문제점을 찾을 수도 있음
-   상용 툴을 사용한다면 실시간으로 데이터를 처리해 확인할 수도 있을 것
-   웹 로그를 그냥 방치하거나 삭제하지 말고 의미 있는 데이터가 될 수 있도록 활용할 것

## 튜닝의 절차는 상황마다 다르다

### 1\. 성능 튜닝을 위한 아주 기초 법칙

-   암달의 법칙 : 컴퓨터 성능 최적화의 한계점을 측정하기 위해 만든 법칙이며, 서버를 추가할 때 얼마만큼의 속도 향상이 있을 것인지 체크하기 위해 활용함
-   암달의 법칙을 수식으로 표현하면 다음과 같음!

![](/java-performance-tuning/153-01.png)

-   P : 개선 가능한 부분의 비율
-   S : 개선된 정도를 의미
-   만약, 개선 가능한 부분이 100%라면 P는 1이 됨. 또한 2배의 성능 향상이 이루어졌다면, S = 2가 됨
-   즉, 공식을 적용하면 성능 개선율은 2가 됨
-   암달의 법칙을 그래프로 나타내면 한계가 존재함

![](/java-performance-tuning/153-02.png)

### 2\. 성능 튜닝 step by step

-   원인 파악
-   목표 설정 → 성능 개선뿐이 아니라, 유지보수까지 고려
-   튜닝 실시 → 프로파일링 툴, APM, JMH.. 등등 적극 사용
-   개선율 확인(피드백 단계)
-   결과 정리 및 반영 → 꼭 필요한 사항들만 정리!



### 3\. 성능 튜닝의 비법

-   하나만 보지 말자! → 성능상 이슈가 존재하면, 절대 하나만 보지 말 것(다양한 가능성을 생각)
-   큰 놈을 없애자! → 잔챙이 백날 튜닝해 봤자 효과 없음
-   깊게 알아야 함! → 모든 것의 전문가가 되기는 어려움. 하나라도 전문가가 되자!
-   결과 공유는 선택이 아닌 필수! 다음과 같은 내용을 포함하면 좋음
    -   개요 : 튜닝을 실시한 배경
    -   튜닝 환경 : 튜닝을 실시하고 성능을 측정한 서버와 툴에 대한 상세한 내용
    -   튜닝 결과 : 튜닝 전과 후의 결과를 비교
    -   결론 : 어느 부분을 어떻게 변경하는 것이 가장 큰 효과를 줄지, 튜닝 작업을 진행한 담당자의 의견 등을 포함
-   튜닝 결과에 대해서는 다시 다음과 같은 유의사항이 존재함
    -   확실한 결과 위주로 포함 → 명확한 수치를 사용
    -   개선 효과가 큰 것부터 나열
    -   개발한 사람의 심기를 나쁘게 하지 말 것! → 무례하지 않게, 존중하면서, 완곡한 표현을 사용할 것

---
date: '2022-02-04'
title: '고등운영체제, 인터럽트 기반 운영체제'
categories: ['OS']
summary: '경성대학교 양희재 교수님의 운영체제 3강 요약'
thumbnail: './osBg.jpg'
---

### 1.고등 운영체제

기존 폰노이만 구조와 다른 고등 컴퓨터 구조에는 고등 운영체제가 있습니다. 그 종류는 다음과 같습니다.

- 다중 프로세서 시스템(Multiprocessor system)
  - 프로세서가 한개가 아닌 여러개인 시스템입니다.
  - 병렬 시스템(parallel system) : CPU가 병렬적으로 작동합니다.
  - 강결합 시스템(tightly-coupled system) : 메모리에 여러 CPU가 붙는 걸 의미합니다.
  - 장점: Performance, Cost(비싼 CPU 하나보다 저렴한 여러개가 더 저렴합니다), Reliabilty
  - 한 CPU가 고장나도 다른 CPU가 있어서 신뢰성이 보장됩니다.
  - 다중 프로세서 운영체제 (Multiprocessor OS)가 적재됩니다.
- 분산 시스템(Distributed system)

  - 여러 컴퓨터를 네트워크로 묶는 시스템입니다.
  - 다중 컴퓨터 시스템(multi-computer system)
  - 소결합 시스템(loosely-coupled system): 여러 메모리가 존재하고, RAN으로 느슨하게 연결합니다.
  - 분산 운영체제 (Distributed OS)가 적재됩니다. 서로간의 메시지를 통해 역할분담을 해야하기 때문 입니다.
  - 장점과 목적은 다중 프로세서 시스템과 같습니다.

- 실시간 시스템(Real-time system)
  - 어떤 계산이 어떤 시간내에 반드시 끝나야하는 시스템을 실시간 시스템이라고 합니다.
  - 시간 제약: Deadline이 존재합니다.
  - 시간의 정확성이 보장되어야 합니다.
  - 공장 자동화(Factory Automation), 군사, 항공, 우주
  - 실시간 운영체제 (Real-time OS = RTOS)가 적재됩니다.

### 2. 인터럽트 기반 시스템(Interrupt-Based System)

현대 운영체제는 인터럽트 기반 시스템입니다. ROM이 OS를 RAM에 적재하면 OS는 메모리에 Resident(상주)
합니다. 상주하면서 Event(사건)을 기다립니다. 이러한 Event를 인터럽트 신호라고 합니다. 인터럽트 신호가 오면 CPU는 지금 하는 행동을 멈추고 다른 행동을 하기 시작합니다. 이러한 상태를 인터럽트라고 합니다.
인터럽트의 종류는
크게 두가지가 있습니다.

- 하드웨어 인터럽트(Hardware interrupt)
  - 인터럽트 결과 운영체제 내의 특정 코드를 실행합니다.(ISR)
  - Interrupt Service Routine 종료 후 다시 대기합니다.
  - ISR은 콜백과 같습니다.
- 소프트웨어 인터럽트(Software interrupt)
  - 사용자 프로그램이 실행되면서 소프트웨어 인터럽트 (운영체제 서비스 이용 위해)
  - 인터럽트 결과 운영체제 내의 특정 코드를 실행합니다. (ISR)
  - ISR 종료 후 다시 사용자 프로그램으로 돌아갑니다.
  - hwp 파일을 더블 클릭할 떄(하드웨어 인터럽트 발생), hwp 파일을 보조기억장치에서 불러오는 신호(소프트웨어 인터럽트 발생)

```js
CPU 명령어 중 SWI 라는 명령어가 존재하는데 이것이 소프트웨어 인터럽트를 거는 명령어입니다. 펜티움 계열에는 INT 명령어가 있습니다.
기본적으로 인터럽트는 하드웨어가 거는데(전기신호로) 소프트웨어 인터럽트는 명령어로 작동하는게 흥미로웠습니다.
```

<br>

요약하자면 운영체제는 평소에는 대기 상태였다가, 하드웨어 인터럽트에 의해 운영체제 코드 (ISR)를 실행
합니다. 혹은 소프트웨어 인터럽트에 의해 내부 인터럽트(Interrnal interrupt)에 의해 ISR이 실행됩니다. 이후 ISR이 종료되면 원래의 대기상태 또는 사용자 프로그램으로 복귀합니다.

- 인터럽트 신호 - Event
- ISR - Callback Function

내부 인터럽트의 대표적인 예는 정수를 0으로 나누는 경우 CPU는 연산을 못합니다. 이러한 경우를 인터럽트로 받아들입니다. 이 경우에 ISR 은 OS 내부의 Divide by zero로 실행됩니다.

<br>

#### 참고

- [경성대학교 양희재 교수님 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)

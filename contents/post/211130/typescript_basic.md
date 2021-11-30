---
date: '2021-11-30'
title: 'Typescript 기본기 다지기(1)'
categories: ['Typescript']
summary: 'Typescript과 타입에 대해서 알아보자!'
thumbnail: './typescript.png'
---

### 1. Typescript란?

> Typescript는 2012년에 발표된 오픈 소스 프로그래밍 언어로, 대규모 Javascript
> 애플리케이션 개발을 목적으로 Microsoft에 의해 개발되었다.

Typescript는 Javascript, ECMAScript를 포함하는 Superset이며,Javascript, ECMAScript에서 지원하는 기능에 인터페이스, 제너릭, 형 관리 등 추가적인 기능을
지원한다.
<br>

<br>

#### 1-1 트랜스파일러

웹브라우저 엔진은 Typescript를 해석할 수 없다. 따라서 Typescript 파일(.ts)을 Javascript(.js) 파일로 변환해야한다. 그래서 Typescript가 Javascript로 출력되는 것을 컴파일이 아닌 트랜스파일이라고 한다. 또한 이러한 언어를 메타 언어라고 한다.

> 근데 왜 Typescript 파일을 컴파일한다고 하는걸까?

**아마도 내 생각에는 Typescript 파일 -> 트랜스 파일 -> Javascript 파일 -> 컴파일** 주기에 있어서 첫 단계와 마지막 단계가 Typescript-> 컴파일이라서 그런게 아닐까라는 추측이다.
<br>
<br>

#### 1-2. 사용하는 이유

- Type을 사용하여 어플리케이션을 개발할 때 정적 타입 검사 및 코드 리팩토링 등 생산성 높은 개발이 가능
- 타입을 통해 컴포넌트 간 인터페이스를 정의할 수 있음
- 모던한 자바스크립트 기능을 포함함
- 신뢰성있는 어플리케이션 개발 가능

#### 1-3. 개인적으로 타입스크립트를 사용하는 이유

- 원래 Javascript 생태계를 좋아했는데, 유연함 때문에 데인적이 많다.
- 안정적인 서버사이드를 개발하기 위해

### 2. Typescript 타입

#### 2.1 암시적 타입 지정

아래와 같이 초기에 name이라는 변수에 string 값을 할당하면
타입스크립트는 이 변수의 타입은 암시적으로 string이라고 설정한다.

```ts
let name = 'leesky'
name = 23 // error!
```

> 그럼 아무것도 안쓰고 선언만하면?

```ts
let name // 암시적으로 아무거나 때려넣을 수 있는 any 타입으로 설정한다.
name = 'leesky' // 암거나 떄려들감!
name = 23
```

#### 2.2 명시적 타입 설정

Typescript는 변수를 선언할 때 명시적으로 할당할 수 있다. Typescript는 Javascript으 슈퍼셋이므로 Javascript의 타입 뿐아니라 클래스, 인터페이스 등을 타입으로 설정 가능하다.

- Typescript 타입
  - null
  - undefined
  - number
  - string
  - boolean
  - array
  - function
  - object
  - Symbol
  - enum
  - tuple
  - never
  - void

> 그외 interface, class, 커스텀 타입 등 엄청 무궁무진함!

아래는 타입 적용방법!

```ts
let name: string = 'leesky'
let age: number = 23
```

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

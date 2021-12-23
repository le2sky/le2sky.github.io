---
date: '2021-12-07'
title: 'Typescript 기본기 다지기(8)'
categories: ['Typescript']
summary: 'Typescript interface에 대해 알아보자 (2편)'
thumbnail: './typescript.png'
---

### 1. 인터페이스 읽기 전용 속성

일부 속성은 처음 만들어 질 때 이외에 수정하도록 하고 싶을 수가 있다. 그런 경우 readonly 키워드를 넣어 설정할 수 있다.

```ts
interface Notebook {
  readonly CPU: string
  readonly RAM: string
}

let hansung: Notebook = {
  CPU: 'intel',
  RAM: '16GB',
}

//error! : readonly임
hansung.CPU = 'm1'
```

### 2. 인덱스 시그니처 속성

인터페이스는 클래스에 설정 되었을 때 주어진 요구사항을 준수한다면, 클래스에 인터페이스에 정의되지 않은 새로운 속성이 추가되어도 오류가 나지 않는다.

```ts
interface IUser {
  sayHi(): void
  sayBye?(): void
}

class User implements IUser {
  //이렇게 새로운 필드 추가 가능
  name: string = 'leesky'
  age: number = 23

  constsructor() {}

  sayHi() {}
  //sayBye는 안넣어도 괜춘
}

let user: IUser = {
  name: 'leesky', // error! 객체 리터럴은 불가능
  sayHi() {},
}
```

<br>
위 예시와 같이 객체 리터럴에 인터페이스를 설정해줄 경우 에러가 난다. 그 이유는 인터페이스에 정의되지
않은 동적 타입이 할당되는 것을 Typescript는 기본적으로 오류로 보기 떄문이다.

> 문제를 해결하기 위해서 tsconfig.json 파일의 noImplictAny 옵션 값을 false로 변경하는 것이다 하지만,
> 암묵적으로 any타입을 사용하는 것을 피하고자 한다면 좋은 방법은 아니다.

아니면 다음과 같이 인덱스 시그니처 속성을 선언하면 된다.

```ts
interface IUser {
  sayHi(): void
  sayBye?(): void
  //인덱스 시그니처 속성으로 새로운 속성을 추가할 수 있게 되었다!
  [prop: string]: any
}
```

### 3. 함수 타입

인터페이스는 함수 타입도 정의가 가능하다. 함수를 할당 받을 변수에 인터페이스를 설정하면 함수 매개변수, 반환값 타입을 명시적으로 입력하지 않아도 괜찮다.

```ts
//인터페이스를 설정하지 않은 함수의 경우, 매개변수 타입, 반환 값을 설정한다.
const sum = (a: number, b: number): number => {
  return a + b
}

interface SumInterface {
  (a: number, b: number): number
}

const sumwithInterface: SumInterface = (a, b) => {
  return a + b //good!
}
```

<br>
주의할 점은 인터페이스가 설정된 함수의 매개변수, 리턴 값 타입을 임의로 변경하면 오류가 발생한다.

```ts
interface SumInterface {
  (a: number, b: number): number
}

//error! 인터페이스에 지정된 타입을 재정의함
const sumwithInterface: SumInterface = (a: string, b: string): string => {
  return a + b
}
```

### 4. 인터페이스 확장

클래스를 상속하는 클래스처럼, 인터페이스 또한 extends 키워드를 사용해 인터페이스를 확장할 수 있다.

```ts
interface ButttonInterface {
  readonly _type: string
  width?: number
  height?: number
  onClick(): void
}

interface ToggleButtonInterface extends ButtonInterface {
  toggle(): void
  onToggled?(): void
}

interface CounterButtonInterface extends ButtonInterface {
  increase(): void
  decrease(): void
}
```

<br>
2개 이상의 인터페이스를 확장하는 인터페이스 구현이 가능하다. ,(콤마) 를 사용하여 다중 확장 설정이 가능하다.

```ts
interface ButtonInterface {
  readonly _type: string
  width?: number
  height?: number
  onClick(): void
}

interface ButtonSizeInterface {
  readonly _size: number
  small(): void
  medium(): void
  large(): void
}

interface ImageButtonInterface extends ButtonInterface, ButtonSizeInterface {
  readonly _url: string
  getUrl(): string
  setUrl?(url: string): void
}
```

<br>
인터페이스를 확장한 클래스는 인터페이스에 정의된 준수사항을 따라 구현해야 한다. 콤마를 이용하여 다중 인터페이스 확장도 가능하다.
또한 클래스 방식이 아닌 객체 리터럴 방식으로 객체를 사용하고자 할 경우, 객체를 할당 받을 변수에 인터페이스를 설정할 수 있다.
이 때 인터페이스에 정의된 준수 사항을 따르지 않을 경우 오류가 난다. (위 인덱스 시그니처 속성 참고)

> 근데 객체 리터럴에서 초기에 선언하는 게 아니라, 추후 인터페이스에 정의된 것들을 차근차근 구현하고 싶어요!

그럴 경우에는 제네릭 문법을 사용하여 변수에 할당하면 된다.

```ts
interface StudentInterface {
  readonly _name: string
  readonly _bloodType: string
  friends: string[]
  sayHi(): void
}

// let studentA: Studentinterface = {
//   //...전부다 구현해줘야하는데 나중에 차근차근하고 싶다.
// }
// 아래와 같이 작성해주면 나중에 구현해줘도 괜찮다.
let studentB = <StudentInterface>{
  _name: 'leesky',
  _bloodType: 'O',
}
console.log(studentB) //good!
```

<br>

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

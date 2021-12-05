---
date: '2021-12-05'
title: 'Typescript 기본기 다지기(7)'
categories: ['Typescript']
summary: 'Typescript interface에 대해 알아보자 (1편)'
thumbnail: './typescript.png'
---

### 1. 인터페이스

인터페이스는 javascript와 같은 동적 타입 언어 환경에서는 다뤄지지 않는다. 하지만 정적 타입 언어인 typescript에서는 타입 검사가 요구 되므로
인터페이스를 지원한다. 인터페이스는 interface 키워드를 사용하면 된다.

```ts
interface ButtonInterface {
  onInit(): void
  onClick(): void
}
```

사용자 정의 타입과 비슷해보이지만, 인터페이스는 더욱 많은 걸 할 수 있게 해준다.
그 중 하나는 인터페이스 선언 병합이다.

> 주의할점은 객체 리터럴에 인터페이스를 타입으로 지정하면, 인터페이스안에 있는 것을 다 구현하고 추가적인 속성은 지정을 못하는 반면
> 클래스는 인터페이스를 다 구현하면 추가로 더 확장가능하다.

### 2. 클래스 이행 규칙

인터페이스는 클래스와 달리 정의만 할 뿐 실제로 구현되지 않는다. 즉, 어떠한 객체를 생성 했을 때 가져야 할 속성 또는 메서드를 정의한다고 생각하면 된다.
(추상 클래스와 비슷해 보인다.)

```ts
interface IUser {
  sayHi(): void
  sayBi(): void
}

class BlogUser implements IUser {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  //아래 두개 메서드를 꼭 구현해야한다.
  sayHi() {
    alert('hi')
  }

  sayBi() {
    alert('bye')
  }
}
```

### 3. 매개변수 이행 규칙

매개변수에도 인터페이스를 설정할 수 있다. 인터페이스가 설정된 매개벽수는 인터페이스에 정의된 요구 사항을 충족해야한다.

```ts
inteface OnInitInterface {
  onInit():void;
  initialize():void;
}

// 인터페이스 요구 조건에 충족하는 객체
const obj = {
  onInit():void {
    console.log('')
  },
  initialize():void {
    console.log('')
  }
}

function ready(m: OnInitInterface):void {
  m.onInit();
  m.initialize();
}
ready(obj); // good!

```

### 4. 객체 리터럴 이행 규칙

클래스 선언 과정에서 implements 키워드를 사용해 명시적으로 인터페이스를 설정하는 방법이 아니어도,
객체 리터럴에 인터페이스 설정이 가능하다.

```ts
interface UserInterface {
  name: string
  age: number
  sayHi(): void
  sayBye(): void
}

let user: UserInterface = {
  name: 'leesky',
  age: 23,
  sayHi() {
    alert('hi')
  },
  sayBye() {
    alert('bye')
  },
}
```

### 5. 인터페이스 옵션 속성

클래스는 인터페이스에 정의된 속성 또는 메서드를 반드시 사용하지 않고, 필요에 따라 선택적으로 사용하도록 하고 싶을 수도 있다.
이럴 때 옵션 속성 설정을 통해 사용자가 선택적으로 사용하게 설정할 수 있다.

```ts
interface ButtonInterface {
  onInit?(): void
  onClick(): void
}
class ButtonCompnent implements ButtonInterface {
  onClick() {
    console.log('버튼 클릭')
  }
}
```

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

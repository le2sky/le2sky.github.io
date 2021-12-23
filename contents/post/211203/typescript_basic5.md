---
date: '2021-12-03'
title: 'Typescript 기본기 다지기(5)'
categories: ['Typescript']
summary: 'Typescript class에 대해 알아보자!'
thumbnail: './typescript.png'
---

### 1. ES6 에서 클래스

es6부터 클래스 문법을 사용해서 객체를 쉽게 만들 수 있다.

```js
class Book {
  //생성자 함수
  constructor(title, author, pages) {
    this.title = title
    this.author = author
    this.pages = pages
    this.init()
  }

  //정적 클래스 메서드
  static create() {}

  //클래스 메서드
  init() {}

  //클래스 필드
  isFinish = true
}
```

> Book 클래스는 내부적으로 function Book 이라는 함수를 만든다.
> 그리고 constructor 내부에 있는 것들을 함수 본문에 추가하고
> 메서드들을 함수의 프로토타입에 넣는다.
> 필드는 프로토타입에 넣지 않는 게 중요한 특징이다.

주의할 점은 클래스는 단순히 편의 문법이 아니란 것이다.
class로 만들어진 함수에는 **특수 내부 프로퍼티 [[FunctionKind]]: "classConstructor"** 가 태그된다. 생성자 함수(위 인용의 function Book과 같은 것)
는 new와 함께 호출되지 않아도 되지만, classConstructor 태그가 붙으면 new와
함께 호출되어야 한다.
<br><br>

추가적으로 클래스의 프로토타입 프로퍼티에 추가된 메서드들은 전부 enumerable 플래그가 붙어서 열거가 불가능하다.

> 그럼 생성자 함수는요?

```js
function User(name, age) {
  this.name = name
  this.age = age
  this.sayHi = () => {
    alert('hi')
  }
}

let user = new User('leesky', 23)
console.log(user) // User{name:'leesky', age:23, sayHi: f} 잘보인다!
```

### 2. 접근 제어자

접근 제어자를 통해 접근 가능한 범위를 설정할 수 있다.
또한 각 속성에 데이터 타입을 지정할 수 있다.

```ts
class Book {
  //클래스 외부에서 접근 가능
  public title: string

  //public은 기본값으로서 생략 가능
  author: string

  // private는 클래스 내부에서만 접근 가능
  private _manufacturing_plant: string

  //클래스 내부 및 상속 클래스에서만 접근 가능
  protected paper_type: string

  //constructor 매개변수 앞에 접근 제어자를 사용하면 별도 선언을 안해도 괜찮음
  constructor(title: string, author: string, public pages: number) {
    this.title = title
    this.author = author
    this.pages = pages
  }
}
```

### 3. 메서드 접근 제어자

속성과 마찬가지로 메서드 또한 접근 제어자를 사용해 외부에서 접근을 제어할 수 있다.

```ts
class Book {
  public title: string
  public author: string
  public pages: number = 150
  private _manufacturing_plant: strin = '안양 공장'
  protected paper_type: string = '밍크지'

  constructor(title: string, author: string, pages: number) {
    this.title = title
    this.author = author
    this.pages = pages
  }
  /* 메서드 ------------------------------------------------ */
  // public 메서드
  // 클래스 외부에서 접근 가능
  public printPages(): string {
    return `${this.pages}페이지`
  }
  // protected 메서드
  // Book 클래스를 포함한 서브 클래스에서만 접근 가능
  protected changePaperType(type: string): void {
    this.paper_type = type
  }
  // private 메서드
  // Book 클래스 내부에서만 접근 가능
  private setManufacturingPlant(plant: string): void {
    this._manufacturing_plant = plant
  }
  /* 클래스 내부 메서드에서 private, protected 메서드 접근 가능 */
  public setPaperType(type: string): void {
    // protected 메서드 접근 가능
    this.changePaperType(type)
    console.log(this.paper_type)
  }
  public setPlant(plant: string): void {
    // private 메서드 접근 가능
    this.setManufacturingPlant(plant)
    console.log(this._manufacturing_plant)
  }
}
```

### 4. 클래스 상속

typescript도 es6와 마찬가지로 extends 키워드를 통해 클래스 상속이 가능하다. 속성 및 메서드 오버라이딩 가능하다.

```ts
class E_Book extends Book {
  paper_type = '스크린'

  //error! private 속성은 오버라이딩 불가
  _manufacturing_plant = '블라블라'
}
```

### 5. 게터 / 세터

비공개로 설정할 필요가 있는 속성을 private로 설정한 후 이 속성에 접근하여 값을
읽거나, 쓰기 위해 게터랑 세터를 만들 수 있다.

```ts
class Plant {
  private _species: string | null = null

  get species(): string {
    return this._species
  }

  set species(value: string) {
    this._species = value
  }
}
```

### 6. 스태틱 속성, 메서드

클래스를 통해 객체를 만들 필요없이 바로 사용가능하다.

```ts
class Mathmatics {
  static PI: number = Math.PI
  static sum(a: number, b: number): number {
    return a + b
  }
}

Mathmatics.sum(123, 321) //good!
Mathmatics.PI //3.141592...
```

### 7. 추상 클래스

추상 클래스 정의시 class 키워드 앞에 abstract 라고 표시한다.
추상 메서드 정의할때도 abstract를 이름 앞에 붙여야한다. 추상 메소드는
정의만 있고, 구현은 안되어 있는데 함수이다. 이걸 포함하고 있는 클래스는
추상 클래스이며 추상 클래스를 상속 받은 클래스는 추상 메소드를 구현해야한다.

```ts
abstract classdProject {
  public project_name:string|null = null;
  public abstract changeProjectName(name:string): void;
}

class WebProject extends Project {
  changeProjectName(name:string):void{
    this.project_name = name;
  }
}
```

### 8. 싱글턴

싱글턴이란 오직 한개의 인스턴스를 반환하는 것을 의미한다.
private 접근 제어자를 통해서 한개의 인스턴스만 반환하도록 구현할 수 있다.

```ts
class OnlyOne {
  private static instance: OnlyOne
  public name: string
  // new 클래스 구문 사용 제한을 목적으로
  // constructor() 함수 앞에 private 접근 제어자 추가
  private constructor(name: string) {
    this.name = name
  }

  // 오직 getInstance() 스태틱 메서드를 통해서만
  // 단 하나의 객체를 생성할 수 있습니다.
  public static getInstance() {
    if (!OnlyOne.instance) {
      OnlyOne.instance = new OnlyOne('싱글턴 객체')
    }
    return OnlyOne.instance
  }
}
```

### 9. 읽기전용 속성

readonly 키워드를 사용하여 읽기 전용 속성을 만들 수 있다.

```ts
class User {
  public readonly name: string = 'leesky'
}

let user = new User()

user.name = 'kimsky!' //error!
```

<br>

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

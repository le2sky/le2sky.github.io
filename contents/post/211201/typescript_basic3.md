---
date: '2021-12-01'
title: 'Typescript 기본기 다지기(3)'
categories: ['Typescript']
summary: 'Typescript function, union, void, object, null, underined, never, 사용자정의 타입, 타입단언 알아보기!'
thumbnail: './typescript.png'
---

### 1. 함수 매개변수 타입

tsconfig.json에 noImplicitAny 설정 값이 true 일 경우, 암시적인
any 사용 시 오류가 난다.

> 함수 매개변수에서만 해당사항이 있는것 같아보인다.

```ts
//error! 암시적으로 id와 name 매개변수가 any로 지정되었음
function foo(id, name) {
  return { id, name }
}
let obj = foo(1, 'leesky')

//명시적으로 함수 매개변수 타입 사용 방법
function foo(id: number, name: string) {
  return { id, name }
}
```

### 2. union 타입

id 매개 변수에 설정 가능한 타입 값을 number, string 모두 가능하게 하려면
파이프(|) 를 사용하여 설정한다. 이를 유니온 타입이라고 한다.

```ts
function foo(id: number | string, name: string) {
  return { id, name }
}
```

### 3. 함수 리턴 타입

void 는 결과 값을 반환하지 않는 함수에 설정한다. 반면 결과 값을
반환하는 함수는 명시적으로 반환값 타입을 지정할 수 있다.

```ts
function sayHi(name: string): void {
  alert(`hello! ${name}!`)
}

function getDoubleNum(num: number): number {
  return num * 2
}

function getStringNum(num: number): string {
  return num.toLocaleString()
}
```

<br>

명시적으로 반환 값을 설정하지 않는 함수는 undefined를 반환하기에
Typescript에서는 void를 명시한다.

### 4. 함수 식

변수에 함수 값을 할당하는 식은 컴파일 과정에서 오류를 발생시키지 않는다.

> 직접 해본 결과 오류가 난다.

```ts
let foo = function (name) {
  alert(`hello ${name}`)
}
```

<br>

하지만 명시적으로 함수에 설정 가능한 타입을 정의하고자 하면
다음과 같이 작성할 수 있다.

```ts
//변수에 함수 매개변수, 리턴 타입에 대한 명시적 설정
let foo: (name: string) => void

//대입하는 function 매개변수와 반환값 타입을 지정할 필요가 없음
foo = function (name) {
  alert(`hello ${name}`)
}
```

<br>
변수에 명시적 타입 설정, 함수 값 할당 구문을 별도로 안나누고 한번에 정의가능

```ts
let foo: (name: string) => string = function (name) {
  return `hello!! ${name}`
}
```

<br>
ES6 화살표 함수 식을 사용하면 다음과 같이 기술할 수 있다.

```ts
let foo: (name: string) => string = name => {
  return `hello!! ${name}`
}
```

### 5. Object 타입

typescript에서 변수에 초기 설정된 값을 암시적으로 할당 가능한 데이터 타입으로
설정하기에 초기 설정된 값과 다른 형태로 할당될 경우 오류가 난다.

```ts
//아래와 같이 선언되면 암시적으로 {name:string, age:number} 타입으로 지정됨
let obj = {
  name: 'leesky',
  age: 23,
  sayHi(name) {
    alert(`hello! ${name}`)
  },
}

/* 아래와 같이 재할당 해버리면 에러남~~~
obj = {
  n: 'leesky',
  a:23,
  sayHello(){
    alert('hello!');
  }
}

obj = {
  name: 23,
  age: 'leesky',
  } 
}

*/
```

<br>
객체의 각 속성 타입을 명시하려면 아래와 같이 하면 된다.

```ts
let obj: {
  name: string
  age: number
  sayHi: (name: string) => void
} = {
  name: 'leesky',
  age: 23,
  sayHi(name) {
    alert(`hello! ${name}`)
  },
}
```

<br>
하지만 타입으로 설정되지 않은 객체의 속성을 새롭게 추가할 경우
에러가 난다.

```ts
// error!
obj.newFunction = function () {}
```

<br>
새롭게 추가할 newFucntion 프로퍼티를 타입에 추가하면 되지만,
매번 하기에는 번거롭다. 따라서 아래와 같이 하면 쉽게 프로퍼티를
추가할 수 있다.

```ts
let obj: {
  name: string
  age: number
  sayHi: (name: string) => void
  [propName: string]: any // <-- 이런 식으로 아무 속성을 추가할 수 있도록함
} = {
  name: 'leesky',
  age: 23,
  sayHi(name) {
    alert(`hello ${name}`)
  },
}

obj.newFunction = function () {
  return 'it is work!'
}
```

### 6. null / undefined 타입

Javascript에서 null, undefiend도 데이터 타입이자 하나의 값으로 취급된다.
Typescript에서도 하나의 타입으로 처리되며 다음과 같이 사용한다.

```ts
let nullable: null = null
let undefinedabe: undefined = undefined
```

<br>
하지만 null로 명시적 타입이 설정된 변수에 null이 아닌 값이 할당되면
오류가 난다.

```ts
//error!
nullable = undefined
```

> tsconfig.json에 strictNullChecks가 true면 모든 데이터 타입은 null, undefiend를 할당 받을 수 없다. false면 null이나 undefined 가능

이러한 문제를 해결하기위해서는 any 타입이나 유니온 타입을 사용할 수 있는데
타입검사를 위해서는 유니온 타입을 쓰는게 적절할 것이다.

```ts
let assign_name: string | null = null //가능
if (!assign_name) {
  assign_name = 'leesky'
}
```

### 7. never 타입

never는 일반적으로 함수 리턴 타입으로 사용된다. nerver 은 함수의 끝에 도달
할 수 없다는 뜻이며, 함수의 리턴 타입으로 never 가 사용된 경우에는, 항상
오류를 출력하거나 리턴 값을 절대 내보내지 않는 다는 뜻이다. (무한 루프)

```ts
//항상 오류 발생
function invalid(message:string): never{
  thorw new Error(message);
}

// never 타입 추론
function fail(){
  return invalid('실패!');
}
// 무한 루프
function infiniteAnimate(): never{
  while(true) { infiniteAnimate() }
}

```

<br>
never 타입을 지정한 변수에 never가 아닌 타입은 할당할 수 없다.

```ts
let neverType: never
// error! never 타입에 number 할당 불가
neverType = 123

// 함수의 반환값이 never 타입이기 때문에 오류안남!
// 이 경우는 조금 특이한데, 함수의 반환값이 익명 never 반환 함수이기
// 때문에 throw new Error을 만나서 never 타입의 무언가를 반환하나보다.
neverType = (function (): never {
  throw new Error('Error')
})()
```

### 8. 사용자 정의 타입

복잡한 타입을 매번 설정하는 것은 상당히 번거롭다.
복잡한 타입을 사용자 정의하여 재사용하기 용이하도록 typescript는 지원한다.
타입 별칭(type alias)을 정의 하려면 type 키워드를 사용한다.

```ts
//너무 복잡하고 재사용하기도 힘들다!
let user: {
  name: string
  age: number
  isAdmin: boolean
  family: string[]
} = {
  name: 'leesky',
  age: 23,
  isAdmin: true,
  family: ['daddy', 'mammy', 'sister'],

//재사용하기도 쉽고 가독성도 좋다.
type userType= {
  name: string,
  age: number,
  isAdmin: boolean,
  family: string[],
  sayHi: (name: string) => void

}

let user:userType = {
  name: 'leesky',
  age: 23,
  isAdmin: true,
  family: ['daddy', 'mammy', 'sister'],
  sayHi(name){
    alert(`hello! ${name}`)
  }
}
```

### 9. 타입 단언(Assertion)

Typescript 프로그래밍을 하다보면 타입 어설션(단언, Assertion)을 사용해야
하는 순간이 온다. 타입 단언은 컴파일러에게 "이 타입이 특정 타입 임을 단언한다"
라고 말하는 것과 같다.

> 컴파일러보다 타입을 더 잘알고 있는 경우 타입 단언을 한다!

다른 언어의 타입 캐스트(Cast)와 비슷하지만, **특별한 검사나 데이터 재구성을
수행하지 않는다**. 런타임 시, 영향을 미치지 않으며 오직 컴파일 과정에서만 사용된다. 타입 단언을 처리하는 방법은 2가지이다.

1. 앵글 브라켓 `<>`문법을 사용하기

```ts
let assertion: any = 'leesky'
// assertion 변수의 타입을 <string>으로 단언한다.
// assertion string 타입임
let assertion_count: number = (<string>assertion).length
```

<br>
2. `as` 문법 사용하기

```ts
let assertion: any = 'leesky'
// as를 통해 assertion 을 string으로 단언
let assertion_count: number = (assertion as string).length
```

> 타입 단언은 타입 캐스트와 비슷하지만, 특별한 검사, 데이터 재구성을 안한다
> 는 점에 주목하자. 그리고 추가적으로 JSX 에서는 as 문법만 사용할 수 있다.

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

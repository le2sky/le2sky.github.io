---
date: '2021-12-02'
title: 'Typescript 기본기 다지기(4)'
categories: ['Typescript']
summary: 'Typescript에서 ES6 사용해보기!'
thumbnail: './typescript.png'
---

### 1. 블록 영역 변수, 상수 선언

let, const 키워드를 통해 블록 스코프 변수와 상수를 만들 수 있다.

```ts
{
  let num: number = 1
  const num2: number = 2
}
console.log(num, num2) // error! not defined
```

### 2. 템플릿 리터럴

```ts
//당연하게도 템플릿 리터럴도 사용가능하다.
const name = 'leesky'
console.log(`${name}님 반갑습니다!`)
```

### 3. 화살표 함수

ES6부터 Expression에 한해 화살표 함수 식을 활용할 수 있다. Typescript 또한
화살표 함수식을 사용 가능하고, 매개변수, 리턴 타입을 명시적으로 설정하여 컴파일
과정에서 타입 검사를 수행해 사전에 문제를 방지할 수 있다.

```ts
let foo = (name: string): string => {
  return `hello ${name}`
}
```

### 4. 전개 문법, 나머지 매개변수

```ts
//string을 반환하는 함수를 반환하는 foo 함수인데 매개변수는 string타입이고
//아무것도 안들어오면 'leesky' 할당
function foo(name: string = 'leesky'): () => string {
  return () => `${name}`
}

function foo(name: string = 'leesky'): () => string {
  return () => `${name}`
}

let bar = foo()
alert(bar())
```

전개 문법

```ts
let arr: number[] = [1, 2, 3, 4]
arr = [...arr, 5, 6, 7] //[1,2,3,4,5,6,7]
```

나머지 매개변수

```ts
function makeArr(...args: (number | string)[]): (number | string)[] {
  return args
}

makeArr(1, 2, 3, 4, 'str')
```

### 5.비구조화 할당

비구조화 할당을 통해 배열, 객체 아이템 및 속성을 변수에 쉽게 할당 가능하다.

```ts
//배열 비구조화 할당 ( 순서 중요 )
let [name, , age] = ['leesky', true, 23]
console.log(name, age) //good!
```

```ts
//객체 비구조화 할당
let obj = {
  name: 'leesky',
  age: 23,
  sayHi(name: string, age: number): void {
    alert(`${age}살 ${name}입니다!.`)
  },
}

let { name, age, sayHi } = obj
sayHi(name, age) //good!
```

```ts
let hello_module: { letsHello: (nameArr: string[]) => void } = {
  letsHello: nameArr => {
    nameArr.forEach(item => {
      alert(`${item}님 안녕하세요?`)
    })
  },
}

// ?는 옵셔널함을 의미
let temp: {
  letsHello: (nameArr: string[]) => void
  whatsYourNameFunction?: () => void
} = hello_module

let {
  letsHello: helloAction,
  //없으면 기본값 설정해주기
  whatsYourNameFunction: getNameAction = () => {
    alert('what is you name?')
  },
} = temp

helloAction(['leesky', 'leesky2', 'leesky3']) //good!
getNameAction() //good!
```

> 뭔가 예제를 더욱 쉽게 만들어보려고 노력하는데 변수명이나 이런게
> 생각이 잘안난다...좀더 시간을 가지고 신중히 변수이름을 짓는
> 연습을 해야겠다.

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

---
date: '2021-12-01'
title: 'Typescript 기본기 다지기(2)'
categories: ['Typescript']
summary: 'Typescript primitive, any, array, tuple, enum 타입 알아보기!'
thumbnail: './typescript.png'
---

### 1. primitive 타입

원시 데이터 타입 **number, string, boolean** 을 명시적으로 설정하기

```ts
let id: number = 1
let name: string = 'leesky'
let isAdmin: boolean = false
```

### 2. any 타입

동적 형 지정 언어 Javascript는 선언된 변수에 어떠한 값이든 재할당 가능하다.
하지만 Typescript는 명시적으로 데이터 유형을 설정해 정적 형 지정 언어로 타입을
지정해 사용하는 것을 권장한다.

하지만 어떤 타입을 할당해야 할지 모르는 경우에는 어떤 타입이든 할당이 가능한
any 타입을 설정가능하다.

```ts
//명시적 any 타입 지정
let id: any = 123
id = 'leesky' // any 타입이라서 가능

//암시적 any 타입 지정
let name
name = 123
name = 'leesky'
```

### 3. array 타입

암시적 타입 지정으로 생성한 string 배열 타입에 다른 값을 넣으면 에러가 발생한다. 이외에도 **Array\<T>** 으로 지정하는 방법도 있는데 나중에 다루도록 함

```ts
// 암시적으로 string 배열 지정
let users = ['leesky', 'leesky2', 'leesky3']
//  이건 에러가남 >> users = [1, 2, 3, 4]

// 명시적 array 타입 지정
let users2: string[] = ['leesky', 'leesky2', 'leesky3']

// 명시적으로 복합 배열 지정
let users3: any[] = [1, 2, 'leesky', 3, true, { name: 'leesky' }]
// 배열이 아닌 다른 타입이면 에러가남>> users3 = { name: 'leesky' }

// 가능한 테이터 타입 지정
let users4: (number | string)[] = ['leesky', 23]

//암시적 any 타입에는 any 복합 배열도 됨
let temp
temp = [1, 2, 23, [], {}]
```

### 4. tuple 타입

tuple은 javascript에는 없지만, Typescript에서 배열 타입을 보다 특수하게 사용할 수 있도록 지원한다. **tuple에 명시적으로 지정된 형식에 따라 아이템 순서를 설정해야하고, 추가되는 아이템 또한 tuple에 명시된 타입만 사용 가능하다**

```ts
let user: [string, number] = ['leesky', 24]
/* 
처음 할당할떄
더 많이 하거나 타입이 틀리면 에러!
    user = ['leesky', 23, 24] => error!
    user = [23, 'leesky'] error!
*/
//이후에 push 는 명시된 타입만 추가가능 (순서는 상관없음)
user.push('323', 2323, '3211', 23) //가능

/*재할당이나 처음할당할떄는, 명시된 타입보다 더 많거나, 타입이 틀리면 에러!
error! Target requires 2 element(s) but source may have fewer.
user = user.map(item => {
  return (typeof item === 'number') ? item * 2 : item
})
*/
```

> 나는 평소에 tuple을 튜플이라고 발음하는데 튜플은 영국식 발음이고
> 미국에서는 터플, 호주에서는 투플이라고 발음한다고 한다.

튜플이해하기 예제

```ts
let admin: [{ name: string; age: number }, boolean] = [
  {
    name: 'leesky',
    age: 23,
  },
  true,
]
```

### 5. enum 타입

Typescript는 enum 열거형 데이터 타입을 지원한다. 멤버라 불리는 명명된
값의 집합을 이루는 자료형으로 기억하기 어려운 숫자 대신 이름으로 접근 및
사용하기 위해 활용한다. <br><br>

**열거된 각 멤버는 별도의 값이 설정되지 않은 경우 기본적으로 0부터 시작**

```ts
enum Family {
  Daddy, // 0
  Mommy, // 1
  Sister, // 2
  Leesky, // 3
}
let leesky: number = Family.Leesky //(enum member) Family.Leesky = 3
```

<br>

**값을 직접 설정할 수도 있음! 단 값이 할당되지 않은 아이템은 이전 아이템
값 + 1된 값이 설정됨!!!**

```ts
enum Family {
  Daddy = 3,
  Mommy, // 4
  Sister, //5
  Leesky, //6
}
```

<br>

**숫자값을 통해서 enum 멤버 이름을 도출가능함!!**

```ts
let whatIsMyname: string = Family[6] // 'Leesky'
```

<br>

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)

---
date: '2021-12-04'
title: 'Typescript 기본기 다지기(6)'
categories: ['Typescript']
summary: 'Typescript namespace에 대해 알아보자!'
thumbnail: './typescript.png'
---

### 1. namespace란?

네임스페이스는 javascript 객체를 사용해 범주를 생성하고, 여러 파일로 나눠
개발 확장 할 수 있고, 연결도 가능하다. 연결은 예를 들어 CoustomMath 라는 네임스페이스를 여러개 만들 었다면, 번들링을 통해서, 하나의 파일로 만든 다음에
사용 가능하다.

<br>

```
# tsc --outFile <생성할 파일.js> [<namespace 파일 1>, <namespace 파일 2>, ...]
```

<br>
어플리케이션을 만들 때, 함수나 컴포넌트 단위로 모듈화하고 번들링하는게 통상적으로 이용되는 방법이다. 이를 구현하기 위해서 Typescript는 namespace를 제공하고 추가적으로 es6 import, export를 통해 모듈을 구성할 수 있다.

### 2. namespace 구현

```ts
namespace MyCustomMath {
  //export를 안해주면 네임스페이스 밖에서 접근이 불가함
  const PI: number = Math.PI

  //export를 하면 범주 밖에서 접근 가능
  export function sum(a: number, b: number): number {
    return a + b
  }

  //밖에서 접근 불가!
  function minus(a: number, b: number): number {
    return a > b ? a - b : b - a
  }
}

alert(MyCustomMath.PI) // error!
alert(MyCustomMath.sum(3, 2)) // good!
```

<br>
또한 네임스페이스는 중첩으로 사용 가능하다.

```ts
namespace MyCustomNamespace {
  export namespace MyCustomMath {
    export const PI: number = Math.PI
    export function sum(a: number, b: number): number {
      return a + b
    }

    export function minus(a: number, b: number): number {
      return a > b ? a - b : b - a
    }
  }
}

//중첩 namespace 별칭 Alias 만들기
import MyNS = MyCustomNamespace.MyCustomMath
alert(MyNS.sum(3, 4)) //good!
```

### 3. 모듈

개발하는 어플리케이션의 크기가 커지면 파일을 분리해야 하는 시점이 온다.
이때 분리된 파일 각각을 모듈이라고 한다. 모듈은 클래스 하나 혹은 특정한
목적을 가진 복수의 함수로 구성되어있다.

```ts
//기본적으로 이런식으로 가져오고
import { sayHi } from 'sayHiModule'

//이런식으로 내보낸다.
//sayHiModule.ts
export function sayHi(): void {
  alert('hi?')
}
```

<br>
모듈에 대해서 더욱 자세하게 알아보고 싶으면 아래 글을 한번 읽어보는 걸
추천한다.

[Modern Javascript Tutorial - 모듈🔎](https://ko.javascript.info/import-export)
<br><br>

#### 참고

- [Typescript 가이드북](https://yamoo9.gitbook.io/typescript/)
- [Modern Javascript Tutorial](https://ko.javascript.info/import-export)

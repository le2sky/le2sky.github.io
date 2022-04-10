---
date: '2022-04-10'
title: '[알고리즘] 2020 카카오 인턴십 - 키패드 누르기'
categories: ['알고리즘']
summary: '프로그래머스 2020 카카오 인턴십 - 키패드 누르기(구현문제) 해결 과정에 대해서 작성합니다.'
thumbnail: './programmers.png'
---

### 2020 카카오 인턴십 - 키패드 누르기

**문제 설명**

스마트폰 전화 키패드의 각 칸에 다음과 같이 숫자들이 적혀 있습니다.

<img src="./q1.png"></img>
<br>

이 전화 키패드에서 왼손과 오른손의 엄지손가락만을 이용해서 숫자만을 입력하려고 합니다. <br><br>
맨 처음 왼손 엄지손가락은 \* 키패드에 오른손 엄지손가락은 # 키패드 위치에서 시작하며, 엄지손가락을 사용하는 규칙은 다음과 같습니다.

1. 엄지손가락은 상하좌우 4가지 방향으로만 이동할 수 있으며 키패드 이동 한 칸은 거리로 1에 해당합니다.
2. 왼쪽 열의 3개의 숫자 1, 4, 7을 입력할 때는 왼손 엄지손가락을 사용합니다.
3. 오른쪽 열의 3개의 숫자 3, 6, 9를 입력할 때는 오른손 엄지손가락을 사용합니다.
4. 가운데 열의 4개의 숫자 2, 5, 8, 0을 입력할 때는 두 엄지손가락의 현재 키패드의 위치에서 더 가까운 엄지손가락을 사용합니다.
   - 4-1. 만약 두 엄지손가락의 거리가 같다면, 오른손잡이는 오른손 엄지손가락, 왼손잡이는 왼손 엄지손가락을 사용합니다.
     순서대로 누를 번호가 담긴 배열 numbers, 왼손잡이인지 오른손잡이인 지를 나타내는 문자열 hand가 매개변수로 주어질 때, 각 번호를 누른 엄지손가락이 왼손인 지 오른손인 지를 나타내는 연속된 문자열 형태로 return 하도록 solution 함수를 완성해주세요.

**제한 사항**

- numbers 배열의 크기는 1 이상 1,000 이하입니다.
- numbers 배열 원소의 값은 0 이상 9 이하인 정수입니다.
- hand는 "left" 또는 "right" 입니다.
- "left"는 왼손잡이, "right"는 오른손잡이를 의미합니다.
- 왼손 엄지손가락을 사용한 경우는 L, 오른손 엄지손가락을 사용한 경우는 R을 순서대로 이어붙여 문자열 형태로 return 해주세요.

### 접근 방법

처음 이 문제를 구현하기 위해서 여러 가정을 통해서 다음과 같은 요구사항을 정의했습니다.

- 1 ,4 ,7의 숫자가 들어오면 무조건 left 이다.
- 3,6,9의 숫자가 들어오면 무조건 right 이다.
- 현재 위치와 목표 위치의 행과 열의 차이(절대값)를 구하면 좌표상에서 몇번 이동해야 하는 지 알 수 있다.

**3번 사항을 함수로 구현한 예시**
<br>

**설명**: 전체 키패드를 1차원 배열로 구성한 다음, 위치를 3으로 나눈 나머지를 구하면 위치한 열을 구할 수 있고, 현재 위치에서 열의 값을 빼주면(보정)
그 행의 가장 작은 값을 찾을 수 있습니다. 그런 다음 3으로 나누면 행 위치를 찾을 수 있습니다.

```js
function getCount(finger, target) {
  let result = 0
  let targetPosition = [target % 3]
  targetPosition.push(Math.floor(Math.abs(target - targetPosition[0]) / 3))

  let fingerPosition = [finger % 3]
  fingerPosition.push(Math.floor(Math.abs(finger - fingerPosition[0]) / 3))

  targetPosition.forEach((item, index) => {
    result += Math.abs(fingerPosition[index] - item)
  })
  return result
}
```

<br>

응용한 전체 소스 코드는 다음과 같습니다.

```js
function solution(numbers, hand) {
  let answer = ''
  let nowFingerPosition = {
    left: '*',
    right: '#',
  }
  const originkeyPad = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '*',
    '0',
    '#',
  ]

  let leftPosition, rightPosition, targetPosition
  numbers.forEach(num => {
    num = String(num)
    if (num === '1' || num === '4' || num === '7') setFinger(0, 1, num)
    else if (num === '3' || num === '6' || num === '9') setFinger(1, 0, num)
    else {
      leftPosition = originkeyPad.indexOf(nowFingerPosition.left)
      rightPosition = originkeyPad.indexOf(nowFingerPosition.right)
      targetPosition = originkeyPad.indexOf(num)
      setFinger(
        getCount(leftPosition, targetPosition),
        getCount(rightPosition, targetPosition),
        num,
      )
    }
  })

  function setFinger(left, right, num) {
    if (left === right) {
      answer += hand[0].toUpperCase()
      nowFingerPosition[hand] = num
    } else if (left > right) {
      answer += 'R'
      nowFingerPosition.right = num
    } else {
      answer += 'L'
      nowFingerPosition.left = num
    }
  }
  function getCount(finger, target) {
    let result = 0
    let targetPosition = [target % 3]
    targetPosition.push(Math.floor(Math.abs(target - targetPosition[0]) / 3))

    let fingerPosition = [finger % 3]
    fingerPosition.push(Math.floor(Math.abs(finger - fingerPosition[0]) / 3))

    targetPosition.forEach((item, index) => {
      result += Math.abs(fingerPosition[index] - item)
    })
    return result
  }
  return answer
}
```

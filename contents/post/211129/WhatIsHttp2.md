---
date: '2021-11-29'
title: 'HTTP 프로토콜(2)'
categories: ['Backend', 'HTTP', 'Protocol']
summary: 'HTTP 프로토콜 메시지에 대해 알아보자!'
thumbnail: './httpThumnail.png'
---

### 1. HTTP 메시지란?

HTTP 메시지는 서버와 클라이언트 간에 데이터가 교환되는 방식이다. 지난 글에서 HTTP는 통신규약이라고 정의했었다.
이러한 통신규약을 정의한게 HTTP 메시지인 것이다.

### 2. HTTP 메시지 타입

**HTTP 메시지에는 타입에는 요청, 응답 등 두가지 형식이 존재한다.**

#### 1. 요청

<img src="./HTTP_Request.png"></img>

- **Method:** 클라이언트가 수행하고 싶은 동작을 의미 GET, POST, PUT, PATCH, DELETE 등이 있음
- **Path:** 요청 경로
- **Version of the protocol:** 프로토콜 버전
- **Headers:** 서버에 대한 추가 정보를 전달하는 헤더
  - 헤더는 General 헤더(메시지 전체 적용 내용), Request 헤더(요청의 내용을 좀 더 구체화), Entity 헤더(요청 본문에 적용)로 나누어져 있으며
    본문은 요청의 마지막 부분에 존재한다.(POST 등과 같은 데이터를 전달하는 과정에 본문을 추가) 본문의 종류는 단일 리소스 본문, 다중 리소스 본문이 있다

#### 2. 응답

<img src="./HTTP_Response.png"></img>

- **Version of the protocol:** 프로토콜 버전
- **Status code:** 요청의 성공 여부와 이유를 나타내는 상태 코드
  - Informationnal responses(100-199)
  - Successful responses(200-299)
  - Redirection messages(300-399)
  - Client error responses(400-499)
  - Server error responses(500-599)
    - [더욱 자세한 status 설명🚀](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- **Status message:** 상태 코드에 대한 짧은 설명
- **Headers:** 요청 헤더와 비슷함 (General 헤더, Response 헤더, Entity 헤더로 이루어짐 \*Response 헤더에는 상태 줄에 미처 들어가지 못한 서버에 대한 추가 정보를 제공)
  - 본문은 응답의 마지막 부분에 존재한다. 응답 메시지의 본문에는 세가지 종류가 있다
    - 이미 길이가 알려진 단일 파일로 구성된 단일 리소스 본문
    - 길이를 모르는 단일 파일로 구성된 단일 리소스 본문
    - 서로 다른 정보를 담고 있는 멀티파트로 이루어진 다중 리소스 본문

#### 참고

- [MDN 개발자를 위한 웹 기술 - HTTP 메시지](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

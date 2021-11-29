---
date: '2021-11-27'
title: '블로그 개발 후기'
categories: ['블로그 개발', 'GatsbyJs']
summary: 'reactJs, GatsbyJs, meterialUI, GraphQL로 블로그 만들기 후기'
thumbnail: './blogReview01.png'
---

### 1. JAM Stack이란?

JAM Stack은 Javascript, API, MarkUp stack 의 약자로, 자바스크립트와 API, 그리고 html과 css등을 칭하는 MarkUp으로 이루어진 웹 구성 방법이다.
빠르고, 안전하며, 스케일링하기 쉬운 웹을 만들기 위해 디자인된 아키텍쳐라고 공식 홈페이지에 적혀있다.

<br>

#### 1-1 JAM Stack 절차

1. 각 마크업 요소와 다양한 api를 통해 만든 정적 웹 사이트(Pro-Render한 Static한 사이트)를 만든다.
2. CDN(Content Delivery Network)를 통해 제공한다.

#### 1-1 JAM Stack 장점

- JAM Stack은 렌더링할 화면들을 모두 Pre-Render하여 제공하므로 기존 방식에 비해 더 빠르게 웹 사이트를 제공할 수 있다.

- JAM Stack은 API를 통해 정적 사이트를 생성한다. 여기서 사용되는 API는 JAM Stck을 활용한 각 프레임워크의 마이크로 서비스로서, 사이트 생성을 위한 프로세스가 추상화되어있기 때문에 공격 노출 범위가 감소한다. 즉 <b>안전한 웹 사이트를 제공할 수 있다.</b>

- 스케일링하기 쉬운 웹사이트를 제공할 수 있다.

### 2. Is Gatsby Great?

JAM stack 기반 프레임워크에는 nextJs, gatsby, nuxt, jekyll 등이 있으며 gatsbyJS는 서버 없이 오로지 정적 사이트 생성을 위해 사용하는 프레임워크이기 때문에 서비스, 기업 소개 및 블로그, 포트폴리오
개발에 많이 사용된다고 한다!(필요에 따라 CSR, SSR을 적절히 섞을 수 있다고도 한다..) 또한 gatsbyJS는 페이지 내 모든 콘텐츠가 생성되어 있기에 SEO 최적화에 유리하다고 한다.

 <br>

나는 블로그 개발 강의를 따라가기 전에 react function/class components, hooks, ContextApi, LifeCycle Method 정도만 선수 지식으로 학습했고, Modern Javascript tutorial을 통해 자바스크립트 실력을
우선적으로 쌓았다! Typescript는 Gatsby에서 처음 사용해봤는데, 엄청난 매력을 가지고 있는거 같다!!!! 뭔가 절제된 유연함이랄까...그리고 티스토리, 미디엄, 벨로그 등등 여러가지 선택지가 있었지만, 직접
만드는게 더 재밌고 커스터마이징하는 맛이 있지 않을까 싶었다.

 <br>

> **백엔드 개발자가 되는 것이 목표**지만 그래도 어느정도 프론트엔드 지식은 가지고 있는게 좋지 않을까 싶었고, 앞으로도 틈틈이 react에 대해 탐구할 예정이다.
> 앞으로의 프론트엔드 테스크 큐는 Redux, React Router, react TDD + CSS, Sass 등 일 것같다!!! **직접 눈에 보이는 걸 만드는 건 언제나 흥미로운 일이다**.

#### 참고

- [[인프런] React 기반 Gatsby로 기술 블로그 개발하기](https://www.inflearn.com/course/gatsby-%EA%B8%B0%EC%88%A0%EB%B8%94%EB%A1%9C%EA%B7%B8/dashboard)
- [React Meterial Ui 공식 문서](https://mui.com/)

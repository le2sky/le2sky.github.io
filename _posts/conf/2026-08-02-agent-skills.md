---
title: Agent Skills에 대해
date: 2026-08-02
modified: 2026-08-02
tags: [claude-code]
description: Agent Skills에 대해
image: ""
article_class: agent-skills
---

## 스킬이란 무엇인가?

스킬은 Claude Code가 **특정 작업을 자동으로 처리하도록 학습시키는 재사용 가능한 마크다운 파일**이다. PR 리뷰, 커밋 메시지 작성을 요청할 때 반복적인 지침을 입력하는 대신, 스킬을 작성하면 해당 작업이 발생할때 클로드는 자동으로 적용한다.

- **Skiils는  클로드 코드가 작업을 더욱 정확하게 처리하기 위해 찾아 사용할 수 있는 지침 및 리소스 폴더**입니다. 각 스킬은 이름과 설명이 포함된 파일에 저장된다. 각 스킬은 [SKILL.md](http://SKILL.md) 파일 내에 저장되며, 파일 이름 앞부분에 설명이 있다.
- 설명은 클로드가 해당 스킬을 사용할지 여부를 결정하는 기준이다. 클로드는 설명을 활용해 요청에 맞는 스킬을 매칭한다. 사용자가 클로드에 무언가 요청하면, 클로드는 요청에 적절한 스킬을 활성화한다.
- 개인 스킬은  \~/.claude/skills에 저장되며 모든 프로젝트에서 활용할 수 있다. (personal-public)
- 프로젝트 스킬은 .claude/skills에 저장되며, 해당 저장소를 복제하는 모든 사용자와 공유한다.
- 스킬은 lazy-load된다. 클로드가 상황을 인식하면 스킬이 활성화된다.
	- [CLAUDE.md](http://CLAUDE.md) 파일은 모든 대화에 로드된다.
	- 슬래시 명령어는 사용자가 직접 입력해야한다.
	- 핵심 특징은 lazy-load + auto apply인듯?
	- claude는 시작 시 스킬 이름과 설명만 로드하고, 의미론적 매칭을 사용해 요청과 설명을 비교한다. → 전체 스킬 컨텐츠를 컨텍스트에 로드하기 전에 확인 메시지가 표시된다.
- 만약, 이름이 충돌된다면 우선 순위는 다음과 같다.
	- 엔터프라이즈(managed setting) → 개인(\~/.calude/skills) → 프로젝트(.claude/skills) → 플러그인
	- 충돌을 피하려면 구체적인 이름을 사용해야한다.
- 스킬을 업데이트하려면 [SKILL.md](http://SKILL.md) 파일의 내용을 편집하면 된다. 스킬을 삭제하려면 디렉토리를 삭제하면 된다. 변경 사항을 적용하려면 항상 Claude Code를 재시작해야 한다.

스킬을 사용하는 대표적인 예시는 다음과 같다.

- 팀 내부 코드 검토 표준
- 선호하는 커밋 메시지 형식
- 사내 브랜드 가이드라인
- 특정 유형의 문서에 대한 문서 템플릿
- 특정 프레임워크용 디버깅 체크리스트

다음은 SKILL.md의 예시이다.

```java
---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, or when the user asks to summarize changes for a pull request.
---

When writing a PR description:

1. Run `git diff main...HEAD` to see all changes on this branch
2. Write a description following this format:

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed
```

## 구성 및 다중 파일 스킬

- **name 및 description은 필수**이다. allowed-tools와 model은 선택이지만 강력한 추가 기능이 존재한다.
	- name : 소문자, 숫자, 하이픈만 사용,최대 64자, 디렉토리 이름과 일치해야한다.
	- description : 최대 1024
	- allowed-tools는 스킬이 활성화된 동안 클로드가 사용할 수 있는 도구를 제한한다. read-only 및 보안에 민감한 워크플로에 유용하다.

```java
---
name: codebase-onboarding
description: Helps new developers understand the system works.
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
---
```

- 좋은 description은 2가지 질문에 답해야 한다.
	- 해당 스킬은 어떤 기능을 하는가?
	- 클로드는 언제 해당 스킬을 사용해야 하는가?
	- 만약 스킬이 예상대로 작동하지 않는다면, 실제로 사용하는 요청 문구에 맞는 키워드를 추가하라.
- 점진적인 공개 : **[SKILL.md](http://SKILL.md) 파일은 500줄 미만으로 유지**하고, 클로드가 필요할 때만 읽는 보조 파일에 링크를 걸어둔다.
	- 스킬은 클로드의 컨텍스트 윈도우를 공유한다. 스킬을 활성화하면 해당 [SKILL.md](http://SKILL.md) 파일 내용이 대화창에 로딩된다. 하지만, 스킬에 필요한 참조, 예제 또는 유틸리티 스크립트가 필요할 수 있다.
	- 개방형 표준에서는 스킬 디렉토리를 다음과 같이 구성할 것을 권장한다.
		- **scripts/** - 실행 파일
		- **references/ - 추가 문서**
		- **assets/** 이미지, 템플릿, 데이터 파일
	- 이후에는 [SKILL.md](http://SKILL.md) 파일에 지원 파일에 대한 링크를 추가하고, 해당 파일을 언제 로드해야 하는지에 대한 명확한 지침을 제공한다.
	- **핵심은 컨텍스트 윈도우 사용량 및 문서 유지 관리 차원**
- 스크립트는 내용을 컨텍스트에 로드하지 않고 실행한다. 출력만 토큰을 사용하므로 컨텍스트 효율성이 유지된다. SKILL.md에 포함해야할 핵심 지침은 스크립트를 읽는것이 아닌 실행하도록 지시하는 것이다. 다음 상황에 유용하다.
	- 환경 검증
	- 일관성이 요구되는 데이터 변환
	- 테스트된 코드로 실행하는 것이 생성된 코드로 실행하는 것보다 더 안정적인 작업

## Claude Code의 다른 기능들과의 비교

- **CLAUDE.md는 모든 대화에 로드되며 상시 가동되는 프로젝트 표준**에 가장 적합하다.
	- 프로젝트 전반에 걸쳐 항상 적용되는 표준
	- 프레임워크 선호도 및 코딩 스타일
	- DB 스키마 수정하지마와 같은 제약 조건
- **서브 에이전트는 격리된 실행 컨텍스트에서 실행**된다. 위임된 작업에 사용한다.
	- 작업을 별도 실행 컨텍스트에 위임하려고 한다.
	- 메인 대화와는 다른 도구 접근 권한이 필요하다.
	- 위임한 업무와 주요 업무 영역 사이에 격리가 필요하다.
- **훅은 이벤트 기반이고, 스킬은 요청 기반**이다. 훅 사용 케이스는 다음과 같다.
	- 파일을 저장할떄마다 실행되어야 하는 작업
	- 특정 도구 호출 전 유효성 검사
	- 클로드의 행동으로 인한 자동화된 부작용
- **MCP 서버는 외부 도구 및 통합 기능을 제공하며, 스킬과 다른 범주**다.
- **스킬은** 필요에 따라 로드되며 특정 작업에 대한 전문 지식에 가장 적합하다.
	- 업무별 전문 지식
	- 때때로만 유용한 지식
	- 모든 대화를 어지럽힐 만한 자세한 절차들
	- 현재 작업을 위해 클로드의 지식을 향상시키고 싶다..
	- 대화 전반에 걸쳐 적용되는 전문 지식들..
	- 클로드가 요청을 처리하는 방식에 영향을 미치는 지식
	- 클로드의 추론에 영향을 미치는 지침

## 스킬 공유하기

- 프로젝트 스킬은 .claude/skills에 존재하며, git을 통해 자동으로 공유되므로 저장소를 복제하는 모든 사람이 해당 스킬을 받게 된다.
- 플러그인을 사용하면 마켓플레이스를 통해 여러 저장소에 스킬을 배포해, 더 넓은 커뮤니티에서 활용할 수 있다.
- 엔터프라이즈 관리형 설정은 조직 전체에 치우선 순위로 스킬을 배포하므로, 필수 표준 및 규정 준수에 이상적이다. (managed-settings)
	- managed-settings 파일은 **strictKnownMarketplanges 기능을 제공하는데, 이를 통해 플러그인을 설치할 수 있는 위치를 제어**할 수 있다.

```java
"strictKnownMarketplaces": [
  {
    "source": "github",
    "repo": "acme-corp/approved-plugins"
  },
  {
    "source": "npm",
    "package": "@acme-corp/compliance-plugins"
  }
]
```

- 서브 에이전트는 자동으로 사용자의 스킬을 인식하지 못한다. 커스텀 에이전트의 프런트매터 skills 필드에 스킬을 명시적으로 나열해야 한다.

```java
이 서브 에이전트에게 권한을 위임하면, 해당 에이전트는 필요한 스킬을 모두 로드하고,
모든 검토에 적용한다. 먼저 .claude/skills
디렉터리에 해당 스킬이 있는지 확인한 다음, 새로운 서브 에이전트를 만들거나
기존 에이전트 md 파일에 skills 필드를 추가하면 된다. 다음 경우에 유용

- 특정 전문 지식을 활용해 작업을 격리하여 위임하고 싶을 경우
- 서브 에이전트마다 서로 다른 스킬이 필요한 경우
- 프롬프트에 의존하지 않고, 위임한 작업에 특정 표준을 일관되게 적용하고 싶은 경우

---
name: frontend-security-accessibility-reviewer
description: "Use this agent when you need to review frontend code for accessibility..."
tools: Bash, Glob, Grep, Read, WebFetch, WebSearch, Skill...
model: sonnet
color: blue
skills: accessibility-audit, performance-check
---
```

- 내장 에이전트는 스킬에 전혀 접근할 수 없으며, .claude/agents에 정의된 커스텀 서브 에이전트만 접근할 수 있다.
	- 내장 에이전트는 Claude Code가 기본으로 제공하는, 특정 작업에 맞게 미리 설정된 서브에이전트다.
	- 정의된 서브 에이전트의 스킬은 메인 대화처럼 필요에 따라 호출되는 것이 아니라, 서브 에이전트가 시작할 때 로드된다.

## 문제 해결 스킬

- **스킬 검증 도구(skills validator tool)를 사용**하라. 다른 문제를 디버깅하기 전에 구조적인 문제를 먼저 발견할 수 있다. uv를 사용하면 빠르게 설치 가능
- **스킬이 트리거되지 않는다면, 대부분 description이 원인**이다. 실제로 요청할 때 사용하는 표현과 일치하는 트리거 문구를 추가하라.
- 스킬이 로딩되지 않는다면, SKILL.md가 skills 루트 바로 아래가 아니라, 이름이 있는 하위 디렉터리 안에 있는지 확인하라. 파일명도 정확히 SKILL.md여야 한다.
	- claude —debug를 사용해 로딩 에러에 스킬 이름이 언급된 메시지가 있는지 확인해라.
- 엉뚱한 스킬이 사용된다면, 스킬들의 설명이 비슷한 것이니 설명을 더욱 명확하게 구분해야한다.
- 플로그인 스킬이 표시되지 않는다면, 캐시를 지우고, claude code를 재시작한 다음 플러그인을 다시 설치해라. → 그래도 안되면 플러그인 구조가 잘못되었을 가능성이 있는데, 이때 유효성 검사 도구가 유용하다.
- 실행 중 오류(런타임 오류)가 발생한다면, 의존성, 파일 권한, 경로 구분자를 확인하라. (경로 구분자는 모든 환경에서 슬래시를 사용하는 것이 좋다.)

**빠른 문제 해결 체크리스트**

- **트리거되지 않는가?** 설명을 개선하고 트리거 문구를 추가한다.
- **로딩되지 않는가?** 경로, 파일명, YAML 문법을 확인한다.
- **잘못된 스킬이 사용되는가?** 스킬별 설명을 더 명확하게 구분한다.
- **다른 스킬에 가려지는가?** 우선순위 계층을 확인하고 필요하면 이름을 변경한다.
- **플러그인 스킬이 보이지 않는가?** 캐시를 삭제하고 플러그인을 다시 설치한다.
- **실행 중 오류가 발생하는가?** 의존성, 권한, 경로를 확인한다.

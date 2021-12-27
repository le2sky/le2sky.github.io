---
date: '2021-12-26'
title: 'NestJS 이메일인증기반 회원가입 로직에 대한 고찰(1)'
categories: ['Backend', 'Nest', 'Redis']
summary: '이메일 인증기반 회원가입에 대한 로직을 깊이 생각해본 내용에 대해 정리합니다.'
thumbnail: './nest.png'
---

> 이전 글들은 글을 쓸 때, 문어체로 딱딱하게 썼는데 이제부터는 구어체로 작성을 하려고 합니다!

### 1. 기존 소스 분석

이메일인증기반 회원가입 로직을 구현하다가 어떻게 하면 좀 더 직관적이고 안전한 방법일까에 대한 생각을 하게 되었는데,
생각한 김에 글로 남겨 보겠습니다. 우선 기존 이메일기반 처리 로직은 다음과 같습니다.

**users.controller.ts**

```ts
  @Post()
  public async createUser(@Body() dto: CreateUserDto): Promise<string> {
    const { name, email, password } = dto;
    return await this.usersService.createUser(name, email, password);
  }
```

<br>
POST /uesrs 요청으로 createUser 라우트 핸들러에 CreateUserDto 타입인 바디를 전달합니다.

**users.service.ts**

```ts
 /*
  Parameter qualification: users/dto/create-user.dto.ts
  */

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);

    return await this.sendMemberJoinEmail(email, signupVerifyToken);
  }
```

<br>
이후에 이메일을 통해서 DB에 user가 있는지 확인을 한 이후에 없다면 uuid 토큰을 생성한 이후 user을 DB에 저장합니다.
이번엔 sendMemberJoinEmail 함수를 살펴보겠습니다.
<br>

**users.service.ts**

```ts
private async sendMemberJoinEmail(
    email: string,
    signupVerifyToken: string,
  ): Promise<string> {
    return await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
```

<br>
emailService.sendMemberJoinVerification 함수는 nodemailer 와 naver smtp 를 이용해서 사용자에게
인증 이메일을 발송하는 함수입니다. sendMemberJoinEmail 함수는 외부에서 노출되는 걸 방지하기 위해서
클래스 내부에서 private로 은닉화 시킵니다. emailService에 대한 자세한 내용은 글의 분량을 위해서 생략
하도록 하겠습니다. response 값은 '이메일이 발송되었습니다' 혹은 "이메일 전송 오류!"를 전달하도록 작동됩니다.

<br><br>

<img src="./mail.PNG">

> 아주 잘 작동하는 군요! 이제 인증하기 버튼을 누르면 아래의 라우트 핸들러로 받은 uuid 토큰과 함께 POST 요청을 하게 됩니다.

**users.controller.ts**

```ts
  @Post('/email-verify')
  public async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    await this.usersService.verifyEmail(signupVerifyToken);
    return '회원가입이 완료되었습니다';
  }
```

<br>
response값은 회원가입이 완료되었습니다. 이지만 이 부분은 중요하지 않습니다. 우선 코드를 분석해보겠습니다. 받은 메일에 인증하기 버튼을 누르면
https://url/users/email-verify?토큰 으로 POST 요청을 보내도록 만들었습니다. 그리고 받은 토큰을 userService.verifyEamil로 보냅니다.
<br>

**users.service.ts**

```ts
async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ signupVerifyToken });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return '회원가입에 성공하셨습니다.';
  }

```

<br>
verifyEmail 함수는 받은 토큰으로 아까 createUser에서 저장한 user이 있었죠? 그걸 확인합니다. 없으면 뭔가 잘못된 거죠 그래서 우선
Notfound 예외를 던지도록 했고 그렇지 않으면, 회원가입에 성공했다는 문자열을 보내게 됩니다.

> 여기에는 큰 흠이 있습니다.😂

1. user가 이메일만 전송하고 도망가면 DB에 저장되긴 할 겁니다. 그런데 직관적으로 생각해보면 DB에 저장됐다는 건 회원가입이 됐다는 뜻이죠?
   즉, 이메일 검증에 효과가 없어지게 됩니다.
2. 이전에 받았던 메일로 다시 회원가입에 성공했다는 문자열을 받을 수 있을 겁니다.

> 이러한 동작을 해소하기 위해서 여러가지 고민을 해봤고, 결국 도출해낸 결론에 대해서 작성해보겠습니다!

<br>

### 2. 시나리오

다음과 같은 절차로 기존 로직이 진행되는 걸 알 수 있습니다.

```ts
1. createUser 요청 -> saveUser -> 이메일 발송
2. verifyEmail 요청 -> 이메일 검증
```

<br>
이렇게 구현하면 위에 작성한 것처럼 문제가 있었죠. 그래서 제가 처음 생각해낸 건 다음과 같습니다.

> user를 먼저 저장하지 말고 이메일 검증하고나서 저장하면 안되는 건가?

위와 같은 생각을 로직으로 구현했을때는 아래와 같습니다.

```ts
createUser 요청 -> 이메일 발송 -> 이메일 검증 -> saveUser
```

<br>

**하지만 이러한 생각이 정말 나이브하단 걸 짧은 시간안에 깨달았습니다.**

1. 이메일을 발송할 때, 처음 요청 받은 name, email, password과 uuid를 다시 전송해야합니다. 왜냐하면 이메일 검증이후에
   saveUser을 할텐데 이때는 name,email,password를 알아야 하기 때문입니다.
2. 그렇다면 전송한 이메일에서 form 요청을 할때 query에 name, email, password, uuid token을 실어서 던지거나
3. query + request body에 name, email, password를 다시 실어서 보냅니다.

> 이러한 시나리오는 query 조작 가능성과 보안문제로 인해 좋지 않다고 생각합니다.
> 우선 토큰이 유효한 토큰인지에 대해 알 수 없을 뿐더러, 파이프를 통해 dto를 검사했을 텐데 password같은 값을 다시 조작할 수도 있습니다.(위 로직에서 saveUser는 중복유저가 있는지만 검사합니다.)
> 이러한 방법은 무언가 큰 문제가 더 많아 보이네요😥

<br>

**증말, 그럼 어쩔수 없네요 유저를 먼저 저장하는 방법을 사용해야겠군요.**
<br>
유저를 저장하는데 기존의 문제를 해결하기 위해서는 임시저장이라는 방법을 사용할 수 있겠다고 생각했습니다. 이러한 임시저장을 구현하는 방법으로
user 스키마에 state라는 컬럼을 추가한 이후 가입중, 가입완료 혹은 미인증유저, 인증유저로 분류하는 방법을 생각했습니다. 로직은 다음과 같습니다.

```ts
1. createUser 요청 -> saveUser/state는 미인증 유저 혹은 가입중인 유저로 저장 -> 이메일 발송
2. verifyEmail 요청 -> 이메일 검증 -> state를 인증유저 혹은 가입완료 유저로 변경
```

<br>
좀더 디테일하게 설명드리겠습니다.

```ts
1. user가 createDto(email, password, name)를 가지고 createUser 라우트 핸들러로 보냅니다.

2. 라우트 핸들러는 user 정보를 DB에 uuid 토큰과 state(미인증유저 / 가입중 유저)로 저장합니다.

3. 이메일을 발송합니다. 이메일안에서 버튼을 클릭하면 verifyEmail로 uuid 토큰을 query에 실어서 저희가 만든 라우트 핸들러로 전달하도록 합니다.

4. verifyEmail 라우트 핸들러 안에서 주어진 토큰이 DB에 있는지 확인합니다.

5. 토큰이 없다면 문제가 있는거고, 있다면 임시저장한 유저 혹은 회원가입을 완료한 유저겠군요

6. state를 확인합니다. 인증완료유저 혹은 가입완료유저라면 이미 가입된 회원이 기존에 보내진 메일을 통해 요청을 한 것이기 때문에 블락킹합니다.
(중복 요청을 방지합니다. 아까 로직에서 이미 가입한 회원도 회원가입 완료라는 문자열을 받을 수 있었죠, 하지만 지금은 문자열이지만 중요한 정보였다면 문제가 있겠죠?)

7. 좋습니다. 여기까지 왔다는 건 state가 미인증유저 혹은/가입 중인 유저일 겁니다. 토큰도 유효하고, DB에 저장된 값도 파이프를 통해 검증된 dto 였기 때문에 아주 좋습니다.

8. state를 인증완료유저 혹은 가입완료유저로 변경합니다. GOOD😎 클라이언트에서는 state를 통해서 미인증회원에게 접근을 제한할 수도 있을 것이고, 시간이 지나도록 인증을
하지 않는다면 과감하게 DB에서 지워버릴 수도 있겠습니다.
```

<br>
하지만 저는 위와 같은 방법이 만능은 아니라고 의심했습니다. 예를들어 스키마에 state를 추가했을 때, user 릴레이션에는 미인증유저와 인증유저가 공존할 수도 있을 것이고,
분리한다고 해도 번거로운 작업일 것이라 생각합니다. 뿐만 아니라 I/O 작업에 성능이 좋은 noedJS 기반 백엔드 프레임워크라 할 지라도 I/O작업은 여전히 부담이 있는 
작업이라고 생각합니다. state를 변경하는 트랜잭션을 걸고, 임시유저를 저장하는 트랜잭션을 걸고.... 이러한 관점에서 저는 In memory DB인 Redis를 통해 이러한 부분을
해결하면 어떨까? 라는 생각을 해봤습니다.

> Redis와 관련된 부분에 대해서는 나중에 따로 분리해서 글을 작성을 할 예정입니다! 우선은 이 포스팅 시리즈에서는 메모리에 올라가 있는 DB이며, 하드에 I/O 작업을 하는 것보다
> 훨씬 빠르다. 또 Redis에 저장되어 있는 값을 나중에 DB로 저장한다! 이정도로만 생각하는게 시리즈의 범위를 초과하지 않는 것이라 생각합니다.

사용자의 state를 변경하는 기존에 제시된 방법에서 저는 다음과 같은 로직을 생각했습니다.

```ts
1. createUser 요청 -> Redis에 임시유저 저장 -> 이메일 발송
2. verifyEmail 요청 -> 이메일 검증 -> Redis에 저장되어 있는 임시유저 정보를 DB에 저장!(user 릴레이션은 state란 값을 안가져도 인증된 유저만 들어가게 됩니다!😎)
```

<br>
좀더 디테일하게 설명드리겠습니다.

```ts
1. user가 createDto(email, password, name)를 가지고 createUser 라우트 핸들러로 보냅니다.

2. 라우트 핸들러는 user 정보를 uuid 토큰과 함께 Redis에 임시저장합니다.

3. 이메일을 발송합니다. 이메일안에서 버튼을 클릭하면 verifyEmail로 uuid 토큰을 query에 실어서 저희가 만든 라우트 핸들러로 전달하도록 합니다.

4. verifyEmail 라우트 핸들러 안에서 주어진 토큰이 Redis에 있는지 확인합니다.

5. 토큰이 없다면 문제가 있는거고, 있다면 임시저장한 유저겠군요!

6. Redis에서 토큰을 통해 유저정보를 가져옵니다.

7. Redis에 저장된 유저를 DB에 옮깁니다.🚀 특정 시간동안 인증을 하지 않는다면 Redis에서 정보를 지워버릴 수 있겠네요! Redisd에 정보가 없다면 이미 회원가입이 완료된 회원이거나
   아직 회원가입요청을 하지않은 유저겠군요. 옮기는 과정에서 이미 DB에 유저가 있다면 블락킹을 할 수도 있겠습니다.

8. 이제 user 릴레이션은 state 없이도 검증된 유저만 들어가게 됩니다.
```

> 어떤가요? DB 접근이 많이 줄었습니다!
> <br>

저는 아직 학생이고 배울게 많습니다. Redis나 Nest의 전문가도 현업 개발자도 아닙니다. 하지만 위와 같은 고찰을 통해서 좀더 깊이 있는 학습을 위해 이번 시리즈를
포스팅하게 되었습니다. 이제 다음 시리즈부터는 마지막에 설명드린 Redis로 이메일인증기반 회원가입을 구현해보도록 하겠습니다! 추가로 기존 로직에 템플릿을 곁들여서
회원가입 인증메일 폼도 이쁘게 한번 만들어 보겠습니다!😎

<br>

#### 참고

- [모두싸인 Dextto님의 NestJs로 배우는 백엔드 프로그래밍](https://wikidocs.net/book/7059)

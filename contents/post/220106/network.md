---
date: '2022-01-06'
title: '컴퓨터 네트워크 기본'
categories: ['Network']
summary: '한양대학교 이석복 교수님의 네트워크 강의 1강 요약입니다.'
thumbnail: './network.png'
---

### 1. 네트워크 구조

우리는 지금 수많은 노드들로 이루어진 인터넷 속에 살아갑니다. 네트워크는 둘 이상의 노드들이
서로 연결하는 링크의 조합이라고 정의합니다. 그 네트워크 구조에는 다음과 같은 요소가 있습니다.

```
keyword: network edge, network core, access networks, physical media
```

### 2. The network edge

network edge에는 client/server라고 불리는 컴퓨터들이 있습니다. 또는 peer-peer model을 이용하는 컴퓨터등이 있습니다. host라고 불리는 end systems등이 network의 가장자리에 있다고 표현할 수 있습니다. host가 client인 경우에는 데스크탑이나 스마트폰이 되고, server인 경우 웹 페이지나 미디어를 저장하고 제공하는 큰 컴퓨터가 될 수 있습니다.

> network edge에는 클라이언트/서버라고 불리는 컴퓨터가 있다고 생각하면 됨!😎

<br>

#### 2-1. connection-oriented service

기본적으로 인터넷이 제공하는 데이터 전송 서비스에는 두가지가 있습니다. 그중 하나인 연결지향서비스에
대해서 생각해 볼 수 있습니다. 대표적인 예로 TCP service가 있습니다. 여기서 전송 서비스는 edge network에 있는 end system들이 담당합니다. dumb core에 proxy들은 재전송 이런거 모릅니다...😥

> TCP(Transmission Control Protocol)은 인터넷의 연결지향서비스로서 양방향 데이터 통신을 제공하며
> 바이트 스트림을 사용하고, 순서를 보장하며, 신뢰성을 보장하고, flow 제어, congestion 제어를 해줍니다. 사용하는 예는 http(web), ftp(file transfer), telnet(remote login), smtp(email)
> (이후 챕터에서 자세히 다룹니다)

```
keyword: tcp, reliable, in-order, byte-stream data transfer, flow control, congestion control
```

<br>
<br>

#### 2-2. connectionless service

연결지향 데이터 전송 서비스인 TCP와 대조적으로 비연결 지향 서비스인 UDP가 있습니다. 내맘대로 데이터가 터지든 말든.. 관계없이 그냥 보내면 되는 경우 UDP를 사용한다고 표현하셨습니다..ㅎㅎ

> UDP(User Datagram Protocol)은 흐름제어 혼잡제어을 안해주고 TCP에 비해 신뢰성이 부족한 비연결 지향서비스입니다. 데이터 유실을 감당할 수 있는 경우 UDP를 사용할 수 있습니다. 컴퓨팅 리소스, 네트워크 리소스를 줄일 수 있다. 예로는 streaming media, 원격 회의, dns, internet telephony등 이 있습니다.

```
keyword: connectionless, unreliable data transter, no flow control, no congestion control
```

<br>
<br>

#### 2-3. protocol

프로토콜은 저번에 http 시리즈에서 말했듯이 상호간에 커뮤니케이션을 위한 규칙! 규약! 국룰!입니다.
국룰을 따르지 않는다면 의사소통이 힘들겠죠? 강의 자료에 따르면 모든 인터넷 통신은 프로토콜에 의해
조정된다고 합니다! 즉.. 인터넷에서 일어나는 노드간의 통신 = 노드 간의 링크 집합 = 네트워크 = 프로토콜
네트워크를 알려면 프로토콜을 잘알아야 한다고 느꼈습니다.

> All communication in Internet coordinated by protocols

### 3. The Network Core

네트워크의 핵심부분에는 수많은 라우터들이 있습니다. 이 라우터끼리 정보를 전달하는데 그 정보 전달
방법에는 Circuit Switching과 Packet Switching이 있습니다. 엄밀히 분류하자면 회선 교환과 축적 교환
이 있는데, 전송 단위가 메시지면 메시지 스위칭 패킷이면 패킷 스위칭입니다.

<br>

#### 3-1 Circuit Switching

Circuit Switching은 유선전화망을 떠올리면 쉽습니다. 특정 유저를 위한 길, 즉 회선을 쫘악 깔아둔 것이
죠 하지만 인터넷은 Circuit Switching을 이용하지 않고 Packet Switching을 사용합니다.

<br>

#### 3-2 Packet Switching: Statistical Multiplexing

패킷 스위칭은 라우터가 들어온 패킷을 알맞은 곳으로 그냥 보내는 방식입니다. 쉽게 말하면
목적지를 정해두고 메세지를 패킷으로 쪼개서 보낸뒤 목적지에서 패킷을 조립해서 확인하는 방식입니다.

> 패킷 교환 방식이란 컴퓨터 네트워크와 통신의 방식 중 하나로 현재 가장 많은 사람들이 사용하는 방식입니다. 작은 블록의 패킷으로 데이터를 전송하며 데이터를 전송하는 동안만 네트워크 자원을 사용하도록 하는 방법을 말합니다. -wiki-

<p>
<b> Packet Switching 방법에는 4가지 딜레이가 존재</b>합니다. 첫 번째로, bit error를 검사하고
어느 링크로 나갈지 결정할 때 생기는 nodal processing과정 중에 발생하는 지연, 라우터에 큐에서 대기하는 큐잉지연, 패킷의 모든 비트들이 링크로 나가는데 걸리는 시간인 전송지연, 링크에서 다음 라우터로 전파되는데 필요한 시간인 propagation 지연등이 있다.
</p>

<br>

#### 참고

- [한양대학교 이석복 교수님 네트워크](http://www.kocw.net/home/search/kemView.do?kemId=1169634)

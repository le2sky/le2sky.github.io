import React from 'react'

function channelStart() {
  var w = window
  if (w.ChannelIO) {
    return (window.console.error || window.console.log || function () {})(
      'ChannelIO script included twice.',
    )
  }
  var ch = function () {
    ch.c(arguments)
  }
  ch.q = []
  ch.c = function (args) {
    ch.q.push(args)
  }
  w.ChannelIO = ch
  function l() {
    if (w.ChannelIOInitialized) {
      return
    }
    w.ChannelIOInitialized = true
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js'
    s.charset = 'UTF-8'
    var x = document.getElementsByTagName('script')[0]
    x.parentNode.insertBefore(s, x)
  }
  if (document.readyState === 'complete') {
    l()
  } else if (window.attachEvent) {
    window.attachEvent('onload', l)
  } else {
    window.addEventListener('DOMContentLoaded', l, false)
    window.addEventListener('load', l, false)
  }
}

function init() {
  if (typeof window !== 'undefined') {
    channelStart()
    ChannelIO('boot', {
      pluginKey: '4bd1b82e-8fda-49cf-960a-c457109e7377',
    })
  } else {
    return null
  }
}

const ChannelTalk = function () {
  return (
    <>
      <script>{init()}</script>
    </>
  )
}

export default ChannelTalk

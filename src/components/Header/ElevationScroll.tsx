import { useScrollTrigger } from '@mui/material'
import { FunctionComponent, ReactElement } from 'react'
import React from 'react'

export type ElevationProps = {
  window?: () => Window
  children?: ReactElement
}

export const ElevationScroll: FunctionComponent<ElevationProps> = function (
  props: ElevationProps,
) {
  const { children, window } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })
  console.log(trigger)
  return React.cloneElement(children as ReactElement, {
    elevation: trigger ? 4 : 0,
  })
}

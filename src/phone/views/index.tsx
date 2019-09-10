import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Phone } from './phone'
import styled from 'styled-components'
import { fonts } from '~/renderer/constants'

const url = new URL(window.location.href)
const server = url.searchParams.get('server')
const username = url.searchParams.get('username')
const host = url.searchParams.get('host')
const lang = url.searchParams.get('lang')
const registerProps = username && host ? { username, host } : null

const StyledPhone = styled(Phone)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
`
const styleElement = document.createElement('style')

styleElement.textContent = `
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(${fonts.robotoRegular}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(${fonts.robotoMedium}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: url(${fonts.robotoLight}) format('woff2');
}
`

document.head.appendChild(styleElement)

ReactDOM.render(<StyledPhone phoneServer={server} registerProps={registerProps} lang={lang} />, document.getElementById('phone'))

import * as React from 'react'
import './Keyboard.css'

const keyboardKeys = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '#',
  '0',
  '*',
]

type KeyboardProps = {
  keyPressed: (key: string) => void,
}

export const Keyboard = (props: KeyboardProps) => (
  <div className="keyboard">
    { keyboardKeys.map((key, index) => (<div className="key" key={`${key}-${index}`} onClick={() => props.keyPressed(key)}><span>{key}</span></div>))}
  </div>
)

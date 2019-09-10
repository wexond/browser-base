import * as React from 'react'
import { Translator } from '../../../translator/translator'
import './Unavailable.css'

interface Props {
  className?: string
  translator: Translator
  lang?: string
}
export const Unavailable = (props: Props) => (
  <div className={props.className}>
    <h1>{props.translator.translate('Sorry... :(', props.lang)}</h1>
    <p>{props.translator.translate('The phone service is momentarily unavailable, please try again later', props.lang)}</p>.
  </div>
)

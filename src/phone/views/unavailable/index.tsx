import * as React from 'react'
import { Translator } from '../../../translator/translator'

interface Props {
  className?: string
  translator: Translator
  lang?: string
}
export const Unavailable = (props: Props) => (
  <div className={props.className}>
    {props.translator.translate('Sorry, this functionality is not available at the moment', props.lang)}.
  </div>
)

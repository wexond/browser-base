import React from 'react'

import Section from '../../Section'
import Item from '../../Item'

export default class Languages extends React.Component {
  render () {
    const lgItems = [
      'English',
      'Polski'
    ]

    return (
      <Section title='Languages' className='section-languages'>
        <Item title='Language' type='dropdown' items={lgItems} />
      </Section>
    )
  }
}
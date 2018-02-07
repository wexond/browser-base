import React from 'react'

import Section from '../../Section'
import Item from '../../Item'

export default class Browser extends React.Component {
  render () {
    const radiobuttons = [
      'xd'
    ]

    return (
      <Section title='Browser'>
        <Item title='New tab' type='radiobuttons' items={radiobuttons} />
      </Section>
    )
  }
}
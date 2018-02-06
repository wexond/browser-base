import React from 'react'

import Section from '../../Section'
import Item from '../../Item'

export default class Test extends React.Component {
  render () {
    const dropdownItems = [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5'
    ]

    return (
      <Section title='Foo' className='test'>
        <Item title='First type' description='Button' type='button' />
        <Item title='Second type' description='Switch' type='switch' />
        <Item title='Third type' description='Dropdown menu' type='dropdown' items={dropdownItems} />
      </Section>
    )
  }
}
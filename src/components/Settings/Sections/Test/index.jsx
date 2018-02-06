import React from 'react'

import Section from '../../Section'
import Item from '../../Item'

export default class Test extends React.Component {
  render() {
    return (
      <Section title='Foo' className='test'>
        <Item title='First type' description='Button' type='button' />
        <Item title='Second type' description='Switch' type='switch' />
      </Section>
    )
  }
}
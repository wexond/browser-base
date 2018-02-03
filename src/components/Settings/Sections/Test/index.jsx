import React from 'react'

import Section from '../../Section'
import Item from '../../Item'

export default class Test extends React.Component {
  render() {
    return (
      <Section title='Test' className='test'>
        <Item description='Foo' />
      </Section>
    )
  }
}
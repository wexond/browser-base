import React from 'react'

import ToolBar from '../ToolBar'
import Section from './Section'
import Item from './Item'
import ItemAction from './ItemAction'
import ExpandableContent from './ExpandableContent'
import RadioButtonsContainer from '../RadioButtonsContainer'
import RadioButton from '../RadioButton'
import Switch from '../Switch'

export default class Settings extends React.Component {
  constructor() {
    super()

    window.dictionary = window.dictionaryAPI.get()

    document.title = window.dictionary.pages.settings.title
  }

  render() {
    return (
      <div className='settings'>
        <ToolBar title='Settings' />
        <div className='content'>
          <div className='alert'>
          Warning! This is an experimental version of Settings page, and some features might not work!
          </div>
          <Section title='On startup'>
            <RadioButtonsContainer>
              <RadioButton toggled={true}>Open the new tab page</RadioButton>
              <RadioButton>Open a specific page</RadioButton>
              <RadioButton>Continue where you left off</RadioButton>
            </RadioButtonsContainer>
          </Section>
          <Section title='Test'>
            <Item title='Test' cursor='pointer' onClick={(e, action) => { action.toggle() }} ref='testItem1'>
              <ItemAction>
                <Switch onToggle={(toggled) => { this.refs.testItem1.expandableContent.toggle(!toggled) }} />
              </ItemAction>
              <ExpandableContent>
                Test
              </ExpandableContent>
            </Item>
          </Section>
        </div>
      </div>
    )
  }
}
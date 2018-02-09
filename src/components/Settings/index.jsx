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

  componentDidMount = async () => {
    this.settings = await window.settingsAPI.get()

    this.refs.onStartupRadioButtons.items[this.settings.onStartup.type].toggle(true)
    this.adblockSwitch.toggle(this.settings.adblock)
    this.adblockCosmeticSwitch.toggle(this.settings.adblockCosmetic)
  }

  render() {
    const save = async () => {
      await window.settingsAPI.save(this.settings)
    }

    const onStartupToggle = async (e) => {
      this.settings.onStartup.type = e.id
      save()
    }

    const onAdblockToggle = async (e) => {
      this.settings.adblock = e.toggled
      save()
    }

    const onAdblockCosmeticToggle = async (e) => {
      this.settings.adblockCosmetic = e.toggled
      save()
    }

    return (
      <div className='settings'>
        <ToolBar title='Settings' />
        <div className='content'>
          <div className='alert'>
          Warning! This is an experimental version of Settings page and some features might not work!
          </div>
          <Section title='On startup'>
            <RadioButtonsContainer ref='onStartupRadioButtons' onToggle={onStartupToggle}>
              <RadioButton>Open the new tab page</RadioButton>
              <RadioButton>Open a specific page</RadioButton>
              <RadioButton>Continue where you left off</RadioButton>
            </RadioButtonsContainer>
          </Section>
          <Section title='Privacy and security'>
            <Item title='Ad-block' description='Block unwanted ads' cursor='pointer'>
              <ItemAction>
                <Switch ref={(r) => this.adblockSwitch = r} onToggle={onAdblockToggle} />
              </ItemAction>
            </Item>
            <Item title='Ad-block cosmetic filtering' description='This is an experimental feature, which might slow down browser' cursor='pointer' ref='testItem1'>
              <ItemAction>
                <Switch ref={(r) => this.adblockCosmeticSwitch = r} onToggle={onAdblockCosmeticToggle} />
              </ItemAction>
            </Item>
          </Section>
          <Section title='Test'>
            <Item title='Test' cursor='pointer' ref='testItem1'>
              <ItemAction>
                <Switch />
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
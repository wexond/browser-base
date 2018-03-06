import React from 'react'

import ToolBar from './ToolBar'
import Section from './Section'
import Item from './Item'
import ItemAction from './ItemAction'
import ExpandableContent from './ExpandableContent'
import RadioButtonsContainer from '../Material/RadioButtonsContainer'
import RadioButton from '../Material/RadioButton'
import Switch from '../Material/Switch'
import FlatButton from '../Material/FlatButton'

interface Props {

}

interface State {
  adblockRelaunchBtnVisible: boolean,
}

export default class Settings extends React.Component<Props, State> {

  private settings: any
  private originalSettings: any
  private adblockSwitch: Switch
  private adblockCosmeticSwitch: Switch

  constructor(props: Props) {
    super(props)

    window.dictionary = window.dictionaryAPI.get()

    document.title = window.dictionary.pages.settings.title

    this.state = {
      adblockRelaunchBtnVisible: false
    }
  }

  public async componentDidMount() {
    this.settings = await window.settingsAPI.get()
    this.originalSettings = Object.assign({}, this.settings)

    this.refs.onStartupRadioButtons.items[this.settings.onStartup.type].toggle(true)
    this.adblockSwitch.toggle(this.settings.adblock)
    this.adblockCosmeticSwitch.toggle(this.settings.adblockCosmetic)
  }

  public render(): JSX.Element {
    const {
      adblockRelaunchBtnVisible
    } = this.state

    const save = async () => {
      await window.settingsAPI.save(this.settings)
    }

    const onStartupToggle = async (e: any) => {
      if (e.toggled) {
        this.settings.onStartup.type = e.id
        save()
      }
    }

    const onAdblockToggle = async (e: any) => {
      this.setState({adblockRelaunchBtnVisible: (this.originalSettings.adblock !== e.toggled)})
      this.settings.adblock = e.toggled
      save()
    }

    const onAdblockCosmeticToggle = async (e: any) => {
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
                <Switch ref={(r: Switch) => this.adblockSwitch = r} onToggle={onAdblockToggle} />
              </ItemAction>
              <ItemAction>
                <FlatButton style={{visibility: (adblockRelaunchBtnVisible) ? 'visible' : 'hidden'}}>relaunch</FlatButton>
              </ItemAction>
            </Item>
            <Item title='Ad-block cosmetic filtering' description='This is an experimental feature, which might slow down browser' cursor='pointer' ref='testItem1'>
              <ItemAction>
                <Switch ref={(r: Switch) => this.adblockCosmeticSwitch = r} onToggle={onAdblockCosmeticToggle} />
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
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { Content } from '../../../style';
import { Title, Row, Control, Header } from '../style';
import { Textfield } from '~/renderer/components/Textfield';
import { RadioButton } from '~/renderer/components/RadioButton';
import { Button } from '~/renderer/components/Button';
import { IStartupTab } from '~/interfaces/startup-tab';
import { icons } from '~/renderer/constants';

interface Props {
  initialValue: 'continue' | 'urls' | 'empty';
  initialURLS: IStartupTab[];
}

interface State {
  value: 'continue' | 'urls' | 'empty';
  customURLs: IStartupTab[];
}

class StartupControl extends React.PureComponent<Props, State> {
  private radioName = 'startupRadioButtons';

  public state: State = {
    value: this.props.initialValue,
    customURLs: this.props.initialURLS,
  }


  public get selectedItem(){
    return this.state.value || this.props.initialValue;
  }

  public set selectedItem(val: 'continue' | 'urls' | 'empty'){
    
    store.settings.object.startupBehavior.type = val;
    store.settings.save();
    if (val === 'empty'){
      store.startupTabs.clearStartupTabs(false, true);
      this.setState({value: val, customURLs: []});
    }
    else if (val === 'urls'){
      let defaultItems: IStartupTab[] = this.props.initialURLS || [];
      store.startupTabs.addStartupDefaultTabItems(defaultItems);
      this.setState({value: val, customURLs: defaultItems});
    }
    else if (val === 'continue'){
      store.startupTabs.clearStartupTabs(true, true);
      store.tabs.list.forEach(x => store.startupTabs.updateStartupTabItem(x));
      this.setState({value: val, customURLs: []});
    }
  }

  private onStartupOptionsChanged = (value: 'continue' | 'urls' | 'empty') => {
    this.selectedItem = value;
  };

  private onAddNewPageClick = () => {
    this.setState({
      customURLs: [...this.state.customURLs, {
        isUserDefined: true,
        pinned: false,
        
      }],
      value: 'urls',
    })
  };

  private onUpdateItemURL = (index: number, value: string) => {
    let newURLs = [...this.state.customURLs];
    newURLs[index].url = value;
    
    this.setState({
      value: 'urls',
      customURLs: newURLs,
    });
    this.saveCustomPages(newURLs);
  }

  private onDeleteItemClick = (index: number) => {
    let newURLs = [...this.state.customURLs].filter((item, j) => j !== index);
    this.setState({
      value: 'urls',
      customURLs: newURLs,
    });
    this.saveCustomPages(newURLs);
  }

  private saveCustomPages = (pages: IStartupTab[]) =>{
    store.startupTabs.addStartupDefaultTabItems(pages);
  }

  public render() {
    return (
      <Content>
        <Header>On Startup</Header>
        <Content>
          <Row>
            <Title>Open the New Tab page</Title>
            <Control>
              <RadioButton 
                name={this.radioName}
                value='empty' 
                selected={this.state.value === 'empty'}
                onSelect={this.onStartupOptionsChanged}/>
            </Control>
          </Row>
          <Row>
            <Title>Continue where you left off</Title>
            <Control>
              <RadioButton 
                name={this.radioName}
                value='continue' 
                selected={this.state.value === 'continue'} 
                onSelect={this.onStartupOptionsChanged}/>
            </Control>
          </Row>
          <Row>
            <Title>Open specific pages</Title>
            <Control>
              <RadioButton 
                name={this.radioName}
                value='urls' 
                selected={this.state.value === 'urls'} 
                onSelect={this.onStartupOptionsChanged}/>
            </Control>
          </Row>
          {(this.state.value === 'urls') && (
            <div>
              <div>
                {this.state.customURLs.map((item, index) => (
                    <Row key={index}>
                      <Control>
                        <Textfield
                          width={350}
                          placeholder={item.url}
                          onChange={(value) => this.onUpdateItemURL(index, value)}
                          icon={icons.close}
                          onIconClick={(target) => this.onDeleteItemClick(index)}
                          delay={500}
                        />
                      </Control>
                    </Row>
                ))}
                </div>

              <Row>
              <Control>
                <Button
                  children='Add a new page'
                  onClick={this.onAddNewPageClick}
                />
              </Control>
            </Row>
          </div>
          )}
        </Content>
      </Content>
    );
  }
}

export const OnStartup = observer(() => {
  const { type } = store.settings.object.startupBehavior;
  const startupTabList = store.startupTabs.list.filter(x => x.isUserDefined);
  return (
    <StartupControl 
      initialValue= {type} 
      initialURLS = {startupTabList}
    />
  );
});

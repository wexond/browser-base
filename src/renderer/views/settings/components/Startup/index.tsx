import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Title, Row, Header } from '../App/style';
import { Textfield } from '~/renderer/components/Textfield';
import { RadioButton } from '~/renderer/components/RadioButton';
import { Button } from '~/renderer/components/Button';
import { IStartupTab } from '~/interfaces/startup-tab';
import { BLUE_500, ICON_CLOSE } from '~/renderer/constants';
import store from '../../store';

interface Props {
  initialValue: 'continue' | 'urls' | 'empty';
  initialURLS: IStartupTab[];
}

interface State {
  value: 'continue' | 'urls' | 'empty';
  customURLs: IStartupTab[];
}

class StartupControl extends React.PureComponent<Props, State> {
  public state: State = {
    value: this.props.initialValue,
    customURLs: this.props.initialURLS,
  };

  public get selectedItem() {
    return this.state.value || this.props.initialValue;
  }

  public set selectedItem(val: 'continue' | 'urls' | 'empty') {
    store.settings.startupBehavior.type = val;
    store.save();

    if (val === 'empty') {
      store.startupTabs.clearStartupTabs(false, true);
      this.setState({ value: val, customURLs: [] });
    } else if (val === 'urls') {
      const defaultItems: IStartupTab[] = this.props.initialURLS || [];
      store.startupTabs.addStartupDefaultTabItems(defaultItems);
      this.setState({ value: val, customURLs: defaultItems });
    } else if (val === 'continue') {
      store.startupTabs.clearUserDefined();
      this.setState({ value: val, customURLs: [] });
    }
  }

  private select = (value: 'continue' | 'urls' | 'empty') => () => {
    this.selectedItem = value;
  };

  private onAddNewPageClick = () => {
    this.setState({
      customURLs: [
        ...this.state.customURLs,
        {
          isUserDefined: true,
          pinned: false,
        },
      ],
      value: 'urls',
    });
  };

  private onUpdateItemURL = (index: number, value: string) => {
    const newURLs = [...this.state.customURLs];
    newURLs[index].url = value;

    this.setState({
      value: 'urls',
      customURLs: newURLs,
    });
    this.saveCustomPages(newURLs);
  };

  private onDeleteItemClick = (index: number) => {
    const newURLs = [...this.state.customURLs].filter((item, j) => j !== index);
    this.setState({
      value: 'urls',
      customURLs: newURLs,
    });
    this.saveCustomPages(newURLs);
  };

  private saveCustomPages = (pages: IStartupTab[]) => {
    store.startupTabs.addStartupDefaultTabItems(pages);
  };

  public render() {
    const titleStyle = {
      marginLeft: 8,
    };

    const rowStyle = {
      cursor: 'pointer',
    };

    return (
      <>
        <Header>On Startup</Header>
        <Row style={rowStyle} onClick={this.select('empty')}>
          <RadioButton selected={this.state.value === 'empty'} />
          <Title style={titleStyle}>Open the New Tab page</Title>
        </Row>
        <Row style={rowStyle} onClick={this.select('continue')}>
          <RadioButton selected={this.state.value === 'continue'} />
          <Title style={titleStyle}>Continue where you left off</Title>
        </Row>
        <Row style={rowStyle} onClick={this.select('urls')}>
          <RadioButton selected={this.state.value === 'urls'} />
          <Title style={titleStyle}>Open specific pages</Title>
        </Row>
        {this.state.value === 'urls' && (
          <div style={{ marginLeft: 36 }}>
            <div>
              {this.state.customURLs.map((item, index) => (
                <Textfield
                  key={index}
                  width={350}
                  placeholder={item.url}
                  onChange={(value) => this.onUpdateItemURL(index, value)}
                  icon={ICON_CLOSE}
                  onIconClick={(target) => this.onDeleteItemClick(index)}
                  delay={500}
                  style={{ marginBottom: 8 }}
                />
              ))}
            </div>

            <Button
              type="outlined"
              foreground={BLUE_500}
              background={BLUE_500}
              onClick={this.onAddNewPageClick}
            >
              Add a new page
            </Button>
          </div>
        )}
      </>
    );
  }
}

export const OnStartup = observer(() => {
  const { type } = store.settings.startupBehavior;
  const startupTabList = store.startupTabs.list.filter((x) => x.isUserDefined);
  return <StartupControl initialValue={type} initialURLS={startupTabList} />;
});

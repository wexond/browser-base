import { observer } from "mobx-react";
import React from "react";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

// Components
import Tab from "../Tab";

import Store from "../../store";

interface IProps {
  tabGroup: ITabGroup;
}

@observer
export default class TabGroup extends React.Component<IProps, {}> {
  public render() {
    const { tabGroup } = this.props;

    return (
      <>
        {tabGroup.tabs.map((tab: ITab) => (
          <Tab
            key={tab.id}
            tabGroup={tabGroup}
            tab={tab}
            selected={tabGroup.selectedTab === tab.id}
          />
        ))}
      </>
    );
  }
}
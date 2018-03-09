import React from "react";
import styled from "styled-components";

interface IProps {
  id: number;
  url: string;
  selected: boolean;
}

export default class Page extends React.Component<IProps, {}> {
  public render() {
    const { url, selected } = this.props;

    const pageStyle = {
      flex: selected ? 1 : "0 1",
      height: !selected && 0,
      width: !selected && 0,
      pointerEvents: !selected && "none",
      opacity: selected ? 1 : 0
    };

    return (
      <div style={pageStyle}>
        <webview src={url} style={{ height: "100%" }} />
      </div>
    );
  }
}

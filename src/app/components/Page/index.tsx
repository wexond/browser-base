import React, { SFC } from "react";
import styled from "styled-components";

import { IPage } from "../../interfaces";

interface IProps {
  page: IPage;
  selected: boolean;
}

export default ({ page, selected }: IProps) => {
  const { url } = page;

  const pageStyle: any = {
    flex: selected ? 1 : "0 1",
    height: !selected ? 0 : "auto",
    width: !selected ? 0 : "auto",
    pointerEvents: !selected ? "none" : "auto",
    opacity: !selected ? 0 : 1,
    position: !selected ? "absolute" : "initial",
    top: !selected ? 0 : "auto",
    left: !selected ? 0 : "auto"
  };

  return (
    <div style={pageStyle}>
      <webview src={url} style={{ height: "100%" }} useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36 WEXOND/0.3" nodeintegration={true} blinkfeatures="PreciseMemoryInfo, CSSVariables"/>
    </div>
  );
};

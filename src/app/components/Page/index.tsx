import { observer } from "mobx-react";
import React from "react";

// Interfaces
import { IPage } from "../../interfaces";

// Styles
import { Page } from "./styles";

interface IProps {
  page: IPage;
  selected: boolean;
}

export default observer(({ page, selected }: IProps) => {
  const { url } = page;

  return (
    <Page>
      <webview src={url} style={{ height: "100%" }} />
    </Page>
  );
});

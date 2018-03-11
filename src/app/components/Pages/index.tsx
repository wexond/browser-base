import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { IPage } from "../../interfaces";

import Store from "../../store";

import Page from "../Page";

export default observer(() => {
  return (
    <StyledPages>
      {Store.pages.map((page: IPage) => {
        return (
          <Page
            key={page.id}
            page={page}
            selected={Store.tabGroups[0].selectedTab === page.id}
          />
        );
      })}
    </StyledPages>
  );
});

const StyledPages = styled.div`
  z-index: 4;
  position: relative;
  flex: 1;
  display: flex;
`;

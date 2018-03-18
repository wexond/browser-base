import { observer } from "mobx-react";
import React from "react";

// Components
import Page from "../Page";

// Styles
import { StyledPages } from "./styles";

import Store from "../../store";

export default observer(() => {
  return (
    <StyledPages>
      {Store.pages.map(page => {
        return (
          <Page
            key={page.id}
            page={page}
            selected={Store.getCurrentTabGroup().selectedTab === page.id}
          />
        );
      })}
    </StyledPages>
  );
});

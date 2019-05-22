import * as React from 'react';
import { observer } from 'mobx-react';
import {
  Soon,
  StyledCard,
  Icon,
  Header,
  Left,
  Title,
  Item,
  Items,
  Overline,
  SmallIcon,
  Degrees,
  SmallDegrees,
} from './style';
import { icons } from '../../constants';

export const WeatherCard = observer(() => {
  return (
    <StyledCard>
      <Header>
        <Left>
          <div>
            <Title>Warsaw</Title>
            <Degrees>20°</Degrees>
            <div
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginBottom: 4,
                marginTop: 8,
              }}
            >
              Few clouds
            </div>
            <div style={{ fontSize: 16, fontWeight: 300 }}>Day</div>
          </div>
          <div>
            <Icon style={{ backgroundImage: `url(${icons.fewClouds})` }} />
          </div>
        </Left>
      </Header>
      <Items>
        <Item>
          <Overline>WED</Overline>
          <SmallIcon style={{ backgroundImage: `url(${icons.fewClouds})` }} />
          <SmallDegrees>20°</SmallDegrees>
          <SmallDegrees night>12°</SmallDegrees>
        </Item>
        <Item>
          <Overline>THU</Overline>
          <SmallIcon style={{ backgroundImage: `url(${icons.fewClouds})` }} />
          <SmallDegrees>20°</SmallDegrees>
          <SmallDegrees night>12°</SmallDegrees>
        </Item>
        <Item>
          <Overline>FRI</Overline>
          <SmallIcon style={{ backgroundImage: `url(${icons.fewClouds})` }} />
          <SmallDegrees>20°</SmallDegrees>
          <SmallDegrees night>12°</SmallDegrees>
        </Item>
        <Item>
          <Overline>SAT</Overline>
          <SmallIcon style={{ backgroundImage: `url(${icons.fewClouds})` }} />
          <SmallDegrees>20°</SmallDegrees>
          <SmallDegrees night>12°</SmallDegrees>
        </Item>
      </Items>
      <Soon>Soon</Soon>
    </StyledCard>
  );
});

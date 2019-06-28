import * as React from 'react';
import { observer } from 'mobx-react';

import { icons } from '../../../app/constants';
import store from '../../../app/store';
import {
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

export const WeatherCard = observer(() => {
  if (store.weather.loading) return null;

  const { city, today, week } = store.weather.data;

  return (
    <StyledCard>
      <Header>
        <Left>
          <div>
            <Title>{city}</Title>
            <Degrees>{today.dayTemp}°</Degrees>
            <div
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginBottom: 4,
                marginTop: 8,
              }}
            >
              {today.description}
            </div>
            <div style={{ fontSize: 16, fontWeight: 300 }}>{today.dayName}</div>
          </div>
          <div>
            <Icon
              style={{
                backgroundImage: `url(${icons.weather.day[today.weather]})`,
              }}
            />
          </div>
        </Left>
      </Header>
      <Items>
        {week.map((item, key) => (
          <Item key={key}>
            <Overline>{item.dayName.toUpperCase()}</Overline>
            <SmallIcon
              style={{
                backgroundImage: `url(${icons.weather.day[item.weather]})`,
              }}
            />
            <SmallDegrees>{item.dayTemp}°</SmallDegrees>
            <SmallDegrees night>{item.nightTemp}°</SmallDegrees>
          </Item>
        ))}
      </Items>
    </StyledCard>
  );
});

import React from 'react';

import store from '@newtab/store';
import { WeatherForecast, WeatherWeeklyItem } from '@/interfaces/newtab';
import { formatDescription } from '@/utils/newtab/weather';
import { transparency, icons, colors } from '@/constants/renderer';
import { formatTime, getDayIndex } from '@/utils/time';
import { capitalizeEachWord } from '@/utils/strings';
import Slider from '@/components/Slider';
import * as Card from '@/components/Card';
import Button from '@/components/Button';
import ForecastItem from '../ForecastItem';
import {
  ActionsContainer,
  ExtraInfo,
  ExtraInfoContainer,
  ExtraInfoIcon,
  ExtraInfoText,
  ForecastContainer,
  InfoContainer,
  Temperature,
  TemperatureDeg,
  TemperatureIcon,
} from './styles';

export interface IProps {
  data: WeatherForecast;
}

export interface IState {
  dailyForecastIndex: number;
  forecastHeight: number;
}

export default class WeatherCard extends React.Component<IProps, IState> {
  public state: IState = {
    dailyForecastIndex: 0,
    forecastHeight: 0,
  };

  public forecastContainer: HTMLDivElement;

  public onExpandButtonClick = () => {
    const { forecastHeight } = this.state;
    const expanded = forecastHeight > 0;

    this.setState({
      forecastHeight: expanded ? 0 : this.forecastContainer.scrollHeight,
    });
  };

  public onSliderChange = (index: any) => {
    this.setState({
      dailyForecastIndex: index,
    });
  };

  public render() {
    const { data } = this.props;
    const { dailyForecastIndex, forecastHeight } = this.state;
    const { dictionary } = store;

    const expanded = forecastHeight > 0;
    const description =
      data && formatDescription(dictionary, data, dailyForecastIndex);
    const current = data && data.daily[dailyForecastIndex];

    const windIconStyle = {
      opacity: transparency.light.disabledIcon,
    };

    const sliderStyle = {
      width: 'calc(100% - 64px)',
      margin: '32px auto 0px auto',
    };

    const sliderTicks = [];

    if (data != null) {
      for (let i = 0; i < data.daily.length; i++) {
        sliderTicks.push(formatTime(data.daily[i].date, data.timeUnit, false));
      }
    }

    return (
      <Card.Root>
        <Card.Header>
          <Card.Title large>
            {(data && capitalizeEachWord(data.city)) ||
              'Weather info is unavailable'}
          </Card.Title>
          <Card.SecondaryText>
            {data && description}
            {!data &&
              'Check your internet connection or your settings. City name is probably incorrect.'}
          </Card.SecondaryText>
        </Card.Header>
        {data && (
          <Card.Content>
            <InfoContainer>
              <Temperature>
                {current.temp}
                <TemperatureDeg>
                  &deg;
                  {data.tempUnit}
                </TemperatureDeg>
              </Temperature>
              <TemperatureIcon src={current.icon} />
            </InfoContainer>
            <ExtraInfoContainer>
              <ExtraInfo>
                <ExtraInfoIcon src={icons.precipitation} />
                <ExtraInfoText>
                  {current.precipitation}% {dictionary.newTab.precipitation}
                </ExtraInfoText>
              </ExtraInfo>
              <ExtraInfo>
                <ExtraInfoIcon src={icons.wind} style={windIconStyle} />
                <ExtraInfoText>
                  {current.winds}
                  {` ${data.windsUnit}`} {dictionary.newTab.winds}
                </ExtraInfoText>
              </ExtraInfo>
            </ExtraInfoContainer>
            <Slider
              onChange={this.onSliderChange}
              discrete
              color="#000"
              ticks={sliderTicks}
              style={sliderStyle}
              showTicksLabels
            />
            <ForecastContainer
              innerRef={r => (this.forecastContainer = r)}
              height={forecastHeight}
            >
              {data.weekly.map((day: WeatherWeeklyItem, key: any) => {
                const dayName =
                  store.dictionary.dateAndTime.days[getDayIndex(day.date)];
                return <ForecastItem data={day} dayName={dayName} key={key} />;
              })}
            </ForecastContainer>
            <ActionsContainer expanded={expanded}>
              <Button
                foreground={colors.blue['500']}
                text
                onClick={this.onExpandButtonClick}
                style={{ ...Card.ActionButtonStyle, marginLeft: 0 }}
              >
                {(!expanded && dictionary.general.expand.toUpperCase()) ||
                  dictionary.general.collapse.toUpperCase()}
              </Button>
            </ActionsContainer>
          </Card.Content>
        )}
      </Card.Root>
    );
  }
}

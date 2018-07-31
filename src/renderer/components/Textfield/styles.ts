import styled, { css } from 'styled-components';
import images from '../../mixins/images';
import typography from '../../mixins/typography';
import opacity from '../../defaults/opacity';

export const Root = styled.div`
  width: 100%;
  position: relative;
`;

export const Container = styled.div`
  width: 100%;
  height: 56px;
  position: relative;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.06);
  user-select: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  &:hover {
    & .hover-border {
      opacity: 1;
    }
  }
`;

export const HoverBorder = styled.div`
  width: 100%;
  height: 1px;
  position: absolute;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.39);
  transition: 0.15s opacity;
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-self: center;
  opacity: ${opacity.light.inactiveIcon};

  ${images.center('24px', 'auto')};

  ${({ src }: { src: string }) => css`
    background-image: url(${src});
  `};
`;

export const LeadingIcon = styled(Icon)`
  margin-left: 12px;
`;

export const TrailingIcon = styled(Icon)`
  margin-right: 12px;
  cursor: pointer;
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
`;

export interface LabelProps {
  color: string;
  activated: boolean;
}

export const Label = styled.div`
  width: 100%;
  padding-left: 12px;
  white-space: nowrap;
  display: flex;
  align-self: center;
  position: absolute;
  will-change: color, opacity, margin-top, font-size;
  transition: 0.15s color, 0.15s ease-out margin-top, 0.15s ease-out font-size, 0.15s opacity;

  ${({ color, activated }: LabelProps) => css`
    margin-top: ${activated ? '-10px' : 'unset'};
    color: ${activated ? color : '#000'};
    font-size: ${activated ? 12 : 16}px;
    opacity: ${activated ? 1 : opacity.light.secondaryText};

    ${activated ? typography.robotoMedium() : typography.robotoRegular()};
  `};
`;

export const Input = styled.input`
  width: 100%;
  height: calc(100% - 16px);
  border: none;
  outline: none;
  margin: 0;
  margin-top: 16px;
  padding-left: 12px;
  padding-right: 12px;
  -webkit-text-fill-color: transparent;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
  text-shadow: ${`0px 0px 0px rgba(0, 0, 0,${opacity.light.primaryText})`};

  ${typography.robotoRegular()};

  ${({ color }: { color: string }) => css`
    color: ${color};
  `};

  &:focus {
    cursor: text;
  }
`;

export interface IndicatorProps {
  color: string;
  activated: boolean;
}

export const Indicator = styled.div`
  height: 2px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -1px;
  transition: 0.15s ease-out;
  will-change: width;

  ${({ color, activated }: IndicatorProps) => css`
    width: ${activated ? 100 : 0}%;
    background-color: ${color};
  `};
`;

export const HelperTexts = styled.div`
  width: 100%;
  position: relative;
  padding-top: 8px;

  ${({ icon }: { icon: boolean }) => css`
    padding-left: ${icon ? 48 : 12}px;
  `};
`;

export const AssistiveText = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});

  ${typography.robotoRegular()};
`;

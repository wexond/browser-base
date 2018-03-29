import styled from 'styled-components';

interface PageProps {
  selected: boolean;
}

export default styled.div.attrs({
  style: ({ selected }: PageProps) => ({
    flex: selected ? 1 : '0 1',
    height: !selected ? 0 : 'auto',
    width: !selected ? 0 : 'auto',
    pointerEvents: !selected ? 'none' : 'auto',
    opacity: !selected ? 0 : 1,
    position: !selected ? 'absolute' : 'initial',
    top: !selected ? 0 : 'auto',
    left: !selected ? 0 : 'auto',
    visibility: !selected ? 'hidden' : 'visible',
  }),
})`
  ${(props: PageProps) => (props.selected ? '' : '')};
`;

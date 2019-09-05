import styled from 'styled-components'

const Flex = styled.div`
  width: 100%;
  display: flex;
`

export const FlexRow = styled(Flex)`
  flex-direction: row;
`

export const FlexRowCenter = styled(FlexRow)`
  align-items: center;
  justify-content: center;
`

export const FlexRowSpaceEvenly = styled(FlexRow)`
  align-items: center;
  justify-content: space-evenly;
`

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`

export const FlexColumnCenter = styled(FlexColumn)`
  align-items: center;
  justify-content: center;
`

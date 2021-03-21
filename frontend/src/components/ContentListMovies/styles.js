import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  display: grid;
  /* grid-template-columns: ${(props) => {
    if (props.cardOrientation === 'vertical') {
      return '1fr 1fr 1fr 1fr 1fr 1fr 1fr;';
    } else if (props.cardOrientation === 'horizontal') {
      return '1fr 1fr 1fr 1fr 1fr;';
    }
    return '1fr 1fr 1fr 1fr 1fr 1fr 1fr';
  }}; */
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 15px;

  .cardWrapper {
    display: flex;
  }

  .cardWrapper:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }

  > .skeleton {
    position: relative;
  }

  > .skeleton:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }
`;

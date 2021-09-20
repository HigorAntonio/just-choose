import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
`;

export const Thumbnail = styled.div`
  width: 360px;
  background: var(--search-button);
  display: flex;
  margin-right: 20px;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(9 / 16 * 100%);
  }

  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  background-color: var(--background-600);

  ${(props) =>
    props.roundedThumbnail &&
    `border-radius: 50%;
    width: 136px;
    height: 136px;
  `};
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3``;

export const Meta = styled.div``;

export const Description = styled.div``;

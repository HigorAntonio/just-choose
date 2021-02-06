import styled, { css } from 'styled-components';

import JustChooseLogo from '../../assets/JustChooseLogo.png';
import SearchImage from '../../assets/SearchIcon.png';
import NewList from '../../assets/NewList.png';
import NewPoll from '../../assets/NewPoll.png';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 10px 19px;

  border-bottom: 3px solid var(--header-border);

  background: var(--primary);
`;

export const Logo = styled.img.attrs((props) => ({
  src: props.src || JustChooseLogo,
  alt: props.alt || 'JustChose Logo',
}))`
  height: 35px;

  &:hover {
    cursor: pointer;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  width: min(399px, 100%);

  max-height: 36px;

  margin: 0 20px;
`;

export const SearchInput = styled.input`
  width: 90%;
  height: 36px;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px 0 0 5px;
  border: 2px solid var(--search);
  background: var(--search);
  text-overflow: ellipsis;

  &::placeholder {
    color: var(--white);
  }

  outline: 0;

  &:hover {
    border: 2px solid var(--gray);
  }

  &:focus {
    border: 2px solid var(--accent);
  }

  transition: border 0.3s;
`;

export const SearchButton = styled.button`
  width: 10%;
  height: 36px;
  min-width: 30px;

  padding: 5px;

  border-radius: 0 5px 5px 0;

  margin-left: 1px;

  background: var(--search-button);

  &:hover {
    background: var(--search);
  }

  &:disabled {
    background: var(--search-button);
    cursor: not-allowed;
  }
`;

export const SearchIcon = styled.img.attrs((props) => ({
  src: props.src || SearchImage,
  alt: props.alt || 'Buscar',
}))`
  width: 60%;
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    margin-right: 10px;
  }
`;

const navButtonCss = css`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 35px;
  height: 35px;

  border-radius: 5px;

  outline: none;

  &:hover {
    background: var(--search);
    cursor: pointer;
  }
  position: relative;
`;

export const NewListButton = styled.button`
  ${navButtonCss}
`;

export const NewListIcon = styled.img.attrs((props) => ({
  src: props.src || NewList,
  alt: props.alt || 'Nova Lista',
}))`
  height: 25px;

  margin-top: 2px;
`;

export const NewPollButton = styled.button`
  ${navButtonCss}
  width: 40px;
`;

export const NewPollIcon = styled.img.attrs((props) => ({
  src: props.src || NewPoll,
  alt: props.alt || 'Nova Votação',
}))`
  height: 27px;
`;

export const Tooltip = styled.span`
  visibility: hidden;
  width: ${(props) => props.width || '120px'};
  background-color: var(--white);
  color: var(--black);
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  top: 150%;
  left: 50%;
  margin-left: ${(props) =>
    `-${parseFloat(props.width) / 2}${props.width.replace(
      `${parseFloat(props.width)}`,
      ''
    )}` || '-60px'};
  font-weight: bold;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent var(--white) transparent;
  }

  ${NewListButton}:hover &,
  ${NewPollButton}:hover & {
    visibility: visible;
  }
`;

const signButton = css`
  font-weight: bold;
  color: var(--white);
  height: 35px;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;
`;

export const SignIn = styled.button`
  ${signButton}
  background: rgba(255, 255, 255, .2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }
`;

export const SignUp = styled.button`
  ${signButton}
  background: var(--accent);
  &:hover {
    background: #0f6ba8d9;
    cursor: pointer;
  }
`;

export const Profile = styled.div`
  width: 35px;
  height: 35px;

  border-radius: 50%;

  background: var(--gray);

  &:hover {
    cursor: pointer;
  }
`;

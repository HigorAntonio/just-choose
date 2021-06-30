import styled, { css } from 'styled-components';

import JustChooseLogoLight from '../../assets/JustChooseLogoLight.svg';
import JustChooseLogoDark from '../../assets/JustChooseLogoDark.svg';
import NewList from '../../assets/NewList.png';
import NewPoll from '../../assets/NewPoll.png';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;

  height: 59px;

  background: var(--background-100);

  -webkit-box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
`;

export const LogoWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavMenuWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Logo = styled.img.attrs((props) => ({
  src:
    props.src ||
    (props.theme === 'light' ? JustChooseLogoLight : JustChooseLogoDark),
  alt: props.alt || 'JustChose Logo',
}))`
  height: 35px;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;

export const SearchBar = styled.div`
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
  border: 2px solid var(--background-400);
  background: var(--background-400);
  text-overflow: ellipsis;

  &::placeholder {
    color: var(--text);
  }

  outline: 0;

  &:hover {
    border: 2px solid var(--gray);
  }

  &:focus {
    border: 2px solid var(--primary-400);
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

  background: var(--background-300);

  &:hover {
    background: var(--background-500);
  }

  &:disabled {
    background: var(--background-300);
    cursor: not-allowed;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;

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
    background: var(--background-500);
    cursor: pointer;
  }
  position: relative;
`;

export const NewListButton = styled.button`
  ${navButtonCss}
  margin-right: 10px;
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
  margin-right: 10px;
`;

export const NewPollIcon = styled.img.attrs((props) => ({
  src: props.src || NewPoll,
  alt: props.alt || 'Nova Votação',
}))`
  height: 27px;
`;

export const Tooltip = styled.span`
  opacity: 0;
  pointer-events: none;
  width: ${(props) => props.width || '120px'};
  background-color: var(--tooltip);
  color: var(--tooltip-text);
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
    border-color: transparent transparent var(--tooltip) transparent;
  }

  ${NewListButton}:hover &,
  ${NewPollButton}:hover & {
    opacity: 1;
  }

  transition: opacity 0.4s ease-in;
`;

const signButton = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--text);
  height: 35px;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;
`;

export const SignIn = styled.button`
  ${signButton}
  background: var(--background-300);

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const SignUp = styled.button`
  ${signButton}
  color: var(--white);
  background: var(--primary-400);
  &:hover {
    background: var(--primary-500);
    cursor: pointer;
  }
`;

export const ProfileWrapper = styled.div`
  position: relative;
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

export const ProfileDropDown = styled.div`
  width: 280px;
  background: var(--background-100);
  padding: 10px;
  border-radius: 5px;
  position: absolute;
  bottom: -5px;
  right: 0;
  transform: translateY(100%);

  ${(props) =>
    props.show
      ? 'opacity: 1; pointer-events: all; transform: translateY(100%);'
      : 'opacity: 0; pointer-events: none; transform: translateY(90%);'}
  transition: opacity 0.4s ease, transform 0.4s ease;
`;

export const DropDownOption = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px;
  border-radius: 2.5px;

  > .align-left {
    flex: 0;
    display: flex;
    align-items: center;
    margin-right: 5px;
  }

  > .align-right {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

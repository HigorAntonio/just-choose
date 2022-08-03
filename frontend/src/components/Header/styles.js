import styled, { css } from 'styled-components';

import JustChooseLogoLight from '../../assets/JustChooseLogoLight.svg';
import JustChooseLogoDark from '../../assets/JustChooseLogoDark.svg';
import NewList from '../../assets/NewList.png';
import NewPoll from '../../assets/NewPoll.png';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;

  /* height: 59px; */
  padding: 0.5em;

  background: var(--background-100);

  -webkit-box-shadow: 0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.5);
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

  @media (max-width: 1290px) {
    flex: 2;
  }

  @media (max-width: 768px) {
    justify-content: flex-end;
    position: relative;
  }
`;

export const NavMenuWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex: 0;
  }
`;

export const Logo = styled.img.attrs((props) => ({
  src:
    props.src ||
    (props.theme === 'light' ? JustChooseLogoLight : JustChooseLogoDark),
  alt: props.alt || 'JustChose',
}))`
  height: 3.5rem;
  margin-left: 0.5rem;
  margin-right: 1em;

  &:hover {
    cursor: pointer;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  width: 100%;
  max-width: 39rem;
  margin: 0 2rem;

  @media (max-width: 768px) {
    display: none;
  }

  &.searchbar-small-screen {
    display: none;
    background: var(--background-100);
    padding: 0.5rem;
    min-width: 39rem;
    margin: 0;
    border-radius: 5px;
    position: absolute;
    top: 4.5rem;
    right: 0;
    transform: translateX(20%);

    -webkit-box-shadow: 0 0.2rem 1rem 0.1rem rgba(0, 0, 0, 0.25);
    box-shadow: 0 0.2rem 1rem 0.1rem rgba(0, 0, 0, 0.25);

    @media (max-width: 768px) {
      ${(props) => (props.show ? 'display: flex;' : 'display: none;')}
    }

    @media (max-width: 670px) {
      transform: translateX(40%);
    }

    @media (max-width: 530px) {
      min-width: 85vw;
      transform: translateX(50%);
    }

    @media (max-width: 470px) {
      transform: translateX(10%);
    }

    @media (max-width: 370px) {
      transform: translateX(15%);
    }
  }
`;

export const SearchInput = styled.input`
  width: 90%;
  height: 3.6rem;
  font-size: 1.4rem;
  padding: 0.5rem 1rem;
  border-radius: 5px 0 0 5px;
  border: 0.2rem solid var(--background-400);
  background: var(--background-400);
  text-overflow: ellipsis;

  &::placeholder {
    color: var(--text);
  }

  outline: 0;

  &:hover {
    border: 0.2rem solid var(--gray);
  }

  &:focus {
    border: 0.2rem solid var(--primary-400);
  }

  transition: border 0.3s;
`;

export const SearchButton = styled.button`
  width: 10%;
  height: 3.6rem;
  min-width: 3rem;
  padding: 0.5rem;
  border-radius: 0 5px 5px 0;
  margin-left: 0.1rem;
  background: var(--background-300);

  &.squared {
    width: 3.6rem;
    border-radius: 5px;
  }

  &.no-background {
    background: transparent;
  }

  &:hover {
    background: var(--background-500);
  }

  &:disabled {
    background: var(--background-300);
    cursor: not-allowed;
  }

  &.search-button-small-screen {
    display: none;
  }

  @media (max-width: 768px) {
    &.search-button-small-screen {
      display: initial;
    }
  }
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 1rem;

  > button {
    margin-right: 1rem;
  }
`;

const navButtonCss = css`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 3.5rem;
  height: 3.5rem;

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
  margin: 0 1rem;
`;

export const NewListIcon = styled.img.attrs((props) => ({
  src: props.src || NewList,
  alt: props.alt || 'Nova Lista',
}))`
  height: 2.5rem;

  margin-top: 0.2rem;
`;

export const NewPollButton = styled.button`
  ${navButtonCss}
  width: 4rem;
  margin-right: 1rem;
`;

export const NewPollIcon = styled.img.attrs((props) => ({
  src: props.src || NewPoll,
  alt: props.alt || 'Nova Votação',
}))`
  height: 2.7rem;
`;

const signButton = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--text);
  height: 3.5rem;
  padding: 1rem;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;

  @media (max-width: 470px) {
    display: none;
  }
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

  @media (max-width: 470px) {
    margin-left: 1rem;
  }
`;

export const Profile = styled.div`
  width: 3.5rem;
  height: 3.5rem;

  border-radius: 50%;

  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  background-color: var(--background-600);

  &:hover {
    cursor: pointer;
  }

  > svg {
    transform: translate(0.75rem, 0.75rem);
  }
`;

export const ProfileDropDown = styled.div`
  width: 28rem;
  background: var(--background-100);
  padding: 1rem;
  border-radius: 5px;
  position: absolute;
  bottom: -0.5rem;
  right: 0;
  transform: translateY(100%);

  -webkit-box-shadow: 0 0.4rem 1rem 0 rgba(0, 0, 0, 0.25);
  box-shadow: 0 0.4rem 1rem 0 rgba(0, 0, 0, 0.25);

  ${(props) =>
    props.show
      ? 'opacity: 1; pointer-events: initial; transform: translateY(100%);'
      : 'opacity: 0; pointer-events: none; transform: translateY(90%);'}

  /* Faz com que as opções do dropdown que tenham a propriedade
  tabindex="0" por padrão (input, button, .etc) se tornem não 'focaveis'
  (não serão selecionadas através da navegação com a tecla tab)*/
  ${(props) =>
    props.show ? '> * { visibility: visible; }' : '> * { visibility: hidden; }'}
  transition: opacity 0.4s ease, transform 0.4s ease;

  .hover:hover {
    background: var(--background-500);
    cursor: pointer;
  }

  > a {
    text-decoration: none;
  }
`;

export const ProfileOption = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const ProfileImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  background-color: var(--background-700);
  flex-shrink: 0;
`;

export const ProfileData = styled.div`
  display: flex;
  align-items: center;

  white-space: nowrap;
  overflow: hidden;

  > span {
    font-size: 1.5rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;

    margin-left: 1rem;
  }
`;

export const DropDownSeparator = styled.div`
  margin-top: 1rem;
  border-top: 0.1rem solid var(--background-700);
  padding-bottom: 1rem;
`;

export const DropDownOption = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  border-radius: 2.5px;

  .align-left {
    flex: 0;
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
  }

  .align-right {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .switch {
    display: flex;
    justify-content: space-between;

    > label {
      cursor: pointer;
    }
  }
`;

import { TextBox } from '@components/atom/text-box';
import styled from 'styled-components';
import MainLogo from '@assets/image/logo.png';
import React from 'react';

export const Main = () => {
  return (
    <MainContainer>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <TextContainer>
        <TextBox
          typography="h2"
          color={'primary'}
          fontWeight={'700'}
          textAlign="center"
          cursor="default"
        >
          빨리잡아!
        </TextBox>
        <TextBox
          typography="h2"
          color="black900"
          textAlign="center"
          fontWeight={'700'}
          cursor="default"
        >
          {' '}
          쿠폰센터
        </TextBox>
      </TextContainer>
    </MainContainer>
  );
};
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 269px;
  height: 134px;
`;

const LogoContainer = styled.div`
  width: 100px;
  height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const Logo = styled.div`
  background-image: url(${MainLogo});
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.1));
`;

const TextContainer = styled.div``;

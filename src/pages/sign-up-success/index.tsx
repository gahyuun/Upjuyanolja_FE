import { useCustomNavigate } from '@hooks/sign-up/useSignUp';
import { Layout, Button } from 'antd';
import styled from 'styled-components';
import { TextBox } from '@components/atom/text-box';
import { Main } from '@components/domain/sign-up';
import { Footer } from '@components/layout/footer';

export const SignUpSuccess = () => {
  const { handleChangeUrl } = useCustomNavigate();
  return (
    <StyledLayout>
      <StyledContent>
        <Main />
        <TextBox
          typography="h3"
          color={'black900'}
          textAlign="center"
          fontWeight={'500'}
          cursor="default"
        >
          회원가입이 완료되었습니다!
        </TextBox>
        <StyledButton
          onClick={() => handleChangeUrl('/signin')}
          type="primary"
          size="large"
        >
          <TextBox typography="h5" fontWeight={'700'} textAlign="center">
            로그인 하러가기
          </TextBox>
        </StyledButton>
      </StyledContent>
      <Footer />
    </StyledLayout>
  );
};

const StyledLayout = styled(Layout)`
  max-width: 100vw;
  background-color: white;
`;

const StyledContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  height: 666px;

  gap: 32px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 374px;
  height: 54px;

  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;

  padding: 12px 32px 12px 32px;
`;

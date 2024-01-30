import { ROUTES } from '@/constants/routes';
import { TextBox } from '@components/atom/text-box';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

export const NotFoundCoupon = () => {
  const navigate = useNavigate();
  const { accommodationId } = useParams();
  const handleNavigateCouponRegistration = () => {
    navigate(`/${accommodationId}${ROUTES.COUPON_REGISTRATION}`);
  };
  return (
    <StyledLayout>
      <StyledTextBox>
        <TextBox fontWeight={400} typography="body1" color="black700">
          쿠폰이 없습니다
        </TextBox>
        <TextBox fontWeight={700} typography="body1" color="black700">
          먼저 새 쿠폰을 만들어주세요
        </TextBox>
      </StyledTextBox>
      <StyledButton type="primary">
        <TextBox
          fontWeight={700}
          typography="h5"
          color="white"
          onClick={handleNavigateCouponRegistration}
        >
          쿠폰 만들기
        </TextBox>
      </StyledButton>
    </StyledLayout>
  );
};

const StyledLayout = styled.div`
  height: calc(100% - 300px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

const StyledTextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 196px;
  height: 46px;
  border-radius: 2px;
`;

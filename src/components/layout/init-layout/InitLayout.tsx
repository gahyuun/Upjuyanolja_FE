import { colors } from '@/constants/colors';
import { ROUTES } from '@/constants/routes';
import { TextBox } from '@components/atom/text-box';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { RouteConfigProps } from './type';
import couponLogo from '@assets/image/logo.png';

export const InitLayout = () => {
  const location = useLocation();

  const routeConfig: RouteConfigProps = {
    [ROUTES.INIT_ACCOMMODATION_REGISTRATION]: {
      pageName: '숙소 등록하기',
      pageDesc: '숙소 정보를 알려주세요.',
    },
    [ROUTES.INIT_ROOM_REGISTRATION]: {
      pageName: '객실 등록하기',
      pageDesc: '객실 정보를 알려주세요.',
    },
    [ROUTES.INIT_INFO_CONFIRMATION]: {
      pageName: '등록 정보 확인하기',
      pageDesc: '등록한 정보를 확인해 주세요.',
    },
  };

  const currentRoute = Object.keys(routeConfig).find(
    (route) => location.pathname === route,
  );

  const { pageName = '숙소 등록하기', pageDesc = '숙소 정보를 알려주세요.' } =
    routeConfig[currentRoute as keyof typeof routeConfig] || {};

  return (
    <StyledLayout>
      <StyledHeader>
        <StyledHeaderContent>
          <StyledHeaderTextWrapper>
            <StyledImage src={couponLogo} />
            <TextBox typography="h5" fontWeight={700} cursor="default">
              빨리잡아! 쿠폰센터
            </TextBox>
          </StyledHeaderTextWrapper>
        </StyledHeaderContent>
      </StyledHeader>
      <StyledHeadContentCotainer>
        <StyledHeadContent>
          <StyledTextWrapper>
            <TextBox
              typography="h2"
              color={'primary'}
              fontWeight={700}
              cursor="default"
            >
              {pageName}
            </TextBox>
            <TextBox typography="h4" cursor="default">
              {pageDesc}
            </TextBox>
          </StyledTextWrapper>
        </StyledHeadContent>
      </StyledHeadContentCotainer>
      <StyledMainContent>
        <Outlet />
      </StyledMainContent>
    </StyledLayout>
  );
};

const StyledLayout = styled(Layout)`
  background-color: ${colors.midGray};
`;

const StyledHeader = styled(Layout.Header)`
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;

  background-color: ${colors.black100};
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.1);

  padding: 16px 0;
`;

const StyledHeaderContent = styled.div`
  background-color: ${colors.black100};

  width: 1024px;

  margin: 0 auto;
`;

const StyledHeaderTextWrapper = styled.div`
  margin-left: 24px;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledHeadContentCotainer = styled.div`
  background-color: ${colors.white};

  width: 100%;

  margin-top: 64px;
`;

const StyledHeadContent = styled(Layout.Header)`
  height: 140px;
  width: 1024px;

  background-color: ${colors.white};

  margin: 0 auto;
  display: flex;
  align-items: center;

  padding: 0;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-left: 67px;
`;

const StyledMainContent = styled(Layout.Content)`
  max-width: 1024px;
  width: 1024px;
  height: 100%;
  min-height: 100vh;

  margin: 0 auto;

  padding: 32px 48px;
`;

const StyledImage = styled.img`
  width: 26px;
  height: 15px;
`;

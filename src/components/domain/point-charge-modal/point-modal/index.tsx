import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  Modal,
  Space,
  message,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  numberFormat,
  removeNumberFormat,
} from '@/utils/formatiing/numberFormat';
import { TextBox } from '@components/atom/text-box';
import { InfoContainer } from '../info-container';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { colors } from '@/constants/colors';
import { PointModalProps } from './types';
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
} from '@tosspayments/payment-widget-sdk';
import { useCustomNavigate } from '@hooks/sign-up/useSignUp';
import { ROUTES } from '@/constants/routes';
import { currentUrlState } from '@stores/point-charge-modal';
import { useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { PointAgreementModal } from '@components/domain/agreement-modal/point-agreement-modal';
import { orderDate } from '@/utils/formatiing/dateFormat';
import { isNumber } from '@/utils/check-type';

const MINIMUM_PRICE = 10000;
const MAXIMUM_PRICE = 10000000;
const PRICE_10000 = 10000;
const PRICE_50000 = 50000;
const PRICE_100000 = 100000;

const SELECTOR = '#payment-widget';

export const PointModal = ({
  isModalOpen,
  setIsModalOpen,
}: PointModalProps) => {
  const [price, setPrice] = useState(0);
  const [formattedValue, setFormattedValue] = useState<string>('');
  const [pointErrorMessage, setPointErrorMessage] = useState<string>('');
  const [form] = Form.useForm<{ inputValue: string }>();
  const [isPointState, setIsPointState] = useState<boolean>(true);
  const [isAgreementPoint, setIsAgreementPoint] = useState(false);
  const [isInfoBoxState, setIsInfoBoxState] = useState(false);

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance['renderPaymentMethods']
  > | null>(null);

  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);

  const agreementShowModal = () => {
    setIsAgreementModalOpen(true);
  };
  const location = useLocation();
  const setCurrentUrl = useSetRecoilState(currentUrlState);
  const { handleChangeUrl } = useCustomNavigate();

  useEffect(() => {
    setCurrentUrl(location.pathname);
    (async () => {
      if (
        process.env.REACT_APP_CLIENT_KEY &&
        process.env.REACT_APP_CUSTOMER_KEY
      ) {
        const paymentWidget = await loadPaymentWidget(
          process.env.REACT_APP_CLIENT_KEY,
          process.env.REACT_APP_CUSTOMER_KEY,
        );

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          SELECTOR,
          { value: price, currency: 'KRW', country: 'KR' },
          { variantKey: 'DEFAULT' },
        );

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
      }
    })();
  }, []);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const handleChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (isNumber(removeNumberFormat(inputValue))) {
      setFormattedValue(numberFormat(inputValue));
      setPrice(parseInt(inputValue));
    } else {
      setFormattedValue('');
      setPrice(0);
      return;
    }

    priceComparator(inputValue);
  };

  const priceComparator = (inputValue: string) => {
    if (
      parseInt(removeNumberFormat(inputValue)) < MINIMUM_PRICE ||
      inputValue === ''
    ) {
      setPointErrorMessage('1회 최소 충전가능한 포인트는 10,000 포인트입니다.');
      setIsPointState(true);
    } else if (parseInt(removeNumberFormat(inputValue)) > MAXIMUM_PRICE) {
      setFormattedValue(numberFormat(`${MAXIMUM_PRICE}`));
      setPrice(MAXIMUM_PRICE);
      setIsPointState(false);
    } else {
      setPointErrorMessage('');
      setIsPointState(false);
    }
  };

  const handleClickAddPoint = (price: number) => {
    const result = parseInt(removeNumberFormat(formattedValue || '0')) + price;
    if (result > MAXIMUM_PRICE) {
      setFormattedValue(numberFormat(`${MAXIMUM_PRICE}`));
      setPrice(MAXIMUM_PRICE);
    } else {
      setFormattedValue(numberFormat(result.toString()));
      setPrice(result);
      setPointErrorMessage('');
      setIsPointState(false);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormattedValue('');
    setPrice(0);
    setPointErrorMessage('');
    setIsPointState(true);
    setIsAgreementPoint(false);
    setIsInfoBoxState(false);
  };

  const handleClickPayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      await paymentWidget?.requestPayment({
        orderId: orderDate(),
        orderName: '포인트 충전',
        successUrl: `${window.location.origin}${ROUTES.TOSS_SUCCESS}`,
        failUrl: `${window.location.origin}${ROUTES.TOSS_FAIL}`,
      });
    } catch (error) {
      message.error({
        content: (
          <TextBox typography="body3" fontWeight={'400'}>
            결제가 취소 되었습니다.
          </TextBox>
        ),
        duration: 2,
      });
      handleChangeUrl(window.location.pathname);
    }
  };

  return (
    <>
      <CustomModal
        title="포인트 충전"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        width={576}
      >
        <Layout>
          <Form form={form} layout="vertical" autoComplete="off">
            <div>
              <TextBox typography="h5" color={'black900'} fontWeight={700}>
                충전할 포인트
              </TextBox>
            </div>

            <Input
              style={{ width: '95%' }}
              placeholder="충전할 포인트를 입력해 주세요."
              value={formattedValue}
              onChange={handleChangePoint}
            />

            <TextBox
              typography="h5"
              color={'black900'}
              fontWeight={700}
              style={{
                marginLeft: '8px',
                top: '40px',
                right: '0%',
              }}
            >
              P
            </TextBox>

            <ErrorContainer>
              <TextBox typography="body4" color={'error'}>
                {pointErrorMessage}
              </TextBox>
            </ErrorContainer>

            <PointButtonWrap>
              <Button onClick={() => handleClickAddPoint(PRICE_10000)}>
                + 1만
              </Button>
              <Button onClick={() => handleClickAddPoint(PRICE_50000)}>
                + 5만
              </Button>
              <Button onClick={() => handleClickAddPoint(PRICE_100000)}>
                + 10만
              </Button>
            </PointButtonWrap>

            <div id="payment-widget" />

            <PriceWrap>
              {isInfoBoxState && <InfoContainer />}

              <InfoButton
                onClick={() => {
                  setIsInfoBoxState(!isInfoBoxState);
                }}
              >
                <ExclamationCircleOutlined />
              </InfoButton>

              <TextBox typography="h5" color={'primary'} fontWeight={700}>
                결제 금액 : {formattedValue}원
              </TextBox>
            </PriceWrap>

            <AgreementWrap>
              <Checkbox
                onChange={() => {
                  setIsAgreementPoint(!isAgreementPoint);
                }}
                checked={isAgreementPoint}
              >
                <TextBox typography="body3" color={'black900'}>
                  주문 내용을 확인하였으며,
                  <TextBox
                    typography="body3"
                    color={'primaryHover'}
                    onClick={agreementShowModal}
                  >
                    구매 약관
                  </TextBox>
                  <PointAgreementModal
                    isModalOpen={isAgreementModalOpen}
                    setIsModalOpen={setIsAgreementModalOpen}
                  />
                  등에 동의합니다
                </TextBox>
              </Checkbox>
            </AgreementWrap>

            <SubmitButton
              key="submit"
              type="primary"
              onClick={handleClickPayment}
              disabled={isPointState || !isAgreementPoint}
            >
              결제하기
            </SubmitButton>
          </Form>
        </Layout>
      </CustomModal>
    </>
  );
};

const CustomModal = styled(Modal)`
  .ant-layout {
    background-color: #ffffff;
  }
  .ant-modal-close {
    top: 2%;
  }
  .ant-form-item {
    margin-bottom: 12px;
  }
  .ant-modal-title {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 32px;
    font-weight: 700;
    line-height: 48px;
  }
  .ant-form-item-label {
    label {
      font-size: 20px;
      font-weight: 900;
      line-height: 30px;
    }
  }
  .ant-input {
    margin-top: 12px;
  }

  .point-buttonWrap {
    margin-bottom: 221px;
  }
`;
const PointButtonWrap = styled(Space)`
  display: flex;
  margin-bottom: 8px;
  button {
    width: 64px;
    height: 25px;

    border: 1px solid #0351ff;
    margin-right: 4px;

    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    color: #0351ff;

    padding: 4px 0px;
  }
`;
const PriceWrap = styled(Space)`
  display: flex;
  justify-content: end;
  align-items: center;

  border: 2px solid #0351ff;
  padding: 4px 16px;
  margin-bottom: 16px;

  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  color: #0351ff;

  background: linear-gradient(268.34deg, #e0edff 1.74%, #ffffff 120.49%);
`;
const ErrorContainer = styled('div')`
  margin-top: 12px;
`;
const SubmitButton = styled(Button)`
  width: 100%;
  height: 46px;
  margin-top: 8px;
  padding: 8px 0px;

  font-size: 20px;
  font-weight: 700;
  line-height: 30px;

  &:disabled {
    background-color: ${colors.black600};
    color: white;
  }
`;
const AgreementWrap = styled(Space)`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const InfoButton = styled('button')`
  background: rgba(0, 0, 0, 0);
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;
  cursor: pointer;
`;

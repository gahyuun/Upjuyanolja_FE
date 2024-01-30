import { colors } from '@/constants/colors';
import { TextBox } from '@components/atom/text-box';
import { Checkbox, Input } from 'antd';
import styled from 'styled-components';
import { AdditionalPurchaseInfo } from '../additional-purchase-info';
import { PurchaseContentProps } from './type';

export const AdditionalPurchaseContent = ({
  purchaseData,
  handleBatchEditCheckbox,
  handleChangeBatchValue,
  handleChangeBuyQuantity,
}: PurchaseContentProps) => {
  if (!purchaseData) return <></>;
  return (
    <>
      <StyledBatchEditContainer>
        <Checkbox
          onChange={handleBatchEditCheckbox}
          checked={purchaseData.isAppliedBatchEdit}
          data-testid="batch-checkbox"
        />

        <TextBox color="primary" typography="h5" fontWeight={700}>
          수량 일괄 적용
        </TextBox>
        <StyledInput
          value={purchaseData.batchValue}
          disabled={!purchaseData.isAppliedBatchEdit}
          onChange={handleChangeBatchValue}
          data-testid="batch-input"
        />
        <TextBox typography="body1" fontWeight={400}>
          장
        </TextBox>
      </StyledBatchEditContainer>
      <StyledInfoContainer>
        {purchaseData.rooms.map((room) => {
          if (!room) return <></>;
          return (
            <StyledRoomInfo key={room.roomId}>
              <TextBox typography="h5" fontWeight={700}>
                {room.roomName}
              </TextBox>
              {room.coupons.map((coupon) => (
                <AdditionalPurchaseInfo
                  key={coupon.couponId}
                  coupon={coupon}
                  disabled={purchaseData.isAppliedBatchEdit}
                  handleChangeBuyQuantity={handleChangeBuyQuantity}
                  roomId={room.roomId}
                />
              ))}
            </StyledRoomInfo>
          );
        })}
      </StyledInfoContainer>
    </>
  );
};

const StyledBatchEditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .ant-checkbox-inner {
    border: 1px solid ${colors.primary};
  }
  .ant-checkbox-wrapper {
    margin-right: 8px;
  }
`;

const StyledInput = styled(Input)`
  width: 114px;
  margin: 0 4px 0 18px;
`;

const StyledInfoContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledRoomInfo = styled.div`
  padding: 16px;
  border: 2px solid ${colors.primary};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

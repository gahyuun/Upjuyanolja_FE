import { TextBox } from '@components/atom/text-box';
import { Input } from 'antd';
import styled from 'styled-components';
import { PurchaseInfoProps } from './type';

export const AdditionalPurchaseInfo = ({
  coupon,
  disabled,
  handleChangeBuyQuantity,
  roomId,
}: PurchaseInfoProps) => {
  return (
    <StyledCouponInfo>
      <TextBox typography="body2" fontWeight={400}>
        {coupon.couponName} | {coupon.points.toLocaleString()}P
      </TextBox>
      <StyledPriceInfo>
        <div>
          <StyledInput
            value={coupon.buyQuantity}
            disabled={disabled}
            onChange={(event) =>
              handleChangeBuyQuantity(event, coupon.couponId, roomId)
            }
            data-testid="buy-input"
          />
          <TextBox fontWeight={400} typography="body3">
            장
          </TextBox>
        </div>
        <StyledEachPoint>
          <TextBox typography="h5" fontWeight={700}>
            {coupon.eachPoint.toLocaleString()}P
          </TextBox>
        </StyledEachPoint>
      </StyledPriceInfo>
    </StyledCouponInfo>
  );
};

const StyledCouponInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledPriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const StyledEachPoint = styled.div`
  width: 120px;
  display: flex;
  justify-content: flex-end;
`;

const StyledInput = styled(Input)`
  width: 56px;
  height: 26px;

  margin-right: 4px;
`;

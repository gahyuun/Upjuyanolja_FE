import { BadgeProps } from '@components/domain/point-detail/badge/types';

export type Coupons = {
  name: string;
  count: number;
  totalPrice: number;
};

export type Orders = {
  room: string;
  coupons: Coupons[];
};

export type Receipt = {
  orderId: string;
  tradeAt: string;
  amount: string;
  accommodationName?: string;
  orders?: Orders[];
  method?: string;
};

export type History = {
  id: number;
  category: string;
  type: string;
  status: BadgeProps;
  name: string;
  description: string;
  trade: number;
  amount: number;
  receipt: Receipt;
};

export type PointDetailDataType = {
  pageNum: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isLast: boolean;
  histories: History[];
};

export type MenuStatusType = 'total' | 'charges' | 'usages';

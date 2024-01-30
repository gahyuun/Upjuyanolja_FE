import { colors } from '@/constants/colors';
import { styled } from 'styled-components';
import { Form, message } from 'antd';
import { ButtonContainer } from '@components/domain/room/room-buttons';
import { CheckBoxContainer } from '@components/domain/init/CheckBoxContainer';
import { ImageUploadContainer } from '@components/domain/init/ImageUploadContainer';
import { NameContainer } from '@components/domain/init/NameContainer';
import { PriceContainer } from '@components/domain/room/price-container';
import { CapacityContainer } from '@components/domain/room/capacity-container';
import { CountContainer } from '@components/domain/room/num-of-rooms-container';
import { TimeContainer } from '@components/domain/room/time-container';
import { StatusContainer } from '@components/domain/room/status-container';
import { useRecoilState } from 'recoil';
import { deletedImageFileState } from '@stores/room/atoms';
import { RoomUpdateData } from '@api/room/type';
import { useGetRoomDetail, useUpdateRoom } from '@queries/room';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useImageFile } from '@queries/init';
import { ROUTES } from '@/constants/routes';
import { AxiosError } from 'axios';
import { checkedRoomOptions, imageFileState } from '@stores/init/atoms';
import { useQueryClient } from '@tanstack/react-query';

export const RoomUpdate = () => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const queryClient = useQueryClient();

  const roomOptions = {
    tv: 'TV',
    airCondition: '에어컨',
    internet: '인터넷',
  };

  const { accommodationId = '', roomId = '' } = useParams<{
    accommodationId: string;
    roomId: string;
  }>();

  const { data, isLoading, error } = useGetRoomDetail(
    roomId,
    accommodationId as string,
    {
      select(data) {
        return data.data;
      },
    },
  );

  const [form] = Form.useForm();

  const [imageFile, setImageFile] = useRecoilState(imageFileState);
  const [deletedImageFile, setDeletedImageFile] = useRecoilState(
    deletedImageFileState,
  );

  useEffect(() => {
    if (data && !isLoading && !error) {
      const imageObjects = data.images.map((image, index) => ({
        url: image.url,
        key: index,
        file: null,
        id: image.id,
      }));
      form.setFieldsValue({
        'room-name': data.name,
        price: data.price.toString(),
        defaultCapacity: data.defaultCapacity,
        maxCapacity: data.maxCapacity,
        checkInTime: moment(data.checkInTime, 'HH:mm'),
        checkOutTime: moment(data.checkOutTime, 'HH:mm'),
        count: data.amount,
        status: data.status === 'SELLING',
      });
      setImageFile(imageObjects);
      setSelectedInitRoomOptions(data.option);
      setDeletedImageFile([]);
    }
  }, [data, isLoading, error, form]);

  useEffect(() => {
    return () => {
      setImageFile([]);
      setDeletedImageFile([]);
      setSelectedInitRoomOptions({
        airCondition: false,
        tv: false,
        internet: false,
      });
    };
  }, []);

  const { mutate: updateRoom } = useUpdateRoom(
    roomId as string,
    accommodationId as string,
    {
      onSuccess() {
        queryClient.invalidateQueries(['room-list']);
        message.success({
          content: '수정되었습니다',
          className: 'coupon-message',
        });
        navigate(`/${accommodationId}${ROUTES.ROOM}`);
      },
      onError(error) {
        if (error instanceof AxiosError)
          message.error('요청에 실패했습니다 잠시 후 다시 시도해주세요');
      },
    },
  );

  const [selectedInitRoomOptions, setSelectedInitRoomOptions] =
    useRecoilState(checkedRoomOptions);

  const { mutate: getImageUrl } = useImageFile({
    onSuccess(data) {
      const roomName = form.getFieldValue('room-name');
      const price = parseInt(form.getFieldValue('price').replace(',', ''));
      const defaultCapacity = form.getFieldValue('defaultCapacity');
      const maxCapacity = form.getFieldValue('maxCapacity');
      const checkInTime = form.getFieldValue('checkInTime').format('HH:mm');
      const checkOutTime = form.getFieldValue('checkOutTime').format('HH:mm');
      const count = form.getFieldValue('count');
      const status = form.getFieldValue('status') ? 'SELLING' : 'STOP_SELLING';

      const deleteObjects = deletedImageFile.map((image) => {
        return { id: image.id };
      });
      const imageObjects = [];
      for (let index = 0; index < data.data.urls.length; index++) {
        const { url } = data.data.urls[index];
        if (url) {
          imageObjects.push({ url });
        }
      }
      const updatedRoomData: RoomUpdateData = {
        name: roomName,
        price: price,
        defaultCapacity: defaultCapacity,
        maxCapacity: maxCapacity,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        status,
        amount: count,
        addImages: imageObjects,
        deleteImages: deleteObjects as { id: number }[],
        option: selectedInitRoomOptions,
      };
      updateRoom(updatedRoomData);
    },
  });

  const onFinish = () => {
    const formData = new FormData();

    for (let index = 0; index < 5; index++) {
      const image = imageFile[index];
      if (image && image.file) {
        formData.append(`image${index + 1}`, image.file);
      } else {
        const emptyBlob = new Blob([], { type: 'application/octet-stream' });
        const nullFile = new File([emptyBlob], 'nullFile.txt', {
          type: 'text/plain',
        });
        formData.append(`image${index + 1}`, nullFile);
      }
    }

    getImageUrl(formData);
  };

  const areFormFieldsValid = () => {
    const values = form.getFieldsValue();

    const conditions =
      values['room-name'] &&
      values['price'] &&
      values['checkInTime'] &&
      values['checkOutTime'] &&
      imageFile.length !== 0;

    return (
      !form.getFieldsError().some(({ errors }) => errors.length) && conditions
    );
  };

  useEffect(() => {
    setIsValid(areFormFieldsValid());
  }, [form, imageFile, selectedInitRoomOptions]);

  const handleFormValuesChange = () => {
    setIsValid(areFormFieldsValid());
  };

  return (
    <StyledWrapper color={colors.white}>
      <Form
        form={form}
        onFinish={onFinish}
        onFieldsChange={handleFormValuesChange}
      >
        <NameContainer
          header="객실명"
          placeholder="객실명을 입력해 주세요. (ex. 디럭스 더블 룸)"
          form={form}
        />
        <StyledCenterVertically>
          <StatusContainer defaultStatus={data?.status} />
        </StyledCenterVertically>
        <StyledInputWrapper>
          <PriceContainer header="객실 가격" form={form} />
        </StyledInputWrapper>
        <ImageUploadContainer header="객실 사진" images={data?.images} />
        <StyledInputWrapper>
          <CountContainer header="객실 수" form={form} />
        </StyledInputWrapper>
        <StyledInputWrapper>
          <TimeContainer header="시간" form={form} />
        </StyledInputWrapper>
        <StyledInputWrapper>
          <CapacityContainer header="인원" form={form} />
        </StyledInputWrapper>
        <StyledInputWrapper>
          <CheckBoxContainer options={roomOptions} header="객실" />
        </StyledInputWrapper>
        <ButtonContainer buttonStyle={'update'} isValid={isValid} />
      </Form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  border-radius: 8px;
  width: 100%;
  padding: 40px;
  background-color: ${(props) => props.color};
`;

const StyledInputWrapper = styled.div`
  margin-bottom: 48px;
`;

const StyledCenterVertically = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 0px;
`;

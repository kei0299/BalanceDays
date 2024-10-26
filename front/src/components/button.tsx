import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'purple',
  color: 'white',
  '&:hover': {
    backgroundColor: 'darkviolet',
  },
}));

const MyComponent = () => {
  return (
    <CustomButton variant="contained">
      カスタムボタン
    </CustomButton>
  );
};

export default MyComponent;
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function PageContainer() {
  return (
    <>
      <Header />
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

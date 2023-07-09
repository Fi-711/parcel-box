// react
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// components
import SignIn from '../../components/sign-in/sign-in.component';
// import Logo from '../../components/logo/logo.component';

// Images
import login from '../../assets/login.jpg';
import logo from '../../assets/logo.svg';

// chakra-ui
import {
  Box,
  Center,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Grid,
  GridItem,
  Spacer,
  VStack,
} from '@chakra-ui/react';

// shake css
import './sign-in-page.styles.css';

/* Contains sign in form. Shakes on incorrect input. Toasts for responsive feedback.*/
const SignInPage = () => {
  const [shake, setShake] = useState(false);

  const handleShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  return (
    // Grid splits screen into 1 column at medium and below resolutions and 2 at large
    <Grid
      templateRows={'repeat(3, 1fr)'}
      w='100%'
      h='100vh'
      mx='auto'
      className='Sign-In-Page'
    >
      <GridItem rowSpan={[3, 3, 3, 2, 2]} className='sign-in-contents'>
        {/* Second box contains login data */}
        <Box width='100%' mx='auto'>
          {/* This box contains the small logo - only visible at large resolutions*/}

          {/* This is where the form contents is*/}
          <Flex justify='center' my='5%' className='sign-in-page' mx='auto'>
            {/* This box holds the form*/}
            <Box
              minW='350px'
              maxW='500px'
              p={3}
              className={shake ? 'shake' : ''}
            >
              {/* This VStack stores text titles, form and register now link*/}
              <VStack align='stretch' width='100%'>
                {/* Text titles in their own box as they are only visible on large screens*/}
                <Center width='100%' pb={10} pt={4}>
                  <Heading textAlign='left'>Login to BoxR Command</Heading>
                </Center>

                {/* The custom made SignIn React component*/}
                <SignIn handleShake={handleShake} />

                {/* The spacer pushes the register now link to bottom of flex box*/}
                <Spacer />

                {/* Register now button link*/}
                <Text>
                  Don't have an account?{' '}
                  <Link to='/'>
                    <Button variant='link' color={'brand.100'}>
                      Register Now
                    </Button>
                  </Link>
                </Text>
                <Spacer />
              </VStack>
            </Box>
          </Flex>
        </Box>
      </GridItem>

      <GridItem
        rowSpan={[0, 0, 0, 1, 1]}
        className='login-image'
        mx='auto'
        w='100%'
        // h='100%'
      >
        {/*Box contains the BoxR image*/}
        <Box
          width='100%'
          height={'100%'}
          bgImage={login}
          bgRepeat='no-repeat'
          bgSize={'cover'}
        >
          <Image
            src={logo}
            alt='boxR login'
            position={'absolute'}
            bottom={0}
            right={0}
            w={['100px', '100px', '200px']}
          />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SignInPage;

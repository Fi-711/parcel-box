import React from 'react';

import { Flex, Box, Spacer, Image } from '@chakra-ui/react';

// logo
import logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <Flex w='100%' h={['100px', '100px', '200px']} className='footer'>
      <Box h={['100px', '100px', '200px']} />
      <Spacer />
      <Box h={['100px', '100px', '200px']}>
        <Image src={logo} alt='Logo' h={['100px', '100px', '200px']} />
      </Box>
    </Flex>
  );
};

export default Footer;

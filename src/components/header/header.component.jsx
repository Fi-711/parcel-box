import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  Flex,
  Box,
  Spacer,
  HStack,
  Image,
  Text,
  Center,
  VStack,
  Button,
} from '@chakra-ui/react';

// redux
import { setCurrentUser } from '../../redux/user/user.actions';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { logoutCurrentUser } from '../../redux/user/user.actions';

// images
import group_18 from '../../assets/group_18.png';

// import { MdDashboard } from 'react-icons/md/';
import { FiSettings } from 'react-icons/fi';
import { BiLogOutCircle } from 'react-icons/bi';

const Header = ({ logoutUser }) => {
  return (
    <Flex className='header' w='100%'>
      <HStack w='100%'>
        <Box className='left-side' w='100%'>
          <HStack fontSize={40} color={'brand.100'}>
            <Center className='dashboard' p={8}>
              <VStack>
                <Button variant={'ghost'} size='xl' onClick={logoutUser}>
                  <BiLogOutCircle />
                </Button>
                <Text fontSize={12} fontWeight={600} textAlign='center'>
                  Logout
                </Text>
              </VStack>
            </Center>
            <Center className='settings' p={8}>
              <VStack>
                <Button variant={'ghost'} size='xl'>
                  <FiSettings />
                </Button>
                <Text fontSize={12} fontWeight={600} textAlign='center'>
                  Settings
                </Text>
              </VStack>
            </Center>
          </HStack>
        </Box>
        <Spacer />
        <Box
          className='right-side'
          w='100%'
          justifyContent={'right'}
          alignItems='right'
          display={'flex'}
          px={8}
        >
          <Center>
            <Image src={group_18} alt='group_18' />
            <Text px={8} fontSize={18} fontWeight={800}>
              Group 18
            </Text>
          </Center>
        </Box>
      </HStack>
    </Flex>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  logoutUser: () => dispatch(logoutCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

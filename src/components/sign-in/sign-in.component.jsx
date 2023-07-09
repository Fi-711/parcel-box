// react
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// redux
import { setCurrentUser } from '../../redux/user/user.actions';
import { selectCurrentUser } from '../../redux/user/user.selectors';

// chakra-ui
import {
  Flex,
  Box,
  Spacer,
  Input,
  Stack,
  FormControl,
  InputGroup,
  InputLeftAddon,
  Tooltip,
  Button,
  Text,
  Checkbox,
  useToast,
  FormLabel,
} from '@chakra-ui/react';
import { LockIcon, EmailIcon } from '@chakra-ui/icons';

/* Sign in form to log users in*/
const SignIn = ({ setCurrentUser, handleShake, currentUser }) => {
  // Toast for user feedback
  const toast = useToast();

  // sign-in credentials
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  // Destructure email and password from userCredentials
  const { email, password } = userCredentials;

  // Update user credentials on keypress
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  // Verify login credentials against backend - async
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign in logic - uses await as async function
      const { data } = await axios.post('/api/login', userCredentials);

      if (data) {
        console.log(data);
        setCurrentUser(data);
        toast({
          title: 'Login Successful',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error(error.response);
      if (error.response.status === 400) {
        console.log(error.response.data.detail);
      }
      // Shake if error
      handleShake();
      toast({
        title: 'Incorrect Login Details',
        description: '',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      // Reset form
      if (!currentUser) {
        console.log(selectCurrentUser);
        setUserCredentials({ email: '', password: '' });
      }
    }
  };

  return (
    // Always give the top level div a classname and name it the same as component
    <div className='sign-in'>
      {/* HTML Form contains form*/}
      <form onSubmit={handleSubmit}>
        <Stack spacing={8} mt={4}>
          {/* This label and group deals with email field */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <InputGroup InputGroup borderColor={'black'} bgColor='white'>
              <InputLeftAddon
                children={
                  <Tooltip label='The email address you registered with'>
                    <EmailIcon />
                  </Tooltip>
                }
              />
              <Input
                type='email'
                name='email'
                value={email}
                aria-label='email'
                placeholder='example@gmail.com'
                required
                onChange={handleChange}
              />
            </InputGroup>
          </FormControl>

          {/* This form control deals with with password field */}
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup borderColor={'black'} bgColor='white'>
              <InputLeftAddon
                children={
                  <Tooltip label='The password associated with your account'>
                    <LockIcon />
                  </Tooltip>
                }
              />
              <Input
                type='password'
                name='password'
                value={password}
                aria-label='password'
                placeholder='Password'
                required
                onChange={handleChange}
              />
            </InputGroup>
          </FormControl>

          {/* Outside form we have some text */}
          <Flex>
            <Box display='flex'>
              <Text>Remember me</Text>
              <Checkbox ml='7px' mt='5px' />
            </Box>
            <Spacer />
            <Box>
              <Link to='/'>
                <Button color={'brand.100'} variant='link'>
                  Forgot password?
                </Button>
              </Link>
            </Box>
          </Flex>
          <Button bgColor={'brand.100'} color='white' type='submit'>
            Login Now
          </Button>
        </Stack>
      </form>
    </div>
  );
};

// Memoized using reselect library
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

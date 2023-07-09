// react
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

// import socketio
import { io } from 'socket.io-client';

// chakra ui
import {
  Grid,
  GridItem,
  Heading,
  Image,
  Center,
  Button,
} from '@chakra-ui/react';

// images
import locked from '../../assets/locked.png';
import unlocked from '../../assets/unlocked.png';
import alert from '../../assets/warning.png';
import live_feed from '../../assets/camera.png';

// redux
import { selectAccessToken } from '../../redux/user/user.selectors';

// connect socketio
let endPoint = 'https://afternoon-depths-56034.herokuapp.com/';
const socket = io.connect(`${endPoint}`);
socket.on('connect', function () {
  socket.emit('my response', { data: "I'm connected!" });
});

const LockPanel = ({ accessToken }) => {
  // ping web socket for data
  const [pingWS, setPingWS] = useState(true);
  // // Lock status
  const [lock, setLock] = useState(true);

  // sync lock code with current
  useEffect(() => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer${accessToken}`,
      };
      axios({
        method: 'POST',
        url: '/api/setlock',
        data: { data: lock },
        headers: headers,
      }).then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

  // lock websocket
  useEffect(() => {
    getAndSetLock();
  }, [pingWS]);

  // listen and set lock
  const getAndSetLock = () => {
    socket.on('lock_status', (msg) => {
      console.log(msg.data);
      let res = msg.data;
      setLock(!res);
    });
  };

  // inform server of button press
  const setLockStatus = () => {
    console.log(lock);
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer${accessToken}`,
      };
      axios({
        method: 'POST',
        url: '/api/unlock',
        data: { data: lock },
        headers: headers,
      }).then(
        (res) => {
          console.log(res);
          socket.emit('lock_status', '');
          setPingWS(!pingWS);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openBox = () => {
    // ping unlock socket - it will get lock status from server
    socket.emit('unlock', '');
  };

  const handleBoxr = () => {
    setLockStatus();
    openBox();
  };

  return (
    <Grid
      templateColumns={'repeat(12, 1fr)'}
      gap={10}
      bg='white'
      p={4}
      borderRadius={12}
    >
      <GridItem colSpan={[12, 12, 12, 3]}>
        <Center height='80px'>
          <Button variant={'ghost'} isDisabled={lock} onClick={handleBoxr}>
            <Center my='auto'>
              <Image src={locked} alt='Lock' />
            </Center>
          </Button>
        </Center>
        <Heading size='md'>Lock</Heading>
      </GridItem>
      <GridItem colSpan={[12, 12, 12, 3]}>
        <Center height='80px'>
          <Button variant={'ghost'} isDisabled={!lock} onClick={handleBoxr}>
            <Center my='auto'>
              <Image src={unlocked} alt='Unlock' />
            </Center>
          </Button>
        </Center>
        <Heading size='md'>Unlock</Heading>
      </GridItem>
      <GridItem colSpan={[12, 12, 12, 3]}>
        <Center height='80px'>
          <Button variant={'ghost'}>
            <Center my='auto'>
              <Image src={alert} alt='Alert' />
            </Center>
          </Button>
        </Center>
        <Heading size='md'>Alert</Heading>
      </GridItem>
      <GridItem colSpan={[12, 12, 12, 3]}>
        <Center height='80px'>
          <Button variant={'ghost'}>
            <Center my='auto'>
              <Image src={live_feed} alt='Live Feed' />
            </Center>
          </Button>
        </Center>
        <Heading size='md'>Live Feed</Heading>
      </GridItem>
    </Grid>
  );
};

const mapStateToProps = createStructuredSelector({
  accessToken: selectAccessToken,
});

export default connect(mapStateToProps)(LockPanel);

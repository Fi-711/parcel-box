// react
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

// components
import Header from '../../components/header/header.component';
import MainPanel from '../../components/main-panel/main-panel.component';
import Footer from '../../components/footer/footer.component';

// redux
import { selectAccessToken } from '../../redux/user/user.selectors';

// chakra ui
import {
  Flex,
  Box,
  Spacer,
  VStack,
  Center,
  Switch,
  Tooltip,
  Text,
} from '@chakra-ui/react';

// User dashboard
const DashboardPage = ({ accessToken }) => {
  // telemetry data
  const [telemetry, setTelemetry] = useState();

  useEffect(() => {
    try {
      let telemetryLoop = setInterval(() => {
        const getData = async () => {
          let { data } = await axios('/api/telemetry', {
            headers: { Authorization: `Bearer${accessToken}` },
          });

          if (data) {
            // console.log(data);
            setTelemetry(data);
          }
        };
        getData();
      }, 3000);

      return () => {
        clearInterval(telemetryLoop);
      };
    } catch (error) {
      console.log(error);
    }
  });

  // Unlock switches
  const [auto, setAuto] = useState({
    autoLock: false,
    facialRecognition: false,
    antiTheft: false,
  });

  let { autoLock, facialRecognition, antiTheft } = auto;

  const handleFacialRecognition = () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer${accessToken}`,
      };
      axios({
        method: 'POST',
        url: '/api/auto',
        data: { data: { ...auto, facialRecognition: !facialRecognition } },
        headers: headers,
      }).then(
        (res) => {
          console.log(res.data);
          setAuto(res.data);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAutoLock = () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer${accessToken}`,
      };

      axios({
        method: 'POST',
        url: '/api/auto',
        data: { data: { ...auto, autoLock: !autoLock } },
        headers: headers,
      }).then(
        (res) => {
          console.log(res.data);
          setAuto(res.data);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAntiTheft = () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer${accessToken}`,
      };

      axios({
        method: 'POST',
        url: '/api/auto',
        data: { data: { ...auto, antiTheft: !antiTheft } },
        headers: headers,
      }).then(
        (res) => {
          console.log(res.data);
          setAuto(res.data);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex h='100%' w='100%' mx='auto' className='dashboard-page'>
      <VStack h='100%' w='100%' mx='auto' gap={4}>
        <Box w='100%'>
          <Header />
        </Box>
        <Spacer />
        <Center w='90%'>
          <MainPanel telemetry={telemetry} />
        </Center>
        <Box>
          <VStack>
            <Switch
              size='lg'
              onChange={handleFacialRecognition}
              isChecked={facialRecognition}
            />
            <Tooltip label='Automatically unlock BoxR for known users, using facial recognition'>
              <Text fontWeight={800}>Facial Recognition</Text>
            </Tooltip>
            <Switch size='lg' onChange={handleAutoLock} isChecked={autoLock} />
            <Tooltip label='Automatically lock the lid when lid closed'>
              <Text fontWeight={800}>Auto-Lock</Text>
            </Tooltip>
            <Switch
              size='lg'
              onChange={handleAntiTheft}
              isChecked={antiTheft}
            />
            <Tooltip label='Buzzer when box is lifted'>
              <Text fontWeight={800}>Anti-Theft Alarm</Text>
            </Tooltip>
          </VStack>
        </Box>
        <Spacer />
        <Box w='100%'>
          <Footer />
        </Box>
      </VStack>
    </Flex>
  );
};

const mapStateToProps = createStructuredSelector({
  accessToken: selectAccessToken,
});

export default connect(mapStateToProps)(DashboardPage);

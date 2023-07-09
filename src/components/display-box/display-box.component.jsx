import { Heading, Box, Center, Image, VStack } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

const DisplayBox = ({ name, img, telemetry }) => {
  let ending = () => {
    if (name === 'temperature') {
      return '°C';
    } else if (name === 'humidity') {
      return ' RH';
    } else {
      return '%';
    }
  };
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [brightness, setBrightness] = useState();

  useEffect(() => {
    if (telemetry) {
      setTemperature(telemetry.temperature);
      setHumidity(telemetry.humidity);
      setBrightness(telemetry.brightness);
    }
  }, [telemetry]);

  return (
    <Box bg='white' h='200px' borderRadius={12}>
      <Box p={4}>
        <Image src={img} />
      </Box>
      <Center>
        <Center>
          <VStack>
            <Heading size={'lg'}>
              {name === 'temperature' && temperature}
              {name === 'humidity' && humidity}
              {name === 'sunlight' && brightness}
              {`${ending()}`}
            </Heading>
            <Heading size={'md'}>{name}</Heading>
          </VStack>
        </Center>
      </Center>
    </Box>
  );
};

export default DisplayBox;

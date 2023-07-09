import React from 'react';

// chakra ui
import { Grid, GridItem, Image, Center } from '@chakra-ui/react';

// components
import DisplayBox from '../display-box/display-box.component';
import LockPanel from '../lock-panel/lock-panel.component';

// displays to be shown
import { boxes } from './displayBoxes.js';

// placeholder image
import delivery from '../../assets/delivery.png';

// main display panel (lock panel + camera + stats)
const MainPanel = ({ telemetry }) => {
  return (
    <Grid templateColumns={'repeat(2, 1fr)'} w='100%' gap={10}>
      <GridItem colSpan={[2, 2, 2, 1]}>
        <Grid templateColumns={'repeat(12, 1fr)'} gap={10}>
          {/* map 3 displays */}
          {boxes.map((box) => (
            <GridItem colSpan={[12, 12, 12, 4]} key={box.name}>
              <DisplayBox name={box.name} img={box.img} telemetry={telemetry} />
            </GridItem>
          ))}
          <GridItem colSpan={12}>
            <LockPanel />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem colSpan={[2, 2, 2, 1]}>
        <Center className='camera-feed'>
          <Image src={delivery} alt='delivery' />
        </Center>
      </GridItem>
    </Grid>
  );
};

export default MainPanel;

import * as Popover from '@radix-ui/react-popover';
import './about-styles.css';

function AboutPopover() {

  return (
    <Popover.Root>
      <Popover.Trigger className="PopoverTrigger">About</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="PopoverContent">
          <p>This is a map using the current data set (as of March 2024) that
          the City of Seattle has identified as URM buildings.</p>
          <p>What is a URM? A URM stands for Unreinforced Masonry building</p>
          <a href="https://www.seattle.gov/emergency-management/hazards/unreinforced-masonry-buildings-(urm)-">More URM Info</a>
          <p>Source: <a href="https://data.seattle.gov/Permitting/Unreinforced-Masonry-Buildings/54qs-2h7f/about_data">Data Source</a></p>
          
          <Popover.Arrow className="PopoverArrow" /> 
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default AboutPopover;
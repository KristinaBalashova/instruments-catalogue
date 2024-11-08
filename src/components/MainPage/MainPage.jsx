import React from 'react';
import { SectionLayout, Intro } from '..';
import { InstrumentsCatalogue } from '../../containers';

const MainPage = () => {
  return (
    <SectionLayout>
      <Intro />
      <InstrumentsCatalogue />
    </SectionLayout>
  );
};

export default MainPage;

import { Intro } from '..';
import { SectionLayout } from '../layouts';
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

import './App.module.css';
import Header from './components/Header/Header';
import MainPage from './components/MainPage/MainPage';
import Footer from './components/Footer/Footer';
import InstrumentsCatalogue from './components/InstrumentsCatalogue/InstrumentsCatalogue';
function App() {
  return (
    <>
      <Header />
      <MainPage />
      <InstrumentsCatalogue />
      <Footer />
    </>
  );
}

export default App;

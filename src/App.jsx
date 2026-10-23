import TopAppBar from './sections/TopAppBar.jsx';
import Hero from './sections/Hero.jsx';
import Definition from './sections/Definition.jsx';
import Trend from './sections/Trend.jsx';
import Counter from './sections/Counter.jsx';
import Solutions from './sections/Solutions.jsx';
import MyView from './sections/MyView.jsx';
import Footer from './sections/Footer.jsx';
import { useTheme } from './hooks/useTheme.js';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  return (
    <>
      <a href="#define" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">
        본문으로 건너뛰기
      </a>
      <TopAppBar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero theme={theme} />
        <Definition />
        <Trend theme={theme} />
        <Counter />
        <Solutions />
        <MyView />
      </main>
      <Footer />
    </>
  );
}

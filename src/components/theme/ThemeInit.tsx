export default function ThemeInit() {
  // Runs before first paint to avoid flash.
  // Default theme is "3"; stored "1" / "2" / "3" override it.
  const script = `
    try {
      var t = localStorage.getItem('bjf-theme');
      var active = (t === '1' || t === '2' || t === '3') ? t : '3';
      if (active !== '1') document.documentElement.setAttribute('data-theme', active);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', '3');
    }
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

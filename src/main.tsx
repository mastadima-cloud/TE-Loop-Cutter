@tailwind base;
@tailwind components;
@tailwind utilities;

/* РЎС‚РёР»Рё РґР»СЏ СЃРєСЂС‹С‚РёСЏ СЃРєСЂРѕР»Р»Р±Р°СЂР° */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* РћР±С‰РёРµ СЃС‚РёР»Рё */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f0f4ff;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulseRing{0%{transform:scale(1);opacity:0.3}70%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:0}}
  .fadeIn{animation:fadeIn 0.22s ease}
  .fadeSlide{animation:fadeSlide 0.28s ease}
  button:hover{opacity:0.82;transition:opacity 0.15s}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:#f0f4ff}
  ::-webkit-scrollbar-thumb{background:#d4ddf5}
  tr:hover{background:rgba(14,127,194,0.03)!important}
  input::placeholder,textarea::placeholder{color:#b8c4dc}
`;
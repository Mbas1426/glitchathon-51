export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Orbitron:wght@400..900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    background: linear-gradient(135deg, #f5f5f7, #eef1f6); 
    font-family: 'Merriweather', serif;
    -webkit-font-smoothing: antialiased;
  }
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(10px) }
    to { opacity: 1; transform: translateY(0) }
  }
  .fadeSlide { animation: fadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) }
  
  .appleCard {
    background: #ffffff;
    border-radius: 18px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 1px solid #f0f0f0;
    box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .appleCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.10);
  }
  .appleCard:active {
    transform: scale(0.98);
    background: #f2f8ff;
    border-color: #cfe3ff;
  }
  
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
  
  button {
    font-family: inherit;
  }
  input::placeholder { color: #86868b; }
  
  .th-sortable {
    transition: all 0.2s ease;
  }
  .th-sortable:hover {
    background: rgba(0, 0, 0, 0.035) !important;
    box-shadow: inset 0 -2px 0 #297FC6, 0 0 15px rgba(41, 127, 198, 0.1);
    color: #1d1d1f !important;
  }
`;
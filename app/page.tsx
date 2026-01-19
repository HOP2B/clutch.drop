'use client'

import { useState, useEffect } from 'react'

interface Skin {
  id: number;
  name: string;
  rarity: string;
  image?: string;
  color?: string;
}

interface Case {
  id: number;
  name: string;
  image?: string;
  contains: number[];
}

const rarityColors: { [key: string]: string } = {
  'Consumer Grade': '#8fbc8f',
  'Industrial Grade': '#32cd32',
  'Mil-Spec': '#00bfff',
  'Restricted': '#ff6347',
  'Classified': '#ff1493',
  'Covert': '#dc143c',
  'Special Item': '#ffd700',
};

export default function Home() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [openedItem, setOpenedItem] = useState<Skin | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [rollingImage, setRollingImage] = useState<string>('');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json')
      .then(response => response.json())
      .then(skinsData => {
        let skinArray: Skin[];
        if (Array.isArray(skinsData)) {
          skinArray = skinsData as Skin[];
        } else {
          skinArray = Object.values(skinsData).flat() as Skin[];
        }
        setSkins(skinArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching skins:', error);
        setLoading(false);
      });

    fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/cases.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Cases API not available');
        }
        return response.json();
      })
      .then(casesData => {
        let casesArray: Case[];
        if (Array.isArray(casesData)) {
          casesArray = casesData as Case[];
        } else {
          casesArray = Object.values(casesData) as Case[];
        }
        setCases(casesArray);
      })
      .catch(error => {
        console.error('Error fetching cases:', error);
        // Set dummy cases or leave empty
        setCases([]);
      });
  }, []);

  const startRolling = (getItem: () => Skin | null) => {
    if (skins.length === 0 || rolling) return;
    setRolling(true);
    setOpenedItem(null);
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * skins.length);
      const item = skins[randomIndex];
      if (item.image) {
        setRollingImage(item.image);
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      const item = getItem();
      if (item) {
        setOpenedItem({ ...item, color: rarityColors[item.rarity] || '#ffffff' });
      }
      setRolling(false);
      setRollingImage('');
    }, 2000);
  };

  const openCase = (caseItem: Case) => {
    startRolling(() => {
      const randomIndex = Math.floor(Math.random() * caseItem.contains.length);
      const skinId = caseItem.contains[randomIndex];
      return skins.find(s => s.id === skinId) || null;
    });
  };

  const spinRandomSkin = () => {
    startRolling(() => {
      const randomIndex = Math.floor(Math.random() * skins.length);
      return skins[randomIndex];
    });
  };

  if (loading) {
    return <div className="app"><h1>Loading skins...</h1></div>;
  }

  return (
    <div className="app">
      <h1>CS Case Opening Simulator</h1>
      <button className="spin-all-btn" onClick={spinRandomSkin} disabled={rolling}>
        Spin Random Skin
      </button>
      <div className="cases-grid">
        {cases.map(caseItem => (
          <img
            key={caseItem.id}
            src={caseItem.image || `https://via.placeholder.com/150x150?text=${encodeURIComponent(caseItem.name)}`}
            alt={caseItem.name}
            className="case-image"
            onClick={() => openCase(caseItem)}
          />
        ))}
      </div>
      {rolling && (
        <div className="rolling-display">
          <h2>Rolling...</h2>
          {rollingImage && <img src={rollingImage} alt="Rolling skin" className="rolling-image" />}
        </div>
      )}
      {openedItem && !rolling && (
        <div className={`item-display ${['Covert', 'Special Item'].includes(openedItem.rarity) ? 'rare' : ''}`} style={{ color: openedItem.color }}>
          <h2>You got:</h2>
          {openedItem.image && <img src={openedItem.image} alt={typeof openedItem.name === 'object' ? (openedItem.name as any).full || (openedItem.name as any).name || 'Skin' : openedItem.name} className="item-image" />}
          <p className="item-name">{typeof openedItem.name === 'object' ? (openedItem.name as any).full || (openedItem.name as any).name || '[Unknown]' : openedItem.name}</p>
          <p className="item-rarity">{String(openedItem.rarity)}</p>
        </div>
      )}
    </div>
  );
}
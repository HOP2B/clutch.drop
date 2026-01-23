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
  const [slotImages, setSlotImages] = useState<string[]>([]);
  const [translateY, setTranslateY] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

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

  const startRolling = (images: string[], getSelectedItem: (selectedImage: string) => Skin | null) => {
    if (rolling) return;
    setRolling(true);
    setOpenedItem(null);
    setSlotImages(images);
    setTranslateY(0);
    let speed = 50; // initial speed
    const slideInterval = setInterval(() => {
      setTranslateY(prev => prev - speed);
      if (speed > 5) speed -= 0.5; // slow down gradually
    }, 20);
    setTimeout(() => {
      clearInterval(slideInterval);
      const selectedIndex = Math.floor(Math.random() * images.length);
      setTranslateY(600 - selectedIndex * 200); // center the selected image
      const selectedImage = images[selectedIndex];
      const item = getSelectedItem(selectedImage);
      if (item) {
        setOpenedItem({ ...item, color: rarityColors[item.rarity] || '#ffffff' });
        setSpinCount(prev => prev + 1);
      }
      setRolling(false);
    }, 6000);
  };

  const openCase = (caseItem: Case) => {
    const images = caseItem.contains.map(id => skins.find(s => s.id === id)?.image || '').filter(Boolean);
    if (images.length === 0) return;
    startRolling(images, (selectedImage) => skins.find(s => s.image === selectedImage) || null);
  };

  const spinRandomSkin = () => {
    const images = [];
    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * skins.length);
      const img = skins[randomIndex].image;
      if (img) images.push(img);
    }
    startRolling(images, (selectedImage) => skins.find(s => s.image === selectedImage) || null);
  };

  if (loading) {
    return <div className="app"><h1>Loading skins...</h1></div>;
  }

  return (
    <div className="app">
      <h1>CS Case Opening Simulator</h1>
      <p className="spin-counter">Total Spins: {spinCount}</p>
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
          <div className="slot-machine">
            <div className="slot-track" style={{ transform: `translateX(${translateY}px)` }}>
              {slotImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Slot ${i}`}
                  className="slot-image"
                />
              ))}
            </div>
            <div className="arrow">▼</div>
          </div>
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
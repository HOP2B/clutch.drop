'use client'

import React, { useState, useEffect } from 'react'

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
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [showInventory, setShowInventory] = useState(false);

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

        // Load inventory from localStorage after skins are loaded
        const savedInventory = localStorage.getItem('inventory');
        if (savedInventory) {
          const inventoryIds = JSON.parse(savedInventory);
          const inventorySkins = skinArray.filter(skin => inventoryIds.includes(skin.id));
          setInventory(inventorySkins);
        }

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

    // Determine the winning image first
    const winningIndex = Math.floor(Math.random() * images.length);
    const winningImage = images[winningIndex];
    const winningItem = getSelectedItem(winningImage);

    // Create a CS2-style animation sequence
    const animationImages = [];

    // Phase 1: Fast random images (builds excitement) - 60 images
    for (let i = 0; i < 60; i++) {
      // Mix more random skins with occasional winning glimpses
      const randomChance = Math.random();
      if (randomChance < 0.1) {
        // 10% chance for winning image to tease early
        animationImages.push(winningImage);
      } else {
        const randomIndex = Math.floor(Math.random() * images.length);
        animationImages.push(images[randomIndex]);
      }
    }

    // Phase 2: Tease the win - highly mixed with many different weapons - 2000 images
    for (let i = 0; i < 2000; i++) {
      const randomChance = Math.random();
      if (randomChance < 0.10) {
        // 10% chance for winning image (reduced to prevent repeats)
        animationImages.push(winningImage);
      } else {
        // 90% chance for different random weapons
        const randomIndex = Math.floor(Math.random() * images.length);
        animationImages.push(images[randomIndex]);
      }
    }

    // Phase 3: Dramatic approach - maximum weapon variety - 2000 images
    for (let i = 0; i < 2000; i++) {
      const randomChance = Math.random();
      if (randomChance < 0.20) {
        // 20% chance for winning image (reduced to prevent repeats)
        animationImages.push(winningImage);
      } else {
        // 80% chance for different random weapons
        const randomIndex = Math.floor(Math.random() * images.length);
        animationImages.push(images[randomIndex]);
      }
    }

    // Phase 4: Final slow-motion - randomized mix with no consecutive repeats - 20 images
    for (let i = 0; i < 20; i++) {
      // Use random chance to determine image type for unpredictability
      const randomChance = Math.random();
      let currentImage;

      if (i < 8) {
        // First 8: 60% random, 40% winning (builds uncertainty)
        if (randomChance < 0.6) {
          currentImage = 'random';
        } else {
          currentImage = 'winning';
        }
      } else if (i < 15) {
        // Middle 7: 40% random, 60% winning (starts hinting at win)
        if (randomChance < 0.4) {
          currentImage = 'random';
        } else {
          currentImage = 'winning';
        }
      } else {
        // Last 5: 20% random, 80% winning (strongly suggests win)
        if (randomChance < 0.2) {
          currentImage = 'random';
        } else {
          currentImage = 'winning';
        }
      }

      // Prevent consecutive repeats and ensure only one winning image at the end
      const previousImage: string | undefined = animationImages[animationImages.length - 1];

      if (currentImage === 'winning') {
        if (previousImage === winningImage) {
          // If previous was winning, force random to avoid repeat
          const randomIndex = Math.floor(Math.random() * images.length);
          animationImages.push(images[randomIndex]);
        } else {
          // Only add winning image if it's not consecutive
          animationImages.push(winningImage);
        }
      } else {
        if (previousImage && previousImage !== winningImage) {
          // If previous was random, force winning to avoid repeat
          animationImages.push(winningImage);
        } else {
          // Get a random image that's different from the previous
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * images.length);
          } while (images[randomIndex] === previousImage);
          animationImages.push(images[randomIndex]);
        }
      }
    }

    setSlotImages(animationImages);
    setTranslateY(0);

    // CS2-style animation with proper phases
    let speed = 100; // Very fast start (increased from 60)
    let frameCount = 0;
    let phase = 1;

    const slideInterval = setInterval(() => {
      frameCount++;

      // Phase 1: Very fast spinning
      if (phase === 1 && frameCount < 120) {
        speed = 100; // Increased from 60
      }
      // Phase 2: Start slowing down
      else if (phase === 1 && frameCount < 240) {
        speed = 80; // Increased from 50
      }
      // Transition to phase 2
      else if (phase === 1) {
        phase = 2;
        frameCount = 0;
      }

      // Phase 2: Moderate speed
      if (phase === 2 && frameCount < 100) {
        speed = 70; // Increased from 40
      } else if (phase === 2 && frameCount < 200) {
        speed = 50; // Increased from 30
      } else if (phase === 2) {
        phase = 3;
        frameCount = 0;
      }

      // Phase 3: Slow down significantly
      if (phase === 3 && frameCount < 150) {
        speed = 30; // Increased from 20
      } else if (phase === 3 && frameCount < 300) {
        speed = 15; // Increased from 10
      } else if (phase === 3) {
        phase = 4;
        frameCount = 0;
      }

      // Phase 4: Very slow final approach
      if (phase === 4 && frameCount < 200) {
        speed = 8; // Increased from 5
      } else if (phase === 4 && frameCount < 400) {
        speed = 5; // Increased from 3
      } else if (phase === 4 && frameCount < 600) {
        speed = 3; // Increased from 2
      } else if (phase === 4) {
        speed = 2; // Increased from 1 (Final slow motion)
      }

      setTranslateY(prev => prev - speed);
    }, 16); // 60fps for smooth animation

    setTimeout(() => {
      clearInterval(slideInterval);

      // Calculate exact position to center the final winning image
      // The final winning image should be perfectly under the arrow
      const finalWinningImageIndex = animationImages.length - 5; // Position of final winning image
      const targetPosition = finalWinningImageIndex * 200 - 500; // Center it in the 1000px container
      setTranslateY(-targetPosition);

      if (winningItem) {
        setOpenedItem({ ...winningItem, color: rarityColors[winningItem.rarity] || '#ffffff' });
        setSpinCount(prev => prev + 1);
        // Add to inventory
        setInventory(prev => {
          if (!prev.some(skin => skin.id === winningItem.id)) {
            const newInventory = [...prev, winningItem];
            localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
            return newInventory;
          }
          return prev;
        });
      }
      setRolling(false);
    }, 8000); // 8 second CS2-style animation
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
      <button className="inventory-btn" onClick={() => setShowInventory(true)}>View Inventory</button>
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
      {selectedSkin && (
        <div className="skin-modal" onClick={() => setSelectedSkin(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedSkin(null)}>&times;</span>
            <h2>Skin Details</h2>
            {selectedSkin.image && <img src={selectedSkin.image} alt={typeof selectedSkin.name === 'object' ? (selectedSkin.name as any).name || 'Skin' : selectedSkin.name} className="modal-image" />}
            <p><strong>Name:</strong> {typeof selectedSkin.name === 'object' ? (selectedSkin.name as any).full || (selectedSkin.name as any).name || '[Unknown]' : selectedSkin.name}</p>
            <p><strong>Rarity:</strong> {String(selectedSkin.rarity)}</p>
            {/* Add more details if available */}
          </div>
        </div>
      )}
      {showInventory && (
        <div className="inventory-modal" onClick={() => setShowInventory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowInventory(false)}>&times;</span>
            <h2>Inventory</h2>
            {inventory.length === 0 ? (
              <p>You have no skins.</p>
            ) : (
              <div className="inventory-grid">
                {inventory.map(skin => (
                  <img
                    key={skin.id}
                    src={skin.image || `https://via.placeholder.com/150x150?text=${encodeURIComponent(typeof skin.name === 'object' ? (skin.name as any).name || 'Skin' : skin.name)}`}
                    alt={typeof skin.name === 'object' ? (skin.name as any).name || 'Skin' : skin.name}
                    className="inventory-item"
                    onClick={() => setSelectedSkin(skin)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
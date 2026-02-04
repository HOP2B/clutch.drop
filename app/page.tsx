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
  'Special': '#ffd700',
  'Ultra Rare': '#ff4500', // Orange-red for ultra rare
};

const rarityWeights: { [key: string]: number } = {
  'Consumer Grade': 50,
  'Industrial Grade': 40,
  'Mil-Spec': 30,
  'Restricted': 20,
  'Classified': 10,
  'Covert': 5,
  'Special': 2, // Very low drop chance
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Hardcoded skins for the cases
    const hardcodedSkins: Skin[] = [
      { id: 1, name: 'AK-47 | Redline', rarity: 'Classified',  image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzOtyufRkASq2lkxx4W-HnNyqJC3FZwYoC5p0Q7FfthW6wdWxPu-371Pdit5HnyXgznQeHYY5wyA/360fx360f', color: '#ff1493' },
      { id: 2, name: 'M4A4 | Howl', rarity: 'Covert', image: 'https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3dlYXBvbl9tNGExX2N1X200YTFfaG93bGluZ19saWdodC40OTEwYTA5ZDgxOTgwZDAxZmYxNDdjNDEyMzlkZjFlZGVkYjVkZjYxLnBuZw--/auto/auto/85/notrim/36b57d3ce6183e0568b09443ca516e8e.webp', color: '#dc143c' },
      { id: 3, name: 'AWP | Dragon Lore', rarity: 'Covert', image: 'https://ss.bitskins.com/53/53ac0ecbb5f1656b41fae9e95df568dc-front.webp', color: '#dc143c' },
      { id: 4, name: 'USP-S | Kill Confirmed', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYL8JSLSMxghCMEjEeNe5hHpw9zhYuOz5VfcitpBmyqt3X9O6itrsesFUfYmrKzTkUifZqPQtnZK/360fx360f', color: '#dc143c' },
      { id: 5, name: 'Desert Eagle | Blaze', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU/360fx360f', color: '#dc143c' },
      { id: 6, name: 'Glock-18 | Fade', rarity: 'Covert', image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0vL3dzxG6eO6nYeDg7miYr7VlWgHscN32LyT8dmm31XgrxdtZzvzJYDGIFM2Y16D-FfvlOu9m9bi66Oq9HyE', color: '#dc143c' },
      { id: 7, name: 'M4A1-S | Knight', rarity: 'Covert', image: 'https://cdn.tradeit.gg/csgo%2FM4A1-S%20-%20Knight%20(Factory%20New)_650x325.webp', color: '#dc143c' },
      { id: 8, name: 'P90 | Asiimov', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-JaV-KfmeAXGvzOtyufRkAXzgwUlwsmSGyo6ocinEPwZzC5J1F-EIsUXrwdbkNeqz7wPaj4wXnH7gznQeoepd94c/360fx360f', color: '#dc143c' },
      { id: 9, name: 'AK-47 | Fire Serpent', rarity: 'Covert', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvjiBk5r0bymVZwIoWZJ1QLEDs0O6ktayZr6ztFeIjYxAyyX-jH8b5y5vt-wDB_Y7uvqAHvjgL6w/360fx360f', color: '#dc143c' },
      { id: 10, name: 'M4A4 | Poseidon', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0OKhe6FkJP-dMWuZxuZi_uM9Sn23xkx_sG3VyNyqcnnFZgchDMYjQuMJtRHuw9PvZuPjtlCI3d9bjXKpHL2aoaM/360fx360f', color: '#dc143c' },
      { id: 11, name: 'AWP | Medusa', rarity: 'Covert', image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_jUnrN4M_preview.png', color: '#dc143c' },
      { id: 12, name: 'USP-S | Orion', rarity: 'Covert', image: 'https://cdn.tradeit.gg/csgo%2FUSP-S%20-%20Orion%20(Field-Tested)_650x325.webp', color: '#dc143c' },
      { id: 13, name: 'Desert Eagle | Golden Koi', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7v-Re6dsLPWAMWWCwPh5j-1gSCGn20om6jyGw9qgJHmQaAcgC8MmR7IMthm5m4W2M7zj7wOIj4pGn32o23hXrnE8VHBG1O4/360fx360f', color: '#dc143c' },
      { id: 14, name: 'Glock-18 | Gamma Doppler', rarity: 'Covert', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a4s2paalgIc-XAXeAzetkj_FhTjq2wSIgvzKGkbD1KCzPKhhxC5FyRbII4Ua_ltDhY-Ln41fW2I1Ayn_9ii5P7Xpr5ekHV6Mg__HekUifZpA8glcU/360fx360f', color: '#dc143c' },
      { id: 15, name: 'M4A1-S | Chantico\'s Fire', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_JmWiWnlBYioQKJk4jxNWXFZ1IgC5MiQuZeuhK4wIXnMuPhslCM2oMTxH75hnxK6Htjse4BVqd25OSJ2DU2Q_CD/360fx360f', color: '#dc143c' },
      { id: 16, name: 'P90 | Emerald Dragon', rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk6-Cvb6tjH-DKXliS0-9gv95lRi67gVMm4m3Vzdmqci-SO1clX8Z1QeYO5xi5mtTuPu7l4FDc2o4TmH32jC1P8G81tLxM49od/360fx360f', color: '#dc143c' },
      { id: 17, name: 'AK-47 | Case Hardened', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNK0P2nZKFpH_yaCW-Ej7sk5bE8Sn-2lEpz4zndzoyvdHuUPwFzWZYiE7EK4Bi4k9TlY-y24FbAy9USGSiZd5Q/360fx360f', color: '#ff1493' },
      { id: 18, name: 'M4A4 | Bullet Rain', rarity: 'Classified', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0PC7ZKhoNM-BD26e_uMisbBWQyC0nQlp4GmGydioIH3DPFMjDMd2QrQO5hDtkNK2Ne_htAXd3d0Uyiiriysb5zErvbh6fsb98Q/360fx360f', color: '#ff1493' },
      { id: 19, name: 'AWP | Pink DDPAT', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk6_a-abBSMPmdBVicyOl-pK9qHXC2zUpz5DiBn9arJCmXOFd0DZpxQOUDtBC6wNK0MOzl4wXWjYpG02yg2c9nQ1pb/360fx360f', color: '#ff1493' },
      { id: 20, name: 'USP-S | Stainless', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSIeGsG3SA_v1isehnQyyghiIqtjmMj4K3IHiSbgVyDMZ1E7QJ40S5l9DgZePltgTY2IxNySj62Hkf7SZr5OgAWb1lpPPjn-YwIg/360fx360f', color: '#ff1493' },
      { id: 21, name: 'Desert Eagle | Hypnotic', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORfqF_NPmUAVicyOl-pK9qSyyywxgjtmnVytyocnLGPA4iWcYmRLYIu0S-xtbuMLjg51DXjoJC02yg2VjGnh4J/360fx360f', color: '#ff1493' },
      { id: 22, name: 'Glock-18 | Water Elemental', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK72fB3aFxP11te99cCW6khUz_TjVyompc3-QOFR2DJQkFOMJtBbqk9LlY-7n5QLZjtkTxCWqhixPv311o7FVIf8eASQ/360fx360f', color: '#ff1493' },
      { id: 23, name: 'M4A1-S | Atomic Alloy', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMWrEwL87o95oQyW8jCIooTyLnYrGLSLANkI-D5d2FrENtRG7wNDvZe-3slfci9pFmHj8jSof6yZjtugEB6QtrKTXhxaBb-PhITXxPA/360fx360f', color: '#ff1493' },
      { id: 24, name: 'P90 | Shallow Grave', rarity: 'Classified', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf-jFk_6v-V7dlIfyfAXCvxvx3puRWQyC0nQlpsWzUyIqvcCiVPFQnW8YmEO4P5xi6xNS2Num35FbX34lCzX7_hytK5zErvbi02RizsA/360fx360f', color: '#ff1493' },
      { id: 25, name: 'AK-47 | Blue Laminate', rarity: 'Restricted', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wipC0POlPPNhIf2sDGuFxNF6ueZhW2fhzE5_5G7dnt_7JXufa1J0DZAkE-cKtBaxl9WzPuyz5lDY3YpAzCn9kGoXuZPu7T4u/330x192?allow_animated=1', color: '#ff6347' },
      { id: 26, name: 'M4A4 | Faded Zebra', rarity: 'Restricted', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFL0OirarZsI_GeMWWH_uJ_t-l9AXu3zBkhsDyHz4z9dXmVagJzW8MiQbFetBfrkNHhZbjr51CMiN8TyS_gznQeEoYBjXk/360fx360f', color: '#ff6347' },
      { id: 27, name: 'AWP | BOOM', rarity: 'Restricted', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk7f6vZZt-Kf2DAmKvzedxuPUnTX7mkxhy62iDzYqhdiqXbw4oWZEkE-IDsRa9lIXlMejktFOMi49MmDK-0H2AgUnw_w/330x192?allow_animated=1', color: '#ff6347' },
      { id: 28, name: 'USP-S | Torque', rarity: 'Restricted', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_v5kv-Z7SjqgnAsYvzSCkpu3cH2eZgcgD5cmTOQK5BftlobvY-zk4gCN2I4UyX-s3XhI7S4_supXA71lpPNCDDeLhA/360fx360f', color: '#ff6347' },
      { id: 29, name: 'Desert Eagle | Crimson Web', rarity: 'Restricted', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk5-uRf6FvM8-XD3WbxPxJveRtRjy-2xh15zmGm9r6IHKTOFJ0DZIkQOFfuhnsk9PnMe_ls1Ha34hHznr5jC5XrnE8TAPhH1w/360fx360f', color: '#ff6347' },
      { id: 30, name: 'Glock-18 | Reactor', rarity: 'Restricted', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a4s2gfadhJfGBMXeR1fpzou84cC6_mh4sjDCAnobsLGWRblJ1A8dyRbRYtES4xNbhNLjqtVeIi45CzSqv2i9B7S1v4u5UUPYh5OSJ2Ogs2lKT/360fx360f', color: '#ff6347' },
      { id: 31, name: 'M4A1-S | Dark Water', rarity: 'Restricted', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMX2Vw_x3j-VoXSKMmRQguynLzI6td3-TPQAlD5slR-EJ5hDux9XmMe7i71CI2t8UzSuthi9OvSlo6vFCD_TltxSe0A/360fx360f', color: '#ff6347' },
      { id: 32, name: 'P90 | Virus', rarity: 'Restricted', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf9Ttk9f2jaq1oH_2WCm6FzKAi5uNtF3vhxUR3426Bz42udiieaVAhD5QiRLNf4RjsktyzYbmzsQLalcsbmgsyJDIC/360fx360f', color: '#ff6347' },
      { id: 33, name: 'AK-47 | Safari Mesh', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wjFL0P-re6xSNPGdMWqVxedjva86HSrnxkx3tTjdz42ud36fbwVxD8RyQbICtBe8kdXgZe624gCK2YhB02yg2fLyHdkl/360fx360f', color: '#00bfff' },
      { id: 34, name: 'M4A4 | Modern Hunter', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwipC0Pq7ZrBoMs-eAWOV0-BJvOhuRz39xUh0tmyDmIusd3mTbldxCcEmRrYNsEO8k9a1Punis1OLj4pBxHn82jQJsHibcUQx2g/360fx360f', color: '#00bfff' },
      { id: 35, name: 'AWP | Worm God', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_DNk7uW-V7B6Kf6WMWuZxuZi_uRoGH3iw0wh4j7cnt6ucSqSZwUkCMB5TLIPsES_kNbuYeOwtgXai4NbjXKpZ4kj0o0/360fx360f', color: '#00bfff' },
      { id: 36, name: 'USP-S | Night Ops', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSKOmsGGaCyO13ve5WQSC0nQkYvzSCkpu3cy-RbFciDJUlQ7Rc4xW6l4DuNLzi4gPdg41NzX6r3H8d7y5q5epTAr1lpPPHAcmmJQ/360fx360f', color: '#00bfff' },
      { id: 37, name: 'Desert Eagle | Urban Rubble', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk5-uRfqV_KfOSA2iv1Px0se9WQyC0nQlp52nWmduhIn-QaQIpX5RyF-ZY5BS4l9TjZOPmsleN34wWnir73yJI7zErvbj27zddPg/360fx360f', color: '#00bfff' },
      { id: 38, name: 'Glock-18 | Death Rattle', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1T9s2gbbZiJPmSMWqVxedjva86GnuwwUsi62_TyNn_ci3COFNxA8Z1FLQL4EXsw9XnN-m04wfb2N1N02yg2Ta1uTqJ/360fx360f', color: '#00bfff' },
      { id: 39, name: 'M4A1-S | Boreal Forest', rarity: 'Mil-Spec', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_iKMWGf0-tlpN5rQDu2lBEYvjiBk5r0b3qfbw8mCJEkFLMJtES7x9PkNuPq4QCLjoNBmyj9hytL5ytstb4CVaY7uvqALhEhN3M/360fx360f', color: '#00bfff' },
      { id: 40, name: 'P90 | Sand Spray', rarity: 'Mil-Spec', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf7jJk_OK8ab1SM_GdClidxOp_pewnGy2xzEh0t2jRzNugci3FP1MiW8BzFrMDuxC-mt2yP-i3tVTeitgXzTK-0H0VdESbcw/360fx360f', color: '#00bfff' },
      { id: 41, name: 'AK-47 | Jungle Spray', rarity: 'Industrial Grade', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wjFL0OG-eqV0H_qGAGCcxNF6ueZhW2ewlhhz5T6ByY2oIi2XZgVxX8Z0FrFfsxnrl9bkMu625lbb2o9DzSyvkGoXuXE-297B/360fx360f', color: '#32cd32' },
      { id: 42, name: 'M4A4 | Urban DDPAT', rarity: 'Industrial Grade', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwipC0PaqeKV5H-WBDFicyOl-pK8xF3DjzR5_4zncnouhcSjGPQ8jA5B3ELFbuhPqloDkPrvjsgXY2t5N02yg2Rf5X8A9/360fx360f', color: '#32cd32' },
      { id: 43, name: 'AWP | Safari Mesh', rarity: 'Industrial Grade', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf7jJk4ve9YJt5If6sA2KUyPt7_rBqHHnhzEh-tzuAzt-vJ3KRbQ8iCpB3RuAMsRLsloeyMujg71TYjoNbjXKpJEJ03hs/360fx360f', color: '#32cd32' },
      { id: 44, name: 'USP-S | Forest Leaves', rarity: 'Industrial Grade', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSM-CsAmKR1-tlj-1gSCGn2xgh5W3Rwo2gcH6eP1IhWcYmTeYO4xTsw9TmY-mx5Q3a3ogQmSqsiCtXrnE8utrnVdI/330x192?allow_animated=1', color: '#32cd32' },
      { id: 45, name: 'Desert Eagle | Mudder', rarity: 'Industrial Grade', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk5-uRZat5NPyWCliDwOByj-1gSCGn20gj4WrVyNiuJ3OfPVAjCpEmE7MKuxbqmtDmPuu0slDW3Y5GyS-tintXrnE8PKHjtHI/330x192?allow_animated=1', color: '#32cd32' },
      { id: 46, name: 'Glock-18 | Groundwater', rarity: 'Industrial Grade', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1I4M2hZK17Jc-fB2CY1aBzseQ4GXG1lEwk4mWHmd39dC7BOwImD8F2QedeshjrkYKyML-z4Q3flcsbmqxtqryL/360fx360f', color: '#32cd32' },
      { id: 47, name: 'M4A1-S | VariCamo', rarity: 'Industrial Grade', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_iKMXGR0-d1sexmcCW6khUz_WjSw9qgd32TaAV1DMAlRrNcuhG7xt2yM-_ktlHW2tlHxHqs2iJI7yZ1o7FVeF8MW04/330x192?allow_animated=1', color: '#32cd32' },
      { id: 48, name: 'P90 | Scorched', rarity: 'Industrial Grade', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf7jJk6_O-eKhoH_yaCW-Ej7Yi5LI7F3jrk05y4G-HzY37dCiRPVAnCpZ3R-MI4BnpkICxMLjr5QHAy9USM2Zemfk/360fx360f', color: '#32cd32' },
      { id: 49, name: 'karambit | Blue gem', rarity: 'special', image:'https://key-drop.com/blog/wp-content/uploads/2024/08/karambit-blue-gem-4-fn-1024x354.webp', color: '#FFD700'},
      { id: 50, name: 'M9 Bayonet | Crimson Web', rarity: 'special', image:'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMW-J_vlzsvJWQyC0nQlp4GrWzYuqeHjDZlN1XJohTecO5xawwdDvNuLm5wPcjY0QzyX83Xsd7zErvbgxKe4lfw/360fx360f', color: '#FFD700'},
      { id: 51, name: 'Karambit | Crimson Web', rarity: 'special', image:'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-bF1iHxOxlj-1gSCGn20wi4mTcyoyoeS_Dbwd2Cpd0RrMK4RbqxNTvZLyw7lff3Y5GxX6oiiNXrnE86bQY1_c/360fx360f', color: '#FFD700'},
      { id: 52, name: 'Karambit | Doppler Sapphire', rarity: 'special', image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_sLfXhlc_preview.png', color: '#FFD700'},
      { id: 53, name: 'Butterfly Knife | Doppler Sapphire', rarity: 'special', image:'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOT1I6vZn3lU18hwmOvN8IXvjVCLqSwwOj6rYJiRdg42NAuE-lW5kri5hpbuvM7AzHtmsnMh4imPzUa3gB4aaOw9hfCeVxzAUJ5TOTzr', color: '#FFD700'},
      { id: 54, name: 'M9 Bayonet | Doppler Sapphire', rarity: 'special', image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjnMqvBnmJD7fp8i_vD-Yn8klGwlB81NDG3OtSUJgY7YVvS-VfolLq7hsO5tZ_OnXo3uyhz7SyPnhGx0xoeb-dugKOACQLJ28w8Lgw', color: '#FFD700'},
      { id: 55, name: 'Karambit | Ruby', rarity: 'special', image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_W2yOMPY_preview.png', color: '#FFD700ff'},
      { id: 56, name: 'Butterfly Knife | Gamma Doppler Emerald fn', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvxu97veBWSyajhREioQKVko7qJHj4Ml93UtZuTbULtxfsxNDjZejqtFbajIMUyy36iytOvS1u5-ZXVPAt_PbejgiSZap9v8cjE0cexQ/360fx360f', color: '#FFD700ff'},
      { id: 57, name: 'Butterfly Knife | Tiger Tooth', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/360fx360f', color: '#FFD700ff'},
      { id: 58, name: 'M9 Bayonet | Marble Fade', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/360fx360f', color: '#FFD700'},
      { id: 59, name: 'Huntsman Knife | Fade', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1P7vG6YadsLM-SD1iWwOpzj-1gSCGn2x8hsW6DmIqpcXjBZgYkCZt5F7VcthS8ldS2Nr7m5VCMi4gRyyuqjHtXrnE8oar8MtU/360fx360f', color: '#FFD700'},
      { id: 60, name: 'Karambit | Marble Fade', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1idwPx0vORWSSi3kCIrujqNjsGveH2RaVRxX5ohEe4Juhawm4fiM-ji4APf2YMXmSz_hyoduytv4uhWT-N7rfLHGBJ4/360fx360f', color: '#FFD700'},
      { id: 61, name: 'Butterfly Knife | Doppler (Ruby)', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOXhMaLum2pD6sl0g_PE8bP5gVO8v11tZGmgINfDJAU_NArYqVO8weq80ZXvuZ_Pm3NluSNz5n7dm0Phgk4YcKUx0gttBNHX', color: '#FFD700'},
      { id: 62, name: 'Karambit | Lore', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-QG1ibwPx3vd5lQDu2qhEutDWR1IqrIHLCZlUmDJYlTLFb50HuwdyxPu2w4lCKjI5HniT2jS1PuCxj5e0cEf1y9ZCADXU/360fx360f', color: '#FFD700'},
      { id: 63, name: 'Skeleton Knife | Fade', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-SD1iWwOpzj-1gSCGn20kjt2-En9mpcCmQag8hXsciQeJYthW9kILkMLji4g3Ygo8Uznj6jX9XrnE8raC5r1M/360fx360f', color: '#FFD700'},
      { id: 64, name: 'Bayonet | Doppler', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLzn4_v8ydP0POjV6BiMOCfC3Wv0eZ3o-Q6cCW6khUz_T_TydyheXmVZwYoXpR5R-YIsRe6lIazP-7h4Qzbj4hEzSyq3HgY7ix1o7FVS1Hc8lA/360fx360f', color: '#FFD700'},
      { id: 65, name: 'Flip Knife | Autotronic', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1d4_u-V6N-H_afB3evwPtiv_V7QCe6liIqtjmMj4K3cn2ealB1CZolF7UIsBW6k9CxYurk71bdjdgWmSSoj3tAv31rtb0LV71lpPO5lCn5IQ/360fx360f', color: '#FFD700'},
      { id: 66, name: 'Gut Knife | Doppler Sapphire', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c-uaRaalSM_GDHm-Z0-tJveB7TSW2nAcitwKJk4jxNWWQO1IjW5d4RLUOsEG_lYCxZbjq5QDejYlBnn6o2y9LvCti4OtRUfUl5OSJ2CIbbpiB', color: '#FFD700'},
      { id: 67, name: 'Falchion Knife | Damascus Steel', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1d7v6tYK1iLs-SH1iUwON3o-J8XBbqxSIqtjmMj4K3IyiSOwAjCJMiR-8JtBDukd3gYrzjtFHbiYIQyiythnxO53k9teYAAr1lpPNG4XW_dA/360fx360f', color: '#FFD700ff'},
      { id: 68, name: 'Shadow Daggers | Doppler Sapphire', rarity: 'special', image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_CzAWS9a_preview.png', color: '#FFD700'},
      { id: 69, name: 'Stiletto Knife | Doppler Black Pearl', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwOfBfThW-NOJlY20lfv1MLDBk2pD5Pp8i_vD-Yn8klGwlB81NDG3Oo-QIQA7ZFnSqVG9wuju0cfpucvLnHNivyFw7HrbmEGxgBxOaOFu1qCACQLJ4GHavAc', color: '#FFD700'},
      { id: 70, name: 'Skeleton Knife | Urban Masked', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-AHliEwP5zj_R7TSi9qhAitzSQl8H9Ii_GOAdyW8BwEOcI40W9kYbnNuq0tQbWjYwWxCut3Cod5yY94LpXT-N7rf4dDCBO/360fx360f', color: '#FFD700'},
      { id: 71, name: 'Paracord Knife | Blue Steel', rarity: 'special', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Y4OCqV6V8H_KfG2KU_uNztOh8Qmeywkpw5DjVyNj9cnORbwMjWJRzQOFYtBnpw9CxZungtQ3XiotHxXn5kGoXuZ6hVFhI/360fx360f', color: '#FFD700'},
      { id: 72, name: 'Bowie Knife | Lore', rarity: 'special', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I-uC4YbJsLM-RAXCZxNF1pd5rQD66kCIrvC-ApYL8JSLSMxhyCMchQLFbthe4wNK0P7vislPcjItMxH2qjn5P6iZtteZQUPYi8_WGkUifZt4J9khU/360fx360f', color: '#FFD700'},
    ]; 
    

    setSkins(hardcodedSkins);

    // Load inventory from localStorage after skins are loaded
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      const inventoryIds = JSON.parse(savedInventory);
      const inventorySkins = hardcodedSkins.filter(skin => inventoryIds.includes(skin.id));
      setInventory(inventorySkins);
    }

    setLoading(false);

    // Hardcoded cases
    const hardcodedCases: Case[] = [
      {
        id: 1,
        name: 'Dragon Lore Case',
        image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/csgo/resource/flash/econ/weapon_cases/crate_eslcologne2015_promo_de_cbble.png',
        contains: [1, 2, 3, 17, 18, 19, 25, 26, 27, 33, 34, 35, 41, 42, 43, 62, 72, 51,] // Mix of rarities
      },
      {
        id: 2,
        name: 'Gamma Case',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHEVtvP5bPZrd6XECmOSxe0v4bRoTnnjwBkitWrRm4yoeX3GagMnCZZ2FPlK7EcEv22BnQ/360fx360f',
        contains: [4, 5, 6, 20, 21, 22, 28, 29, 30, 36, 37, 38, 44, 45, 46, 52, 53, 54,]
      },
      {
        id: 3,
        name: 'Spectrum Case',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHQV7qCra_JscqPGCzLCl78ktuAxHSzmzUh_sjvWzdqoI33CaQF2DscjR_lK7EeF3oM7TA/360fx360f',
        contains: [7, 8, 9, 23, 24, 31, 32, 39, 40, 47, 48, 1, 2, 3, 4, 55, 56, 57] // Some overlaps
      },
      {
        id: 4,
        name: 'Chroma Case',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fq2wP7qr6bqI5cvHDCzfBlbcv57JqF3zrxRkj4W6Dwo34dy6QPQAoC5ZyW6dU5cxvklfG/360fx360f',
        contains: [10, 11, 12, 17, 18, 19, 25, 26, 27, 33, 34, 35, 41, 42, 43, 58, 59, 60]
      },
      {
        id: 5,
        name: 'Shadow Case',
        image: 'https://images.steamusercontent.com/ugc/2004717947593956802/C0C33DE5BD039BB5A4CA7F3B52B5E1F2A3A6954A/',
        contains: [13, 14, 15, 20, 21, 22, 28, 29, 30, 36, 37, 38, 44, 45, 46, 61, 49, 63]
      },
      {
        id: 6,
        name: 'Falchion Case',
        image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fpWwI7Pb-P6Y5dvPEDGSSlrsh57U8HHHiwx5yt2-Dwo7_JSnCOw8oCJF0W6dU5dgrLNA1/360fx360f',
        contains: [16, 1, 2, 23, 24, 31, 32, 39, 40, 47, 48, 3, 4, 5, 6, 64, 65, 66]
      },
      {
        id: 7,
        name: 'Revolver Case',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHIV7qWvOqE9IqSVWGKVlu8v6eM7Girmxkwl4TnWmIv8J36WagEiCpImQvlK7EclOzxxiQ/360fx360f',
        contains: [7, 8, 9, 17, 18, 19, 25, 26, 27, 33, 34, 35, 41, 42, 43, 67, 68, 69]
      },
      {
        id: 8,
        name: 'Dreams & Nightmares Case',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnIV7Kb5OaU-JqfHDzXFle0u4LY8Gy_kkRgisGzcm4v4J3vDOAQmDMdyRvlK7EcmeCU3yw/360fx360f',
        contains: [10, 11, 12, 20, 21, 22, 28, 29, 30, 36, 37, 38, 44, 45, 46, 70, 71, 50]
      }
    ];

    setCases(hardcodedCases);
  }, []);

  const startRolling = (images: string[], winningItem: Skin) => {
    if (rolling) return;
    setRolling(true);
    setOpenedItem(null);

    // Winning item is passed
    const winningImage = winningItem.image;

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

    // Phase 4: Final slow-motion - 100% guaranteed arrow landing on winning image
    for (let i = 0; i < 150; i++) {
      // Use strategic positioning to ensure 100% arrow landing
      const randomChance = Math.random();
      let currentImage;

      if (i < 75) {
        // First 75: 99.99% random, 0.01% winning (builds uncertainty)
        if (randomChance < 0.9999) {
          currentImage = 'random';
        } else {
          currentImage = 'winning';
        }
      } else if (i < 145) {
        // Middle 70: 99.8% random, 0.2% winning (starts hinting at win)
        if (randomChance < 0.998) {
          currentImage = 'random';
        } else {
          currentImage = 'winning';
        }
      } else {
        // Last 5: 0% random, 100% winning (guarantees win)
        currentImage = 'winning';
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
    let speed = 80; // Fast start with dramatic slow-down
    let frameCount = 0;
    let phase = 1;

    const slideInterval = setInterval(() => {
      frameCount++;

      // Phase 1: Very fast spinning
      if (phase === 1 && frameCount < 100) {
        speed = 80; // Fast start
      }
      // Phase 2: Start slowing down
      else if (phase === 1 && frameCount < 200) {
        speed = 50; // Significant drop
      }
      // Transition to phase 2
      else if (phase === 1) {
        phase = 2;
        frameCount = 0;
      }

      // Phase 2: Moderate speed
      if (phase === 2 && frameCount < 80) {
        speed = 30; // Further reduction
      } else if (phase === 2 && frameCount < 160) {
        speed = 20; // Slowing down more
      } else if (phase === 2) {
        phase = 3;
        frameCount = 0;
      }

      // Phase 3: Slow down significantly
      if (phase === 3 && frameCount < 120) {
        speed = 15; // Getting slower
      } else if (phase === 3 && frameCount < 240) {
        speed = 8; // Much slower
      } else if (phase === 3) {
        phase = 4;
        frameCount = 0;
      }

      // Phase 4: Very slow final approach
      if (phase === 4 && frameCount < 150) {
        speed = 5; // Slow
      } else if (phase === 4 && frameCount < 300) {
        speed = 3; // Very slow
      } else if (phase === 4 && frameCount < 450) {
        speed = 2; // Extremely slow
      } else if (phase === 4) {
        speed = 1; // Final slow motion for perfect skin reveal
      }

      setTranslateY(prev => prev - speed);
    }, 16); // 60fps for smooth animation

    setTimeout(() => {
      clearInterval(slideInterval);

      // Let the animation naturally settle without forcing position
      // The arrow will naturally land on the winning image due to the animation sequence
      // No forced positioning - natural landing

      // Wait for arrow to fully stop before showing reward (CS2 style)
      setTimeout(() => {
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
      }, 1000); // 1 second delay after arrow stops (CS2 style)
    }, 12000); // 12 second CS2-style animation (increased from 8000)
  };

  const openCase = (caseItem: Case) => {
    const caseSkins = caseItem.contains.map(id => skins.find(s => s.id === id)).filter(Boolean) as Skin[];
    if (caseSkins.length === 0) return;
    // Compute total weight
    const totalWeight = caseSkins.reduce((sum, skin) => sum + (rarityWeights[skin.rarity] || 1), 0);
    let random = Math.random() * totalWeight;
    let winningSkin: Skin | null = null;
    for (const skin of caseSkins) {
      random -= rarityWeights[skin.rarity] || 1;
      if (random <= 0) {
        winningSkin = skin;
        break;
      }
    }
    if (!winningSkin) winningSkin = caseSkins[caseSkins.length - 1];
    const images = caseSkins.map(s => s.image || '').filter((img): img is string => Boolean(img));
    startRolling(images, winningSkin);
  };

  const spinRandomSkin = () => {
    const allSkins = skins;
    // Compute total weight
    const totalWeight = allSkins.reduce((sum, skin) => sum + (rarityWeights[skin.rarity] || 1), 0);
    let random = Math.random() * totalWeight;
    let winningSkin: Skin | null = null;
    for (const skin of allSkins) {
      random -= rarityWeights[skin.rarity] || 1;
      if (random <= 0) {
        winningSkin = skin;
        break;
      }
    }
    if (!winningSkin) winningSkin = allSkins[allSkins.length - 1];
    const images = [];
    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * allSkins.length);
      const img = allSkins[randomIndex].image;
      if (img) images.push(img);
    }
    startRolling(images, winningSkin);
  };

  if (loading) {
    return <div className="app"><h1>Loading skins...</h1></div>;
  }

  return (
    <div className="app">
      <h1>CS Case Opening Simulator</h1>
      <input
        type="text"
        placeholder="Search cases..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <p className="spin-counter">Total Spins: {spinCount}</p>
      <button className="inventory-btn" onClick={() => setShowInventory(true)}>View Inventory</button>
      <button className="spin-all-btn" onClick={spinRandomSkin} disabled={rolling}>
        Spin Random Skin
      </button>
      <div className="cases-grid">
        {cases.filter(caseItem => caseItem.name.toLowerCase().includes(searchQuery.toLowerCase())).map(caseItem => (
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
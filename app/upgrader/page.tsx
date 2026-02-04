'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Skin {
  id: number;
  name: string;
  rarity: string;
  image?: string;
  color?: string;
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

const rarityOrder = [
  'Consumer Grade',
  'Industrial Grade',
  'Mil-Spec',
  'Restricted',
  'Classified',
  'Covert',
  'Special Item'
];

export default function Upgrader() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [selectedSkins, setSelectedSkins] = useState<Skin[]>([]);
  const [upgradeResult, setUpgradeResult] = useState<Skin | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load inventory from localStorage
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      const inventoryIds = JSON.parse(savedInventory);
      const hardcodedSkins: Skin[] = getHardcodedSkins();
      const inventorySkins = hardcodedSkins.filter(skin => inventoryIds.includes(skin.id));
      setInventory(inventorySkins);
    }
  }, []);

  const getHardcodedSkins = (): Skin[] => {
    return [
      { id: 1, name: 'AK-47 | Redline', rarity: 'Classified', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzOtyufRkASq2lkxx4W-HnNyqJC3FZwYoC5p0Q7FfthW6wdWxPu-371Pdit5HnyXgznQeHYY5wyA/360fx360f', color: '#ff1493' },
      { id: 2, name: 'M4A4 | Howl', rarity: 'Covert', image: 'https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3dlYXBvbl9tNGExX2N1X200YTFfaG93bGluZ19saWdodC40OTEwYTA5ZDgxOTgwZDAxZmYxNDdjNDEyMzkkZjFiZGVkYjVkZjYxLnBuZw--/auto/auto/85/notrim/36b57d3ce6183e0568b09443ca516e8e.webp', color: '#dc143c' },
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
      { id: 15, name: "M4A1-S | Chantico's Fire", rarity: 'Covert', image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_JmWiWnlBYioQKJk4jxNWXFZ1IgC5MiQuZeuhK4wIXnMuPhslCM2oMTxH75hnxK6Htjse4BVqd25OSJ2DU2Q_CD/360fx360f', color: '#dc143c' },
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
      { id: 27, name: 'AWP | BOOM', rarity: 'Restricted', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk7f6vZZt-Kf2DAmKvTX7mkxhy62iDzYqhdiqXbw4ozedxuPUnWZEkE-IDsRa9lIXlMejktFOMi49MmDK-0H2AgUnw_w/330x192?allow_animated=1', color: '#ff6347' },
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
    ];
  };

  const getRarityIndex = (rarity: string): number => {
    return rarityOrder.indexOf(rarity);
  };

  const toggleSkinSelection = (skin: Skin) => {
    const isSelected = selectedSkins.some(s => s.id === skin.id);
    if (isSelected) {
      setSelectedSkins(selectedSkins.filter(s => s.id !== skin.id));
    } else {
      if (selectedSkins.length < 10) {
        setSelectedSkins([...selectedSkins, skin]);
      }
    }
  };

  const upgrade = () => {
    if (selectedSkins.length < 2) return;
    
    setUpgrading(true);
    setUpgradeResult(null);

    // Calculate upgrade power based on selected skins
    const totalPower = selectedSkins.reduce((sum, skin) => {
      return sum + Math.pow(2, getRarityIndex(skin.rarity));
    }, 0);

    // Higher rarity targets have lower chance
    const maxRarityIndex = Math.max(...selectedSkins.map(s => getRarityIndex(s.rarity)));
    const allSkins = getHardcodedSkins();
    
    // Filter skins that are same or higher rarity than selected
    const possibleUpgrades = allSkins.filter(skin => {
      const targetIndex = getRarityIndex(skin.rarity);
      return targetIndex >= maxRarityIndex;
    });

    // Calculate success chance based on total power
    const successChance = Math.min(0.5, totalPower / 100);

    setTimeout(() => {
      const roll = Math.random();
      let result: Skin | null = null;

      if (roll < successChance && possibleUpgrades.length > 0) {
        // Success - upgrade to a random skin from possible upgrades
        result = possibleUpgrades[Math.floor(Math.random() * possibleUpgrades.length)];
      } else {
        // Failed - keep a random skin from original selection (but it's consumed)
        // Or give a small consolation prize
        const consolationSkins = allSkins.filter(skin => {
          const targetIndex = getRarityIndex(skin.rarity);
          return targetIndex >= 0; // Any skin as consolation
        });
        result = consolationSkins[Math.floor(Math.random() * consolationSkins.length)];
      }

      if (result) {
        setUpgradeResult({ ...result, color: rarityColors[result.rarity] || '#ffffff' });
        
        // Remove consumed skins from inventory
        const remainingInventory = inventory.filter(s => 
          !selectedSkins.some(selected => selected.id === s.id)
        );
        setInventory(remainingInventory);
        localStorage.setItem('inventory', JSON.stringify(remainingInventory.map(s => s.id)));

        // Add result to inventory if not already there
        if (!remainingInventory.some(s => s.id === result!.id)) {
          const newInventory = [...remainingInventory, result!];
          setInventory(newInventory);
          localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
        }
      }

      setSelectedSkins([]);
      setUpgrading(false);
    }, 2000);
  };

  const filteredInventory = inventory.filter(skin =>
    skin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <div className="upgrader-header">
        <Link href="/" className="back-btn">← Back to Cases</Link>
        <h1>Skin Upgrader</h1>
      </div>
      
      <div className="upgrade-info">
        <p>Select 2-10 skins from your inventory to combine them for a chance to upgrade!</p>
        <p>Higher rarity skins increase your chances of getting a better skin.</p>
      </div>

      <div className="selected-skins">
        <h3>Selected: {selectedSkins.length}/10</h3>
        <div className="selected-grid">
          {selectedSkins.map(skin => (
            <div 
              key={skin.id} 
              className="selected-skin-item"
              onClick={() => toggleSkinSelection(skin)}
              style={{ borderColor: rarityColors[skin.rarity] }}
            >
              {skin.image && <img src={skin.image} alt={skin.name} />}
              <span className="skin-name">{skin.name}</span>
              <span className="skin-rarity" style={{ color: rarityColors[skin.rarity] }}>
                {skin.rarity}
              </span>
            </div>
          ))}
        </div>
        <button 
          className="upgrade-btn" 
          onClick={upgrade}
          disabled={selectedSkins.length < 2 || upgrading}
        >
          {upgrading ? 'Upgrading...' : `Upgrade (${selectedSkins.length} skins)`}
        </button>
      </div>

      {upgradeResult && (
        <div className="upgrade-result">
          <h2>{upgrading ? 'Upgrading...' : 'Upgrade Complete!'}</h2>
          {upgradeResult.image && (
            <img src={upgradeResult.image} alt={upgradeResult.name} className="result-image" />
          )}
          <p className="result-name" style={{ color: upgradeResult.color }}>
            {upgradeResult.name}
          </p>
          <p className="result-rarity" style={{ color: upgradeResult.color }}>
            {upgradeResult.rarity}
          </p>
        </div>
      )}

      <div className="inventory-section">
        <h2>Your Inventory ({inventory.length} items)</h2>
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {inventory.length === 0 ? (
          <p className="empty-inventory">Your inventory is empty. Open some cases to get skins!</p>
        ) : (
          <div className="inventory-grid">
            {filteredInventory.map(skin => {
              const isSelected = selectedSkins.some(s => s.id === skin.id);
              return (
                <div 
                  key={skin.id}
                  className={`inventory-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSkinSelection(skin)}
                  style={{ borderColor: rarityColors[skin.rarity] }}
                >
                  {skin.image && <img src={skin.image} alt={skin.name} />}
                  <span className="skin-name">{skin.name}</span>
                  <span className="skin-rarity" style={{ color: rarityColors[skin.rarity] }}>
                    {skin.rarity}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

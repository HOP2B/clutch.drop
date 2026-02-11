'use client'

import React, { useState, useEffect, useCallback } from 'react'

// Types
interface Skin {
  id: number;
  name: string;
  rarity: string;
  image?: string;
  color?: string;
  price?: number;
  isSpecial?: boolean;
}

interface Case {
  id: number;
  name: string;
  image?: string;
  contains: number[];
  price?: number;
}

// Rarity Configuration
const RARITY_CONFIG: { [key: string]: { color: string; gradient: string; label: string; weight: number } } = {
  'Consumer Grade': { color: '#8fbc8f', gradient: 'rarity-consumer', label: 'Consumer', weight: 50 },
  'Industrial Grade': { color: '#32cd32', gradient: 'rarity-industrial', label: 'Industrial', weight: 40 },
  'Mil-Spec': { color: '#00bfff', gradient: 'rarity-milspec', label: 'Mil-Spec', weight: 30 },
  'Restricted': { color: '#ff6347', gradient: 'rarity-restricted', label: 'Restricted', weight: 20 },
  'Classified': { color: '#ff1493', gradient: 'rarity-classified', label: 'Classified', weight: 10 },
  'Covert': { color: '#dc143c', gradient: 'rarity-covert', label: 'Covert', weight: 5 },
  'Special': { color: '#ffd700', gradient: 'rarity-special', label: 'Special', weight: 1 },
};

// Premium Skins Database
const PREMIUM_SKINS: Skin[] = [
  // Covert Skins
  { id: 1, name: 'AK-47 | Redline', rarity: 'Classified', color: '#ff1493', price: 45, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzOtyufRkASq2lkxx4W-HnNyqJC3FZwYoC5p0Q7FfthW6wdWxPu-371Pdit5HnyXgznQeHYY5wyA/360fx360f' },
  { id: 2, name: 'M4A4 | Howl', rarity: 'Covert', color: '#dc143c', price: 150, image: 'https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3dlYXBvbl9tNGExX2N1X200YTFfaG93bGluZ19saWdodC40OTEwYTA5ZDgxOTgwZDAxZmYxNDdjNDEyMzlkZjFlZGVkYjVkZjYxLnBuZw--/auto/auto/85/notrim/36b57d3ce6183e0568b09443ca516e8e.webp' },
  { id: 3, name: 'AWP | Dragon Lore', rarity: 'Covert', color: '#dc143c', price: 200, image: 'https://ss.bitskins.com/53/53ac0ecbb5f1656b41fae9e95df568dc-front.webp' },
  { id: 4, name: 'USP-S | Kill Confirmed', rarity: 'Covert', color: '#dc143c', price: 75, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYL8JSLSMxghCMEjEeNe5hHpw9zhYuOz5VfcitpBmyqt3X9O6itrsesFUfYmrKzTkUifZqPQtnZK/360fx360f' },
  { id: 5, name: 'Desert Eagle | Blaze', rarity: 'Covert', color: '#dc143c', price: 95, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU/360fx360f' },
  { id: 6, name: 'Glock-18 | Fade', rarity: 'Covert', color: '#dc143c', price: 120, image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0vL3dzxG6eO6nYeDg7miYr7VlWgHscN32LyT8dmm31XgrxdtZzvzJYDGIFM2Y16D-FfvlOu9m9bi66Oq9HyE', isSpecial: true },
  { id: 7, name: 'M4A1-S | Knight', rarity: 'Covert', color: '#dc143c', price: 85, image: 'https://cdn.tradeit.gg/csgo%2FM4A1-S%20-%20Knight%20(Factory%20New)_650x325.webp' },
  { id: 8, name: 'P90 | Asiimov', rarity: 'Covert', color: '#dc143c', price: 60, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-JaV-KfmeAXGvzOtyufRkAXzgwUlwsmSGyo6ocinEPwZzC5J1F-EIsUXrwdbkNeqz7wPaj4wXnH7gznQeoepd94c/360fx360f' },
  { id: 9, name: 'AK-47 | Fire Serpent', rarity: 'Covert', color: '#dc143c', price: 110, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvjiBk5r0bymVZwIoWZJ1QLEDs0O6ktayZr6ztFeIjYxAyyX-jH8b5y5vt-wDB_Y7uvqAHvjgL6w/360fx360f' },
  { id: 10, name: 'M4A4 | Poseidon', rarity: 'Covert', color: '#dc143c', price: 80, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0OKhe6FkJP-dMWuZxuZi_uM9Sn23xkx_sG3VyNyqcnnFZgchDMYjQuMJtRHuw9PvZuPjtlCI3d9bjXKpHL2aoaM/360fx360f' },
  { id: 11, name: 'AWP | Medusa', rarity: 'Covert', color: '#dc143c', price: 180, image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_jUnrN4M_preview.png' },
  { id: 12, name: 'USP-S | Orion', rarity: 'Covert', color: '#dc143c', price: 70, image: 'https://cdn.tradeit.gg/csgo%2FUSP-S%20-%20Orion%20(Field-Tested)_650x325.webp' },
  
  // Classified Skins
  { id: 13, name: 'Desert Eagle | Golden Koi', rarity: 'Covert', color: '#dc143c', price: 90, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7v-Re6dsLPWAMWWCwPh5j-1gSCGn20om6jyGw9qgJHmQaAcgC8MmR7IMthm5m4W2M7zj7wOIj4pGn32o23hXrnE8VHBG1O4/360fx360f' },
  { id: 14, name: 'Glock-18 | Gamma Doppler', rarity: 'Covert', color: '#dc143c', price: 100, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a4s2paalgIc-XAXeAzetkj_FhTjq2wSIgvzKGkbD1KCzPKhhxC5FyRbII4Ua_ltDhY-Ln41fW2I1Ayn_9ii5P7Xpr5ekHV6Mg__HekUifZpA8glcU/360fx360f' },
  { id: 15, name: 'M4A1-S | Chantico\'s Fire', rarity: 'Covert', color: '#dc143c', price: 75, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_JmWiWnlBYioQKJk4jxNWXFZ1IgC5MiQuZeuhK4wIXnMuPhslCM2oMTxH75hnxK6Htjse4BVqd25OSJ2DU2Q_CD/360fx360f' },
  { id: 16, name: 'P90 | Emerald Dragon', rarity: 'Covert', color: '#dc143c', price: 65, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk6-Cvb6tjH-DKXliS0-9gv95lRi67gVMm4m3Vzdmqci-SO1clX8Z1QeYO5xi5mtTuPu7l4FDc2o4TmH32jC1P8G81tLxM49od/360fx360f' },
  { id: 17, name: 'AK-47 | Case Hardened', rarity: 'Classified', color: '#ff1493', price: 40, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNK0P2nZKFpH_yaCW-Ej7sk5bE8Sn-2lEpz4zndzoyvdHuUPwFzWZYiE7EK4Bi4k9TlY-y24FbAy9USGSiZd5Q/360fx360f' },
  { id: 18, name: 'M4A4 | Bullet Rain', rarity: 'Classified', color: '#ff1493', price: 35, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0PC7ZKhoNM-BD26e_uMisbBWQyC0nQlp4GmGydioIH3DPFMjDMd2QrQO5hDtkNK2Ne_htAXd3d0Uyiiriysb5zErvbh6fsb98Q/360fx360f' },
  { id: 19, name: 'AWP | Pink DDPAT', rarity: 'Classified', color: '#ff1493', price: 30, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk6_a-abBSMPmdBVicyOl-pK9qHXC2zUpz5DiBn9arJCmXOFd0DZpxQOUDtBC6wNK0MOzl4wXWjYpG02yg2c9nQ1pb/360fx360f' },
  { id: 20, name: 'USP-S | Stainless', rarity: 'Classified', color: '#ff1493', price: 25, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSIeGsG3SA_v1isehnQyyghiIqtjmMj4K3IHiSbgVyDMZ1E7QJ40S5l9DgZePltgTY2IxNySj62Hkf7SZr5OgAWb1lpPPjn-YwIg/360fx360f' },
  { id: 21, name: 'Desert Eagle | Hypnotic', rarity: 'Classified', color: '#ff1493', price: 28, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORfqF_NPmUAVicyOl-pK9qSyyywxgjtmnVytyocnLGPA4iWcYmRLYIu0S-xtbuMLjg51DXjoJC02yg2VjGnh4J/360fx360f' },
  { id: 22, name: 'Glock-18 | Water Elemental', rarity: 'Classified', color: '#ff1493', price: 32, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK72fB3aFxP11te99cCW6khUz_TjVyompc3-QOFR2DJQkFOMJtBbqk9LlY-7n5QLZjtkTxCWqhixPv311o7FVIf8eASQ/360fx360f' },
  { id: 23, name: 'M4A1-S | Atomic Alloy', rarity: 'Classified', color: '#ff1493', price: 22, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMWrEwL87o95oQyW8jCIooTyLnYrGLSLANkI-D5d2FrENtRG7wNDvZe-3slfci9pFmHj8jSof6yZjtugEB6QtrKTXhxaBb-PhITXxPA/360fx360f' },
  { id: 24, name: 'P90 | Shallow Grave', rarity: 'Classified', color: '#ff1493', price: 20, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf-jFk_6v-V7dlIfyfAXCvxvx3puRWQyC0nQlpsWzUyIqvcCiVPFQnW8YmEO4P5xi6xNS2Num35FbX34lCzX7_hytK5zErvbi02RizsA/360fx360f' },
  
  // Restricted Skins
  { id: 25, name: 'AK-47 | Blue Laminate', rarity: 'Restricted', color: '#ff6347', price: 15, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wipC0POlPPNhIf2sDGuFxNF6ueZhW2fhzE5_5G7dnt_7JXufa1J0DZAkE-cKtBaxl9WzPuyz5lDY3YpAzCn9kGoXuZPu7T4u/330x192?allow_animated=1' },
  { id: 26, name: 'M4A4 | Faded Zebra', rarity: 'Restricted', color: '#ff6347', price: 12, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFL0OirarZsI_GeMWWH_uJ_t-l9AXu3zBkhsDyHz4z9dXmVagJzW8MiQbFetBfrkNHhZbjr51CMiN8TyS_gznQeEoYBjXk/360fx360f' },
  { id: 27, name: 'AWP | BOOM', rarity: 'Restricted', color: '#ff6347', price: 18, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk7f6vZZt-Kf2DAmKvzedxuPUnTX7mkxhy62iDzYqhdiqXbw4oWZEkE-IDsRa9lIXlMejktFOMi49MmDK-0H2AgUnw_w/330x192?allow_animated=1' },
  { id: 28, name: 'USP-S | Torque', rarity: 'Restricted', color: '#ff6347', price: 10, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_v5kv-Z7SjqgnAsYvzSCkpu3cH2eZgcgD5cmTOQK5BftlobvY-zk4gCN2I4UyX-s3XhI7S4_supXA71lpPNCDDeLhA/360fx360f' },
  { id: 29, name: 'Desert Eagle | Crimson Web', rarity: 'Restricted', color: '#ff6347', price: 14, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk5-uRf6FvM8-XD3WbxPxJveRtRjy-2xh15zmGm9r6IHKTOFJ0DZIkQOFfuhnsk9PnMe_ls1Ha34hHznr5jC5XrnE8TAPhH1w/360fx360f' },
  { id: 30, name: 'Glock-18 | Reactor', rarity: 'Restricted', color: '#ff6347', price: 11, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a4s2gfadhJfGBMXeR1fpzou84cC6_mh4sjDCAnobsLGWRblJ1A8dyRbRYtES4xNbhNLjqtVeIi45CzSqv2i9B7S1v4u5UUPYh5OSJ2Ogs2lKT/360fx360f' },
  { id: 31, name: 'M4A1-S | Dark Water', rarity: 'Restricted', color: '#ff6347', price: 13, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMX2Vw_x3j-VoXSKMmRQguynLzI6td3-TPQAlD5slR-EJ5hDux9XmMe7i71CI2t8UzSuthi9OvSlo6vFCD_TltxSe0A/360fx360f' },
  { id: 32, name: 'P90 | Virus', rarity: 'Restricted', color: '#ff6347', price: 9, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf9Ttk9f2jaq1oH_2WCm6FzKAi5uNtF3vhxUR3426Bz42udiieaVAhD5QiRLNf4RjsktyzYbmzsQLalcsbmgsyJDIC/360fx360f' },
  
  // Mil-Spec Skins
  { id: 33, name: 'AK-47 | Safari Mesh', rarity: 'Mil-Spec', color: '#00bfff', price: 5, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wjFL0P-re6xSNPGdMWqVxedjva86HSrnxkx3tTjdz42ud36fbwVxD8RyQbICtBe8kdXgZe624gCK2YhB02yg2fLyHdkl/360fx360f' },
  { id: 34, name: 'M4A4 | Modern Hunter', rarity: 'Mil-Spec', color: '#00bfff', price: 6, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwipC0Pq7ZrBoMs-eAWOV0-BJvOhuRz39xUh0tmyDmIusd3mTbldxCcEmRrYNsEO8k9a1Punis1OLj4pBxHn82jQJsHibcUQx2g/360fx360f' },
  { id: 35, name: 'AWP | Worm God', rarity: 'Mil-Spec', color: '#00bfff', price: 7, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_DNk7uW-V7B6Kf6WMWuZxuZi_uRoGH3iw0wh4j7cnt6ucSqSZwUkCMB5TLIPsES_kNbuYeOwtgXai4NbjXKpZ4kj0o0/360fx360f' },
  { id: 36, name: 'USP-S | Night Ops', rarity: 'Mil-Spec', color: '#00bfff', price: 4, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSKOmsGGaCyO13ve5WQSC0nQkYvzSCkpu3cy-RbFciDJUlQ7Rc4xW6l4DuNLzi4gPdg41NzX6r3H8d7y5q5epTAr1lpPPHAcmmJQ/360fx360f' },
  { id: 37, name: 'Desert Eagle | Urban Rubble', rarity: 'Mil-Spec', color: '#00bfff', price: 5, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk5-uRfqV_KfOSA2iv1Px0se9WQyC0nQlp52nWmduhIn-QaQIpX5RyF-ZY5BS4l9TjZOPmsleN34wWnir73yJI7zErvbj27zddPg/360fx360f' },
  { id: 38, name: 'Glock-18 | Death Rattle', rarity: 'Mil-Spec', color: '#00bfff', price: 4, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1T9s2gbbZiJPmSMWqVxedjva86GnuwwUsi62_TyNn_ci3COFNxA8Z1FLQL4EXsw9XnN-m04wfb2N1N02yg2Ta1uTqJ/360fx360f' },
  { id: 39, name: 'M4A1-S | Boreal Forest', rarity: 'Mil-Spec', color: '#00bfff', price: 5, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_iKMWGf0-tlpN5rQDu2lBEYvjiBk5r0b3qfbw8mCJEkFLMJtES7x9PkNuPq4QCLjoNBmyj9hytL5ytstb4CVaY7uvqALhEhN3M/360fx360f' },
  { id: 40, name: 'P90 | Sand Spray', rarity: 'Mil-Spec', color: '#00bfff', price: 4, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf7jJk_OK8ab1SM_GdClidxOp_pewnGy2xzEh0t2jRzNugci3FP1MiW8BzFrMDuxC-mt2yP-i3tVTeitgXzTK-0H0VdESbcw/360fx360f' },
  
  // Special / Rare Knives
  { id: 50, name: 'Karambit | Doppler Sapphire', rarity: 'Special', color: '#ffd700', price: 350, image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_sLfXhlc_preview.png', isSpecial: true },
  // Rward Special Skin
  { id: 999, name: 'Rward Special', rarity: 'Special', color: '#ffd700', price: 500, image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_sLfXhlc_preview.png', isSpecial: true },
  { id: 51, name: 'Butterfly Knife | Doppler Sapphire', rarity: 'Special', color: '#ffd700', price: 380, image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOXhMaLum2pD6sl0g_PE8bP5gVO8v11tZGmgINfDJAU_NArYqVO8weq80ZXvuZ_Pm3NluSNz5n7dm0Phgk4YcKUx0gttBNHX', isSpecial: true },
  { id: 52, name: 'M9 Bayonet | Doppler Sapphire', rarity: 'Special', color: '#ffd700', price: 320, image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjnMqvBnmJD7fp8i_vD-Yn8klGwlB81NDG3OtSUJgY7YVvS-VfolLq7hsO5tZ_OnXo3uyhz7SyPnhGx0xoeb-dugKOACQLJ28w8Lgw', isSpecial: true },
  { id: 53, name: 'Karambit | Ruby', rarity: 'Special', color: '#ffd700', price: 400, image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_W2yOMPY_preview.png', isSpecial: true },
  { id: 54, name: 'Butterfly Knife | Gamma Doppler', rarity: 'Special', color: '#ffd700', price: 280, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvxu97veBWSyajhREioQKVko7qJHj4Ml93UtZuTbULtxfsxNDjZejqtFbajIMUyy36iytOvS1u5-ZXVPAt_PbejgiSZap9v8cjE0cexQ/360fx360f', isSpecial: true },
  { id: 55, name: 'Butterfly Knife | Tiger Tooth', rarity: 'Special', color: '#ffd700', price: 250, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/360fx360f', isSpecial: true },
  { id: 56, name: 'M9 Bayonet | Marble Fade', rarity: 'Special', color: '#ffd700', price: 220, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/360fx360f', isSpecial: true },
  { id: 57, name: 'Huntsman Knife | Fade', rarity: 'Special', color: '#ffd700', price: 200, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1P7vG6YadsLM-SD1iWwOpzj-1gSCGn2x8hsW6DmIqpcXjBZgYkCZt5F7VcthS8ldS2Nr7m5VCMi4gRyyuqjHtXrnE8oar8MtU/360fx360f', isSpecial: true },
  { id: 58, name: 'Karambit | Marble Fade', rarity: 'Special', color: '#ffd700', price: 280, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1idwPx0vORWSSi3kCIrujqNjsGveH2RaVRxX5ohEe4Juhawm4fiM-ji4APf2YMXmSz_hyoduytv4uhWT-N7rfLHGBJ4/360fx360f', isSpecial: true },
  { id: 59, name: 'Butterfly Knife | Doppler Ruby', rarity: 'Special', color: '#ffd700', price: 360, image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOXhMaLum2pD6sl0g_PE8bP5gVO8v11tZGmgINfDJAU_NArYqVO8weq80ZXvuZ_Pm3NluSNz5n7dm0Phgk4YcKUx0gttBNHX', isSpecial: true },
  { id: 60, name: 'Karambit | Lore', rarity: 'Special', color: '#ffd700', price: 240, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-QG1ibwPx3vd5lQDu2qhEutDWR1IqrIHLCZlUmDJYlTLFb50HuwdyxPu2w4lCKjI5HniT2jS1PuCxj5e0cEf1y9ZCADXU/360fx360f', isSpecial: true },
  { id: 61, name: 'Skeleton Knife | Fade', rarity: 'Special', color: '#ffd700', price: 180, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-SD1iWwOpzj-1gSCGn20kjt2-En9mpcCmQag8hXsciQeJYthW9kILkMLji4g3Ygo8Uznj6jX9XrnE8raC5r1M/360fx360f', isSpecial: true },
  { id: 62, name: 'Bayonet | Doppler', rarity: 'Special', color: '#ffd700', price: 160, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLzn4_v8ydP0POjV6BiMOCfC3Wv0eZ3o-Q6cCW6khUz_T_TydyheXmVZwYoXpR5R-YIsRe6lIazP-7h4Qzbj4hEzSyq3HgY7ix1o7FVS1Hc8lA/360fx360f', isSpecial: true },
  { id: 63, name: 'Flip Knife | Autotronic', rarity: 'Special', color: '#ffd700', price: 170, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1d4_u-V6N-H_afB3evwPtiv_V7QCe6liIqtjmMj4K3cn2ealB1CZolF7UIsBW6k9CxYurk71bdjdgWmSSoj3tAv31rtb0LV71lpPO5lCn5IQ/360fx360f', isSpecial: true },
  { id: 64, name: 'Gut Knife | Doppler Sapphire', rarity: 'Special', color: '#ffd700', price: 150, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c-uaRaalSM_GDHm-Z0-tJveB7TSW2nAcitwKJk4jxNWWQO1IjW5d4RLUOsEG_lYCxZbjq5QDejYlBnn6o2y9LvCti4OtRUfUl5OSJ2CIbbpiB', isSpecial: true },
  { id: 65, name: 'Falchion Knife | Damascus Steel', rarity: 'Special', color: '#ffd700', price: 140, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1d7v6tYK1iLs-SH1iUwON3o-J8XBbqxSIqtjmMj4K3IyiSOwAjCJMiR-8JtBDukd3gYrzjtFHbiYIQyiythnxO53k9teYAAr1lpPNG4XW_dA/360fx360f', isSpecial: true },
  { id: 66, name: 'Shadow Daggers | Doppler', rarity: 'Special', color: '#ffd700', price: 190, image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/images/wiki_CzAWS9a_preview.png', isSpecial: true },
  { id: 67, name: 'Stiletto Knife | Doppler Black Pearl', rarity: 'Special', color: '#ffd700', price: 230, image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwOfBfThW-NOJlY20lfv1MLDBk2pD5Pp8i_vD-Yn8klGwlB81NDG3Oo-QIQA7ZFnSqVG9wuju0cfpucvLnHNivyFw7HrbmEGxgBxOaOFu1qCACQLJ4GHavAc', isSpecial: true },
  { id: 68, name: 'Skeleton Knife | Urban Masked', rarity: 'Special', color: '#ffd700', price: 130, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-AHliEwP5zj_R7TSi9qhAitzSQl8H9Ii_GOAdyW8BwEOcI40W9kYbnNuq0tQbWjYwWxCut3Cod5yY94LpXT-N7rf4dDCBO/360fx360f', isSpecial: true },
  { id: 69, name: 'Paracord Knife | Blue Steel', rarity: 'Special', color: '#ffd700', price: 120, image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Y4OCqV6V8H_KfG2KU_uNztOh8Qmeywkpw5DjVyNj9cnORbwMjWJRzQOFYtBnpw9CxZungtQ3XiotHxXn5kGoXuZ6hVFhI/360fx360f', isSpecial: true },
  { id: 70, name: 'Bowie Knife | Lore', rarity: 'Special', color: '#ffd700', price: 210, image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I-uC4YbJsLM-RAXCZxNF1pd5rQD66kCIrvC-ApYL8JSLSMxhyCMchQLFbthe4wNK0P7vislPcjItMxH2qjn5P6iZtteZQUPYi8_WGkUifZt4J9khU/360fx360f', isSpecial: true },
];

// Cases Configuration
const CASES: Case[] = [
  {
    id: 1,
    name: 'Dragon Lore Case',
    image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/csgo/resource/flash/econ/weapon_cases/crate_eslcologne2015_promo_de_cbble.png',
    contains: [1, 2, 3, 17, 18, 19, 25, 26, 27, 33, 34, 35, 50, 53, 60, 68],
    price: 15
  },
  {
    id: 2,
    name: 'Gamma Case',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHEVtvP5bPZrd6XECmOSxe0v4bRoTnnjwBkitWrRm4yoeX3GagMnCZZ2FPlK7EcEv22BnQ/360fx360f',
    contains: [4, 5, 6, 20, 21, 22, 28, 29, 30, 36, 37, 38, 51, 52, 54, 59],
    price: 18
  },
  {
    id: 3,
    name: 'Spectrum Case',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHQV7qCra_JscqPGCzLCl78ktuAxHSzmzUh_sjvWzdqoI33CaQF2DscjR_lK7EeF3oM7TA/360fx360f',
    contains: [7, 8, 9, 23, 24, 31, 32, 39, 40, 55, 56, 57, 61, 62, 63, 64],
    price: 20
  },
  {
    id: 4,
    name: 'Chroma Case',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fq2wP7qr6bqI5cvHDCzfBlbcv57JqF3zrxRkj4W6Dwo34dy6QPQAoC5ZyW6dU5cxvklfG/360fx360f',
    contains: [10, 11, 12, 17, 18, 19, 25, 26, 27, 33, 34, 35, 58, 65, 66, 67],
    price: 12
  },
  {
    id: 5,
    name: 'Shadow Case',
    image: 'https://images.steamusercontent.com/ugc/2004717947593956802/C0C33DE5BD039BB5A4CA7F3B52B5E1F2A3A6954A/',
    contains: [13, 14, 15, 20, 21, 22, 28, 29, 30, 36, 37, 38, 69, 70, 50, 51],
    price: 16
  },
  {
    id: 6,
    name: 'Falchion Case',
    image: 'https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fpWwI7Pb-P6Y5dvPEDGSSlrsh57U8HHHiwx5yt2-Dwo7_JSnCOw8oCJF0W6dU5dgrLNA1/360fx360f',
    contains: [16, 1, 2, 23, 24, 31, 32, 39, 40, 52, 53, 54, 59, 60, 61, 62],
    price: 14
  },
  {
    id: 7,
    name: 'Revolver Case',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHIV7qWvOqE9IqSVWGKVlu8v6eM7Girmxkwl4TnWmIv8J36WagEiCpImQvlK7EclOzxxiQ/360fx360f',
    contains: [7, 8, 9, 17, 18, 19, 25, 26, 27, 33, 34, 35, 63, 64, 65, 66],
    price: 22
  },
  {
    id: 8,
    name: 'Dreams & Nightmares',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnIV7Kb5OaU-JqfHDzXFle0u4LY8Gy_kkRgisGzcm4v4J3vDOAQmDMdyRvlK7EcmeCU3yw/360fx360f',
    contains: [10, 11, 12, 20, 21, 22, 28, 29, 30, 36, 37, 38, 67, 68, 69, 70],
    price: 25
  },
];

export default function Home() {
  // State
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [winningSkin, setWinningSkin] = useState<Skin | null>(null);
  const [slotImages, setSlotImages] = useState<string[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [balance, setBalance] = useState(1000); // Starting balance
  const [loading, setLoading] = useState(true);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeType, setUpgradeType] = useState<'blue-to-purple' | 'purple-to-red' | 'red-to-knife' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load stats from localStorage
  useEffect(() => {
    const savedSpinCount = localStorage.getItem('spinCount');
    const savedBalance = localStorage.getItem('balance');
    
    if (savedSpinCount) {
      setSpinCount(parseInt(savedSpinCount, 10));
    }
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    }
  }, []);

  // Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      const inventoryIds = JSON.parse(savedInventory);
      const savedInventorySkins = PREMIUM_SKINS.filter(skin => inventoryIds.includes(skin.id)).filter(Boolean) as Skin[];
      setInventory(savedInventorySkins);
    }
    setLoading(false);
  }, []);

  // Weighted random selection
  const selectRandomSkin = useCallback((skinIds: number[]): Skin => {
    const availableSkins = skinIds.map(id => PREMIUM_SKINS.find(s => s.id === id)).filter(Boolean) as Skin[];
    
    if (availableSkins.length === 0) {
      return PREMIUM_SKINS[0];
    }

    // Calculate total weight
    let totalWeight = 0;
    availableSkins.forEach(skin => {
      totalWeight += RARITY_CONFIG[skin.rarity]?.weight || 1;
    });

    // Weighted random selection
    let random = Math.random() * totalWeight;
    for (const skin of availableSkins) {
      const weight = RARITY_CONFIG[skin.rarity]?.weight || 1;
      random -= weight;
      if (random <= 0) {
        return skin;
      }
    }

    return availableSkins[availableSkins.length - 1];
  }, []);

  // Start case opening animation
  const startRolling = useCallback((caseItem: Case, targetSkinId?: number, hiddenReward?: boolean) => {
    if (rolling || balance < (caseItem.price || 0)) return;

    setRolling(true);
    setCurrentCase(caseItem);
    setShowSlotMachine(true);
    setShowWinOverlay(false);

    // Deduct balance
    setBalance(prev => {
      const newBalance = prev - (caseItem.price || 0);
      localStorage.setItem('balance', newBalance.toString());
      return newBalance;
    });

    // Select winning skin - either target specific skin or random
    let wonSkin: Skin;
    if (targetSkinId) {
      // Find the specific guns skin
      wonSkin = PREMIUM_SKINS.find(s => s.id === targetSkinId) || selectRandomSkin(caseItem.contains);
    } else {
      wonSkin = selectRandomSkin(caseItem.contains);
    }
    setWinningSkin(wonSkin);

    // Create animation sequence with improved mixing for hidden rewards
    const animationSequence: string[] = [];
    const skinImages = caseItem.contains.map(id => PREMIUM_SKINS.find(s => s.id === id)?.image || '').filter(Boolean);

    // Build animation with multiple phases for excitement and better hiding
    // Phase 1: Fast spinning (120 frames) - mix target skin in early to confuse
    for (let i = 0; i < 120; i++) {
      if (hiddenReward && i > 30 && i < 90) {
        // For hidden rewards, sprinkle the target skin throughout the fast spin
        const sprinkleChance = 0.15; // 15% chance to show target skin
        if (Math.random() < sprinkleChance) {
          animationSequence.push(wonSkin.image || '');
        } else {
          const randomIndex = Math.floor(Math.random() * skinImages.length);
          animationSequence.push(skinImages[randomIndex]);
        }
      } else {
        // Normal behavior for non-hidden rewards
        const randomIndex = Math.floor(Math.random() * skinImages.length);
        animationSequence.push(skinImages[randomIndex]);
      }
    }

    // Phase 2: Slowing down with strategic mixing (220 frames)
    for (let i = 0; i < 220; i++) {
      if (hiddenReward) {
        // For hidden rewards, use a sophisticated mixing pattern
        const phaseProgress = i / 220;
        
        if (phaseProgress < 0.3) {
          // Early slow-down: 25% target skin, 75% others
          const targetChance = 0.25;
          if (Math.random() < targetChance) {
            animationSequence.push(wonSkin.image || '');
          } else {
            const randomIndex = Math.floor(Math.random() * skinImages.length);
            animationSequence.push(skinImages[randomIndex]);
          }
        } else if (phaseProgress < 0.7) {
          // Middle phase: 40% target skin, 60% others (build anticipation)
          const targetChance = 0.4;
          if (Math.random() < targetChance) {
            animationSequence.push(wonSkin.image || '');
          } else {
            const randomIndex = Math.floor(Math.random() * skinImages.length);
            animationSequence.push(skinImages[randomIndex]);
          }
        } else {
          // Late phase: 60% target skin, 40% others (almost revealing)
          const targetChance = 0.6;
          if (Math.random() < targetChance) {
            animationSequence.push(wonSkin.image || '');
          } else {
            const randomIndex = Math.floor(Math.random() * skinImages.length);
            animationSequence.push(skinImages[randomIndex]);
          }
        }
      } else {
        // Normal behavior for non-hidden rewards
        const randomChance = Math.random();
        if (randomChance < 0.15 && i > 50) {
          animationSequence.push(wonSkin.image || '');
        } else {
          const randomIndex = Math.floor(Math.random() * skinImages.length);
          animationSequence.push(skinImages[randomIndex]);
        }
      }
    }

    // Phase 3: Final approach (120 frames) - dramatic reveal
    for (let i = 0; i < 120; i++) {
      if (hiddenReward) {
        // For hidden rewards, use a dramatic reveal pattern
        const finalProgress = i / 120;
        
        if (finalProgress < 0.5) {
          // First half: 80% target skin, 20% others (almost certain)
          const targetChance = 0.8;
          if (Math.random() < targetChance) {
            animationSequence.push(wonSkin.image || '');
          } else {
            const randomIndex = Math.floor(Math.random() * skinImages.length);
            animationSequence.push(skinImages[randomIndex]);
          }
        } else {
          // Second half: 95% target skin, 5% others (almost guaranteed)
          const targetChance = 0.95;
          if (Math.random() < targetChance) {
            animationSequence.push(wonSkin.image || '');
          } else {
            const randomIndex = Math.floor(Math.random() * skinImages.length);
            animationSequence.push(skinImages[randomIndex]);
          }
        }
      } else {
        // Normal behavior for non-hidden rewards
        if (i > 70) {
          animationSequence.push(wonSkin.image || '');
        } else {
          const randomChance = Math.random();
          if (randomChance < 0.2) {
            animationSequence.push(wonSkin.image || '');
          } else {
            const randomIndex = Math.floor(Math.random() * skinImages.length);
            animationSequence.push(skinImages[randomIndex]);
          }
        }
      }
    }

    // Special handling for rward skin - make it appear 40 times
    if (wonSkin.id === 999) {
      for (let i = 0; i < 40; i++) {
        animationSequence.push(wonSkin.image || '');
      }
    } else {
      // Ensure winning skin appears at the end
      for (let i = 0; i < 10; i++) {
        animationSequence.push(wonSkin.image || '');
      }
    }

    setSlotImages(animationSequence);

    // Animate
    let frame = 0;
    const imageWidth = 190; // Updated for new image width + margin
    const totalFrames = animationSequence.length;
    const startTime = Date.now();
    const animationDuration = 3000; // 3 seconds total animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      let progress = elapsed / animationDuration;
      
      // Clamp progress between 0 and 1
      if (progress > 1) progress = 1;
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const position = easeOut * (totalFrames * imageWidth);
      
      setTranslateX(-position);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setTimeout(() => {
          setShowSlotMachine(false);
          setShowWinOverlay(true);
          setRolling(false);
          setSpinCount(prev => {
            const newSpinCount = prev + 1;
            localStorage.setItem('spinCount', newSpinCount.toString());
            return newSpinCount;
          });
          
          // Add to inventory
          setInventory(prev => {
            if (!prev.some(s => s.id === wonSkin.id)) {
              const newInventory = [...prev, wonSkin];
              localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
              return newInventory;
            }
            return prev;
          });
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  }, [rolling, balance, selectRandomSkin]);

  // Quick spin (random skin from all cases)
  const quickSpin = useCallback(() => {
    if (rolling || balance < 10) return;

    setRolling(true);
    setShowSlotMachine(true);
    setShowWinOverlay(false);

    setBalance(prev => {
      const newBalance = prev - 10;
      localStorage.setItem('balance', newBalance.toString());
      return newBalance;
    });

    const allSkinIds = CASES.flatMap(c => c.contains);
    const wonSkin = selectRandomSkin(allSkinIds);
    setWinningSkin(wonSkin);

    const skinImages = PREMIUM_SKINS.map(s => s.image || '').filter(Boolean);
    const animationSequence: string[] = [];

    for (let i = 0; i < 300; i++) {
      const randomIndex = Math.floor(Math.random() * skinImages.length);
      animationSequence.push(skinImages[randomIndex]);
    }

    // Add winning skin at the end
    for (let i = 0; i < 10; i++) {
      animationSequence.push(wonSkin.image || '');
    }

    setSlotImages(animationSequence);

    const startTime = Date.now();
    const imageWidth = 220;
    const totalFrames = animationSequence.length;
    const animationDuration = 2500; // 2.5 seconds for quick spin
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      let progress = elapsed / animationDuration;
      
      // Clamp progress between 0 and 1
      if (progress > 1) progress = 1;
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const position = easeOut * (totalFrames * imageWidth);
      
      setTranslateX(-position);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setShowSlotMachine(false);
          setShowWinOverlay(true);
          setRolling(false);
          setSpinCount(prev => {
            const newSpinCount = prev + 1;
            localStorage.setItem('spinCount', newSpinCount.toString());
            return newSpinCount;
          });
          
          setInventory(prev => {
            if (!prev.some(s => s.id === wonSkin.id)) {
              const newInventory = [...prev, wonSkin];
              localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
              return newInventory;
            }
            return prev;
          });
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  }, [rolling, balance, selectRandomSkin]);

  // Sell item
  const sellItem = useCallback((skin: Skin) => {
    const sellPrice = skin.price || 5;
    setBalance(prev => prev + sellPrice);
    setInventory(prev => {
      const newInventory = prev.filter(s => s.id !== skin.id);
      localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
      return newInventory;
    });
  }, []);

  // Delete item
  const deleteItem = useCallback((skinId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setInventory(prev => {
      const newInventory = prev.filter(s => s.id !== skinId);
      localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
      return newInventory;
    });
  }, []);

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    return RARITY_CONFIG[rarity]?.color || '#888';
  };

  // Get rarity gradient class
  const getRarityGradient = (rarity: string) => {
    return RARITY_CONFIG[rarity]?.gradient || 'rarity-consumer';
  };

  // Helper functions for upgrade system
  const countItemsByRarity = useCallback((rarity: string) => {
    return inventory.filter(s => s.rarity === rarity).length;
  }, [inventory]);

  const getItemsByRarity = useCallback((rarity: string) => {
    return inventory.filter(s => s.rarity === rarity);
  }, [inventory]);

  const getUpgradeRequirements = useCallback((type: string) => {
    switch (type) {
      case 'blue-to-purple':
        return {
          from: 'Mil-Spec',
          to: 'Classified',
          count: 12,
          color: '#00bfff',
          toColor: '#ff1493'
        };
      case 'purple-to-red':
        return {
          from: 'Classified',
          to: 'Covert',
          count: 12,
          color: '#ff1493',
          toColor: '#dc143c'
        };
      case 'red-to-knife':
        return {
          from: 'Covert',
          to: 'Special',
          count: 6,
          color: '#dc143c',
          toColor: '#ffd700'
        };
      default:
        return null;
    }
  }, []);

  const performUpgrade = useCallback((type: string) => {
    const requirements = getUpgradeRequirements(type);
    if (!requirements) return;

    const itemsToRemove = getItemsByRarity(requirements.from).slice(0, requirements.count);
    
    if (itemsToRemove.length < requirements.count) {
      alert(`Not enough ${requirements.from} items. You need ${requirements.count} but only have ${itemsToRemove.length}.`);
      return;
    }

    // Remove items from inventory
    const newInventory = inventory.filter(s => !itemsToRemove.includes(s));
    
    // Get possible upgrade skins based on rarity
    let upgradeSkins: Skin[] = [];
    
    switch (type) {
      case 'blue-to-purple':
        // Mil-Spec to Classified - get Classified skins
        upgradeSkins = PREMIUM_SKINS.filter(s => s.rarity === 'Classified');
        break;
      case 'purple-to-red':
        // Classified to Covert - get Covert skins
        upgradeSkins = PREMIUM_SKINS.filter(s => s.rarity === 'Covert');
        break;
      case 'red-to-knife':
        // Covert to Special (Knives) - get Special knives
        upgradeSkins = PREMIUM_SKINS.filter(s => s.rarity === 'Special' && s.isSpecial);
        break;
    }

    // Select random upgrade skin
    const randomIndex = Math.floor(Math.random() * upgradeSkins.length);
    const upgradedSkin = upgradeSkins[randomIndex];
    
    // Add upgraded skin to inventory
    newInventory.push(upgradedSkin);
    
    // Update state
    setInventory(newInventory);
    localStorage.setItem('inventory', JSON.stringify(newInventory.map(s => s.id)));
    
    // Show success message
    alert(`Successfully upgraded ${requirements.count} ${requirements.from} items to 1 ${upgradedSkin.name}!`);
    
    // Close modal
    setShowUpgradeModal(false);
    setUpgradeType(null);
  }, [inventory, getItemsByRarity, getUpgradeRequirements]);

  // Filter cases by search
  const filteredCases = CASES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>CASE ROLLING</h1>
        <p className="header-subtitle">Open Cases & Win Exclusive Skins</p>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{spinCount}</span>
          <span className="stat-label">Total Spins</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">${balance}</span>
          <span className="stat-label">Balance</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{inventory.length}</span>
          <span className="stat-label">Inventory</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {inventory.filter(s => s.rarity === 'Special' || s.rarity === 'Covert').length}
          </span>
          <span className="stat-label">Rare Items</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn guns"
          onClick={() => {
            // Find a case that contains the AK-47 | Redline skin (ID: 1)
            const gunsCase = CASES.find(c => c.contains.includes(1));
            if (gunsCase) {
              startRolling(gunsCase, 1, true); // Target the AK-47 | Redline skin with hidden reward
            } else {
              // Fallback to quick spin if no case contains the target skin
              quickSpin();
            }
          }}
          disabled={rolling || balance < 15}
        >
          🔫 Spin Guns ($15)
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setShowInventory(true)}
        >
          🎒 Inventory
        </button>
        <button 
          className="action-btn upgrade"
          onClick={() => setShowUpgradeModal(true)}
        >
          🔧 Upgrade Items
        </button>
      </div>

      {/* Cases Grid */}
      <section className="cases-section">
        <h2 className="section-title">Available Cases</h2>
        <div className="cases-grid">
          {filteredCases.map(caseItem => (
            <div 
              key={caseItem.id}
              className={`case-card ${rolling || balance < (caseItem.price || 0) ? 'disabled' : ''}`}
              onClick={() => !rolling && balance >= (caseItem.price || 0) && startRolling(caseItem)}
            >
              <img 
                src={caseItem.image} 
                alt={caseItem.name}
                className="case-image"
              />
              <p className="case-name">{caseItem.name}</p>
              <p className="case-price">${caseItem.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Slot Machine Modal */}
      {showSlotMachine && (
        <div className="slot-machine-container">
          <button className="close-slot" onClick={() => setShowSlotMachine(false)}>✕</button>
          
          <div className="slot-machine-header">
            <h2>{currentCase?.name || 'Opening Case...'}</h2>
          </div>

          <div className="slot-machine">
            {/* Center Line */}
            <div className="center-line"></div>
            
            {/* Center Indicator Arrows */}
            <div className="center-indicator">
              <div className="arrow-up"></div>
              <div className="arrow-down"></div>
            </div>

            {/* Sliding Track */}
            <div className="slot-track" style={{ transform: `translateX(${translateX}px)` }}>
              {slotImages.map((img, i) => (
                <img 
                  key={i}
                  src={img}
                  alt={`Skin ${i}`}
                  className="slot-image"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Win Overlay */}
      {showWinOverlay && winningSkin && (
        <div className="win-overlay">
          <div className="win-content">
            <h2 className="win-title">YOU WON!</h2>
            
            <img 
              src={winningSkin.image} 
              alt={winningSkin.name}
              className="win-skin-image"
              style={{ borderBottom: `4px solid ${getRarityColor(winningSkin.rarity)}` }}
            />
            
            <h3 className="win-skin-name">{winningSkin.name}</h3>
            <p 
              className="win-skin-rarity"
              style={{ color: getRarityColor(winningSkin.rarity) }}
            >
              {RARITY_CONFIG[winningSkin.rarity]?.label || winningSkin.rarity}
            </p>
            
            <button 
              className="continue-btn"
              onClick={() => setShowWinOverlay(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventory && (
        <div className="inventory-modal">
          <div className="inventory-content">
            <div className="inventory-header">
              <h2 className="inventory-title">Your Inventory</h2>
              <button className="close-modal-btn" onClick={() => setShowInventory(false)}>✕</button>
            </div>

            <div className="inventory-stats centered-stats">
              <div className="inventory-stat">
                <div className="inventory-stat-value">{inventory.length}</div>
                <div className="inventory-stat-label">Items</div>
              </div>
              <div className="inventory-stat">
                <div className="inventory-stat-value">
                  ${inventory.reduce((sum, s) => sum + (s.price || 0), 0)}
                </div>
                <div className="inventory-stat-label">Total Value</div>
              </div>
            </div>

            <div className="inventory-scroll">
              {inventory.length === 0 ? (
                <div className="empty-inventory">
                  <div className="empty-inventory-icon">📦</div>
                  <p className="empty-inventory-text">Your inventory is empty</p>
                  <p className="empty-inventory-subtext">Open some cases to get started!</p>
                </div>
              ) : (
                <div className="inventory-grid">
                  {inventory.map(skin => (
                    <div 
                      key={skin.id} 
                      className="inventory-item-card"
                      onClick={() => sellItem(skin)}
                    >
                      <div className="inventory-item-image-container">
                        <img 
                          src={skin.image} 
                          alt={skin.name}
                          className="inventory-item-image"
                        />
                        <div 
                          className={`item-rarity-bar ${getRarityGradient(skin.rarity)}`}
                        ></div>
                      </div>
                      
                      <div className="inventory-item-info">
                        <p className="inventory-item-name">{skin.name}</p>
                        <p 
                          className="inventory-item-rarity"
                          style={{ color: getRarityColor(skin.rarity) }}
                        >
                          {RARITY_CONFIG[skin.rarity]?.label || skin.rarity}
                        </p>
                      </div>

                      <div className="inventory-item-actions">
                        <button 
                          className="item-action-btn sell"
                          onClick={(e) => {
                            e.stopPropagation();
                            sellItem(skin);
                          }}
                        >
                          Sell ${skin.price}
                        </button>
                        <button 
                          className="item-action-btn delete"
                          onClick={(e) => deleteItem(skin.id, e)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="inventory-modal">
          <div className="inventory-content">
            <div className="inventory-header">
              <h2 className="inventory-title">🔧 <span className="glow-text">Item Upgrade System</span></h2>
              <button className="close-modal-btn" onClick={() => setShowUpgradeModal(false)}>✕</button>
            </div>

            <div className="inventory-stats">
              <div className="inventory-stat">
                <div className="inventory-stat-value glow-blue">{inventory.length}</div>
                <div className="inventory-stat-label">Total Items</div>
              </div>
              <div className="inventory-stat">
                <div className="inventory-stat-value glow-gold">
                  ${inventory.reduce((sum, s) => sum + (s.price || 0), 0)}
                </div>
                <div className="inventory-stat-label">Total Value</div>
              </div>
            </div>

            <div className="inventory-scroll">
              <div className="upgrade-grid-separated">
                {/* Blue to Purple (Mil-Spec to Classified) */}
                <div className="upgrade-card-separated">
                  <div className="upgrade-card-header-separated">
                    <div className="upgrade-card-title-container-separated">
                      <h3 className="upgrade-card-title-separated">Mil-Spec → Classified</h3>
                      <div className="upgrade-ratio-badge-separated">12:1</div>
                    </div>
                    <div className="upgrade-card-subtitle-separated">Upgrade 12 Mil-Spec items to get 1 Classified item</div>
                  </div>
                  <div className="upgrade-card-content-separated">
                    <div className="upgrade-item-preview-separated">
                      <div className="upgrade-item-image-container-separated">
                        <div className="upgrade-item-image-placeholder-separated upgrade-item-blue">
                          <span className="upgrade-item-count-separated">12x</span>
                          <div className="upgrade-item-glow-separated"></div>
                        </div>
                        <div className="item-rarity-bar rarity-milspec"></div>
                      </div>
                      <div className="upgrade-item-info-separated">
                        <p className="upgrade-item-name-separated">Mil-Spec</p>
                        <p className="upgrade-item-rarity-separated upgrade-rarity-blue">Mil-Spec</p>
                      </div>
                    </div>
                    <div className="upgrade-arrow-container-separated">
                      <div className="upgrade-arrow-separated upgrade-arrow-blue">→</div>
                    </div>
                    <div className="upgrade-item-preview-separated">
                      <div className="upgrade-item-image-container-separated">
                        <div className="upgrade-item-image-placeholder-separated upgrade-item-pink">
                          <span className="upgrade-item-count-separated">1x</span>
                          <div className="upgrade-item-glow-separated"></div>
                        </div>
                        <div className="item-rarity-bar rarity-classified"></div>
                      </div>
                      <div className="upgrade-item-info-separated">
                        <p className="upgrade-item-name-separated">Classified</p>
                        <p className="upgrade-item-rarity-separated upgrade-rarity-pink">Classified</p>
                      </div>
                    </div>
                  </div>
                  <div className="upgrade-card-footer-separated">
                    <div className="upgrade-stats-separated">
                      <div className="upgrade-progress-separated">
                        <div className="upgrade-progress-bar-separated">
                          <div 
                            className="upgrade-progress-fill-separated upgrade-progress-blue"
                            style={{ 
                              width: `${Math.min((countItemsByRarity('Mil-Spec') / 12) * 100, 100)}%`,
                              backgroundColor: countItemsByRarity('Mil-Spec') >= 12 ? '#4CAF50' : '#ff9800'
                            }}
                          ></div>
                        </div>
                        <span className="upgrade-progress-text-separated upgrade-progress-text-blue">
                          {countItemsByRarity('Mil-Spec')}/12 items
                        </span>
                      </div>
                    </div>
                    <button 
                      className={`upgrade-action-btn-separated ${countItemsByRarity('Mil-Spec') >= 12 ? 'available' : 'unavailable'} upgrade-btn-blue`}
                      onClick={() => performUpgrade('blue-to-purple')}
                      disabled={countItemsByRarity('Mil-Spec') < 12}
                    >
                      <span className="upgrade-btn-text-separated">
                        {countItemsByRarity('Mil-Spec') >= 12 ? 'Upgrade to Classified' : 'Need 12 Mil-Spec'}
                      </span>
                      {countItemsByRarity('Mil-Spec') >= 12 && (
                        <span className="upgrade-btn-icon-separated">✨</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Purple to Red (Classified to Covert) */}
                <div className="upgrade-card-separated">
                  <div className="upgrade-card-header-separated">
                    <div className="upgrade-card-title-container-separated">
                      <h3 className="upgrade-card-title-separated">Classified → Covert</h3>
                      <div className="upgrade-ratio-badge-separated">12:1</div>
                    </div>
                    <div className="upgrade-card-subtitle-separated">Upgrade 12 Classified items to get 1 Covert item</div>
                  </div>
                  <div className="upgrade-card-content-separated">
                    <div className="upgrade-item-preview-separated">
                      <div className="upgrade-item-image-container-separated">
                        <div className="upgrade-item-image-placeholder-separated upgrade-item-pink">
                          <span className="upgrade-item-count-separated">12x</span>
                          <div className="upgrade-item-glow-separated"></div>
                        </div>
                        <div className="item-rarity-bar rarity-classified"></div>
                      </div>
                      <div className="upgrade-item-info-separated">
                        <p className="upgrade-item-name-separated">Classified</p>
                        <p className="upgrade-item-rarity-separated upgrade-rarity-pink">Classified</p>
                      </div>
                    </div>
                    <div className="upgrade-arrow-container-separated">
                      <div className="upgrade-arrow-separated upgrade-arrow-pink">→</div>
                    </div>
                    <div className="upgrade-item-preview-separated">
                      <div className="upgrade-item-image-container-separated">
                        <div className="upgrade-item-image-placeholder-separated upgrade-item-red">
                          <span className="upgrade-item-count-separated">1x</span>
                          <div className="upgrade-item-glow-separated"></div>
                        </div>
                        <div className="item-rarity-bar rarity-covert"></div>
                      </div>
                      <div className="upgrade-item-info-separated">
                        <p className="upgrade-item-name-separated">Covert</p>
                        <p className="upgrade-item-rarity-separated upgrade-rarity-red">Covert</p>
                      </div>
                    </div>
                  </div>
                  <div className="upgrade-card-footer-separated">
                    <div className="upgrade-stats-separated">
                      <div className="upgrade-progress-separated">
                        <div className="upgrade-progress-bar-separated">
                          <div 
                            className="upgrade-progress-fill-separated upgrade-progress-pink"
                            style={{ 
                              width: `${Math.min((countItemsByRarity('Classified') / 12) * 100, 100)}%`,
                              backgroundColor: countItemsByRarity('Classified') >= 12 ? '#4CAF50' : '#ff9800'
                            }}
                          ></div>
                        </div>
                        <span className="upgrade-progress-text-separated upgrade-progress-text-pink">
                          {countItemsByRarity('Classified')}/12 items
                        </span>
                      </div>
                    </div>
                    <button 
                      className={`upgrade-action-btn-separated ${countItemsByRarity('Classified') >= 12 ? 'available' : 'unavailable'} upgrade-btn-pink`}
                      onClick={() => performUpgrade('purple-to-red')}
                      disabled={countItemsByRarity('Classified') < 12}
                    >
                      <span className="upgrade-btn-text-separated">
                        {countItemsByRarity('Classified') >= 12 ? 'Upgrade to Covert' : 'Need 12 Classified'}
                      </span>
                      {countItemsByRarity('Classified') >= 12 && (
                        <span className="upgrade-btn-icon-separated">🔥</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Red to Knife (Covert to Special) */}
                <div className="upgrade-card-separated">
                  <div className="upgrade-card-header-separated">
                    <div className="upgrade-card-title-container-separated">
                      <h3 className="upgrade-card-title-separated">Covert → Special Knife</h3>
                      <div className="upgrade-ratio-badge-separated">6:1</div>
                    </div>
                    <div className="upgrade-card-subtitle-separated">Upgrade 6 Covert items to get 1 Guaranteed Special Knife</div>
                  </div>
                  <div className="upgrade-card-content-separated">
                    <div className="upgrade-item-preview-separated">
                      <div className="upgrade-item-image-container-separated">
                        <div className="upgrade-item-image-placeholder-separated upgrade-item-red">
                          <span className="upgrade-item-count-separated">6x</span>
                          <div className="upgrade-item-glow-separated"></div>
                        </div>
                        <div className="item-rarity-bar rarity-covert"></div>
                      </div>
                      <div className="upgrade-item-info-separated">
                        <p className="upgrade-item-name-separated">Covert</p>
                        <p className="upgrade-item-rarity-separated upgrade-rarity-red">Covert</p>
                      </div>
                    </div>
                    <div className="upgrade-arrow-container-separated">
                      <div className="upgrade-arrow-separated upgrade-arrow-red">→</div>
                    </div>
                    <div className="upgrade-item-preview-separated">
                      <div className="upgrade-item-image-container-separated">
                        <div className="upgrade-item-image-placeholder-separated upgrade-item-gold">
                          <span className="upgrade-item-count-separated">1x</span>
                          <div className="upgrade-item-glow-separated"></div>
                        </div>
                        <div className="item-rarity-bar rarity-special"></div>
                      </div>
                      <div className="upgrade-item-info-separated">
                        <p className="upgrade-item-name-separated">Special Knife</p>
                        <p className="upgrade-item-rarity-separated upgrade-rarity-gold">Special</p>
                      </div>
                    </div>
                  </div>
                  <div className="upgrade-card-footer-separated">
                    <div className="upgrade-stats-separated">
                      <div className="upgrade-progress-separated">
                        <div className="upgrade-progress-bar-separated">
                          <div 
                            className="upgrade-progress-fill-separated upgrade-progress-red"
                            style={{ 
                              width: `${Math.min((countItemsByRarity('Covert') / 6) * 100, 100)}%`,
                              backgroundColor: countItemsByRarity('Covert') >= 6 ? '#4CAF50' : '#ff9800'
                            }}
                          ></div>
                        </div>
                        <span className="upgrade-progress-text-separated upgrade-progress-text-red">
                          {countItemsByRarity('Covert')}/6 items
                        </span>
                      </div>
                    </div>
                    <button 
                      className={`upgrade-action-btn-separated ${countItemsByRarity('Covert') >= 6 ? 'available' : 'unavailable'} upgrade-btn-red`}
                      onClick={() => performUpgrade('red-to-knife')}
                      disabled={countItemsByRarity('Covert') < 6}
                    >
                      <span className="upgrade-btn-text-separated">
                        {countItemsByRarity('Covert') >= 6 ? 'Upgrade to Knife (Guaranteed!)' : 'Need 6 Covert'}
                      </span>
                      {countItemsByRarity('Covert') >= 6 && (
                        <span className="upgrade-btn-icon-separated">🗡️</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="upgrade-info">
              <p><strong>Note:</strong> Upgrades are guaranteed! You will receive a random item of the target rarity.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
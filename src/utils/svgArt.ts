// Flat procedural SVG artwork generator without external images or gradients
const SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90">';

export const scenes: Record<string, () => string> = {
  coast: () =>
    `<rect width="160" height="90" fill="#f0d9b5"/><circle cx="116" cy="36" r="15" fill="#e5533d"/><rect y="54" width="160" height="36" fill="#2e5f7e"/><rect y="62" width="160" height="2" fill="#3f7aa0"/><rect y="71" width="160" height="2" fill="#3f7aa0"/><path d="M40 90 L56 66 L74 62 L106 62 L120 90Z" fill="#3b3b3b"/><path d="M86 25 L160 12 L160 36Z" fill="#fff" opacity=".45"/><path d="M73 62 L76 28 L84 28 L87 62Z" fill="#f7f3ea"/><rect x="74.6" y="36" width="10.8" height="5" fill="#e5533d"/><rect x="73.8" y="47" width="12.4" height="5" fill="#e5533d"/><rect x="75" y="21" width="10" height="7" fill="#2b2b2b"/><path d="M74 21 L80 14 L86 21Z" fill="#e5533d"/><path d="M20 24q4-4 8 0q4-4 8 0M34 16q3-3 6 0q3-3 6 0" stroke="#333" stroke-width="1" fill="none"/>`,

  mountain: () =>
    `<rect width="160" height="90" fill="#2d1e3f"/><circle cx="80" cy="32" r="18" fill="#f2e3c3"/><path d="M0 70L30 40L55 62L85 35L115 60L140 42L160 66V90H0Z" fill="#4a2f5e"/><path d="M0 90V75L35 55L65 78L95 58L130 80L160 62V90Z" fill="#1d1230"/><path d="M52 32Q68 12 80 30Q92 12 108 32Q94 28 80 40Q66 28 52 32Z" fill="#c81d25"/><path d="M78 40L80 50L82 40Z" fill="#c81d25"/><circle cx="20" cy="18" r="1" fill="#fff"/><circle cx="36" cy="30" r="1" fill="#fff"/><circle cx="130" cy="14" r="1" fill="#fff"/><circle cx="144" cy="28" r="1" fill="#fff"/>`,

  ocean: () =>
    `<rect width="160" height="90" fill="#0a4a66"/><path d="M50 0H70L95 90H40Z" fill="#fff" opacity=".08"/><path d="M90 0H110L140 90H85Z" fill="#fff" opacity=".08"/><path d="M64 38A16 16 0 0 1 96 38Z" fill="#f08a8a"/><path d="M68 38q-3 10 0 20M76 38q3 12 0 24M84 38q-3 12 0 24M92 38q3 10 0 20" stroke="#f08a8a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M0 80Q20 72 40 80T80 80T120 78T160 80V90H0Z" fill="#062c3d"/><circle cx="30" cy="30" r="3" fill="none" stroke="#9fd8ea"/><circle cx="38" cy="50" r="2" fill="none" stroke="#9fd8ea"/><circle cx="124" cy="26" r="4" fill="none" stroke="#9fd8ea"/><circle cx="132" cy="52" r="2" fill="none" stroke="#9fd8ea"/><circle cx="110" cy="64" r="3" fill="none" stroke="#9fd8ea"/>`,

  city: () => {
    let s = '<rect width="160" height="90" fill="#1d2342"/><circle cx="122" cy="20" r="9" fill="#f5e8c7"/>';
    const buildings = [
      [4, 40, 18],
      [24, 28, 16],
      [42, 48, 14],
      [58, 20, 20],
      [80, 34, 16],
      [98, 44, 14],
      [114, 26, 18],
      [134, 38, 22],
    ];
    buildings.forEach(([x, y, w], i) => {
      s += `<rect x="${x}" y="${y}" width="${w}" height="${90 - y}" fill="${i % 2 ? '#0d1226' : '#121936'}"/>`;
      for (let yy = y + 5; yy < 84; yy += 7) {
        for (let xx = x + 3; xx < x + w - 3; xx += 5) {
          if ((xx * 7 + yy * 3 + i) % 5 < 2) {
            s += `<rect x="${xx}" y="${yy}" width="2.5" height="3" fill="#f2c14e"/>`;
          }
        }
      }
    });
    return s + '<rect y="86" width="160" height="4" fill="#e50914"/>';
  },

  cafe: () => {
    let s = '<rect width="160" height="90" fill="#e9b872"/>';
    for (let i = 0; i < 10; i++) {
      s += `<rect x="${i * 16}" y="0" width="16" height="13" fill="${i % 2 ? '#fff5e6' : '#e50914'}"/>`;
    }
    return (
      s +
      `<rect x="14" y="22" width="40" height="42" fill="#9fd3e6" stroke="#7a4a22" stroke-width="3"/><path d="M34 22V64M14 43H54" stroke="#7a4a22" stroke-width="2"/><rect y="78" width="160" height="12" fill="#8a4b2a"/><ellipse cx="96" cy="76" rx="30" ry="5" fill="#d9d2c5"/><path d="M70 44H122L116 70Q96 80 76 70Z" fill="#fff5e6"/><ellipse cx="96" cy="44" rx="26" ry="4" fill="#6b3e26"/><path d="M122 50q14 0 12 10q-2 8-14 8" stroke="#fff5e6" stroke-width="4" fill="none"/><path d="M88 34q-4-6 0-12q4-6 0-12M102 34q-4-6 0-12q4-6 0-12" stroke="#fff" stroke-width="2" fill="none" opacity=".75" stroke-linecap="round"/>`
    );
  },

  desert: () =>
    `<rect width="160" height="90" fill="#f4a261"/><circle cx="80" cy="52" r="26" fill="#e63946"/><path d="M0 68Q40 54 80 66T160 60V90H0Z" fill="#c1581f"/><rect x="40" y="63" width="50" height="4" fill="#2b1a10"/><rect x="42" y="59" width="10" height="4" fill="#2b1a10"/><rect x="54" y="60" width="8" height="3" fill="#2b1a10"/><rect x="64" y="60" width="8" height="3" fill="#2b1a10"/><path d="M0 90V78Q50 68 100 80T160 74V90Z" fill="#8f3b12"/><rect x="124" y="56" width="5" height="26" fill="#264d3a"/><rect x="118" y="62" width="4" height="10" fill="#264d3a"/><rect x="118" y="68" width="8" height="4" fill="#264d3a"/><rect x="131" y="60" width="4" height="10" fill="#264d3a"/><rect x="127" y="66" width="8" height="4" fill="#264d3a"/><path d="M20 20q4-4 8 0q4-4 8 0" stroke="#5a2a10" stroke-width="1" fill="none"/>`,

  lab: () =>
    `<rect width="160" height="90" fill="#1f3a4d"/><path d="M0 22H160M0 44H160M0 66H160M32 0V90M64 0V90M96 0V90M128 0V90" stroke="#2b4b61" stroke-width="1"/><g fill="none" stroke="#f4d58d" stroke-width="1.6"><ellipse cx="80" cy="45" rx="36" ry="13"/><ellipse cx="80" cy="45" rx="36" ry="13" transform="rotate(60 80 45)"/><ellipse cx="80" cy="45" rx="36" ry="13" transform="rotate(120 80 45)"/></g><circle cx="80" cy="45" r="7" fill="#e50914"/><circle cx="116" cy="45" r="3" fill="#fff"/><circle cx="62" cy="76" r="3" fill="#fff"/><circle cx="62" cy="14" r="3" fill="#fff"/>`,

  forest: () => {
    let s = '<rect width="160" height="90" fill="#0f2d24"/><circle cx="122" cy="18" r="9" fill="#e8e4c9"/>';
    const pine = (x: number, h: number, w: number, f: string) => `<path d="M${x} ${90 - h}L${x - w} 90H${x + w}Z" fill="${f}"/>`;
    const trees1 = [
      [8, 40, 10],
      [30, 52, 12],
      [52, 36, 9],
      [108, 44, 11],
      [130, 56, 13],
      [152, 40, 10],
    ];
    trees1.forEach(p => (s += pine(p[0], p[1], p[2], '#1b4332')));
    s +=
      '<path d="M80 22L72 72M80 22L88 72M74 56H86M76 44H84M77 34H83" stroke="#e8e4c9" stroke-width="1.4" fill="none"/><circle cx="80" cy="21" r="2.4" fill="#e50914"/>';
    const trees2 = [
      [0, 34, 12],
      [20, 28, 10],
      [44, 30, 10],
      [70, 24, 9],
      [96, 30, 10],
      [120, 26, 10],
      [146, 32, 12],
    ];
    trees2.forEach(p => (s += pine(p[0] + 10, p[1] + 10, p[2], '#081c15')));
    return s;
  },

  stage: () =>
    `<rect width="160" height="90" fill="#262626"/><path d="M76 0H84L116 90H44Z" fill="#fff" opacity=".12"/><ellipse cx="80" cy="82" rx="30" ry="5" fill="#f2e6c9" opacity=".3"/><rect width="34" height="90" fill="#b0121c"/><rect x="126" width="34" height="90" fill="#b0121c"/><path d="M8 0V90M18 0V90M28 0V90M132 0V90M142 0V90M152 0V90" stroke="#8c0d16" stroke-width="3"/><circle cx="80" cy="36" r="7" fill="#0d0d0d"/><path d="M68 80Q68 48 80 46Q92 48 92 80Z" fill="#0d0d0d"/><path d="M100 82V48" stroke="#ddd" stroke-width="1.6"/><ellipse cx="100" cy="46" rx="3" ry="4" fill="#ddd"/><path d="M94 84H106" stroke="#ddd" stroke-width="2"/>`,

  harbor: () =>
    `<rect width="160" height="90" fill="#9fd3e6"/><circle cx="124" cy="24" r="12" fill="#fff3c4"/><rect y="56" width="160" height="34" fill="#0f3d57"/><path d="M0 66H160M0 76H160" stroke="#1b5878" stroke-width="2"/><path d="M42 62H118L110 76H50Z" fill="#c81d25"/><rect x="68" y="50" width="32" height="12" fill="#f2f2f2"/><rect x="72" y="53" width="4" height="4" fill="#0f3d57"/><rect x="80" y="53" width="4" height="4" fill="#0f3d57"/><rect x="88" y="53" width="4" height="4" fill="#0f3d57"/><rect x="80" y="38" width="9" height="12" fill="#222"/><rect x="80" y="41" width="9" height="3" fill="#e50914"/><path d="M12 56V20L34 20M12 28L34 20" stroke="#333" stroke-width="2" fill="none"/><path d="M24 14q4-4 8 0q4-4 8 0" stroke="#fff" stroke-width="1.2" fill="none"/>`,
};

const cache: Record<string, string> = {};

export function getArtUrl(key: string): string {
  if (cache[key]) return cache[key];
  const generator = scenes[key] || scenes.coast;
  const svg = SVG_OPEN + generator() + '</svg>';
  const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  cache[key] = encoded;
  return encoded;
}

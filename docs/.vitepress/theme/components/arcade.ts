export const directions = [
  { x: -1, y: 0, icon: '←', label: ['左', 'Left'] },
  { x: 0, y: -1, icon: '↑', label: ['上', 'Up'] },
  { x: 0, y: 1, icon: '↓', label: ['下', 'Down'] },
  { x: 1, y: 0, icon: '→', label: ['右', 'Right'] }
]

export const games = [
  {
    id: 'merge', mark: '3 + 3', color: '#f6b85a',
    title: ['芒果合成', 'Mango Merge'],
    description: ['移动整盘芒果方块，合并相同数字，挑战 3072。', 'Slide the whole board and merge matching tiles to reach 3072.'],
    guide: ['用方向键、滑动棋盘或点按方向按钮。每次移动后会出现新方块。', 'Use arrow keys, swipe the board, or tap the direction buttons. Each move adds a tile.'],
    source: 'https://github.com/gabrielecirulli/2048', reference: '2048'
  },
  {
    id: 'courier', mark: '◆ → ◎', color: '#a7db91',
    title: ['轨道快递', 'Orbit Courier'],
    description: ['驾驶不断前进的运输船，收齐六个包裹后驶入终点。', 'Steer a moving ship, collect six parcels, then reach the dock.'],
    guide: ['用方向键、滑动棋盘或点按方向按钮转向。避开边界、障碍和自己的轨迹。', 'Steer with arrow keys, swipes, or the direction buttons. Avoid edges, obstacles and your trail.'],
    source: 'https://github.com/epidemian/snake', reference: 'URL Snake'
  },
  {
    id: 'survey', mark: '1 ◇ 2', color: '#93d7ed',
    title: ['珊瑚礁勘探', 'Reef Survey'],
    description: ['翻开所有安全海域，用数字推断周围的暗礁。', 'Reveal every safe cell and use numbers to locate nearby hazards.'],
    guide: ['数字表示周围八格的暗礁数。右键或开启标记模式标记暗礁。每局有一次声呐，可翻开一处安全海域。', 'Numbers count hazards in the eight surrounding cells. Right-click or use flag mode to mark hazards. One sonar scan per round reveals a safe cell.'],
    source: 'https://github.com/michaelbutler/minesweeper', reference: 'JavaScript MineSweeper'
  }
]

export function randomCell(cells: number[]) {
  return cells[Math.floor(Math.random() * cells.length)]
}

export function slideTiles(board: number[], direction: number) {
  const next = Array<number>(16).fill(0)
  let points = 0
  for (let line = 0; line < 4; line++) {
    const indices = Array.from({ length: 4 }, (_, step) => {
      if (direction === 0) return line * 4 + step
      if (direction === 1) return step * 4 + line
      if (direction === 2) return (3 - step) * 4 + line
      return line * 4 + 3 - step
    })
    const tiles = indices.map(index => board[index]).filter(Boolean)
    let slot = 0
    for (let i = 0; i < tiles.length; i++) {
      let value = tiles[i]
      if (value === tiles[i + 1]) {
        value *= 2
        points += value
        i++
      }
      next[indices[slot++]] = value
    }
  }
  return { next, points, changed: next.some((tile, index) => tile !== board[index]) }
}

export function neighbors(index: number, width: number) {
  const x = index % width
  const y = Math.floor(index / width)
  const cells: number[] = []
  for (let row = Math.max(0, y - 1); row <= Math.min(width - 1, y + 1); row++) {
    for (let col = Math.max(0, x - 1); col <= Math.min(width - 1, x + 1); col++) {
      const cell = row * width + col
      if (cell !== index) cells.push(cell)
    }
  }
  return cells
}

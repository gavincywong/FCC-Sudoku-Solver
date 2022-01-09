class SudokuSolver {

	validate(string) {
		if (string.length !== 81) {
			return false;
		} 
		return true;
	}

	convertLetterToNumber(row) {
		let letters = [null, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

		return letters.indexOf(row.toUpperCase())
	}

	checkRowPlacement(puzzleArr, row, col, value) {
		for (let i = 0; i < 9; i++) {
			if (i === col) {
				continue;
			} else if (puzzleArr[row][i] === value) {
				return false;
			}
		}
    return true;
	}

	checkColPlacement(puzzleArr, row, col, value) {
    for (let i = 0; i < 9; i++) {
			if (i == row) {
				continue;
			} else if (puzzleArr[i][col] === value) {
        return false;
      }
    }
    return true;
	}

	checkRegionPlacement(puzzleArr, row, col, value) {
    let startRow = row - row % 3
    let startCol = col - col % 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
				if (row === startRow + i && col === startCol + j) {
					continue;
				} else if (puzzleArr[startRow + i][startCol + j] === value) {
          return false;
        }
      }
    }
    return true;
	}

	convertStringtoArr(puzzleString) {
		let numArr = []
		let tempArr = []

		for (let i = 0; i < puzzleString.length; i++) {
			tempArr.push(puzzleString[i])

			if ((i+1) % 9 === 0 && i > 0) {
				numArr.push(tempArr)
				tempArr = []
			}
		}
		return numArr
	}

	isValid(puzzleArr, row, col, value) {
			for (let i = 0; i < 9; i++) {
					const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
					const n = 3 * Math.floor(col / 3) + i % 3;

					if (puzzleArr[row][i] == value || puzzleArr[i][col] == value || puzzleArr[m][n] == value) {
						return false;
					}
			}
			return true;
	}

	sudokuSolver(puzzleArr) {
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (puzzleArr[i][j] === '.') {
					for (let k = 1; k <= 9; k++) {
						if (this.isValid(puzzleArr, i, j, k)) {
							puzzleArr[i][j] = k.toString()
							if (this.sudokuSolver(puzzleArr)) {
								return true;
							} else { 
								puzzleArr[i][j] = '.';
							}
						}		
					}
					return false
				}
			}
		}
		return true
	}

	arrToString(puzzleArr) {
		let solvedString = ''

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				solvedString += puzzleArr[i][j]
			}
		}
		return solvedString;
	}

}

module.exports = SudokuSolver;


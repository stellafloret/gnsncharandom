// キャラクターデータを読み込む
let characters = [];
fetch('characters.json')
  .then(response => response.json())
  .then(data => {
    characters = data;
    updateHistoryDisplay(); // 履歴を更新
  })
  .catch(error => console.error('データ読み込みエラー:', error));

let history = []; // 履歴を保存する配列

// 絞り込みボタンのクリックイベント
document.getElementById('filterButton').addEventListener('click', () => {
  const selectedRegions = getCheckedValues('region');
  const selectedWeapons = getCheckedValues('weapon');
  const selectedElements = getCheckedValues('element');
  const excludedCharacters = getExcludedCharacters();

  const filteredCharacters = characters.filter(character => {
    return (
      (selectedRegions.length === 0 || selectedRegions.includes(character.地域)) &&
      (selectedWeapons.length === 0 || selectedWeapons.includes(character.武器)) &&
      (selectedElements.length === 0 || selectedElements.includes(character.元素)) &&
      !excludedCharacters.includes(character.名前)
    );
  });

  displayFilteredCharacters(filteredCharacters);
});

// サイコロボタンのクリックイベント
document.getElementById('rollButton').addEventListener('click', () => {
  const filteredCharacters = document.querySelectorAll('#filteredCharacters li');
  if (filteredCharacters.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
    const randomCharacter = filteredCharacters[randomIndex].textContent;

    document.getElementById('selectedCharacter').textContent = randomCharacter;

    // 履歴に追加
    addToHistory(randomCharacter);
  }
});

// 履歴消去ボタンのクリックイベント
document.getElementById('clearHistoryButton').addEventListener('click', () => {
  history = [];
  updateHistoryDisplay();
});

// チェックボックスで選択された値を取得
function getCheckedValues(groupName) {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 履歴に基づく除外キャラクターを取得
function getExcludedCharacters() {
  const checkboxes = document.querySelectorAll('#history input:checked');
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 絞り込んだキャラクターを表示
function displayFilteredCharacters(filteredCharacters) {
  const list = document.getElementById('filteredCharacters');
  list.innerHTML = '';
  filteredCharacters.forEach(character => {
    const listItem = document.createElement('li');
    listItem.textContent = character.名前;
    list.appendChild(listItem);
  });

  // サイコロボタンの有効/無効を切り替える
  document.getElementById('rollButton').disabled = filteredCharacters.length === 0;
}

// 履歴にキャラクターを追加
function addToHistory(characterName) {
  if (!history.includes(characterName)) {
    history.push(characterName);
    updateHistoryDisplay();
  }
}

// 履歴を表示
function updateHistoryDisplay() {
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';
  history.forEach(character => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <label>
        <input type="checkbox" value="${character}"> 除外する
        ${character}
      </label>
    `;
    historyList.appendChild(listItem);
  });
}

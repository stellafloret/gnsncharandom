// キャラクターデータを読み込む
let characters = [];
fetch('characters.json')
  .then(response => {
    // デバッグ用: HTTPステータスコードの確認
    console.log(`HTTPステータス: ${response.status}`);

    // レスポンスが正常か確認
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // デバッグ用: 読み込まれたデータの確認
    console.log('データ読み込み成功:', data);

    characters = data;
    updateHistoryDisplay(); // 履歴を更新
    updateFilteredCharacters(); // 初回の絞り込み表示
  })
  .catch(error => console.error('データ読み込みエラー:', error));

let history = []; // 履歴を保存する配列

// フィルタリング関数
function updateFilteredCharacters() {
  const selectedRegions = getCheckedValues('region');
  const selectedGenders = getCheckedValues('gender');
  const selectedWeapons = getCheckedValues('weapon');
  const selectedElements = getCheckedValues('element');
  const selectedBirthdays = getCheckedValues('birthday');
  const excludeHistoryChecked = document.getElementById('excludeHistory').checked;
  
  const filteredCharacters = characters.filter(character => {
    return (
      (selectedRegions.length === 0 || selectedRegions.some(region => character.地域.includes(region)))  &&
      (selectedGenders.length === 0 || selectedGenders.includes(character.性別)) &&
      (selectedWeapons.length === 0 || selectedWeapons.includes(character.武器)) &&
      (selectedElements.length === 0 || selectedElements.includes(character.元素)) &&
      (selectedBirthdays.length === 0 || selectedBirthdays.includes(character.誕生日)) &&
      (!excludeHistoryChecked || !history.includes(character.名前)) // 履歴にあるキャラクターを除外
    );
  });

  displayFilteredCharacters(filteredCharacters);
}

// チェックボックスの変更時にフィルタリングを実行
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateFilteredCharacters);
});

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

// 履歴にキャラクターを追加
function addToHistory(characterName) {
  if (!history.includes(characterName)) {
    history.push(characterName);
    updateHistoryDisplay();
    updateFilteredCharacters(); // 履歴に追加されたキャラクターを絞り込み結果に反映
  }
}

// 履歴を表示
function updateHistoryDisplay() {
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';

  history.forEach(character => {
    const listItem = document.createElement('li');
    listItem.textContent = character;
    historyList.appendChild(listItem);
  });
}

// 履歴消去ボタンのクリックイベント
document.getElementById('clearHistoryButton').addEventListener('click', () => {
  history = [];
  updateHistoryDisplay();
  updateFilteredCharacters(); // 履歴消去後に絞り込み結果を更新
});

// チェックボックスで選択された値を取得
function getCheckedValues(groupName) {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// データ読み込みエラー処理
function handleError(error) {
  console.error('データ読み込みエラー:', error);
}

// 履歴リセットのイベントリスナー
document.getElementById('resetHistoryButton')?.addEventListener('click', () => {
  history = [];
  updateHistoryDisplay();
  updateFilteredCharacters();
});

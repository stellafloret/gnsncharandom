// キャラクターデータを読み込む
let characters = [];
fetch('characters.json')
  .then(response => response.json())
  .then(data => {
    characters = data;
  })
  .catch(error => console.error('データ読み込みエラー:', error));

// 絞り込みボタンのクリックイベント
document.getElementById('filterButton').addEventListener('click', () => {
  const selectedRegions = getCheckedValues('region');
  const selectedWeapons = getCheckedValues('weapon');
  const selectedElements = getCheckedValues('element');

  const filteredCharacters = characters.filter(character => {
    return (
      (selectedRegions.length === 0 || selectedRegions.includes(character.地域)) &&
      (selectedWeapons.length === 0 || selectedWeapons.includes(character.武器)) &&
      (selectedElements.length === 0 || selectedElements.includes(character.元素))
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
  }
});

// 選択されたチェックボックスの値を取得
function getCheckedValues(groupName) {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
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

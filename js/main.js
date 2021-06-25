'use strict';

/*   変数初期設定
======================================== */
let canvas; //描画キャンバス
let ctx; //描画コンテキスト
let canvasImage; //描画キャンバス背景

let gameStatus = 0; //状態管理 0-読み込み中画面 1-読み込み完了画面 2-ゲーム終了画面
let gameCredit = 50; //クレジットコイン数
let gameSetting = 1; //設定
let gameSettingData = [];

let reelImageA = [];
let reelImageB = [];
let reel = [];
let reelSpeed = 20;
let reelFreq = 13; //
let reelMove = 0; //動作リール数

let audioStatus = 1; //音声 0-OFF 1-ON
let audio = [];
let audioFiles = [];

let bonusFlag = 0; //BonusFlag 1-BIG 2-REG
let bonusCount = 0; //BonusCounter 
let bonusCountBig = 0;
let bonusCountReg = 0;
let bonusHistory = []; //ボーナス履歴

let flagData = []; //フラグデータ

/*   描画キャンバスの設定
======================================== */
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
ctx.strokeStyle = '#eee';
ctx.fillStyle = '#eee';
ctx.lineWidth = 1;
ctx.lineCap = 'butt';
ctx.fillRect(0, 0, 800, 539);
canvasImage = new Image();　//canvas背景画像の設定
// canvasImage.src = '../images/canvas-background.jpg';
canvasImage.onload = function () {
  ctx.drawImage(canvasImage, 0, 0, 800, 540, 0, 0, 500,320);
}

/*   全体の音量調整
======================================== */
{
  for (i = 0; i < audioFiles.length; i++) {
    audio[i] = new Audio(audioFiles[i]);
    audio[i].volume = 1;
  }
  audio[1].volume = 0.6; //BIG-BGMを小さく調整
  audio[2].volume = 0.6; //REG-BGMを小さく調整
  audio[3].volume = 0.7; //BIG-終了時BGMを小さく調整
}

/*   フラグデータ管理
======================================== */
{
  flagData[0] = {
    name: 'リプレイ', //役名
    hit: 1, //役番号
    replay: 1, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 0, //通常時獲得メダル数
    bGet: 0, //ボーナス獲得メダル数
  }
  flagData[3] = {
    name: 'ぶどう', //役名
    hit: 2, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 7, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[12] = {
    name: 'ベル', //役名
    hit: 3, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 14, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[49] = {
    name: 'ピエロ', //役名
    hit: 4, //役番号
    replay: 1, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 10, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[300] = {
    name: 'ビッグボーナス', //役名
    hit: 100, //役番号
    replay: 0, //リプレイ判定
    bonus: 1, //ボーナス判定
    aGet: 0, //通常時獲得メダル数
    bGet: 0, //ボーナス獲得メダル数
  }
  flagData[600] = {
    name: 'レギュラーボーナス', //役名
    hit: 200, //役番号
    replay: 0, //リプレイ判定
    bonus: 2, //ボーナス判定
    aGet: 10, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[4000] = {
    name: 'チェリー', //役名
    hit: 5, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 1, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[5000] = {
    name: 'チェリー', //役名
    hit: 5, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 1, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[6000] = {
    name: 'チェリー', //役名
    hit: 6, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 1, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[900] = {
    name: 'チェリー', //役名
    hit: 6, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 1, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
  flagData[6000] = {
    name: 'チェリー', //役名
    hit: 6, //役番号
    replay: 0, //リプレイ判定
    bonus: 0, //ボーナス判定
    aGet: 1, //通常時獲得メダル数
    bGet: 14, //ボーナス獲得メダル数
  }
}

/*   各種設定データ
======================================== */
{
  gameSettingData[1] = { //設定1
    r: [13698, 29106, 29197, 29288, 32266, 32266, 32613, 32832]
  }
  gameSettingData[2] = { //設定2
    r: [13698, 29106, 29197, 29288, 32266, 32266, 32620, 32845]
  }
  gameSettingData[3] = { //設定3
    r: [13698, 29106, 29197, 29288, 32284, 32284, 32638, 32924]
  }
  gameSettingData[4] = { //設定4
    r: [13698, 29106, 29197, 29288, 32297, 32297, 32663, 32974]
  }
  gameSettingData[5] = { //設定5
    r: [13698, 29106, 29197, 29288, 32315, 32315, 32681, 33053]
  }
  gameSettingData[6] = { //設定6
    r: [13698, 29879, 29970, 30061, 33088, 33088, 33460, 33832]
  }
  gameSettingData[10] = { //爆裂(テスト用)
    r: [13698, 29879, 29970, 30061, 33088, 33088, 36421, 39754]
  }
  gameSettingData[100] = { //ビッグボーナス中
    r: [0, 97087, 97170, 97253, 100000, 100000, 100000, 100000]
  }
  gameSettingData[200] = { //レギュラーボーナス中
    r: [0, 0, 0, 0, 0, 100000, 100000, 100000]
  }
}
